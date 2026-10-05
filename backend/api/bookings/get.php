<?php
/**
 * Vana Resort Araku - Booking API: Get Booking by ID / Reference
 * Protected endpoint.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth();

$id = sanitizeString($_GET['id'] ?? ($_GET['reference'] ?? ''));

if (empty($id)) {
    sendError('Booking identifier is required.', 400);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('
        SELECT 
            b.*,
            r.slug AS room_slug,
            r.price_per_night AS room_current_price
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.id
        WHERE b.id = :id_numeric OR b.booking_reference = :id_ref
        LIMIT 1
    ');

    $stmt->execute([
        ':id_numeric' => is_numeric($id) ? (int)$id : 0,
        ':id_ref'     => $id
    ]);

    $row = $stmt->fetch();

    if (!$row) {
        sendError('Booking not found.', 404);
    }

    $booking = [
        'id'                 => $row['booking_reference'],
        'databaseId'         => (int)$row['id'],
        'bookingReference'   => $row['booking_reference'],
        'booking_reference'  => $row['booking_reference'],
        'guestName'          => $row['full_name'],
        'full_name'          => $row['full_name'],
        'email'              => $row['email'],
        'phone'              => $row['phone'],
        'roomType'           => $row['room_name_snapshot'],
        'room_id'            => (int)$row['room_id'],
        'room_name_snapshot' => $row['room_name_snapshot'],
        'room_slug'          => $row['room_slug'] ?? '',
        'checkIn'            => $row['check_in'],
        'check_in'           => $row['check_in'],
        'checkOut'           => $row['check_out'],
        'check_out'          => $row['check_out'],
        'adults'             => (int)$row['adults'],
        'children'           => (int)$row['children'],
        'roomsCount'         => (int)$row['rooms_count'],
        'rooms_count'        => (int)$row['rooms_count'],
        'nights'             => (int)$row['nights'],
        'totalPrice'         => (float)$row['final_price'],
        'estimated_price'    => (float)$row['estimated_price'],
        'final_price'        => (float)$row['final_price'],
        'specialRequests'    => $row['additional_requests'],
        'additional_requests'=> $row['additional_requests'],
        'adminNotes'         => $row['admin_notes'],
        'admin_notes'        => $row['admin_notes'],
        'status'             => $row['status'],
        'createdAt'          => $row['created_at'],
        'created_at'         => $row['created_at'],
        'updated_at'         => $row['updated_at']
    ];

    sendSuccess('Booking retrieved successfully.', $booking);

} catch (Exception $e) {
    error_log('Get booking error: ' . $e->getMessage());
    sendError('Failed to fetch booking details.', 500);
}
