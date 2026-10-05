<?php
/**
 * Vana Resort Araku - Secure Image Upload Helper
 * Validates mime, extension, size, image integrity, and sanitizes filenames
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/response.php';

function handleImageUpload(string $fileKey = 'image', string $subDir = ''): string {
    if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
        $errorCode = $_FILES[$fileKey]['error'] ?? UPLOAD_ERR_NO_FILE;
        $errorMsg = match ($errorCode) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'File exceeds maximum upload size (5MB).',
            UPLOAD_ERR_PARTIAL => 'File was only partially uploaded.',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded.',
            default => 'Upload failed due to a server error.'
        };
        sendError($errorMsg, 400);
    }

    $file = $_FILES[$fileKey];

    // Validate file size
    if ($file['size'] > MAX_UPLOAD_SIZE) {
        sendError('File size exceeds 5MB limit.', 400);
    }

    // Validate file extension
    $originalName = $file['name'];
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    if (!in_array($extension, ALLOWED_EXTENSIONS, true)) {
        sendError('Invalid file type. Only JPG, PNG, and WebP images are allowed.', 400);
    }

    // Validate MIME type with finfo
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);

    if (!in_array($mimeType, ALLOWED_MIMES, true)) {
        sendError('Invalid image format detected. Only true JPG, PNG, and WebP images are accepted.', 400);
    }

    // Verify image integrity with getimagesize
    $imageInfo = @getimagesize($file['tmp_name']);
    if ($imageInfo === false) {
        sendError('Corrupted or invalid image file.', 400);
    }

    // Destination target folder
    $targetDir = UPLOAD_DIR;
    if ($subDir !== '') {
        $targetDir .= '/' . trim($subDir, '/');
    }

    if (!is_dir($targetDir)) {
        if (!@mkdir($targetDir, 0755, true)) {
            sendError('Failed to create upload destination directory.', 500);
        }
    }

    // Generate cryptographically safe unique filename
    $safeFilename = bin2hex(random_bytes(16)) . '.' . $extension;
    $destination = $targetDir . '/' . $safeFilename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        sendError('Failed to store uploaded file on server.', 500);
    }

    // Return public web accessible path
    $publicPath = '/vana-resort/backend/uploads/' . ($subDir ? trim($subDir, '/') . '/' : '') . $safeFilename;
    return $publicPath;
}
