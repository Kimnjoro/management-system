<?php
// Include database connection parameters
include 'config.php';

// Function to update task in tomorrow's table
function updateTomorrowsTable($conn, $id, $updatedTask, $updatedDueDate, $updatedDueTime, $updatedPriority) {
    // Prepare and bind the SQL statement to update the task in tomorrow's table
    $stmt = $conn->prepare("UPDATE tomorrows_table_tasks SET task = ?, due_date = ?, due_time = ?, priority = ? WHERE id = ?");
    $stmt->bind_param("ssssi", $updatedTask, $updatedDueDate, $updatedDueTime, $updatedPriority, $id);

    // Execute the statement
    if ($stmt->execute() === TRUE) {
        return true; // Return true if update is successful
    } else {
        return false; // Return false if update fails
    }

    // Close statement
    $stmt->close();
}

// Function to update task in today's table
function updateTodaysTable($conn, $id, $updatedTask, $updatedDueDate, $updatedDueTime, $updatedPriority) {
    // Prepare and bind the SQL statement to update the task in today's table
    $stmt = $conn->prepare("UPDATE todays_table_tasks SET task = ?, due_date = ?, due_time = ?, priority = ? WHERE id = ?");
    $stmt->bind_param("ssssi", $updatedTask, $updatedDueDate, $updatedDueTime, $updatedPriority, $id);

    // Execute the statement
    if ($stmt->execute() === TRUE) {
        return true; // Return true if update is successful
    } else {
        return false; // Return false if update fails
    }

    // Close statement
    $stmt->close();
}

// Check if request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve data from POST request
    $action = $_POST['action'];
    $id = $_POST['id'];
    $updatedTask = $_POST['updatedTask'];
    $updatedDueDate = $_POST['updatedDueDate'];
    $updatedDueTime = $_POST['updatedDueTime'];
    $updatedPriority = $_POST['updatedPriority'];
    $table = $_POST['table'];

    // Execute the appropriate update function based on the specified table
    if ($table === 'tomorrows_table_tasks') {
        $success = updateTomorrowsTable($conn, $id, $updatedTask, $updatedDueDate, $updatedDueTime, $updatedPriority);
    } elseif ($table === 'todays_table_tasks') {
        $success = updateTodaysTable($conn, $id, $updatedTask, $updatedDueDate, $updatedDueTime, $updatedPriority);
    } else {
        // If specified table is invalid, send error response
        echo json_encode(array("error" => "Invalid table specified"));
        exit;
    }

    // Send JSON response based on update success or failure
    if ($success) {
        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("success" => false));
    }
} else {
    // If request method is not POST, send error response
    echo json_encode(array("error" => "Invalid request method"));
}

// Close connection
$conn->close();
?>
