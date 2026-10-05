<?php
/**
 * Vana Resort Araku - Contact API: Delete Message
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

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
    $input = getJsonInput();
    $id = (int)($input['id'] ?? 0);
}

if ($id <= 0) {
    sendError('Valid contact ID is required.', 400);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('DELETE FROM contacts WHERE id = :id');
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        sendError('Contact inquiry not found or already deleted.', 404);
    }

    sendSuccess('Contact inquiry deleted successfully.');

} catch (Exception $e) {
    error_log('Delete contact error: ' . $e->getMessage());
    sendError('Failed to delete contact inquiry.', 500);
}
