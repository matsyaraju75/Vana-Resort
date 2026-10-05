<?php
/**
 * Vana Resort Araku - Response Helper
 * Standardized JSON response formatting with appropriate HTTP status codes
 */

function jsonResponse(bool $success, string $message, $data = null, int $statusCode = 200, array $errors = []): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');

    $response = [
        'success' => $success,
        'message' => $message
    ];

    if ($data !== null) {
        $response['data'] = $data;
    }

    if (!empty($errors)) {
        $response['errors'] = $errors;
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function sendSuccess(string $message, $data = null, int $statusCode = 200): void {
    jsonResponse(true, $message, $data, $statusCode);
}

function sendError(string $message, int $statusCode = 400, array $errors = []): void {
    jsonResponse(false, $message, null, $statusCode, $errors);
}
