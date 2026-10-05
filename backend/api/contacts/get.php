<?php
/**
 * Vana Resort Araku - Contact API: Get Message by ID
 * Protected endpoint.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth();

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
    sendError('Valid contact ID is required.', 400);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('SELECT * FROM contacts WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $row = $stmt->fetch();

    if (!$row) {
        sendError('Contact inquiry not found.', 404);
    }

    // Automatically mark unread message as read on viewing
    if ($row['status'] === 'unread') {
        $up = $pdo->prepare('UPDATE contacts SET status = "read", updated_at = NOW() WHERE id = :id');
        $up->execute([':id' => $id]);
        $row['status'] = 'read';
    }

    $message = [
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

    sendSuccess('Contact inquiry retrieved.', $message);

} catch (Exception $e) {
    error_log('Get contact error: ' . $e->getMessage());
    sendError('Failed to fetch contact message.', 500);
}
