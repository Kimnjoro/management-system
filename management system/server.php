<?php
$servername = "localhost";
$username = "KIM";
$password = "kim@berd";
$dbname = "todo_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if(isset($_POST['today_task'], $_POST['today_due_date'], $_POST['today_due_time'], $_POST['today_priority'])) {
        $table = "todays_table_tasks";
        $task = mysqli_real_escape_string($conn, $_POST['today_task']);
        $due_date = mysqli_real_escape_string($conn, $_POST['today_due_date']);
        $due_time = mysqli_real_escape_string($conn, $_POST['today_due_time']);
        $priority = mysqli_real_escape_string($conn, $_POST['today_priority']);

        $sql = "INSERT INTO $table (task, due_date, due_time, priority) VALUES ('$task', '$due_date', '$due_time', '$priority')";

        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif(isset($_POST['tomorrow_task'], $_POST['tomorrow_due_date'], $_POST['tomorrow_due_time'], $_POST['tomorrow_priority'])) {
        $table = "tomorrows_table_tasks";
        $task = mysqli_real_escape_string($conn, $_POST['tomorrow_task']);
        $due_date = mysqli_real_escape_string($conn, $_POST['tomorrow_due_date']);
        $due_time = mysqli_real_escape_string($conn, $_POST['tomorrow_due_time']);
        $priority = mysqli_real_escape_string($conn, $_POST['tomorrow_priority']);

        $sql = "INSERT INTO $table (task, due_date, due_time, priority) VALUES ('$task', '$due_date', '$due_time', '$priority')";

        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}

$conn->close();
?>
