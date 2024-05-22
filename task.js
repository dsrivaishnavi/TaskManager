document.addEventListener("DOMContentLoaded", function() {
    displayTasks('work', true); // Display work tasks with delete buttons
    displayTasks('home', true); // Display home tasks with delete buttons
});

function displayTasks(type, showDelete) {
    var tasks = JSON.parse(localStorage.getItem(type + '-tasks')) || [];
    var tasksList = document.getElementById(type + '-tasks');

    tasksList.innerHTML = '';

    tasks.forEach(function(task) {
        var taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        var completionDateText = task.completionDate ? ` (Completion Date: ${task.completionDate})` : '';
        var timeText = task.time ? ` (Time: ${task.time.hours}:${task.time.minutes})` : '';
        var taskText = `${task.text}${timeText}${completionDateText}`;
        taskItem.textContent = taskText;

        // Check if the task has a reminder
        if (task.reminder) {
            var now = new Date();
            var reminderTime = new Date(task.reminder);

            // If the reminder time is in the future, set a reminder
            if (reminderTime > now) {
                var timeDifference = Math.abs(reminderTime - now);
                var minutesDifference = Math.ceil(timeDifference / (1000 * 60));
                var reminderText = ` (Reminder: ${minutesDifference} minutes left)`;
                taskItem.textContent += reminderText;
            }
            // If the reminder time has passed, remove the reminder
            else {
                delete task.reminder;
                localStorage.setItem(type + '-tasks', JSON.stringify(tasks));
            }
        }

        if (showDelete) {
            var deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                tasks = tasks.filter(t => t.id !== task.id);
                localStorage.setItem(type + '-tasks', JSON.stringify(tasks));
                displayTasks(type, showDelete);
            });
            taskItem.appendChild(deleteButton);
        }

        tasksList.appendChild(taskItem);
    });
}
