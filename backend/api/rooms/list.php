<?php
/**
 * Vana Resort Araku - Rooms API: List Rooms
 * Public endpoint (returns active rooms). If authenticated admin and all=1, returns all rooms.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

$currentAdmin = getCurrentAdmin();
$showAll = !empty($_GET['all']) && $currentAdmin !== null;

try {
    $pdo = Database::getConnection();

    $where = $showAll ? '' : 'WHERE r.status = "active"';
    $sql = "
        SELECT 
            r.*,
            GROUP_CONCAT(ri.image_path ORDER BY ri.sort_order ASC SEPARATOR '|||') AS image_paths,
            GROUP_CONCAT(ri.alt_text ORDER BY ri.sort_order ASC SEPARATOR '|||') AS alt_texts
        FROM rooms r
        LEFT JOIN room_images ri ON r.id = ri.room_id
        {$where}
        GROUP BY r.id
        ORDER BY r.id ASC
    ";

    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();

    $rooms = array_map(function ($row) {
        $imagePaths = !empty($row['image_paths']) ? explode('|||', $row['image_paths']) : [];
        $altTexts = !empty($row['alt_texts']) ? explode('|||', $row['alt_texts']) : [];

        $images = [];
        foreach ($imagePaths as $idx => $path) {
            $images[] = [
                'image_path' => $path,
                'alt_text'   => $altTexts[$idx] ?? $row['name']
            ];
        }

        $primaryImage = !empty($imagePaths) ? $imagePaths[0] : '';

        return [
            'id'             => $row['slug'], // Frontend routes use slug
            'databaseId'     => (int)$row['id'],
            'database_id'    => (int)$row['id'],
            'slug'           => $row['slug'],
            'name'           => $row['name'],
            'description'    => $row['description'],
            'sizeSqft'       => (int)$row['size_sqft'],
            'size_sqft'      => (int)$row['size_sqft'],
            'sizeSqm'        => (float)$row['size_sqm'],
            'size_sqm'       => (float)$row['size_sqm'],
            'maxGuests'      => (int)$row['max_guests'],
            'max_guests'     => (int)$row['max_guests'],
            'bedType'        => $row['bed_type'],
            'bed_type'       => $row['bed_type'],
            'bathroomCount'  => (int)$row['bathroom_count'],
            'bathroom_count' => (int)$row['bathroom_count'],
            'pricePerNight'  => (float)$row['price_per_night'],
            'price_per_night'=> (float)$row['price_per_night'],
            'samplePrice'    => (float)$row['sample_price'],
            'sample_price'   => (float)$row['sample_price'],
            'availableRooms' => (int)$row['available_rooms'],
            'available_rooms'=> (int)$row['available_rooms'],
            'status'         => $row['status'],
            'featured'       => (bool)$row['featured'],
            'image'          => $primaryImage,
            'images'         => $images,
            'imageUrls'      => $imagePaths,
            'created_at'     => $row['created_at'],
            'updated_at'     => $row['updated_at']
        ];
    }, $rows);

    sendSuccess('Rooms retrieved successfully.', [
        'rooms' => $rooms,
        'count' => count($rooms)
    ]);

} catch (Exception $e) {
    error_log('List rooms error: ' . $e->getMessage());
    sendError('Failed to fetch rooms.', 500);
}
