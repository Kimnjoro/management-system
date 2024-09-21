<?php
// Include database connection parameters
include 'config.php';

// Check if request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve data from POST request
    $action = $_POST['action'];
    $id = $_POST['id'];
    $table = $_POST['table'];

    // Prepare and bind the SQL statement to delete the task from the specified table
    if ($table == 'todays_table_tasks' || $table == 'tomorrows_table_tasks') {
        $stmt = $conn->prepare("DELETE FROM $table WHERE id = ?");
        $stmt->bind_param("i", $id);

        // Execute the statement
        if ($stmt->execute() === TRUE) {
            // If deletion is successful, send JSON response indicating success
            echo json_encode(array("success" => true));
        } else {
            // If deletion fails, send JSON response indicating failure
            echo json_encode(array("success" => false));
        }

        // Close statement
        $stmt->close();
    } else {
        // Invalid table name
        echo json_encode(array("error" => "Invalid table name"));
    }
} else {
    // If request method is not POST, send error response
    echo json_encode(array("error" => "Invalid request method"));
}

// Close connection
$conn->close();
?>
