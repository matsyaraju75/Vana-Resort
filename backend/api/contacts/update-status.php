<?php
/**
 * Vana Resort Araku - Contact API: Update Status
 * Protected endpoint. Statuses: unread, read, responded
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth();

if (!in_array($_SERVER['REQUEST_METHOD'], ['PATCH', 'POST', 'PUT'], true)) {
    sendError('Method Not Allowed. Use PATCH or POST.', 405);
}

$input = getJsonInput();
$id = (int)($input['id'] ?? ($_GET['id'] ?? 0));
$status = sanitizeString($input['status'] ?? '');
$adminNotes = isset($input['adminNotes']) ? sanitizeString($input['adminNotes']) : (isset($input['admin_notes']) ? sanitizeString($input['admin_notes']) : null);

if ($id <= 0) {
    sendError('Valid contact ID is required.', 400);
}

// Map frontend 'replied' to 'responded' if sent
if ($status === 'replied') {
    $status = 'responded';
}

$allowedStatuses = ['unread', 'read', 'responded'];
if (!empty($status) && !in_array($status, $allowedStatuses, true)) {
    sendError('Invalid status. Allowed values: unread, read, responded.', 422);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('SELECT id, status, admin_notes FROM contacts WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $contact = $stmt->fetch();

    if (!$contact) {
        sendError('Contact inquiry not found.', 404);
    }

    $updates = [];
    $params = [':id' => $id];

    if (!empty($status)) {
        $updates[] = 'status = :status';
        $params[':status'] = $status;
    }

    if ($adminNotes !== null) {
        $updates[] = 'admin_notes = :admin_notes';
        $params[':admin_notes'] = $adminNotes;
    }

    if (empty($updates)) {
        sendError('No updates specified.', 400);
    }

    $updates[] = 'updated_at = NOW()';
    $sql = 'UPDATE contacts SET ' . implode(', ', $updates) . ' WHERE id = :id';
    $updateStmt = $pdo->prepare($sql);
    $updateStmt->execute($params);

    sendSuccess('Contact status updated successfully.', [
        'id'         => (string)$id,
        'status'     => $status ?: $contact['status'],
        'adminNotes' => $adminNotes !== null ? $adminNotes : $contact['admin_notes']
    ]);

} catch (Exception $e) {
    error_log('Update contact error: ' . $e->getMessage());
    sendError('Failed to update contact inquiry.', 500);
}
