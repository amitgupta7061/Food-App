<?php
require 'vendor/autoload.php';

use MongoDB\Client;
use MongoDB\Driver\Exception\Exception as MongoException;

// Connect to MongoDB (same connection as your login page)
try {
    $mongo = new Client("mongodb://localhost:27017");
    $db = $mongo->selectDatabase('your_database_name');
    $feedbackCollection = $db->selectCollection('feedback'); // New collection for feedback
    
} catch (MongoException $e) {
    die("MongoDB Connection Error: " . $e->getMessage());
}

// Process form submission
$success = false;
$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    // Basic validation
    if (empty($name) || empty($email) || empty($message)) {
        $error = "All fields are required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Invalid email format";
    } else {
        try {
            // Insert into MongoDB
            $result = $feedbackCollection->insertOne([
                'name' => $name,
                'email' => $email,
                'message' => $message,
                'ip_address' => $_SERVER['REMOTE_ADDR'],
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'status' => 'new'
            ]);
            
            if ($result->getInsertedCount() === 1) {
                $success = true;
                
                // Optional: Send email notification
                // mail($admin_email, "New Feedback", $message);
                
                // Optional: Call Node.js webhook if needed
                // file_get_contents('http://your-node-app.com/api/feedback-webhook');
            }
            
        } catch (MongoException $e) {
            $error = "Failed to save feedback: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feedback Form</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        .feedback-form {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"],
        input[type="email"],
        textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        textarea {
            height: 120px;
            resize: vertical;
        }
        button {
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #45a049;
        }
        .alert {
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        .alert-success {
            background: #dff0d8;
            color: #3c763d;
        }
        .alert-error {
            background: #f2dede;
            color: #a94442;
        }
    </style>
</head>
<body>
    <div class="feedback-form">
        <h2>Send Us Your Feedback</h2>
        
        <?php if ($success): ?>
            <div class="alert alert-success">
                Thank you for your feedback! We'll get back to you soon.
            </div>
        <?php elseif ($error): ?>
            <div class="alert alert-error">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="name">Your Name</label>
                <input type="text" id="name" name="name" required 
                       value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>">
            </div>
            
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required
                       value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
            </div>
            
            <div class="form-group">
                <label for="message">Your Message</label>
                <textarea id="message" name="message" required><?php 
                    echo htmlspecialchars($_POST['message'] ?? '');
                ?></textarea>
            </div>
            
            <button type="submit">Submit Feedback</button>
        </form>
    </div>
</body>
</html>