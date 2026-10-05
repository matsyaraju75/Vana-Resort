<?php
/**
 * Vana Resort Araku - Booking API: Delete Booking
 * Protected endpoint. Only authorized admins (super_admin, manager) can delete.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

// Only super_admin and manager can delete bookings
requireAuth(['super_admin', 'manager']);

if (!in_array($_SERVER['REQUEST_METHOD'], ['DELETE', 'POST'], true)) {
    sendError('Method Not Allowed. Use DELETE.', 405);
}

$id = sanitizeString($_GET['id'] ?? ($_GET['reference'] ?? ''));
if (empty($id)) {
    $input = getJsonInput();
    $id = sanitizeString($input['id'] ?? ($input['bookingReference'] ?? ''));
}

if (empty($id)) {
    sendError('Booking identifier is required.', 400);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('
        DELETE FROM bookings 
        WHERE id = :id_num OR booking_reference = :id_ref
    ');
    $stmt->execute([
        ':id_num' => is_numeric($id) ? (int)$id : 0,
        ':id_ref' => $id
    ]);

    if ($stmt->rowCount() === 0) {
        sendError('Booking not found or already deleted.', 404);
    }

    sendSuccess('Booking deleted successfully.');

} catch (Exception $e) {
    error_log('Delete booking error: ' . $e->getMessage());
    sendError('Failed to delete booking.', 500);
}
