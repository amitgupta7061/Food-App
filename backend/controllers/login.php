<?php
require 'vendor/autoload.php'; // Load Composer's MongoDB lib

use MongoDB\Client;

// Connect to the SAME MongoDB as your Node.js app
try {
    // If using local MongoDB (no auth):
    $mongo = new Client("mongodb://localhost:27017");
    
    // If using MongoDB Atlas or auth:
    // $mongo = new Client("mongodb+srv://USER:PASSWORD@cluster0.xxx.mongodb.net/DB_NAME");
    
    $db = $mongo->selectDatabase('your_db_name'); // Same DB as Node.js
    $users = $db->selectCollection('users'); // Same collection as Mongoose

} catch (Exception $e) {
    die("MongoDB Connection Error: " . $e->getMessage());
}

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    try {
        // Find user (same query as Node.js)
        $user = $users->findOne(['username' => $username]);
        
        if (!$user) {
            throw new Exception("User not found");
        }

        // Verify password (assuming bcrypt hashing like Node.js)
        if (password_verify($password, $user['password'])) {
            // Login success! Start session
            session_start();
            $_SESSION['user_id'] = (string)$user['_id']; // Cast ObjectID to string
            $_SESSION['username'] = $user['username'];
            
            // Redirect to Node.js dashboard
            header('Location: http://your-node-app.com/dashboard');
            exit();
        } else {
            throw new Exception("Invalid password");
        }

    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}
?>

<!-- Simple HTML Form -->
<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
</head>
<body>
    <?php if (!empty($error)) echo "<p style='color:red'>$error</p>"; ?>
    <form method="POST">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Login</button>
    </form>
</body>
</html>