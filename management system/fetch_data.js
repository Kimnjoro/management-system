function deleteTodo(todoId) {
    const formDataTasks = new FormData();
    formDataTasks.append('action', 'delete');
    formDataTasks.append('id', todoId);
    formDataTasks.append('table', 'todays_table_tasks');

    const formDataTasks2 = new FormData();
    formDataTasks2.append('action', 'delete');
    formDataTasks2.append('id', todoId);
    formDataTasks2.append('table', 'tomorrows_table_tasks'); // Changed table name

    Promise.all([
        fetch('delete.php', {
            method: 'POST',
            body: formDataTasks
        }),
        fetch('delete.php', {
            method: 'POST',
            body: formDataTasks2
        })
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
        const success = data.every(item => item.success);
        if (success) {
            console.log('Todo deleted successfully');
            // Refresh the tasks list after deletion
            fetchTodayTasks();
            fetchTomorrowTasks();
        } else {
            console.error('Failed to delete todo');
        }
    })
    .catch(error => {
        console.error('Error deleting todo:', error);
    });
}

function updateTodo(todoId, updatedTask, updatedDueDate, updatedDueTime, updatedPriority) {
    const formDataTasks1 = new FormData();
    formDataTasks1.append('action', 'update');
    formDataTasks1.append('id', todoId);
    formDataTasks1.append('updatedTask', updatedTask);
    formDataTasks1.append('updatedDueDate', updatedDueDate);
    formDataTasks1.append('updatedDueTime', updatedDueTime);
    formDataTasks1.append('updatedPriority', updatedPriority);
    formDataTasks1.append('table', 'todays_table_tasks');

    const formDataTasks2 = new FormData();
    formDataTasks2.append('action', 'update');
    formDataTasks2.append('id', todoId);
    formDataTasks2.append('updatedTask', updatedTask);
    formDataTasks2.append('updatedDueDate', updatedDueDate);
    formDataTasks2.append('updatedDueTime', updatedDueTime);
    formDataTasks2.append('updatedPriority', updatedPriority);
    formDataTasks2.append('table', 'tomorrows_table_tasks'); // Changed table name

    Promise.all([
        fetch('update.php', {
            method: 'POST',
            body: formDataTasks1
        }),
        fetch('update.php', {
            method: 'POST',
            body: formDataTasks2
        })
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
        const success = data.every(item => item.success);
        if (success) {
            console.log('Todo updated successfully');
            // Refresh the tasks list after update
            fetchTodayTasks();
            fetchTomorrowTasks();
        } else {
            console.error('Failed to update todo');
        }
    })
    .catch(error => {
        console.error('Error updating todo:', error);
    });
}

// Function to fetch and display tasks for today
function fetchTodayTasks() {
    fetch('fetch_data.php?table=todays_table_tasks')
        .then(response => response.json())
        .then(data => {
            const todayTaskList = document.getElementById('taskList');
            todayTaskList.innerHTML = '';
            data.forEach(task => {
                // Create container div for the task
                const taskContainer = document.createElement('div');
                taskContainer.classList.add('task-container');

                // Create list item for the task content
                const li = document.createElement('li');
                li.textContent = task.task + ' - ' + task.due_date + ' ' + task.due_time;
                taskContainer.appendChild(li);

                // Create delete button with icon
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('todo-button');
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.onclick = function() {
                    deleteTodo(task.id);
                };
                taskContainer.appendChild(deleteButton);

                // Create update button with icon
                const updateButton = document.createElement('button');
                updateButton.classList.add('todo-button');
                updateButton.innerHTML = '<i class="fas fa-edit"></i>';
                updateButton.onclick = function() {
                    const updatedTask = prompt('Enter updated task:', task.task);
                    if (updatedTask) {
                        updateTodo(task.id, updatedTask, task.due_date, task.due_time, task.priority);
                    }
                };
                taskContainer.appendChild(updateButton);

                // Append the container div to the task list
                todayTaskList.appendChild(taskContainer);
            });
        });
}



// Function to fetch and display tasks for tomorrow
function fetchTomorrowTasks() {
    fetch('fetch_data.php?table=tomorrows_table_tasks')
        .then(response => response.json())
        .then(data => {
            const tomorrowTaskList = document.getElementById('tomorrowTaskList');
            tomorrowTaskList.innerHTML = '';
            data.forEach(task => {
                // Create container div for the task
                const taskContainer = document.createElement('div');
                taskContainer.classList.add('task-container');

                // Create list item for the task content
                const li = document.createElement('li');
                li.textContent = task.task + ' - ' + task.due_date + ' ' + task.due_time;
                li.classList.add('truncate'); // Add truncate class
                taskContainer.appendChild(li);

                // Create delete button with icon
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('todo-button');
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.onclick = function() {
                    deleteTodo(task.id);
                };
                taskContainer.appendChild(deleteButton);

                // Create update button with icon
                const updateButton = document.createElement('button');
                updateButton.classList.add('todo-button');
                updateButton.innerHTML = '<i class="fas fa-edit"></i>';
                updateButton.onclick = function() {
                    const updatedTask = prompt('Enter updated task:', task.task);
                    if (updatedTask) {
                        updateTodo(task.id, updatedTask, task.due_date, task.due_time, task.priority);
                    }
                };
                taskContainer.appendChild(updateButton);

                // Append the container div to the task list
                tomorrowTaskList.appendChild(taskContainer);
            });
        });
}



// Call the functions to fetch tasks
fetchTodayTasks();
fetchTomorrowTasks();

// Keep track of task IDs for which notifications have been shown
const notifiedTasks = new Set();

// Function to check for due tasks and show notification
function checkForDueTasks() {
    setInterval(() => {
        const now = new Date();

        // Fetch tasks from today's table and check if any are due
        fetch('fetch_data.php?table=todays_table_tasks')
            .then(response => response.json())
            .then(data => {
                data.forEach(task => {
                    const taskId = task.id;
                    const taskKey = 'notified_' + taskId;
                    if (!localStorage.getItem(taskKey)) { // Check if notification hasn't been shown for this task
                        const dueDateTime = new Date(task.due_date + 'T' + task.due_time);
                        if (now >= dueDateTime) {
                            // Show notification for due task and pass taskId
                            showNotification(task.task, taskId);
                            // Add task ID to localStorage
                            localStorage.setItem(taskKey, true);
                        } else {
                            // Update countdown timer for task
                            updateCountdownTimer(task.id, dueDateTime);
                        }
                    }
                });
            });

        // Fetch tasks from tomorrow's table and check if any are due
        fetch('fetch_data.php?table=tomorrows_table_tasks')
            .then(response => response.json())
            .then(data => {
                data.forEach(task => {
                    const taskId = task.id;
                    const taskKey = 'notified_' + taskId;
                    if (!localStorage.getItem(taskKey)) { // Check if notification hasn't been shown for this task
                        const dueDateTime = new Date(task.due_date + 'T' + task.due_time);
                        if (now >= dueDateTime) {
                            // Show notification for due task and pass taskId
                            showNotification(task.task, taskId);
                            // Add task ID to localStorage
                            localStorage.setItem(taskKey, true);
                        } else {
                            // Update countdown timer for task
                            updateCountdownTimer(task.id, dueDateTime);
                        }
                    }
                });
            });
    }, 1000); // Check every second

    // Request permission for notifications
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted');
            } else {
                console.log('Notification permission denied');
            }
        });
    }
}


// Call the function to check for due tasks
checkForDueTasks();

// Function to display notification
function showNotification(taskName, taskId) {
    if (notifiedTasks.has(taskId)) {
        return; // Notification already shown for this task
    }

    // Play the notification sound
    const notificationSound = document.getElementById('notificationSound');
    if (notificationSound) {
        notificationSound.play();
    }

    // Show the stop button
    const stopButton = document.getElementById('stopNotificationSound');
    if (stopButton) {
        stopButton.style.display = 'block';
    }

    // Stop the notification sound after 5 minutes
    setTimeout(() => {
        if (notificationSound) {
            notificationSound.pause();
            notificationSound.currentTime = 0;
        }

        // Hide the stop button
        if (stopButton) {
            stopButton.style.display = 'none';
        }
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    new Notification('Task Due', {
        body: taskName + ' is due now!'
    });
    markTaskAsNotified(taskId); // Call the function to update task appearance and refresh task list
}

// JavaScript code for stopping the notification sound
document.getElementById('stopNotificationSound').addEventListener('click', function() {
    const notificationSound = document.getElementById('notificationSound');
    if (notificationSound) {
        notificationSound.pause();
        notificationSound.currentTime = 0;
    }
    // Hide the stop button
    this.style.display = 'none';
});


// Function to update countdown timer for task
function updateCountdownTimer(taskId, dueDateTime) {
    const now = new Date();
    const timeDifference = dueDateTime - now;
    if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        // Update countdown timer display for task
        const countdownTimerElement = document.getElementById('countdownTimer_' + taskId);
        if (countdownTimerElement) {
            countdownTimerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    } else {
        // Task overdue
        const countdownTimerElement = document.getElementById('countdownTimer_' + taskId);
        if (countdownTimerElement) {
            countdownTimerElement.innerHTML = 'Task overdue';
        }
    }
}

// Call the functions to fetch tasks and check for due tasks
fetchTodayTasks();
fetchTomorrowTasks();
checkForDueTasks();

// Function to mark tasks based on their due dates and times
function markTasksBasedOnDateTime() {
    const now = new Date();

    // Fetch tasks from today's table and mark tasks based on due date and time
    fetch('fetch_data.php?table=todays_table_tasks')
        .then(response => response.json())
        .then(data => {
            data.forEach(task => {
                const dueDateTime = new Date(task.due_date + 'T' + task.due_time);
                if (now > dueDateTime) {
                    // Find the task element by its content and mark it as overdue
                    markTaskAsOverdue(task.task);
                }
            });
        });

    // Fetch tasks from tomorrow's table and mark tasks based on due date and time
    fetch('fetch_data.php?table=tomorrows_table_tasks')
        .then(response => response.json())
        .then(data => {
            data.forEach(task => {
                const dueDateTime = new Date(task.due_date + 'T' + task.due_time);
                if (now > dueDateTime) {
                    // Find the task element by its content and mark it as overdue
                    markTaskAsOverdue(task.task);
                }
            });
        });
}

// Call the function to mark tasks based on their due dates and times
markTasksBasedOnDateTime();

// Function to mark task as notified
function markTaskAsNotified(taskId) {
    notifiedTasks.add(taskId);

    fetchTodayTasks();
    fetchTomorrowTasks();

    // scheduleTaskDeletion(taskId);
}


function markTaskAsOverdue(taskContent) {
    // Find all <li> elements in the task lists for both today and tomorrow
    const taskElements = document.querySelectorAll('#taskList li, #tomorrowTaskList li');
    const currentDate = new Date(); // Get current date and time

    taskElements.forEach(taskElement => {
        // Extract due date and time from task content
        const taskDueDateTimeString = taskElement.textContent.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
        if (taskDueDateTimeString) {
            const taskDueDateTime = new Date(taskDueDateTimeString[0]);
            // Check if the task is overdue (due date and time have passed)
            if (currentDate > taskDueDateTime) {
                // Check if the task already has the tick icon
                if (!taskElement.querySelector('.tick-icon')) {
                    // Set background color to red
                    taskElement.style.backgroundColor = 'red';

                    // Add tick icon to the left of the task
                    const tickIcon = document.createElement('i');
                    tickIcon.className = 'fas fa-check-circle tick-icon';
                    taskElement.insertBefore(tickIcon, taskElement.firstChild);
                }
            }
        }
    });
}



// Clear the interval after marking tasks
setTimeout(() => {
    clearInterval(checkForDueTasks);
}, 5000); // Wait for 1 second before clearing the interval

// Request permission for notifications
if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted');
        } else {
            console.log('Notification permission denied');
        }
    });
}
