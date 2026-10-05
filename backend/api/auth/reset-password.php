<?php
/**
 * Vana Resort Araku - Admin Authentication: Password Recovery / Reset
 * Authorizes reset with master recovery key and updates password in MySQL
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method Not Allowed. Use POST for password reset.', 405);
}

// Rate limiting: max 5 recovery attempts per minute
if (!checkRateLimit('admin_password_reset', 5, 60)) {
    sendError('Too many password reset attempts. Please wait 1 minute before trying again.', 429);
}

$input = getJsonInput();
$recoveryKey = trim((string)($input['recovery_key'] ?? ''));
$newPassword = (string)($input['new_password'] ?? '');
$username = sanitizeString($input['username'] ?? 'admin');
if (empty($username)) {
    $username = 'admin';
}

$errors = [];
if (empty($recoveryKey)) {
    $errors['recovery_key'] = 'Master recovery key is required.';
}
if (empty($newPassword) || strlen($newPassword) < 4) {
    $errors['new_password'] = 'New password must be at least 4 characters long.';
}

if (!empty($errors)) {
    sendError('Validation failed.', 422, $errors);
}

// Master recovery keys accepted
$validRecoveryKeys = ['vana-admin', 'admin', 'admin@vana2026!', 'vana@araku2025'];
if (!in_array(strtolower($recoveryKey), $validRecoveryKeys, true)) {
    sendError('Invalid master recovery key. Authorized keys are "vana-admin" or "admin".', 403);
}

try {
    $pdo = Database::getConnection();

    // Verify admin account exists
    $stmt = $pdo->prepare('SELECT id, username, status FROM admins WHERE username = :username LIMIT 1');
    $stmt->execute([':username' => $username]);
    $admin = $stmt->fetch();

    if (!$admin) {
        sendError('Administrator account not found in database.', 404);
    }

    // Hash new password using bcrypt
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);

    // Update admin password
    $updateStmt = $pdo->prepare('UPDATE admins SET password_hash = :hash, updated_at = NOW() WHERE id = :id');
    $updateStmt->execute([
        ':hash' => $newHash,
        ':id'   => $admin['id']
    ]);

    sendSuccess('Management password updated successfully.', [
        'username' => $admin['username']
    ]);

} catch (Exception $e) {
    error_log('Password reset error: ' . $e->getMessage());
    sendError('An internal server error occurred while updating the password.', 500);
}
