<?php
/**
 * Vana Resort Araku - CORS Middleware
 * Manages Cross-Origin Resource Sharing with credentials support
 */

require_once __DIR__ . '/../config/config.php';

function handleCors(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    // If origin is in allowed origins or matches localhost/127.0.0.1 port pattern
    $isAllowed = false;
    if (in_array($origin, ALLOWED_ORIGINS, true)) {
        $isAllowed = true;
    } elseif (preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin)) {
        $isAllowed = true;
    }

    if ($isAllowed && $origin) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Access-Control-Allow-Credentials: true');
    } else {
        // Default to localhost:5173 for local dev if origin header omitted by tools/curl
        header('Access-Control-Allow-Origin: http://localhost:5173');
        header('Access-Control-Allow-Credentials: true');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
    header('Access-Control-Max-Age: 86400'); // Cache preflight for 24 hours

    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Automatically invoke CORS handling
handleCors();
