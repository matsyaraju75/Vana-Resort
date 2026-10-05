<?php
/**
 * Vana Resort Araku - Settings API: Get Resort Settings
 * Public endpoint.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->query('SELECT setting_key, setting_value FROM settings');
    $rows = $stmt->fetchAll();

    $settings = [];
    foreach ($rows as $r) {
        $settings[$r['setting_key']] = $r['setting_value'];
    }

    sendSuccess('Resort settings retrieved successfully.', [
        'settings' => $settings
    ]);

} catch (Exception $e) {
    error_log('Get settings error: ' . $e->getMessage());
    sendError('Failed to fetch settings.', 500);
}
