<?php
/**
 * Vana Resort Araku - Analytics API: Track Page View
 * Lightweight privacy-preserving page view logging.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method Not Allowed. Use POST.', 405);
}

// Rate limit: max 60 tracking hits per minute per IP
if (!checkRateLimit('analytics_track', 60, 60)) {
    sendSuccess('Track ignored (rate limit).');
}

$input = getJsonInput();

$pagePath = sanitizeString($input['page_path'] ?? ($input['path'] ?? '/'));
$pageTitle = sanitizeString($input['page_title'] ?? ($input['title'] ?? 'Vana Resort Araku'));
$referrer = sanitizeString($input['referrer'] ?? '');
$sessionId = sanitizeString($input['session_id'] ?? ($input['sessionId'] ?? ''));

if (empty($sessionId)) {
    // Generate pseudo-session based on date + ip
    $sessionId = 'sess_' . substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1') . date('Ymd')), 0, 16);
}

// Infer device type, browser, and OS from User-Agent
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
$ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

$ipHash = hash('sha256', $ip . 'vana_salt_2026');
$uaHash = hash('sha256', $ua);

$deviceType = 'desktop';
if (preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', $ua)) {
    $deviceType = 'tablet';
} elseif (preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i', $ua)) {
    $deviceType = 'mobile';
}

$browser = 'Other';
if (preg_match('/edg/i', $ua)) {
    $browser = 'Edge';
} elseif (preg_match('/chrome/i', $ua)) {
    $browser = 'Chrome';
} elseif (preg_match('/safari/i', $ua) && !preg_match('/chrome/i', $ua)) {
    $browser = 'Safari';
} elseif (preg_match('/firefox/i', $ua)) {
    $browser = 'Firefox';
} elseif (preg_match('/opera|opr/i', $ua)) {
    $browser = 'Opera';
}

$os = 'Other';
if (preg_match('/windows nt 10/i', $ua)) {
    $os = 'Windows 10/11';
} elseif (preg_match('/windows nt/i', $ua)) {
    $os = 'Windows';
} elseif (preg_match('/macintosh|mac os x/i', $ua)) {
    $os = 'macOS';
} elseif (preg_match('/linux/i', $ua)) {
    $os = 'Linux';
} elseif (preg_match('/android/i', $ua)) {
    $os = 'Android';
} elseif (preg_match('/iphone|ipad|ipod/i', $ua)) {
    $os = 'iOS';
}

try {
    $pdo = Database::getConnection();

    // Debounce exact duplicates within 10 seconds
    $checkDup = $pdo->prepare('
        SELECT id FROM visitor_logs 
        WHERE session_id = :session_id AND page_path = :page_path 
          AND created_at >= (NOW() - INTERVAL 10 SECOND)
        LIMIT 1
    ');
    $checkDup->execute([
        ':session_id' => $sessionId,
        ':page_path'  => $pagePath
    ]);
    if ($checkDup->fetch()) {
        sendSuccess('Duplicate pageview debounced.');
    }

    $stmt = $pdo->prepare('
        INSERT INTO visitor_logs (
            session_id, page_path, page_title, referrer,
            device_type, browser, operating_system, ip_hash, user_agent_hash,
            visit_date, created_at
        ) VALUES (
            :session_id, :page_path, :page_title, :referrer,
            :device_type, :browser, :os, :ip_hash, :ua_hash,
            CURDATE(), NOW()
        )
    ');

    $stmt->execute([
        ':session_id'  => $sessionId,
        ':page_path'   => $pagePath,
        ':page_title'  => $pageTitle,
        ':referrer'    => substr($referrer, 0, 255),
        ':device_type' => $deviceType,
        ':browser'     => $browser,
        ':os'          => $os,
        ':ip_hash'     => $ipHash,
        ':ua_hash'     => $uaHash
    ]);

    sendSuccess('Pageview logged.');

} catch (Exception $e) {
    error_log('Analytics track error: ' . $e->getMessage());
    sendSuccess('Track skipped on error.');
}
