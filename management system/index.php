<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do List</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">

    <style>
        .left-content {
            /* float: left; */
            width: 50%;
            /* margin-right: 2%; */
            background-color: #f2f2f2;
            padding: 10px;
            border-radius: 5px;
            flex-direction: column;
            box-shadow: 1.5px 3.0px 3.0px hsl(0deg 0% 0% / 0.45),
                         1.5px 3.0px 3.0px hsl(0deg 0% 0% / 0.45),
                         1.5px 3.0px 3.0px hsl(0deg 0% 0% / 0.45),
                         1.5px 3.0px 3.0px hsl(0deg 0% 0% / 0.45),
                         1.5px 3.0px 3.0px hsl(0deg 0% 0% / 0.45)
                         ;
                         overflow-y: scroll;
        }

        .left-content::-webkit-scrollbar {
    width: 0;
}


        .right-content {
            width: 50%;
            background-color: #f2f2f2;
            padding: 10px;
            border-radius: 5px;
            flex-direction: column;
            background-color: #f2f2f2;
            overflow-wrap: break-word;
            box-shadow: 1.5px 3.0px 3.0px hsl(0deg 0% 0% / 0.45),
                         1.5px 3.0px 3.0px hsl(0deg 0% 0% / 0.45),
                         1.5px 3.0px 3.0px hsl(0deg 0% 0% / 0.45),
                         1.5px 3.0px 3.0px hsl(0deg 0% 0% / 0.45),
                         1.5px 3.0px 3.0px hsl(0deg 0% 0% / 0.45)
                         ;
                         overflow-y: scroll;
        }


        .tm-container,
        .td-container {
            display: flex;
            justify-content: center;

        }

        #todayDueTimeInput,
        #tomorrowDueTimeInput {
            height: 40px;
            float: right;
            outline: none;
            font-size: 16px;
            width: 180px;
            display: flex;
            justify-content: center;
            border: .5px solid rgba(134, 130, 130, 0.452);
            border-radius: 8px;
            /* margin: 10px; */
        }

        .truncate {
            width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .task-container {
            width: 100%;
            border: 1px solid #41555c52;
            border-radius: 5px;
            background-color: #bbd0e6;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 1.5px 3.0px 3.0px hsl(0deg 0% 0% / 0.45);

        }

        li {
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 0;
            width: 100%;
        }

        .task-container:hover li {
            white-space: normal;
            overflow: visible;

        }

        #taskList,
        #tomorrowTaskList {
            list-style: none;
            padding: 0;
            /* align-items: left;
            float: left; */
        }

        .todo-button {
            background: #0a67f3;

            color: #fff;
            border: none;
            border-radius: 3px;
            margin-left: 10px;
            /* Adjust spacing between buttons */
            cursor: pointer;
        }

        .todo-button:hover {
            background-color: #dc22ed;
        }

        #td-btn, #tm-btn{
            background-color: #4380c0;
            height: 40px;
            width: 100px;
            color:#fff;
            font-size: 14px;
            font-weight: 900;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
        }

        #td-btn:hover{
            background-color: #bbd0e6;
            color: #000000;
        }

        #tm-btn:hover{
            background-color: #bbd0e6;
            color: #000000;
        }

       .tick-icon{
            color: aqua;
            padding: 5px;
       }
    </style>
</head>

<body>
    <h1>To-Do List</h1>
    <div class="container">
        <div class="left-content">
            <h2>Today's Tasks</h2>
            <div class="td-container">
                <form id="today-Form" class="td-Form" data-table="tasks" method="post" action="server.php">
                    <input type="text" name="today_task" id="todayTaskInput" placeholder="Add new task">
                    <input type="date" name="today_due_date" id="todayDueDateInput">
                    <select name="today_priority" id="todayPriorityInput">
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <input type="time" name="today_due_time" id="todayDueTimeInput">
                    <button id="td-btn" class="todo-button" type="submit">Add Task</button>
                </form>
            </div>

            <div class="todo_container">
                <ul id="taskList">
                    <!-- dynamically updated -->
                </ul>
            </div>

        </div>

        <div class="right-content">

            <h2>Tomorrow's Tasks</h2>
            <div class="tm-container">
                <form id="tomorrow-Form" class="td-Form" data-table="tasks_2" method="post" action="server.php">
                    <input type="text" name="tomorrow_task" id="tomorrowTaskInput" placeholder="Add new task">
                    <input type="date" name="tomorrow_due_date" id="tomorrowDueDateInput">
                    <select name="tomorrow_priority" id="tomorrowPriorityInput">
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <input type="time" name="tomorrow_due_time" id="tomorrowDueTimeInput">
                    <button id="tm-btn" class="todo-button" type="submit">Add Task</button>
                </form>
            </div>
            <div class="todo_container">

                <ul id="tomorrowTaskList">
                    <!-- dynamically updated -->
                </ul>
            </div>

        </div>
    </div>

    <button id="stopNotificationSound">Stop Sound</button>

    <audio id="notificationSound" loop>
        <source src="http://localhost/Kim/notify.wav" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>

    <script src="fetch_data.js"></script>
</body>

</html>