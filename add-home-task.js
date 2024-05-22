document.addEventListener("DOMContentLoaded", function() {
  var addHomeTaskForm = document.getElementById("add-home-task-form");
  if (addHomeTaskForm) {
    addHomeTaskForm.addEventListener("submit", function(event) {
      event.preventDefault();
      addTask('home');
    });
    displayTasks('home', true);
  }

  function addTask(type) {
    var taskInput = document.getElementById(type + '-task');
    var taskTimeInput = document.getElementById(type + '-task-time');
    var taskCompletionDateInput = document.getElementById(type + '-completion-date');
    var taskValue = taskInput.value.trim();
    var taskTimeValue = taskTimeInput.value.trim();
    var taskCompletionDateValue = taskCompletionDateInput.value;

    if (taskValue !== "") {
      var tasks = JSON.parse(localStorage.getItem(type + '-tasks')) || [];
      var task = {
        text: taskValue,
        time: taskTimeValue ? parseTime(taskTimeValue) : null,
        completionDate: taskCompletionDateValue,
        id: Date.now()
      };

      tasks.push(task);
      localStorage.setItem(type + '-tasks', JSON.stringify(tasks));

      taskInput.value = "";
      taskTimeInput.value = "";
      taskCompletionDateInput.value = "";

      displayTasks(type, true);
    }
  }

  function parseTime(timeString) {
    var parts = timeString.split(':');
    var hours = parseInt(parts[0]);
    var minutes = parseInt(parts[1]);
    return { hours: hours, minutes: minutes };
  }

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
});
