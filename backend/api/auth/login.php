<?php
/**
 * Vana Resort Araku - Admin Authentication: Login
 * Validates credentials against MySQL admins table, uses password_verify, regenerates session
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method Not Allowed. Use POST for login.', 405);
}

// Rate limiting: max 10 login attempts per minute per IP
if (!checkRateLimit('admin_login', 10, 60)) {
    sendError('Too many login attempts. Please wait 1 minute before trying again.', 429);
}

$input = getJsonInput();
$identifier = sanitizeString($input['username'] ?? ($input['email'] ?? ''));
$password = (string)($input['password'] ?? '');

$errors = [];
if (empty($identifier)) {
    $errors['username'] = 'Username or email is required.';
}
if (empty($password)) {
    $errors['password'] = 'Password is required.';
}

if (!empty($errors)) {
    sendError('Validation failed.', 422, $errors);
}

try {
    $pdo = Database::getConnection();

    // Query admin by username or email
    $stmt = $pdo->prepare('
        SELECT id, name, username, email, password_hash, role, status, last_login 
        FROM admins 
        WHERE (username = :identifier OR email = :identifier) 
        LIMIT 1
    ');
    $stmt->execute([':identifier' => $identifier]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        // Prevent user enumeration by returning consistent error
        sendError('Invalid username/email or password.', 401);
    }

    if ($admin['status'] !== 'active') {
        sendError('Account has been deactivated. Please contact the administrator.', 403);
    }

    // Initialize session and regenerate ID for session fixation protection
    startAdminSession();
    session_regenerate_id(true);

    $_SESSION['admin_id'] = (int)$admin['id'];
    $_SESSION['admin_name'] = $admin['name'];
    $_SESSION['admin_username'] = $admin['username'];
    $_SESSION['admin_email'] = $admin['email'];
    $_SESSION['admin_role'] = $admin['role'];
    $_SESSION['admin_status'] = $admin['status'];

    // Update last_login timestamp
    $updateStmt = $pdo->prepare('UPDATE admins SET last_login = NOW() WHERE id = :id');
    $updateStmt->execute([':id' => $admin['id']]);

    $userData = [
        'id'         => (int)$admin['id'],
        'name'       => $admin['name'],
        'username'   => $admin['username'],
        'email'      => $admin['email'],
        'role'       => $admin['role'],
        'status'     => $admin['status'],
        'last_login' => date('Y-m-d H:i:s')
    ];

    sendSuccess('Login successful.', [
        'user' => $userData
    ]);

} catch (Exception $e) {
    error_log('Login error: ' . $e->getMessage());
    sendError('An internal server error occurred during login.', 500);
}
