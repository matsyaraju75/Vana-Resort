<?php
/**
 * Vana Resort Araku - Attractions API: List Attractions
 * Public endpoint (returns active attractions). If authenticated admin and all=1, returns all attractions.
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

    $where = $showAll ? '' : 'WHERE status = "active"';
    $sql = "SELECT * FROM attractions {$where} ORDER BY sort_order ASC, id ASC";

    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();

    $categoryLabels = [
        'viewpoint' => 'Scenic Viewpoint',
        'waterfall' => 'Cascading Waterfalls',
        'culture'   => 'Culture & Heritage',
        'nature'    => 'Nature & Botany',
        'heritage'  => 'Historic Caves & Geology'
    ];

    $attractions = array_map(function ($row) use ($categoryLabels) {
        $cat = $row['category'] ?? 'nature';
        $timeStr = ($row['opening_time'] && $row['closing_time']) 
            ? "{$row['opening_time']} – {$row['closing_time']}" 
            : ($row['best_time_to_visit'] ?: 'Daytime');

        return [
            'id'                     => $row['slug'],
            'databaseId'             => (int)$row['id'],
            'database_id'            => (int)$row['id'],
            'slug'                   => $row['slug'],
            'name'                   => $row['name'],
            'category'               => $cat,
            'categoryLabel'          => $categoryLabels[$cat] ?? ucfirst($cat),
            'category_label'         => $categoryLabels[$cat] ?? ucfirst($cat),
            'description'            => $row['description'],
            'distance'               => $row['distance_from_resort'],
            'distance_from_resort'   => $row['distance_from_resort'],
            'timeToVisit'            => $timeStr,
            'approximate_travel_time'=> $row['approximate_travel_time'],
            'entryPrice'             => $row['entry_fee'] ?: 'Free Entry',
            'entry_fee'              => $row['entry_fee'],
            'opening_time'           => $row['opening_time'],
            'closing_time'           => $row['closing_time'],
            'best_time_to_visit'     => $row['best_time_to_visit'],
            'image'                  => $row['image'],
            'latitude'               => $row['latitude'] ? (float)$row['latitude'] : null,
            'longitude'              => $row['longitude'] ? (float)$row['longitude'] : null,
            'status'                 => $row['status'],
            'sort_order'             => (int)$row['sort_order'],
            'googleQuery'            => $row['name'] . ' Araku Valley Andhra Pradesh',
            'created_at'             => $row['created_at'],
            'updated_at'             => $row['updated_at']
        ];
    }, $rows);

    sendSuccess('Attractions retrieved successfully.', [
        'attractions' => $attractions,
        'count'       => count($attractions)
    ]);

} catch (Exception $e) {
    error_log('List attractions error: ' . $e->getMessage());
    sendError('Failed to fetch attractions.', 500);
}
