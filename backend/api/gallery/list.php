<?php
/**
 * Vana Resort Araku - Gallery API: List Images
 * Public endpoint. Supports filtering by category.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

$currentAdmin = getCurrentAdmin();
$showAll = !empty($_GET['all']) && $currentAdmin !== null;
$category = sanitizeString($_GET['category'] ?? '');

try {
    $pdo = Database::getConnection();

    $where = [];
    $params = [];

    if (!$showAll) {
        $where[] = 'status = "active"';
    }

    if (!empty($category) && $category !== 'all') {
        $where[] = 'category = :category';
        $params[':category'] = $category;
    }

    $whereSql = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
    $sql = "SELECT * FROM gallery {$whereSql} ORDER BY sort_order ASC, id ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $items = array_map(function ($row) {
        return [
            'id'         => (string)$row['id'],
            'databaseId' => (int)$row['id'],
            'title'      => $row['title'],
            'category'   => $row['category'],
            'src'        => $row['image_path'],
            'image_path' => $row['image_path'],
            'alt'        => $row['alt_text'] ?: $row['title'],
            'alt_text'   => $row['alt_text'] ?: $row['title'],
            'caption'    => $row['caption'] ?? '',
            'sort_order' => (int)$row['sort_order'],
            'status'     => $row['status'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];
    }, $rows);

    sendSuccess('Gallery items retrieved successfully.', [
        'gallery' => $items,
        'count'   => count($items)
    ]);

} catch (Exception $e) {
    error_log('List gallery error: ' . $e->getMessage());
    sendError('Failed to fetch gallery items.', 500);
}
