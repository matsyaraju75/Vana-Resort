<?php
/**
 * Vana Resort Araku - Database Connection
 * PDO Singleton with prepared statement enforcement and secure error handling
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;

    /**
     * Get singleton PDO connection
     * @return PDO
     * @throws Exception
     */
    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                DB_HOST,
                DB_PORT,
                DB_NAME,
                DB_CHARSET
            );

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];

            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                error_log('Database connection error: ' . $e->getMessage());
                throw new Exception('Database connection failed. Please ensure MySQL is running and the database is imported.');
            }
        }

        return self::$instance;
    }

    /**
     * Check if database connection can be established
     * @return array [bool $connected, string $error]
     */
    public static function testConnection(): array {
        try {
            self::getConnection();
            return ['connected' => true, 'error' => ''];
        } catch (Exception $e) {
            return ['connected' => false, 'error' => $e->getMessage()];
        }
    }
}
