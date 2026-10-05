<?php
/**
 * Vana Resort Araku - Attractions API: Delete Attraction
 * Protected endpoint.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth(['super_admin', 'manager']);

if (!in_array($_SERVER['REQUEST_METHOD'], ['DELETE', 'POST'], true)) {
    sendError('Method Not Allowed. Use DELETE.', 405);
}

$id = sanitizeString($_GET['id'] ?? ($_GET['slug'] ?? ''));
if (empty($id)) {
    $input = getJsonInput();
    $id = sanitizeString($input['id'] ?? ($input['slug'] ?? ''));
}

if (empty($id)) {
    sendError('Attraction identifier (ID or slug) is required.', 400);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('DELETE FROM attractions WHERE id = :id_num OR slug = :slug_val');
    $stmt->execute([
        ':id_num'   => is_numeric($id) ? (int)$id : 0,
        ':slug_val' => $id
    ]);

    if ($stmt->rowCount() === 0) {
        sendError('Attraction not found or already deleted.', 404);
    }

    sendSuccess('Attraction deleted successfully.');

} catch (Exception $e) {
    error_log('Delete attraction error: ' . $e->getMessage());
    sendError('Failed to delete attraction.', 500);
}
