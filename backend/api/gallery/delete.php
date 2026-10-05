<?php
/**
 * Vana Resort Araku - Gallery API: Delete Image
 * Protected endpoint.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/config.php';

requireAuth(['super_admin', 'manager']);

if (!in_array($_SERVER['REQUEST_METHOD'], ['DELETE', 'POST'], true)) {
    sendError('Method Not Allowed. Use DELETE.', 405);
}

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
    $input = getJsonInput();
    $id = (int)($input['id'] ?? 0);
}

if ($id <= 0) {
    sendError('Valid gallery ID is required.', 400);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('SELECT id, image_path FROM gallery WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $item = $stmt->fetch();

    if (!$item) {
        sendError('Gallery item not found.', 404);
    }

    // If file is stored locally in uploads, delete it
    $imagePath = $item['image_path'];
    if (str_starts_with($imagePath, '/vana-resort/backend/uploads/')) {
        $relativePath = str_replace('/vana-resort/backend/uploads/', '', $imagePath);
        $fullPath = UPLOAD_DIR . '/' . $relativePath;
        if (file_exists($fullPath) && is_file($fullPath)) {
            @unlink($fullPath);
        }
    }

    $delStmt = $pdo->prepare('DELETE FROM gallery WHERE id = :id');
    $delStmt->execute([':id' => $id]);

    sendSuccess('Gallery item deleted successfully.');

} catch (Exception $e) {
    error_log('Delete gallery error: ' . $e->getMessage());
    sendError('Failed to delete gallery item.', 500);
}
