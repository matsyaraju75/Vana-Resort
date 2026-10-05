<?php
/**
 * Vana Resort Araku - Rooms API: Get Room by ID or Slug
 * Public endpoint.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

$identifier = sanitizeString($_GET['id'] ?? ($_GET['slug'] ?? ''));

if (empty($identifier)) {
    sendError('Room identifier (slug or ID) is required.', 400);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('
        SELECT * FROM rooms 
        WHERE id = :id_num OR slug = :slug_val 
        LIMIT 1
    ');
    $stmt->execute([
        ':id_num'   => is_numeric($identifier) ? (int)$identifier : 0,
        ':slug_val' => $identifier
    ]);
    $room = $stmt->fetch();

    if (!$room) {
        sendError('Room not found.', 404);
    }

    // Fetch images
    $imgStmt = $pdo->prepare('
        SELECT id, image_path, alt_text, sort_order 
        FROM room_images 
        WHERE room_id = :room_id 
        ORDER BY sort_order ASC
    ');
    $imgStmt->execute([':room_id' => $room['id']]);
    $images = $imgStmt->fetchAll();

    $imageUrls = array_column($images, 'image_path');
    $primaryImage = !empty($imageUrls) ? $imageUrls[0] : '';

    $data = [
        'id'             => $room['slug'],
        'databaseId'     => (int)$room['id'],
        'database_id'    => (int)$room['id'],
        'slug'           => $room['slug'],
        'name'           => $room['name'],
        'description'    => $room['description'],
        'sizeSqft'       => (int)$room['size_sqft'],
        'size_sqft'      => (int)$room['size_sqft'],
        'sizeSqm'        => (float)$room['size_sqm'],
        'size_sqm'       => (float)$room['size_sqm'],
        'maxGuests'      => (int)$room['max_guests'],
        'max_guests'     => (int)$room['max_guests'],
        'bedType'        => $room['bed_type'],
        'bed_type'       => $room['bed_type'],
        'bathroomCount'  => (int)$room['bathroom_count'],
        'bathroom_count' => (int)$room['bathroom_count'],
        'pricePerNight'  => (float)$room['price_per_night'],
        'price_per_night'=> (float)$room['price_per_night'],
        'samplePrice'    => (float)$room['sample_price'],
        'sample_price'   => (float)$room['sample_price'],
        'availableRooms' => (int)$room['available_rooms'],
        'available_rooms'=> (int)$room['available_rooms'],
        'status'         => $room['status'],
        'featured'       => (bool)$room['featured'],
        'image'          => $primaryImage,
        'images'         => $images,
        'imageUrls'      => $imageUrls,
        'created_at'     => $room['created_at'],
        'updated_at'     => $room['updated_at']
    ];

    sendSuccess('Room details retrieved successfully.', $data);

} catch (Exception $e) {
    error_log('Get room error: ' . $e->getMessage());
    sendError('Failed to fetch room details.', 500);
}
