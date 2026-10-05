<?php
/**
 * Vana Resort Araku - Validation & Input Helper
 * Sanitization, date calculations, and format checking
 */

function getJsonInput(): array {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    
    if (stripos($contentType, 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            return [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    // Fallback to standard POST data if form-encoded or multipart
    return $_POST ?: [];
}

function sanitizeString(?string $str): string {
    if ($str === null) {
        return '';
    }
    return htmlspecialchars(trim($str), ENT_QUOTES, 'UTF-8');
}

function validateEmail(?string $email): bool {
    if (empty($email)) {
        return false;
    }
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validatePhone(?string $phone): bool {
    if (empty($phone)) {
        return false;
    }
    // Allow standard phone numbers (+, digits, spaces, hyphens, min 7 max 15 digits)
    $clean = preg_replace('/[^\d+]/', '', $phone);
    return strlen($clean) >= 7 && strlen($clean) <= 16;
}

function validateDate(?string $date, string $format = 'Y-m-d'): bool {
    if (empty($date)) {
        return false;
    }
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
}

/**
 * Calculate difference in days between two Y-m-d dates
 */
function calculateStayNights(string $checkIn, string $checkOut): int {
    try {
        $start = new DateTime($checkIn);
        $end = new DateTime($checkOut);
        $diff = $start->diff($end);
        return $diff->invert ? 0 : (int)$diff->days;
    } catch (Exception $e) {
        return 0;
    }
}

/**
 * Lightweight rate-limiter based on client IP hash
 */
function checkRateLimit(string $action = 'general', int $maxAttempts = 30, int $windowSeconds = 60): bool {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $hash = hash('sha256', $ip . '_' . $action);
    $tmpDir = sys_get_temp_dir() . '/vana_rate_limits';
    if (!is_dir($tmpDir)) {
        @mkdir($tmpDir, 0755, true);
    }
    $file = $tmpDir . '/' . $hash . '.json';

    $now = time();
    $data = ['count' => 0, 'first_attempt' => $now];

    if (file_exists($file)) {
        $content = @file_get_contents($file);
        $parsed = json_decode($content, true);
        if (is_array($parsed) && isset($parsed['first_attempt']) && ($now - $parsed['first_attempt'] < $windowSeconds)) {
            $data = $parsed;
        }
    }

    $data['count']++;
    @file_put_contents($file, json_encode($data));

    return $data['count'] <= $maxAttempts;
}
