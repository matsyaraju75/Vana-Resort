<?php
/**
 * Vana Resort Araku - Authentication & Session Middleware
 * Secure session initialization and role-based authorization verification
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/response.php';

function startAdminSession(): void {
    if (session_status() === PHP_SESSION_NONE) {
        // Configure secure cookie parameters
        session_name(SESSION_COOKIE_NAME);
        
        $cookieParams = [
            'lifetime' => SESSION_LIFETIME,
            'path'     => '/',
            'domain'   => '',
            'secure'   => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
            'httponly' => true,
            'samesite' => 'Lax'
        ];

        session_set_cookie_params($cookieParams);
        session_start();
    }
}

/**
 * Require valid authenticated admin session
 * @param array $allowedRoles Array of roles (e.g. ['super_admin', 'manager'])
 * @return array Authenticated admin information
 */
function requireAuth(array $allowedRoles = []): array {
    startAdminSession();

    if (!isset($_SESSION['admin_id']) || empty($_SESSION['admin_id'])) {
        sendError('Unauthorized. Please log in to continue.', 401);
    }

    $admin = [
        'id'       => $_SESSION['admin_id'],
        'name'     => $_SESSION['admin_name'] ?? '',
        'username' => $_SESSION['admin_username'] ?? '',
        'email'    => $_SESSION['admin_email'] ?? '',
        'role'     => $_SESSION['admin_role'] ?? 'staff',
        'status'   => $_SESSION['admin_status'] ?? 'active'
    ];

    if ($admin['status'] !== 'active') {
        // Destroy session if account disabled
        $_SESSION = [];
        session_destroy();
        sendError('Account is inactive. Access denied.', 403);
    }

    if (!empty($allowedRoles) && !in_array($admin['role'], $allowedRoles, true)) {
        sendError('Forbidden. Insufficient permissions for this action.', 403);
    }

    return $admin;
}

/**
 * Get currently authenticated admin without throwing error
 * @return array|null
 */
function getCurrentAdmin(): ?array {
    startAdminSession();

    if (!isset($_SESSION['admin_id']) || empty($_SESSION['admin_id'])) {
        return null;
    }

    return [
        'id'       => $_SESSION['admin_id'],
        'name'     => $_SESSION['admin_name'] ?? '',
        'username' => $_SESSION['admin_username'] ?? '',
        'email'    => $_SESSION['admin_email'] ?? '',
        'role'     => $_SESSION['admin_role'] ?? 'staff',
        'status'   => $_SESSION['admin_status'] ?? 'active'
    ];
}
