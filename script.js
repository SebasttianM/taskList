// DOM Element Selectors
const taskForm = document.querySelector('.form');
const entryTask = document.getElementById('entryTask');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
const btnClean = document.getElementById('btnClean');

// Load tasks from LocalStorage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initial render
renderTasks();

// Event Listeners
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask();
});

btnClean.addEventListener('click', clearTasks);

// Functions
function addTask() {
    const text = entryTask.value.trim();

    if (text === '') {
        alert('Please write down a task.');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    entryTask.value = '';
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task) => {
        const li = document.createElement('li');
        
        // Use 'task' and 'done' classes to match CSS styles
        li.classList.add('task');
        if (task.completed) {
            li.classList.add('done');
        }

        li.innerHTML = `
            <span class="task-text" style="cursor: pointer;">${task.text}</span>
            <button class="btnDelete">Delete</button>
        `;

        // Toggle task status when clicking the text
        const taskText = li.querySelector('.task-text');
        taskText.addEventListener('click', () => toggleTask(task.id));

        // Delete individual task
        const btnDelete = li.querySelector('.btnDelete');
        btnDelete.addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(li);
    });

    updateCounter();
}

function toggleTask(id) {
    tasks = tasks.map((task) => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
}

function clearTasks() {
    if (tasks.length === 0) return;

    const confirmClear = confirm('Are you sure you want to delete all tasks?');
    if (confirmClear) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

function updateCounter() {
    const pendingTasks = tasks.filter((task) => !task.completed);
    counter.textContent = pendingTasks.length;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}