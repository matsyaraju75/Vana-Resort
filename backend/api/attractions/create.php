<?php
/**
 * Vana Resort Araku - Attractions API: Create Attraction
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
$distance = sanitizeString($input['distance_from_resort'] ?? ($input['distance'] ?? ''));
$travelTime = sanitizeString($input['approximate_travel_time'] ?? ($input['timeToVisit'] ?? ''));
$entryFee = sanitizeString($input['entry_fee'] ?? ($input['entryPrice'] ?? 'Free Entry'));
$openingTime = sanitizeString($input['opening_time'] ?? '');
$closingTime = sanitizeString($input['closing_time'] ?? '');
$bestTime = sanitizeString($input['best_time_to_visit'] ?? '');
$category = sanitizeString($input['category'] ?? 'nature');
$image = sanitizeString($input['image'] ?? '');
$latitude = isset($input['latitude']) && is_numeric($input['latitude']) ? (float)$input['latitude'] : null;
$longitude = isset($input['longitude']) && is_numeric($input['longitude']) ? (float)$input['longitude'] : null;
$status = sanitizeString($input['status'] ?? 'active');
$sortOrder = (int)($input['sort_order'] ?? 0);

$errors = [];
if (empty($name)) {
    $errors['name'] = 'Attraction name is required.';
}
if (empty($slug)) {
    $errors['slug'] = 'Attraction slug is required.';
}

if (!empty($errors)) {
    sendError('Validation failed.', 422, $errors);
}

try {
    $pdo = Database::getConnection();

    // Check slug uniqueness
    $checkStmt = $pdo->prepare('SELECT id FROM attractions WHERE slug = :slug LIMIT 1');
    $checkStmt->execute([':slug' => $slug]);
    if ($checkStmt->fetch()) {
        sendError('An attraction with this slug already exists.', 409, ['slug' => 'Slug must be unique.']);
    }

    $stmt = $pdo->prepare('
        INSERT INTO attractions (
            name, slug, description, distance_from_resort, approximate_travel_time,
            entry_fee, opening_time, closing_time, best_time_to_visit, category,
            image, latitude, longitude, status, sort_order, created_at, updated_at
        ) VALUES (
            :name, :slug, :description, :distance, :travel_time,
            :entry_fee, :opening_time, :closing_time, :best_time, :category,
            :image, :latitude, :longitude, :status, :sort_order, NOW(), NOW()
        )
    ');

    $stmt->execute([
        ':name'        => $name,
        ':slug'        => $slug,
        ':description' => $description,
        ':distance'    => $distance,
        ':travel_time' => $travelTime,
        ':entry_fee'   => $entryFee,
        ':opening_time'=> $openingTime ?: null,
        ':closing_time'=> $closingTime ?: null,
        ':best_time'   => $bestTime ?: null,
        ':category'    => $category,
        ':image'       => $image,
        ':latitude'    => $latitude,
        ':longitude'   => $longitude,
        ':status'      => $status,
        ':sort_order'  => $sortOrder
    ]);

    $attractionId = (int)$pdo->lastInsertId();

    sendSuccess('Attraction created successfully.', [
        'id'         => $slug,
        'databaseId' => $attractionId,
        'slug'       => $slug,
        'name'       => $name
    ], 201);

} catch (Exception $e) {
    error_log('Create attraction error: ' . $e->getMessage());
    sendError('Failed to create attraction.', 500);
}
