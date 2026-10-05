<?php
/**
 * Vana Resort Araku - API Health Check
 */

require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/database.php';

$dbCheck = Database::testConnection();

$data = [
    'app'          => 'Vana Resort Araku API',
    'status'       => $dbCheck['connected'] ? 'healthy' : 'degraded',
    'php_version'  => PHP_VERSION,
    'database'     => $dbCheck['connected'] ? 'connected' : 'disconnected',
    'timestamp'    => date('Y-m-d H:i:s')
];

if (!$dbCheck['connected']) {
    $data['db_error'] = $dbCheck['error'];
    jsonResponse(false, 'API is running but database connection failed. Please ensure MySQL is running in XAMPP.', $data, 503);
}

sendSuccess('Vana Resort Araku API is healthy and connected to MySQL.', $data);
