// State management
let tasks = [];
let currentFilter = 'all';

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Update task count
function updateTaskCount() {
    const taskCountElement = document.getElementById('task-count');
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;

    if (totalTasks === 0) {
        taskCountElement.textContent = 'No tasks';
    } else if (activeTasks === 1) {
        taskCountElement.textContent = '1 task';
    } else {
        taskCountElement.textContent = `${activeTasks} tasks`;
    }
}

// Get filtered tasks
function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// Render tasks
function renderTasks() {
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const footerActions = document.getElementById('footer-actions');
    
    const filteredTasks = getFilteredTasks();
    
    taskList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        
        filteredTasks.forEach((task, index) => {
            const actualIndex = tasks.indexOf(task);
            const taskItem = createTaskElement(task, actualIndex);
            taskList.appendChild(taskItem);
        });
    }
    
    // Show/hide footer actions
    const hasCompletedTasks = tasks.some(task => task.completed);
    footerActions.style.display = hasCompletedTasks ? 'block' : 'none';
    
    updateTaskCount();
}

// Create task element
function createTaskElement(task, index) {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(index));
    
    // Task text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    `;
    deleteButton.addEventListener('click', () => removeTask(index));
    
    // Task actions wrapper
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';
    taskActions.appendChild(deleteButton);
    
    // Append elements
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(taskActions);
    
    return taskItem;
}

// Add new task
function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        taskInput.focus();
        return;
    }
    
    tasks.push({
        text: taskText,
        completed: false,
        id: Date.now()
    });
    
    taskInput.value = '';
    saveTasks();
    renderTasks();
    
    // Focus back on input
    taskInput.focus();
}

// Toggle task completion
function toggleTask(index) {
    if (index >= 0 && index < tasks.length) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }
}

// Remove task
function removeTask(index) {
    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

// Clear completed tasks
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Set filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    renderTasks();
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Load tasks from localStorage
    loadTasks();
    
    // Add task button
    document.getElementById('add-task-button').addEventListener('click', addTask);
    
    // Add task on Enter key
    document.getElementById('task-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setFilter(btn.dataset.filter);
        });
    });
    
    // Clear completed button
    document.getElementById('clear-completed').addEventListener('click', clearCompleted);
    
    // Initial render
    renderTasks();
});
