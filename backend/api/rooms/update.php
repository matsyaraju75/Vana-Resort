<?php
/**
 * Vana Resort Araku - Rooms API: Update Room
 * Protected endpoint. Admins only.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth(['super_admin', 'manager']);

if (!in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'POST', 'PATCH'], true)) {
    sendError('Method Not Allowed. Use PUT or POST.', 405);
}

$input = getJsonInput();
$identifier = sanitizeString($_GET['id'] ?? ($input['id'] ?? ($input['slug'] ?? '')));

if (empty($identifier)) {
    sendError('Room ID or slug is required.', 400);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('SELECT * FROM rooms WHERE id = :id_num OR slug = :slug_val LIMIT 1');
    $stmt->execute([
        ':id_num'   => is_numeric($identifier) ? (int)$identifier : 0,
        ':slug_val' => $identifier
    ]);
    $room = $stmt->fetch();

    if (!$room) {
        sendError('Room not found.', 404);
    }

    $roomId = (int)$room['id'];

    $updates = [];
    $params = [':id' => $roomId];

    if (isset($input['name'])) {
        $updates[] = 'name = :name';
        $params[':name'] = sanitizeString($input['name']);
    }
    if (isset($input['description'])) {
        $updates[] = 'description = :description';
        $params[':description'] = sanitizeString($input['description']);
    }
    if (isset($input['size_sqft']) || isset($input['sizeSqft'])) {
        $updates[] = 'size_sqft = :size_sqft';
        $params[':size_sqft'] = (int)($input['size_sqft'] ?? $input['sizeSqft']);
    }
    if (isset($input['size_sqm']) || isset($input['sizeSqm'])) {
        $updates[] = 'size_sqm = :size_sqm';
        $params[':size_sqm'] = (float)($input['size_sqm'] ?? $input['sizeSqm']);
    }
    if (isset($input['max_guests']) || isset($input['maxGuests'])) {
        $updates[] = 'max_guests = :max_guests';
        $params[':max_guests'] = (int)($input['max_guests'] ?? $input['maxGuests']);
    }
    if (isset($input['bed_type']) || isset($input['bedType'])) {
        $updates[] = 'bed_type = :bed_type';
        $params[':bed_type'] = sanitizeString($input['bed_type'] ?? $input['bedType']);
    }
    if (isset($input['bathroom_count']) || isset($input['bathroomCount'])) {
        $updates[] = 'bathroom_count = :bathroom_count';
        $params[':bathroom_count'] = (int)($input['bathroom_count'] ?? $input['bathroomCount']);
    }
    if (isset($input['price_per_night']) || isset($input['pricePerNight'])) {
        $updates[] = 'price_per_night = :price_per_night';
        $params[':price_per_night'] = (float)($input['price_per_night'] ?? $input['pricePerNight']);
    }
    if (isset($input['sample_price']) || isset($input['samplePrice'])) {
        $updates[] = 'sample_price = :sample_price';
        $params[':sample_price'] = (float)($input['sample_price'] ?? $input['samplePrice']);
    }
    if (isset($input['available_rooms']) || isset($input['availableRooms'])) {
        $updates[] = 'available_rooms = :available_rooms';
        $params[':available_rooms'] = (int)($input['available_rooms'] ?? $input['availableRooms']);
    }
    if (isset($input['status'])) {
        $statusVal = sanitizeString($input['status']);
        if (in_array($statusVal, ['active', 'inactive', 'maintenance'], true)) {
            $updates[] = 'status = :status';
            $params[':status'] = $statusVal;
        }
    }
    if (isset($input['featured'])) {
        $updates[] = 'featured = :featured';
        $params[':featured'] = !empty($input['featured']) ? 1 : 0;
    }

    $pdo->beginTransaction();

    if (!empty($updates)) {
        $updates[] = 'updated_at = NOW()';
        $updateSql = 'UPDATE rooms SET ' . implode(', ', $updates) . ' WHERE id = :id';
        $upStmt = $pdo->prepare($updateSql);
        $upStmt->execute($params);
    }

    // If new images provided, optionally replace or append
    if (isset($input['images']) && is_array($input['images'])) {
        $pdo->prepare('DELETE FROM room_images WHERE room_id = :room_id')->execute([':room_id' => $roomId]);
        $imgInsert = $pdo->prepare('
            INSERT INTO room_images (room_id, image_path, alt_text, sort_order, created_at)
            VALUES (:room_id, :image_path, :alt_text, :sort_order, NOW())
        ');
        foreach ($input['images'] as $index => $img) {
            $imgPath = is_array($img) ? ($img['image_path'] ?? '') : (string)$img;
            $altText = is_array($img) ? ($img['alt_text'] ?? $room['name']) : $room['name'];
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

    sendSuccess('Room updated successfully.', [
        'id'   => $room['slug'],
        'databaseId' => $roomId
    ]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Update room error: ' . $e->getMessage());
    sendError('Failed to update room.', 500);
}
