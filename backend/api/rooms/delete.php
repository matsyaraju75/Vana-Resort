<?php
/**
 * Vana Resort Araku - Rooms API: Delete Room
 * Protected endpoint. Only super_admin and manager.
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
    sendError('Room identifier (ID or slug) is required.', 400);
}

try {
    $pdo = Database::getConnection();

    // Check if room has active bookings before deletion
    $checkBooking = $pdo->prepare('
        SELECT COUNT(*) as booking_count 
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE (r.id = :id_num OR r.slug = :slug_val) AND b.status IN ("pending", "confirmed")
    ');
    $checkBooking->execute([
        ':id_num'   => is_numeric($id) ? (int)$id : 0,
        ':slug_val' => $id
    ]);
    if ((int)$checkBooking->fetch()['booking_count'] > 0) {
        sendError('Cannot delete room because it has active/pending bookings. You can change its status to "inactive" instead.', 409);
    }

    $stmt = $pdo->prepare('DELETE FROM rooms WHERE id = :id_num OR slug = :slug_val');
    $stmt->execute([
        ':id_num'   => is_numeric($id) ? (int)$id : 0,
        ':slug_val' => $id
    ]);

    if ($stmt->rowCount() === 0) {
        sendError('Room not found or already deleted.', 404);
    }

    sendSuccess('Room deleted successfully.');

} catch (Exception $e) {
    error_log('Delete room error: ' . $e->getMessage());
    sendError('Failed to delete room.', 500);
}
