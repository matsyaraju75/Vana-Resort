<?php
/**
 * Vana Resort Araku - Booking API: Create Booking
 * Public endpoint. Server calculates nights, validates dates & room, verifies pricing.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method Not Allowed. Use POST.', 405);
}

// Rate limit: max 15 booking attempts per 5 minutes per IP
if (!checkRateLimit('booking_create', 15, 300)) {
    sendError('Too many booking requests. Please wait a moment before trying again.', 429);
}

$input = getJsonInput();

$fullName = sanitizeString($input['fullName'] ?? ($input['full_name'] ?? ($input['guestName'] ?? '')));
$email = sanitizeString($input['email'] ?? '');
$phone = sanitizeString($input['phone'] ?? '');
$checkIn = sanitizeString($input['checkIn'] ?? ($input['check_in'] ?? ''));
$checkOut = sanitizeString($input['checkOut'] ?? ($input['check_out'] ?? ''));
$adults = (int)($input['adults'] ?? 1);
$children = (int)($input['children'] ?? 0);
$roomsCount = (int)($input['roomsCount'] ?? ($input['rooms_count'] ?? 1));
$roomIdentifier = sanitizeString($input['roomId'] ?? ($input['room_id'] ?? ($input['roomType'] ?? '')));
$additionalRequests = sanitizeString($input['specialRequests'] ?? ($input['additional_requests'] ?? ($input['notes'] ?? '')));

$errors = [];

if (empty($fullName) || mb_strlen($fullName) < 2) {
    $errors['fullName'] = 'Full name is required and must be at least 2 characters.';
}
if (!validateEmail($email)) {
    $errors['email'] = 'A valid email address is required.';
}
if (!validatePhone($phone)) {
    $errors['phone'] = 'A valid phone number is required (min 7 digits).';
}
if (!validateDate($checkIn)) {
    $errors['checkIn'] = 'Check-in date must be in valid YYYY-MM-DD format.';
}
if (!validateDate($checkOut)) {
    $errors['checkOut'] = 'Check-out date must be in valid YYYY-MM-DD format.';
}

$today = date('Y-m-d');
if (validateDate($checkIn) && $checkIn < $today) {
    $errors['checkIn'] = 'Check-in date cannot be in the past.';
}

if (validateDate($checkIn) && validateDate($checkOut) && $checkOut <= $checkIn) {
    $errors['checkOut'] = 'Check-out date must be after the check-in date.';
}

if ($adults < 1) {
    $errors['adults'] = 'At least 1 adult guest is required.';
}
if ($children < 0) {
    $errors['children'] = 'Children count cannot be negative.';
}
if ($roomsCount < 1) {
    $errors['roomsCount'] = 'At least 1 room must be selected.';
}
if (empty($roomIdentifier)) {
    $errors['roomId'] = 'Please select a room category.';
}

if (!empty($errors)) {
    sendError('Validation failed.', 422, $errors);
}

try {
    $pdo = Database::getConnection();

    // Find the room by id or slug or name
    $roomStmt = $pdo->prepare('
        SELECT id, slug, name, sample_price, price_per_night, available_rooms, status 
        FROM rooms 
        WHERE (id = :id_val OR slug = :slug_val OR name = :name_val) 
        LIMIT 1
    ');
    $roomStmt->execute([
        ':id_val'   => is_numeric($roomIdentifier) ? (int)$roomIdentifier : 0,
        ':slug_val' => $roomIdentifier,
        ':name_val' => $roomIdentifier
    ]);
    $room = $roomStmt->fetch();

    if (!$room || $room['status'] !== 'active') {
        sendError('The selected room category is invalid or currently unavailable.', 400, [
            'roomId' => 'Invalid or inactive room selected.'
        ]);
    }

    // Calculate nights server-side
    $nights = calculateStayNights($checkIn, $checkOut);
    if ($nights <= 0) {
        sendError('Invalid stay duration.', 422, ['checkOut' => 'Check-out must be at least 1 night after check-in.']);
    }

    // Calculate verified price
    $pricePerNight = (float)($room['sample_price'] ?: $room['price_per_night']);
    $estimatedPrice = $pricePerNight * $nights * $roomsCount;

    // Generate unique collision-resistant booking reference: BK-YYYYMMDD-XXXX
    $datePrefix = date('Ymd');
    $pdo->beginTransaction();

    $countStmt = $pdo->prepare('
        SELECT COUNT(*) as today_count 
        FROM bookings 
        WHERE booking_reference LIKE :prefix
        FOR UPDATE
    ');
    $countStmt->execute([':prefix' => "BK-{$datePrefix}-%"]);
    $todayCount = (int)$countStmt->fetch()['today_count'] + 1;
    $sequence = str_pad((string)$todayCount, 4, '0', STR_PAD_LEFT);
    $bookingReference = "BK-{$datePrefix}-{$sequence}";

    // Insert booking
    $insertStmt = $pdo->prepare('
        INSERT INTO bookings (
            booking_reference, full_name, email, phone, check_in, check_out,
            adults, children, rooms_count, room_id, room_name_snapshot,
            additional_requests, nights, estimated_price, final_price, status, created_at, updated_at
        ) VALUES (
            :ref, :full_name, :email, :phone, :check_in, :check_out,
            :adults, :children, :rooms_count, :room_id, :room_name,
            :requests, :nights, :estimated_price, :final_price, "pending", NOW(), NOW()
        )
    ');

    $insertStmt->execute([
        ':ref'             => $bookingReference,
        ':full_name'        => $fullName,
        ':email'            => $email,
        ':phone'            => $phone,
        ':check_in'         => $checkIn,
        ':check_out'        => $checkOut,
        ':adults'           => $adults,
        ':children'         => $children,
        ':rooms_count'      => $roomsCount,
        ':room_id'          => $room['id'],
        ':room_name'        => $room['name'],
        ':requests'         => $additionalRequests,
        ':nights'           => $nights,
        ':estimated_price'  => $estimatedPrice,
        ':final_price'      => $estimatedPrice
    ]);

    $bookingId = (int)$pdo->lastInsertId();
    $pdo->commit();

    // Unified formatted booking payload compatible with frontend types
    $bookingData = [
        'id'                  => $bookingReference, // Used as main reference in frontend
        'databaseId'          => $bookingId,
        'bookingReference'    => $bookingReference,
        'booking_reference'   => $bookingReference,
        'guestName'           => $fullName,
        'full_name'           => $fullName,
        'email'               => $email,
        'phone'               => $phone,
        'roomType'            => $room['name'],
        'room_id'             => (int)$room['id'],
        'room_name_snapshot'  => $room['name'],
        'checkIn'             => $checkIn,
        'check_in'            => $checkIn,
        'checkOut'            => $checkOut,
        'check_out'           => $checkOut,
        'adults'              => $adults,
        'children'            => $children,
        'roomsCount'          => $roomsCount,
        'rooms_count'         => $roomsCount,
        'nights'              => $nights,
        'totalPrice'          => $estimatedPrice,
        'estimated_price'     => $estimatedPrice,
        'specialRequests'     => $additionalRequests,
        'status'              => 'pending',
        'createdAt'           => date('Y-m-d H:i:s'),
        'created_at'          => date('Y-m-d H:i:s')
    ];

    sendSuccess('Booking submitted successfully! Our team will contact you shortly to confirm your reservation.', $bookingData, 201);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Booking creation error: ' . $e->getMessage());
    sendError('An error occurred while processing your booking. Please try again.', 500);
}
