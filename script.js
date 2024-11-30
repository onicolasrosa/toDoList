document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('showAllBtn').addEventListener('click', () => setActiveFilter('all'));
document.getElementById('showPendingBtn').addEventListener('click', () => setActiveFilter('pending'));
document.getElementById('showCompletedBtn').addEventListener('click', () => setActiveFilter('completed'));

document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

let draggedItem = null;

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        const tasks = getTasks();
        const newTask = { id: Date.now(), task: taskText, completed: false };
        tasks.push(newTask);
        saveTasks(tasks);
        setActiveFilter('all');
        taskInput.value = '';
    }
}

function setActiveFilter(filter) {
    document.querySelectorAll('.filter-buttons button').forEach(button => {
        button.classList.remove('active');
    });
    const filterName = document.getElementById('filterName');
    const tasks = getTasks();
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;

    if (filter === 'all') {
        document.getElementById('showAllBtn').classList.add('active');
        filterName.textContent = `All Tasks: ${totalTasks}`;
    } else if (filter === 'pending') {
        document.getElementById('showPendingBtn').classList.add('active');
        filterName.textContent = `Pending Tasks: ${pendingTasks}`;
    } else if (filter === 'completed') {
        document.getElementById('showCompletedBtn').classList.add('active');
        filterName.textContent = `Completed Tasks: ${completedTasks}`;
    }
    renderTasks(filter);
}

function renderTasks(filter) {
    const tasks = getTasks();
    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.setAttribute('draggable', true); // Make list item draggable

        li.addEventListener('dragstart', function() {
            draggedItem = li;
            setTimeout(() => li.classList.add('dragging'), 0);
        });

        li.addEventListener('dragend', function() {
            setTimeout(() => li.classList.remove('dragging'), 0);
            draggedItem = null;
            saveTasksOrder();
        });

        li.addEventListener('dragover', function(e) {
            e.preventDefault();
            const draggingElement = document.querySelector('.dragging');
            if (draggingElement && draggingElement !== li) {
                const bounding = li.getBoundingClientRect();
                const offset = bounding.y + (bounding.height / 2);
                if (e.clientY - offset > 0) {
                    li.parentNode.insertBefore(draggingElement, li.nextSibling);
                } else {
                    li.parentNode.insertBefore(draggingElement, li);
                }
            }
        });

        const taskText = document.createElement('span');
        taskText.textContent = task.task;
        taskText.className = task.completed ? 'completed' : '';
        li.appendChild(taskText);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', function() {
            task.completed = checkbox.checked;
            saveTasks(tasks);
            setActiveFilter(filter);
        });
        li.insertBefore(checkbox, taskText);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', function() {
            const newTaskText = prompt('Edit task:', task.task);
            if (newTaskText !== null && newTaskText.trim() !== '') {
                task.task = newTaskText.trim();
                saveTasks(tasks);
                renderTasks(filter);
            }
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.addEventListener('click', function() {
            const index = tasks.findIndex(t => t.id === task.id);
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks(filter);
            setActiveFilter(filter);
        });

        li.appendChild(editBtn);
        li.appendChild(removeBtn);
        taskList.appendChild(li);
    });
}

function saveTasksOrder() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.children).map(li => {
        const taskText = li.querySelector('span').textContent;
        const completed = li.querySelector('input[type="checkbox"]').checked;
        return { task: taskText, completed };
    });
    saveTasks(tasks);
}

setActiveFilter('all'); // Initial rendering of tasks
