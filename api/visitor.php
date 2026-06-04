<?php
/**
 * Visitor Counter API — Homestay Salsabila Syariah
 *
 * GET  /api/visitor.php  → returns { today, total }
 * POST /api/visitor.php  → increments counter, returns { today, total }
 *
 * Data stored in visitor-data.json (auto-created if missing).
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataFile = __DIR__ . '/visitor-data.json';
$today    = date('Y-m-d');

// --- Helper: load data ---
function loadData(string $file): array {
    if (!file_exists($file)) {
        return ['date' => '', 'today' => 0, 'total' => 0];
    }
    $raw = file_get_contents($file);
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return ['date' => '', 'today' => 0, 'total' => 0];
    }
    return $data;
}

// --- Helper: save data ---
function saveData(string $file, array $data): void {
    $dir = dirname($file);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
}

$data = loadData($dataFile);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Increment visitor count
    $data['total'] = ($data['total'] ?? 0) + 1;

    if (($data['date'] ?? '') !== $today) {
        $data['date']  = $today;
        $data['today'] = 1;
    } else {
        $data['today'] = ($data['today'] ?? 0) + 1;
    }

    saveData($dataFile, $data);
}

// Return current counts
echo json_encode([
    'today' => (int) ($data['today'] ?? 0),
    'total' => (int) ($data['total'] ?? 0),
]);
