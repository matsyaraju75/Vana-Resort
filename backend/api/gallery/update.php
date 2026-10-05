<?php
/**
 * Vana Resort Araku - Gallery API: Update Image Metadata
 * Protected endpoint.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth(['super_admin', 'manager', 'staff']);

if (!in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'POST', 'PATCH'], true)) {
    sendError('Method Not Allowed. Use PUT or POST.', 405);
}

$input = getJsonInput();
$id = (int)($_GET['id'] ?? ($input['id'] ?? 0));

if ($id <= 0) {
    sendError('Valid gallery ID is required.', 400);
}

try {
    $pdo = Database::getConnection();

    $checkStmt = $pdo->prepare('SELECT id FROM gallery WHERE id = :id LIMIT 1');
    $checkStmt->execute([':id' => $id]);
    if (!$checkStmt->fetch()) {
        sendError('Gallery item not found.', 404);
    }

    $updates = [];
    $params = [':id' => $id];

    if (isset($input['title'])) {
        $updates[] = 'title = :title';
        $params[':title'] = sanitizeString($input['title']);
    }
    if (isset($input['category'])) {
        $updates[] = 'category = :category';
        $params[':category'] = sanitizeString($input['category']);
    }
    if (isset($input['alt_text']) || isset($input['alt'])) {
        $updates[] = 'alt_text = :alt_text';
        $params[':alt_text'] = sanitizeString($input['alt_text'] ?? $input['alt']);
    }
    if (isset($input['caption'])) {
        $updates[] = 'caption = :caption';
        $params[':caption'] = sanitizeString($input['caption']);
    }
    if (isset($input['sort_order'])) {
        $updates[] = 'sort_order = :sort_order';
        $params[':sort_order'] = (int)$input['sort_order'];
    }
    if (isset($input['status'])) {
        $updates[] = 'status = :status';
        $params[':status'] = sanitizeString($input['status']);
    }

    if (empty($updates)) {
        sendError('No updates provided.', 400);
    }

    $updates[] = 'updated_at = NOW()';
    $sql = 'UPDATE gallery SET ' . implode(', ', $updates) . ' WHERE id = :id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    sendSuccess('Gallery item updated successfully.', ['id' => (string)$id]);

} catch (Exception $e) {
    error_log('Update gallery error: ' . $e->getMessage());
    sendError('Failed to update gallery item.', 500);
}
