<?php
/**
 * Vana Resort Araku - Admin Authentication: Me (Session check)
 * Verifies backend session and returns authenticated admin details
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/database.php';

$adminSession = requireAuth();

try {
    $pdo = Database::getConnection();
    $stmt = $pdo->prepare('
        SELECT id, name, username, email, role, status, last_login, created_at 
        FROM admins 
        WHERE id = :id 
        LIMIT 1
    ');
    $stmt->execute([':id' => $adminSession['id']]);
    $admin = $stmt->fetch();

    if (!$admin || $admin['status'] !== 'active') {
        $_SESSION = [];
        session_destroy();
        sendError('Session invalid or account deactivated.', 401);
    }

    $userData = [
        'id'         => (int)$admin['id'],
        'name'       => $admin['name'],
        'username'   => $admin['username'],
        'email'      => $admin['email'],
        'role'       => $admin['role'],
        'status'     => $admin['status'],
        'last_login' => $admin['last_login']
    ];

    sendSuccess('Authenticated session valid.', [
        'user' => $userData
    ]);

} catch (Exception $e) {
    error_log('Session check error: ' . $e->getMessage());
    sendError('Failed to verify session.', 500);
}
