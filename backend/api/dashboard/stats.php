<?php
/**
 * Vana Resort Araku - Dashboard API: Aggregated Statistics
 * Protected endpoint. Returns bookings, contacts, rooms, and visitors overview.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth(); // Verify admin session

try {
    $pdo = Database::getConnection();

    // 1. Booking Statistics
    $bkTotalStmt = $pdo->query('SELECT COUNT(*) AS total, COALESCE(SUM(CASE WHEN status = "confirmed" THEN final_price ELSE 0 END), 0) AS revenue FROM bookings');
    $bkTotal = $bkTotalStmt->fetch();

    $bkStatusStmt = $pdo->query('
        SELECT 
            SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) AS pending,
            SUM(CASE WHEN status = "confirmed" THEN 1 ELSE 0 END) AS confirmed,
            SUM(CASE WHEN status = "cancelled" THEN 1 ELSE 0 END) AS cancelled,
            SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) AS completed
        FROM bookings
    ');
    $bkStatus = $bkStatusStmt->fetch();

    $bookingsData = [
        'total'     => (int)$bkTotal['total'],
        'pending'   => (int)($bkStatus['pending'] ?? 0),
        'confirmed' => (int)($bkStatus['confirmed'] ?? 0),
        'cancelled' => (int)($bkStatus['cancelled'] ?? 0),
        'completed' => (int)($bkStatus['completed'] ?? 0),
        'revenue'   => (float)$bkTotal['revenue']
    ];

    // 2. Contact Inquiries Statistics
    $ctStmt = $pdo->query('
        SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN status = "unread" THEN 1 ELSE 0 END) AS unread,
            SUM(CASE WHEN status = "read" THEN 1 ELSE 0 END) AS `read`,
            SUM(CASE WHEN status = "responded" THEN 1 ELSE 0 END) AS responded
        FROM contacts
    ');
    $ctData = $ctStmt->fetch();

    $contactsData = [
        'total'     => (int)$ctData['total'],
        'unread'    => (int)($ctData['unread'] ?? 0),
        'read'      => (int)($ctData['read'] ?? 0),
        'responded' => (int)($ctData['responded'] ?? 0)
    ];

    // 3. Visitor Overview
    $visToday = $pdo->query('SELECT COUNT(DISTINCT session_id) AS val FROM visitor_logs WHERE visit_date = CURDATE()')->fetch();
    $visYesterday = $pdo->query('SELECT COUNT(DISTINCT session_id) AS val FROM visitor_logs WHERE visit_date = (CURDATE() - INTERVAL 1 DAY)')->fetch();
    $visTotal = $pdo->query('SELECT COUNT(DISTINCT session_id) AS val FROM visitor_logs')->fetch();
    $pageviewsTotal = $pdo->query('SELECT COUNT(*) AS val FROM visitor_logs')->fetch();

    $visitorsData = [
        'today'          => (int)$visToday['val'],
        'yesterday'      => (int)$visYesterday['val'],
        'total'          => (int)$visTotal['val'],
        'totalPageViews' => (int)$pageviewsTotal['val']
    ];

    // 4. Room Statistics
    $rmStmt = $pdo->query('
        SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) AS active,
            SUM(CASE WHEN status = "maintenance" THEN 1 ELSE 0 END) AS maintenance,
            SUM(CASE WHEN status = "inactive" THEN 1 ELSE 0 END) AS inactive,
            COALESCE(SUM(available_rooms), 0) AS total_inventory
        FROM rooms
    ');
    $rmData = $rmStmt->fetch();

    $roomsData = [
        'total'          => (int)$rmData['total'],
        'active'         => (int)($rmData['active'] ?? 0),
        'maintenance'    => (int)($rmData['maintenance'] ?? 0),
        'inactive'       => (int)($rmData['inactive'] ?? 0),
        'availableRooms' => (int)($rmData['total_inventory'] ?? 0)
    ];

    // 5. Recent Bookings (Last 5)
    $recentBkStmt = $pdo->query('
        SELECT 
            booking_reference AS id,
            booking_reference,
            full_name AS guestName,
            full_name,
            room_name_snapshot AS roomType,
            check_in AS checkIn,
            check_out AS checkOut,
            final_price AS totalPrice,
            status,
            created_at AS createdAt
        FROM bookings 
        ORDER BY created_at DESC 
        LIMIT 5
    ');
    $recentBookings = $recentBkStmt->fetchAll();

    // 6. Recent Messages (Last 5)
    $recentMsgStmt = $pdo->query('
        SELECT 
            id,
            full_name AS name,
            full_name,
            email,
            subject,
            status,
            created_at AS createdAt
        FROM contacts 
        ORDER BY created_at DESC 
        LIMIT 5
    ');
    $recentMessages = $recentMsgStmt->fetchAll();

    sendSuccess('Dashboard statistics loaded.', [
        'bookings'       => $bookingsData,
        'contacts'       => $contactsData,
        'visitors'       => $visitorsData,
        'rooms'          => $roomsData,
        'recentBookings' => $recentBookings,
        'recentMessages' => $recentMessages
    ]);

} catch (Exception $e) {
    error_log('Dashboard stats error: ' . $e->getMessage());
    sendError('Failed to fetch dashboard statistics.', 500);
}
