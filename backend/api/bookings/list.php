<?php
/**
 * Vana Resort Araku - Booking API: List Bookings
 * Protected endpoint. Filter by status, search by guest name/email/phone/reference.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth(); // Verify admin session

try {
    $pdo = Database::getConnection();

    $status = sanitizeString($_GET['status'] ?? '');
    $search = sanitizeString($_GET['search'] ?? '');
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(100, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    $where = [];
    $params = [];

    if (!empty($status) && in_array($status, ['pending', 'confirmed', 'cancelled', 'completed'], true)) {
        $where[] = 'b.status = :status';
        $params[':status'] = $status;
    }

    if (!empty($search)) {
        $where[] = '(b.booking_reference LIKE :search OR b.full_name LIKE :search OR b.email LIKE :search OR b.phone LIKE :search OR b.room_name_snapshot LIKE :search)';
        $params[':search'] = "%{$search}%";
    }

    $whereSql = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    // Total count for pagination
    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM bookings b {$whereSql}");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetch()['total'];

    // Fetch records
    $sql = "
        SELECT 
            b.*,
            r.slug AS room_slug
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.id
        {$whereSql}
        ORDER BY b.created_at DESC
        LIMIT :limit OFFSET :offset
    ";

    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll();

    // Map rows to both frontend-compatible camelCase and backend snake_case
    $items = array_map(function ($row) {
        return [
            'id'                 => $row['booking_reference'],
            'databaseId'         => (int)$row['id'],
            'bookingReference'   => $row['booking_reference'],
            'booking_reference'  => $row['booking_reference'],
            'guestName'          => $row['full_name'],
            'full_name'          => $row['full_name'],
            'email'              => $row['email'],
            'phone'              => $row['phone'],
            'roomType'           => $row['room_name_snapshot'],
            'room_id'            => (int)$row['room_id'],
            'room_name_snapshot' => $row['room_name_snapshot'],
            'room_slug'          => $row['room_slug'] ?? '',
            'checkIn'            => $row['check_in'],
            'check_in'           => $row['check_in'],
            'checkOut'           => $row['check_out'],
            'check_out'          => $row['check_out'],
            'adults'             => (int)$row['adults'],
            'children'           => (int)$row['children'],
            'roomsCount'         => (int)$row['rooms_count'],
            'rooms_count'        => (int)$row['rooms_count'],
            'nights'             => (int)$row['nights'],
            'totalPrice'         => (float)$row['final_price'],
            'estimated_price'    => (float)$row['estimated_price'],
            'final_price'        => (float)$row['final_price'],
            'specialRequests'    => $row['additional_requests'],
            'additional_requests'=> $row['additional_requests'],
            'adminNotes'         => $row['admin_notes'],
            'admin_notes'        => $row['admin_notes'],
            'status'             => $row['status'],
            'createdAt'          => $row['created_at'],
            'created_at'         => $row['created_at'],
            'updated_at'         => $row['updated_at']
        ];
    }, $rows);

    sendSuccess('Bookings retrieved successfully.', [
        'bookings'    => $items,
        'pagination'  => [
            'total'   => $total,
            'page'    => $page,
            'limit'   => $limit,
            'pages'   => ceil($total / $limit)
        ]
    ]);

} catch (Exception $e) {
    error_log('List bookings error: ' . $e->getMessage());
    sendError('Failed to fetch bookings.', 500);
}
