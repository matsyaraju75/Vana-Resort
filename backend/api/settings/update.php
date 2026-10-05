<?php
/**
 * Vana Resort Araku - Settings API: Update Resort Settings
 * Protected endpoint. Only super_admin and manager.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth(['super_admin', 'manager']);

if (!in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'POST', 'PATCH'], true)) {
    sendError('Method Not Allowed. Use PUT or POST.', 405);
}

$input = getJsonInput();
$settings = $input['settings'] ?? $input;

if (!is_array($settings) || empty($settings)) {
    sendError('Settings payload must be a key-value object.', 400);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('
        INSERT INTO settings (setting_key, setting_value, updated_at) 
        VALUES (:key, :val, NOW()) 
        ON DUPLICATE KEY UPDATE setting_value = :update_val, updated_at = NOW()
    ');

    $pdo->beginTransaction();

    $allowedKeys = [
        'resort_name', 'resort_phone', 'resort_email', 'whatsapp_number',
        'address', 'check_in_time', 'check_out_time', 'facebook_url',
        'instagram_url', 'youtube_url', 'booking_message', 'maintenance_mode'
    ];

    $updatedKeys = [];
    foreach ($settings as $k => $v) {
        if (in_array($k, $allowedKeys, true) && is_scalar($v)) {
            $stmt->execute([
                ':key'        => $k,
                ':val'        => (string)$v,
                ':update_val' => (string)$v
            ]);
            $updatedKeys[] = $k;
        }
    }

    $pdo->commit();

    sendSuccess('Settings updated successfully.', [
        'updated_keys' => $updatedKeys
    ]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Update settings error: ' . $e->getMessage());
    sendError('Failed to update resort settings.', 500);
}
