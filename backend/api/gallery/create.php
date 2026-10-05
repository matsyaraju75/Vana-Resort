<?php
/**
 * Vana Resort Araku - Gallery API: Upload & Add Image
 * Protected endpoint. Handles secure file upload or static image URL.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../helpers/upload.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth(['super_admin', 'manager', 'staff']);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method Not Allowed. Use POST.', 405);
}

// Check if an actual file was uploaded via multipart/form-data
$imagePath = '';
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $imagePath = handleImageUpload('image', 'gallery');
}

$input = getJsonInput();
if (empty($imagePath)) {
    $imagePath = sanitizeString($input['image_path'] ?? ($input['src'] ?? ''));
}

$title = sanitizeString($input['title'] ?? ($_POST['title'] ?? ''));
$category = sanitizeString($input['category'] ?? ($_POST['category'] ?? 'resort'));
$altText = sanitizeString($input['alt_text'] ?? ($input['alt'] ?? ($_POST['alt_text'] ?? ($_POST['alt'] ?? $title))));
$caption = sanitizeString($input['caption'] ?? ($_POST['caption'] ?? ''));
$sortOrder = (int)($input['sort_order'] ?? ($_POST['sort_order'] ?? 0));
$status = sanitizeString($input['status'] ?? ($_POST['status'] ?? 'active'));

$errors = [];
if (empty($title)) {
    $errors['title'] = 'Image title is required.';
}
if (empty($imagePath)) {
    $errors['image'] = 'An image file or valid image path is required.';
}

if (!empty($errors)) {
    sendError('Validation failed.', 422, $errors);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('
        INSERT INTO gallery (
            title, category, image_path, alt_text, caption, sort_order, status, created_at, updated_at
        ) VALUES (
            :title, :category, :image_path, :alt_text, :caption, :sort_order, :status, NOW(), NOW()
        )
    ');

    $stmt->execute([
        ':title'      => $title,
        ':category'   => $category,
        ':image_path' => $imagePath,
        ':alt_text'   => $altText,
        ':caption'    => $caption,
        ':sort_order' => $sortOrder,
        ':status'     => $status
    ]);

    $id = (int)$pdo->lastInsertId();

    sendSuccess('Gallery item created successfully.', [
        'id'         => (string)$id,
        'title'      => $title,
        'category'   => $category,
        'src'        => $imagePath,
        'image_path' => $imagePath,
        'alt'        => $altText,
        'caption'    => $caption,
        'sort_order' => $sortOrder,
        'status'     => $status
    ], 201);

} catch (Exception $e) {
    error_log('Create gallery error: ' . $e->getMessage());
    sendError('Failed to save gallery item.', 500);
}
