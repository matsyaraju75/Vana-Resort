<?php
/**
 * Vana Resort Araku - Contact API: Submit Message
 * Public endpoint with rate-limiting and validation.
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method Not Allowed. Use POST.', 405);
}

// Rate limiting: max 10 messages per 10 minutes per IP
if (!checkRateLimit('contact_submit', 10, 600)) {
    sendError('Too many messages submitted. Please wait a few minutes before trying again.', 429);
}

$input = getJsonInput();

$name = sanitizeString($input['name'] ?? ($input['fullName'] ?? ($input['full_name'] ?? '')));
$email = sanitizeString($input['email'] ?? '');
$phone = sanitizeString($input['phone'] ?? '');
$subject = sanitizeString($input['subject'] ?? 'Website Inquiry');
$message = sanitizeString($input['message'] ?? '');

$errors = [];
if (empty($name) || mb_strlen($name) < 2) {
    $errors['name'] = 'Name is required and must be at least 2 characters.';
}
if (!validateEmail($email)) {
    $errors['email'] = 'A valid email address is required.';
}
if (!empty($phone) && !validatePhone($phone)) {
    $errors['phone'] = 'Please enter a valid phone number.';
}
if (empty($message) || mb_strlen($message) < 5) {
    $errors['message'] = 'Message is required and must be at least 5 characters.';
}

if (!empty($errors)) {
    sendError('Validation failed.', 422, $errors);
}

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->prepare('
        INSERT INTO contacts (
            full_name, email, phone, subject, message, status, created_at, updated_at
        ) VALUES (
            :name, :email, :phone, :subject, :message, "unread", NOW(), NOW()
        )
    ');

    $stmt->execute([
        ':name'    => $name,
        ':email'   => $email,
        ':phone'   => $phone,
        ':subject' => $subject,
        ':message' => $message
    ]);

    $contactId = (int)$pdo->lastInsertId();

    $data = [
        'id'         => (string)$contactId,
        'name'       => $name,
        'full_name'  => $name,
        'email'      => $email,
        'phone'      => $phone,
        'subject'    => $subject,
        'message'    => $message,
        'status'     => 'unread',
        'createdAt'  => date('Y-m-d H:i:s'),
        'created_at' => date('Y-m-d H:i:s')
    ];

    sendSuccess('Thank you for contacting Vana Resort Araku. Our team will get back to you shortly.', $data, 201);

} catch (Exception $e) {
    error_log('Contact form error: ' . $e->getMessage());
    sendError('Failed to send your message. Please try again later or contact us directly via WhatsApp.', 500);
}
