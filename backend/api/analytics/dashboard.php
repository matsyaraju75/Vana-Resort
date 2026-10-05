<?php
/**
 * Vana Resort Araku - Analytics API: Dashboard Analytics
 * Protected endpoint. Comprehensive website traffic statistics.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth(); // Verify admin session

try {
    $pdo = Database::getConnection();

    // 1. Visitor Counts (Unique Sessions)
    $todayStmt = $pdo->query('SELECT COUNT(DISTINCT session_id) AS val FROM visitor_logs WHERE visit_date = CURDATE()');
    $todayVisitors = (int)$todayStmt->fetch()['val'];

    $yesterdayStmt = $pdo->query('SELECT COUNT(DISTINCT session_id) AS val FROM visitor_logs WHERE visit_date = (CURDATE() - INTERVAL 1 DAY)');
    $yesterdayVisitors = (int)$yesterdayStmt->fetch()['val'];

    $sevenDaysStmt = $pdo->query('SELECT COUNT(DISTINCT session_id) AS val FROM visitor_logs WHERE visit_date >= (CURDATE() - INTERVAL 7 DAY)');
    $last7DaysVisitors = (int)$sevenDaysStmt->fetch()['val'];

    $thirtyDaysStmt = $pdo->query('SELECT COUNT(DISTINCT session_id) AS val FROM visitor_logs WHERE visit_date >= (CURDATE() - INTERVAL 30 DAY)');
    $last30DaysVisitors = (int)$thirtyDaysStmt->fetch()['val'];

    $totalVisitorsStmt = $pdo->query('SELECT COUNT(DISTINCT session_id) AS val FROM visitor_logs');
    $totalVisitors = (int)$totalVisitorsStmt->fetch()['val'];

    // 2. Page View Counts
    $totalPageviewsStmt = $pdo->query('SELECT COUNT(*) AS val FROM visitor_logs');
    $totalPageviews = (int)$totalPageviewsStmt->fetch()['val'];

    $bookingViewsStmt = $pdo->query("SELECT COUNT(*) AS val FROM visitor_logs WHERE page_path LIKE '%booking%'");
    $bookingPageviews = (int)$bookingViewsStmt->fetch()['val'];

    $contactViewsStmt = $pdo->query("SELECT COUNT(*) AS val FROM visitor_logs WHERE page_path LIKE '%contact%'");
    $contactPageviews = (int)$contactViewsStmt->fetch()['val'];

    $roomViewsStmt = $pdo->query("SELECT COUNT(*) AS val FROM visitor_logs WHERE page_path LIKE '%room%'");
    $roomPageviews = (int)$roomViewsStmt->fetch()['val'];

    // 3. Popular Pages
    $popStmt = $pdo->query('
        SELECT page_path, page_title, COUNT(*) AS view_count, COUNT(DISTINCT session_id) AS unique_visitors
        FROM visitor_logs
        GROUP BY page_path, page_title
        ORDER BY view_count DESC
        LIMIT 10
    ');
    $popularPages = $popStmt->fetchAll();

    // 4. Device Breakdown
    $deviceStmt = $pdo->query('
        SELECT device_type, COUNT(*) AS count
        FROM visitor_logs
        GROUP BY device_type
        ORDER BY count DESC
    ');
    $deviceBreakdown = $deviceStmt->fetchAll();

    // 5. Daily trend (last 7 days)
    $dailyStmt = $pdo->query('
        SELECT visit_date, COUNT(*) AS pageviews, COUNT(DISTINCT session_id) AS visitors
        FROM visitor_logs
        WHERE visit_date >= (CURDATE() - INTERVAL 7 DAY)
        GROUP BY visit_date
        ORDER BY visit_date ASC
    ');
    $dailyTrend = $dailyStmt->fetchAll();

    // 6. Recent Visitor Activity
    $recentStmt = $pdo->query('
        SELECT id, page_path, page_title, device_type, browser, operating_system, created_at
        FROM visitor_logs
        ORDER BY id DESC
        LIMIT 20
    ');
    $recentActivity = $recentStmt->fetchAll();

    sendSuccess('Analytics data retrieved successfully.', [
        'summary' => [
            'totalVisitors'     => $totalVisitors,
            'todayVisitors'     => $todayVisitors,
            'yesterdayVisitors' => $yesterdayVisitors,
            'last7DaysVisitors' => $last7DaysVisitors,
            'last30DaysVisitors'=> $last30DaysVisitors,
            'totalPageViews'    => $totalPageviews,
            'bookingPageViews'  => $bookingPageviews,
            'contactPageViews'  => $contactPageviews,
            'roomPageViews'     => $roomPageviews
        ],
        'popularPages'     => $popularPages,
        'deviceBreakdown'  => $deviceBreakdown,
        'dailyTrend'       => $dailyTrend,
        'recentActivity'   => $recentActivity
    ]);

} catch (Exception $e) {
    error_log('Analytics dashboard error: ' . $e->getMessage());
    sendError('Failed to fetch analytics dashboard data.', 500);
}
