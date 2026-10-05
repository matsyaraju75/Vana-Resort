<?php
/**
 * Vana Resort Araku - Attractions API: Update Attraction
 * Protected endpoint. Admins only.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth(['super_admin', 'manager']);

if (!in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'POST', 'PATCH'], true)) {
    sendError('Method Not Allowed. Use PUT or POST.', 405);
}

$input = getJsonInput();
$identifier = sanitizeString($_GET['id'] ?? ($input['id'] ?? ($input['slug'] ?? '')));

if (empty($identifier)) {
    sendError('Attraction ID or slug is required.', 400);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('SELECT * FROM attractions WHERE id = :id_num OR slug = :slug_val LIMIT 1');
    $stmt->execute([
        ':id_num'   => is_numeric($identifier) ? (int)$identifier : 0,
        ':slug_val' => $identifier
    ]);
    $attraction = $stmt->fetch();

    if (!$attraction) {
        sendError('Attraction not found.', 404);
    }

    $id = (int)$attraction['id'];
    $updates = [];
    $params = [':id' => $id];

    $fields = [
        'name'                    => 'name',
        'description'             => 'description',
        'distance_from_resort'    => ['distance_from_resort', 'distance'],
        'approximate_travel_time' => ['approximate_travel_time', 'timeToVisit'],
        'entry_fee'               => ['entry_fee', 'entryPrice'],
        'opening_time'            => 'opening_time',
        'closing_time'            => 'closing_time',
        'best_time_to_visit'      => 'best_time_to_visit',
        'category'                => 'category',
        'image'                   => 'image',
        'status'                  => 'status'
    ];

    foreach ($fields as $col => $keys) {
        $keys = (array)$keys;
        foreach ($keys as $k) {
            if (isset($input[$k])) {
                $updates[] = "{$col} = :{$col}";
                $params[":{$col}"] = sanitizeString($input[$k]);
                break;
            }
        }
    }

    if (isset($input['sort_order'])) {
        $updates[] = 'sort_order = :sort_order';
        $params[':sort_order'] = (int)$input['sort_order'];
    }
    if (isset($input['latitude'])) {
        $updates[] = 'latitude = :latitude';
        $params[':latitude'] = is_numeric($input['latitude']) ? (float)$input['latitude'] : null;
    }
    if (isset($input['longitude'])) {
        $updates[] = 'longitude = :longitude';
        $params[':longitude'] = is_numeric($input['longitude']) ? (float)$input['longitude'] : null;
    }

    if (empty($updates)) {
        sendError('No updates provided.', 400);
    }

    $updates[] = 'updated_at = NOW()';
    $sql = 'UPDATE attractions SET ' . implode(', ', $updates) . ' WHERE id = :id';
    $upStmt = $pdo->prepare($sql);
    $upStmt->execute($params);

    sendSuccess('Attraction updated successfully.', [
        'id'   => $attraction['slug'],
        'databaseId' => $id
    ]);

} catch (Exception $e) {
    error_log('Update attraction error: ' . $e->getMessage());
    sendError('Failed to update attraction.', 500);
}
