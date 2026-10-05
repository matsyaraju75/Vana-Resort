<?php
/**
 * Vana Resort Araku - Database Migration / Setup Helper
 * Automates table creation and data seeding from database/vana_resort.sql
 */

require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/config.php';

try {
    // 1. Connect to MySQL server without specific DB first
    $rootDsn = sprintf('mysql:host=%s;port=%s;charset=%s', DB_HOST, DB_PORT, DB_CHARSET);
    $rootPdo = new PDO($rootDsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // 2. Create database if it does not exist
    $rootPdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

    // 3. Connect to the database
    $dbDsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', DB_HOST, DB_PORT, DB_NAME, DB_CHARSET);
    $pdo = new PDO($dbDsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);

    // 4. Locate SQL file
    $sqlFile = realpath(__DIR__ . '/../../database/vana_resort.sql');
    if (!$sqlFile || !file_exists($sqlFile)) {
        sendError('SQL file database/vana_resort.sql not found.', 404);
    }

    $sqlContent = file_get_contents($sqlFile);
    if (empty($sqlContent)) {
        sendError('SQL file database/vana_resort.sql is empty.', 400);
    }

    // 5. Execute SQL statements
    $pdo->exec($sqlContent);

    // 6. Verify table counts
    $tables = ['admins', 'rooms', 'room_images', 'bookings', 'contacts', 'attractions', 'gallery', 'visitor_logs', 'settings'];
    $summary = [];
    foreach ($tables as $t) {
        $stmt = $pdo->query("SELECT COUNT(*) AS total FROM `{$t}`");
        $summary[$t] = (int)$stmt->fetch()['total'];
    }

    sendSuccess('Database setup completed successfully! All tables and seed data are ready.', [
        'database' => DB_NAME,
        'tables'   => $summary,
        'default_admin' => [
            'username' => 'admin',
            'email'    => 'admin@vanaresort.com',
            'role'     => 'super_admin',
            'note'     => 'Password is the secure default initialized in schema'
        ]
    ]);

} catch (PDOException $e) {
    error_log('Database setup error: ' . $e->getMessage());
    sendError('Database setup failed: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    sendError('Setup error: ' . $e->getMessage(), 500);
}
