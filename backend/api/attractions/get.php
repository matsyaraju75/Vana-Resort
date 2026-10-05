<?php
/**
 * Vana Resort Araku - Attractions API: Get Attraction
 * Public endpoint.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

$identifier = sanitizeString($_GET['id'] ?? ($_GET['slug'] ?? ''));

if (empty($identifier)) {
    sendError('Attraction identifier (slug or ID) is required.', 400);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('
        SELECT * FROM attractions 
        WHERE id = :id_num OR slug = :slug_val 
        LIMIT 1
    ');
    $stmt->execute([
        ':id_num'   => is_numeric($identifier) ? (int)$identifier : 0,
        ':slug_val' => $identifier
    ]);
    $row = $stmt->fetch();

    if (!$row) {
        sendError('Attraction not found.', 404);
    }

    $categoryLabels = [
        'viewpoint' => 'Scenic Viewpoint',
        'waterfall' => 'Cascading Waterfalls',
        'culture'   => 'Culture & Heritage',
        'nature'    => 'Nature & Botany',
        'heritage'  => 'Historic Caves & Geology'
    ];

    $cat = $row['category'] ?? 'nature';
    $timeStr = ($row['opening_time'] && $row['closing_time']) 
        ? "{$row['opening_time']} – {$row['closing_time']}" 
        : ($row['best_time_to_visit'] ?: 'Daytime');

    $attraction = [
        'id'                     => $row['slug'],
        'databaseId'             => (int)$row['id'],
        'database_id'            => (int)$row['id'],
        'slug'                   => $row['slug'],
        'name'                   => $row['name'],
        'category'               => $cat,
        'categoryLabel'          => $categoryLabels[$cat] ?? ucfirst($cat),
        'category_label'         => $categoryLabels[$cat] ?? ucfirst($cat),
        'description'            => $row['description'],
        'distance'               => $row['distance_from_resort'],
        'distance_from_resort'   => $row['distance_from_resort'],
        'timeToVisit'            => $timeStr,
        'approximate_travel_time'=> $row['approximate_travel_time'],
        'entryPrice'             => $row['entry_fee'] ?: 'Free Entry',
        'entry_fee'              => $row['entry_fee'],
        'opening_time'           => $row['opening_time'],
        'closing_time'           => $row['closing_time'],
        'best_time_to_visit'     => $row['best_time_to_visit'],
        'image'                  => $row['image'],
        'latitude'               => $row['latitude'] ? (float)$row['latitude'] : null,
        'longitude'              => $row['longitude'] ? (float)$row['longitude'] : null,
        'status'                 => $row['status'],
        'sort_order'             => (int)$row['sort_order'],
        'googleQuery'            => $row['name'] . ' Araku Valley Andhra Pradesh',
        'created_at'             => $row['created_at'],
        'updated_at'             => $row['updated_at']
    ];

    sendSuccess('Attraction retrieved successfully.', $attraction);

} catch (Exception $e) {
    error_log('Get attraction error: ' . $e->getMessage());
    sendError('Failed to fetch attraction.', 500);
}
