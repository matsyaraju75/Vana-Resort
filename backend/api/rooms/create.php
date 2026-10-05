<?php
/**
 * Vana Resort Araku - Rooms API: Create Room
 * Protected endpoint. Admins only.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth(['super_admin', 'manager']);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method Not Allowed. Use POST.', 405);
}

$input = getJsonInput();

$name = sanitizeString($input['name'] ?? '');
$slug = sanitizeString($input['slug'] ?? '');
if (empty($slug) && !empty($name)) {
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name), '-'));
}
$description = sanitizeString($input['description'] ?? '');
$sizeSqft = (int)($input['size_sqft'] ?? ($input['sizeSqft'] ?? 0));
$sizeSqm = (float)($input['size_sqm'] ?? ($input['sizeSqm'] ?? 0));
$maxGuests = (int)($input['max_guests'] ?? ($input['maxGuests'] ?? 2));
$bedType = sanitizeString($input['bed_type'] ?? ($input['bedType'] ?? 'King Bed'));
$bathroomCount = (int)($input['bathroom_count'] ?? ($input['bathroomCount'] ?? 1));
$pricePerNight = (float)($input['price_per_night'] ?? ($input['pricePerNight'] ?? 0));
$samplePrice = (float)($input['sample_price'] ?? ($input['samplePrice'] ?? $pricePerNight));
$availableRooms = (int)($input['available_rooms'] ?? ($input['availableRooms'] ?? 1));
$status = sanitizeString($input['status'] ?? 'active');
$featured = !empty($input['featured']) ? 1 : 0;
$images = is_array($input['images'] ?? null) ? $input['images'] : [];

$errors = [];
if (empty($name)) {
    $errors['name'] = 'Room name is required.';
}
if (empty($slug)) {
    $errors['slug'] = 'Room slug is required.';
}
if ($pricePerNight <= 0) {
    $errors['price_per_night'] = 'Price per night must be greater than 0.';
}

if (!empty($errors)) {
    sendError('Validation failed.', 422, $errors);
}

try {
    $pdo = Database::getConnection();

    // Check slug uniqueness
    $checkStmt = $pdo->prepare('SELECT id FROM rooms WHERE slug = :slug LIMIT 1');
    $checkStmt->execute([':slug' => $slug]);
    if ($checkStmt->fetch()) {
        sendError('A room with this slug already exists.', 409, ['slug' => 'Slug must be unique.']);
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare('
        INSERT INTO rooms (
            slug, name, description, size_sqft, size_sqm, max_guests, bed_type,
            bathroom_count, price_per_night, sample_price, available_rooms, status, featured, created_at, updated_at
        ) VALUES (
            :slug, :name, :description, :size_sqft, :size_sqm, :max_guests, :bed_type,
            :bathroom_count, :price_per_night, :sample_price, :available_rooms, :status, :featured, NOW(), NOW()
        )
    ');

    $stmt->execute([
        ':slug'            => $slug,
        ':name'            => $name,
        ':description'     => $description,
        ':size_sqft'       => $sizeSqft,
        ':size_sqm'        => $sizeSqm,
        ':max_guests'      => $maxGuests,
        ':bed_type'        => $bedType,
        ':bathroom_count'  => $bathroomCount,
        ':price_per_night' => $pricePerNight,
        ':sample_price'    => $samplePrice,
        ':available_rooms' => $availableRooms,
        ':status'          => $status,
        ':featured'        => $featured
    ]);

    $roomId = (int)$pdo->lastInsertId();

    // Insert room images if provided
    if (!empty($images)) {
        $imgInsert = $pdo->prepare('
            INSERT INTO room_images (room_id, image_path, alt_text, sort_order, created_at)
            VALUES (:room_id, :image_path, :alt_text, :sort_order, NOW())
        ');
        foreach ($images as $index => $img) {
            $imgPath = is_array($img) ? ($img['image_path'] ?? '') : (string)$img;
            $altText = is_array($img) ? ($img['alt_text'] ?? $name) : $name;
            if (!empty($imgPath)) {
                $imgInsert->execute([
                    ':room_id'    => $roomId,
                    ':image_path' => $imgPath,
                    ':alt_text'   => $altText,
                    ':sort_order' => $index
                ]);
            }
        }
    }

    $pdo->commit();

    sendSuccess('Room created successfully.', [
        'id'   => $slug,
        'databaseId' => $roomId,
        'slug' => $slug,
        'name' => $name
    ], 201);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Create room error: ' . $e->getMessage());
    sendError('Failed to create room.', 500);
}
