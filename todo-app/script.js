// Local Storage Key
const STORAGE_KEY = 'todoList';

// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');

// App State
let todos = [];
let currentFilter = 'all';

// Initialize App
function initApp() {
    loadTodos();
    renderTodos();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);
    clearAllBtn.addEventListener('click', clearAll);
}

// Add Todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: 'medium',
        createdAt: new Date().toLocaleDateString()
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

// Delete Todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Toggle Todo
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Clear Completed
function clearCompleted() {
    if (todos.filter(t => t.completed).length === 0) {
        alert('No completed tasks to clear!');
        return;
    }

    if (confirm('Are you sure you want to delete all completed tasks?')) {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }
}

// Clear All
function clearAll() {
    if (todos.length === 0) {
        alert('No tasks to clear!');
        return;
    }

    if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

// Render Todos
function renderTodos() {
    todoList.innerHTML = '';

    let filteredTodos = todos;

    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li class="empty-state">📝 No tasks yet. Add one to get started!</li>';
    } else {
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <span class="priority-badge priority-${todo.priority}">${todo.priority}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">🗑️ Delete</button>
            `;
            todoList.appendChild(li);
        });
    }

    updateStats();
}

// Update Statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;

    totalTasksSpan.textContent = `Total: ${total}`;
    completedTasksSpan.textContent = `Completed: ${completed}`;
}

// Save Todos to Local Storage
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Load Todos from Local Storage
function loadTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            todos = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading todos:', e);
            todos = [];
        }
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize App on Page Load
window.addEventListener('DOMContentLoaded', initApp);
