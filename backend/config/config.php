<?php
/**
 * Vana Resort Araku - Backend Configuration
 * Safe configuration with environment fallbacks
 */

// Error reporting settings (Log errors, never expose raw errors in response)
ini_set('display_errors', '0');
ini_set('log_errors', '1');

$logDir = __DIR__ . '/../logs';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}
ini_set('error_log', $logDir . '/php_error.log');

// Database configuration
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'vana_resort');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
define('DB_CHARSET', 'utf8mb4');

// Allowed Origins for CORS
define('ALLOWED_ORIGINS', [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost'
]);

// Upload directory configuration
define('UPLOAD_DIR', realpath(__DIR__ . '/../uploads') ?: (__DIR__ . '/../uploads'));
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5 MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'webp']);
define('ALLOWED_MIMES', ['image/jpeg', 'image/png', 'image/webp']);

// Session settings
define('SESSION_COOKIE_NAME', 'vana_session');
define('SESSION_LIFETIME', 86400 * 7); // 7 days
