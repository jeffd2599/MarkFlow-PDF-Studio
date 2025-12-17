<?php
header('Content-Type: application/json');

// Allow from any origin for development purposes. In production, restrict this. 
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['content']) || !isset($input['instruction'])) {
    echo json_encode(['error' => 'Missing content or instruction.']);
    http_response_code(400);
    exit();
}

// Default to 'gemini' if no provider is specified
$provider = $input['provider'] ?? 'gemini';
$content = $input['content'];
$instruction = $input['instruction'];

// --- Function to call Gemini API ---
function callGemini($apiKey, $content, $instruction) {
    $prompt = "Context: You are a professional editor. You will be provided with Markdown text and a specific instruction. 
Respond ONLY with the modified Markdown text. Do not include explanations, preambles, or formatting backticks unless they are part of the markdown itself.

Instruction: " . $instruction . "

Content:
" . $content;

    $data = [
        'contents' => [['parts' => [['text' => $prompt]]]],
        'model' => 'gemini-3-flash-preview'
    ];

    $ch = curl_init('https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=' . $apiKey);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        return ['error' => 'cURL error: ' . $error, 'http_code' => 500];
    }

    $responseData = json_decode($response, true);

    if ($httpCode !== 200 || isset($responseData['error'])) {
        return ['error' => 'Gemini API error', 'details' => $responseData['error'] ?? $response, 'http_code' => $httpCode];
    }

    return ['markdown' => $responseData['candidates'][0]['content']['parts'][0]['text'] ?? null];
}

// --- Function to call OpenRouter API ---
function callOpenRouter($apiKey, $content, $instruction, $model) {
    $system_prompt = "You are a professional editor. You will be provided with Markdown text and a specific instruction. Respond ONLY with the modified Markdown text. Do not include explanations, preambles, or formatting backticks unless they are part of the markdown itself.";
    $user_prompt = "Instruction: " . $instruction . "\n\nContent:\n" . $content;

    $data = [
        'model' => $model,
        'messages' => [
            ['role' => 'system', 'content' => $system_prompt],
            ['role' => 'user', 'content' => $user_prompt]
        ]
    ];

    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
        'HTTP-Referer: ' . ($_SERVER['HTTP_HOST'] ?? 'localhost'), // Recommended by OpenRouter
        'X-Title: MarkFlow PDF Studio' // Recommended by OpenRouter
    ];
    
    $ch = curl_init('https://openrouter.ai/api/v1/chat/completions');
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        return ['error' => 'cURL error: ' . $error, 'http_code' => 500];
    }

    $responseData = json_decode($response, true);
    
    if ($httpCode !== 200 || isset($responseData['error'])) {
        return ['error' => 'OpenRouter API error', 'details' => $responseData['error'] ?? $response, 'http_code' => $httpCode];
    }

    return ['markdown' => $responseData['choices'][0]['message']['content'] ?? null];
}


// --- Main Logic ---
$result = null;

if ($provider === 'openrouter') {
    $apiKey = getenv('OPENROUTER_API_KEY');
    if (!$apiKey) {
        http_response_code(500);
        echo json_encode(['error' => 'OpenRouter API Key not configured.']);
        exit();
    }
    // For now, hardcode a default free model. Later, this could come from the frontend.
    $model = $input['model'] ?? 'mistralai/mistral-7b-instruct:free';
    $result = callOpenRouter($apiKey, $content, $instruction, $model);
} else { // Default to Gemini
    $apiKey = getenv('GEMINI_API_KEY');
    if (!$apiKey) {
        http_response_code(500);
        echo json_encode(['error' => 'Gemini API Key not configured.']);
        exit();
    }
    $result = callGemini($apiKey, $content, $instruction);
}

if (isset($result['error'])) {
    http_response_code($result['http_code']);
    echo json_encode(['error' => $result['error'], 'details' => $result['details'] ?? '']);
} elseif (isset($result['markdown'])) {
    echo json_encode(['markdown' => $result['markdown']]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'An unknown error occurred in the AI handler.']);
}
?>
