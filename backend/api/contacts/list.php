<?php
/**
 * Vana Resort Araku - Contact API: List Messages
 * Protected endpoint for admins.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth();

try {
    $pdo = Database::getConnection();

    $status = sanitizeString($_GET['status'] ?? '');
    $search = sanitizeString($_GET['search'] ?? '');
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(100, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    $where = [];
    $params = [];

    if (!empty($status) && in_array($status, ['unread', 'read', 'responded'], true)) {
        $where[] = 'status = :status';
        $params[':status'] = $status;
    }

    if (!empty($search)) {
        $where[] = '(full_name LIKE :search OR email LIKE :search OR phone LIKE :search OR subject LIKE :search OR message LIKE :search)';
        $params[':search'] = "%{$search}%";
    }

    $whereSql = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM contacts {$whereSql}");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetch()['total'];

    $sql = "
        SELECT * FROM contacts 
        {$whereSql} 
        ORDER BY created_at DESC 
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

    $messages = array_map(function ($row) {
        return [
            'id'          => (string)$row['id'],
            'databaseId'  => (int)$row['id'],
            'name'        => $row['full_name'],
            'full_name'   => $row['full_name'],
            'email'       => $row['email'],
            'phone'       => $row['phone'],
            'subject'     => $row['subject'],
            'message'     => $row['message'],
            'status'      => $row['status'],
            'adminNotes'  => $row['admin_notes'],
            'admin_notes' => $row['admin_notes'],
            'createdAt'   => $row['created_at'],
            'created_at'  => $row['created_at'],
            'updated_at'  => $row['updated_at']
        ];
    }, $rows);

    sendSuccess('Contact inquiries retrieved successfully.', [
        'messages'   => $messages,
        'contacts'   => $messages, // Alias for compatibility
        'pagination' => [
            'total' => $total,
            'page'  => $page,
            'limit' => $limit,
            'pages' => ceil($total / $limit)
        ]
    ]);

} catch (Exception $e) {
    error_log('List contacts error: ' . $e->getMessage());
    sendError('Failed to fetch contact inquiries.', 500);
}
