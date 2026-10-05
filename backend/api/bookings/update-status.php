<?php
/**
 * Vana Resort Araku - Booking API: Update Booking Status
 * Protected endpoint. Statuses: pending, confirmed, cancelled, completed
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth(); // Verify admin authentication

if (!in_array($_SERVER['REQUEST_METHOD'], ['PATCH', 'POST', 'PUT'], true)) {
    sendError('Method Not Allowed. Use PATCH or POST.', 405);
}

$input = getJsonInput();
$id = sanitizeString($input['id'] ?? ($input['bookingReference'] ?? ($input['booking_reference'] ?? ($_GET['id'] ?? ''))));
$status = sanitizeString($input['status'] ?? '');
$adminNotes = isset($input['adminNotes']) ? sanitizeString($input['adminNotes']) : (isset($input['admin_notes']) ? sanitizeString($input['admin_notes']) : null);
$finalPrice = isset($input['finalPrice']) ? (float)$input['finalPrice'] : (isset($input['final_price']) ? (float)$input['final_price'] : null);

if (empty($id)) {
    sendError('Booking ID or reference is required.', 400);
}

$allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
if (!empty($status) && !in_array($status, $allowedStatuses, true)) {
    sendError('Invalid status. Allowed values: pending, confirmed, cancelled, completed.', 422);
}

try {
    $pdo = Database::getConnection();

    // Check if booking exists
    $checkStmt = $pdo->prepare('
        SELECT id, booking_reference, status, admin_notes, final_price 
        FROM bookings 
        WHERE id = :id_num OR booking_reference = :id_ref 
        LIMIT 1
    ');
    $checkStmt->execute([
        ':id_num' => is_numeric($id) ? (int)$id : 0,
        ':id_ref' => $id
    ]);
    $booking = $checkStmt->fetch();

    if (!$booking) {
        sendError('Booking not found.', 404);
    }

    $updates = [];
    $params = [':id' => $booking['id']];

    if (!empty($status)) {
        $updates[] = 'status = :status';
        $params[':status'] = $status;
    }

    if ($adminNotes !== null) {
        $updates[] = 'admin_notes = :admin_notes';
        $params[':admin_notes'] = $adminNotes;
    }

    if ($finalPrice !== null && $finalPrice >= 0) {
        $updates[] = 'final_price = :final_price';
        $params[':final_price'] = $finalPrice;
    }

    if (empty($updates)) {
        sendError('No updates provided.', 400);
    }

    $updates[] = 'updated_at = NOW()';
    $updateSql = 'UPDATE bookings SET ' . implode(', ', $updates) . ' WHERE id = :id';

    $updateStmt = $pdo->prepare($updateSql);
    $updateStmt->execute($params);

    sendSuccess('Booking updated successfully.', [
        'id'               => $booking['booking_reference'],
        'bookingReference' => $booking['booking_reference'],
        'status'           => $status ?: $booking['status'],
        'adminNotes'       => $adminNotes !== null ? $adminNotes : $booking['admin_notes']
    ]);

} catch (Exception $e) {
    error_log('Update booking error: ' . $e->getMessage());
    sendError('Failed to update booking status.', 500);
}
