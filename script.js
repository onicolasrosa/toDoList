// Add click event to the add task button
document.getElementById('addTaskBtn').addEventListener('click', addTask);

// Add click event to each dropdown link to set the active filter
document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor behavior
        const filter = this.getAttribute('data-filter'); // Get the filter type from data attribute
        setActiveFilter(filter); // Set the active filter
    });
});

// Add keypress event to the input field to add task on "Enter" key
document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask(); // Call addTask function when Enter key is pressed
    }
});

// Variable to store the currently dragged item for drag-and-drop functionality
let draggedItem = null;

// Retrieve tasks from local storage, or return an empty array if none exist
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Save the tasks array to local storage as a JSON string
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to add a new task to the list
function addTask() {
    const taskInput = document.getElementById('taskInput'); // Get the input field
    const taskText = taskInput.value.trim(); // Trim whitespace from the input value

    if (taskText !== '') { // Check if the input is not empty
        const tasks = getTasks(); // Get current tasks from local storage
        const newTask = {
            id: Date.now(),
            task: taskText,
            completed: false,
            createdAt: new Date().toLocaleString() // Store the creation date
        };
        tasks.push(newTask); // Add the new task to the tasks array
        saveTasks(tasks); // Save updated tasks array to local storage
        setActiveFilter('all'); // Refresh the task list to show all tasks
        taskInput.value = ''; // Clear the input field
    }
}

// Set the active filter and update the task display accordingly
function setActiveFilter(filter) {
    const filterName = document.getElementById('filterName'); // Get the filter name display element
    const tasks = getTasks(); // Retrieve tasks from local storage
    const totalTasks = tasks.length; // Calculate total number of tasks
    const pendingTasks = tasks.filter(task => !task.completed).length; // Calculate number of pending tasks
    const completedTasks = tasks.filter(task => task.completed).length; // Calculate number of completed tasks

    // Update the filter name based on the selected filter
    if (filter === 'all') {
        filterName.textContent = `All Tasks: ${totalTasks}`;
    } else if (filter === 'pending') {
        filterName.textContent = `Pending Tasks: ${pendingTasks}`;
    } else if (filter === 'completed') {
        filterName.textContent = `Completed Tasks: ${completedTasks}`;
    }
    renderTasks(filter); // Render tasks based on the active filter
}

// Render tasks on the screen based on the selected filter
function renderTasks(filter) {
    const tasks = getTasks(); // Retrieve tasks from local storage
    // Filter tasks based on the active filter
    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true; // Return all tasks if filter is 'all'
    });

    const taskList = document.getElementById('taskList'); // Get the task list element
    taskList.innerHTML = ''; // Clear the current task list

    // Iterate over each filtered task and create list items
    filteredTasks.forEach(task => {
        const li = document.createElement('li'); // Create a list item element
        li.setAttribute('draggable', true); // Make the list item draggable

        // Add dragstart event listener to handle the start of dragging
        li.addEventListener('dragstart', function() {
            draggedItem = li; // Set the dragged item
            setTimeout(() => li.classList.add('dragging'), 0); // Add dragging class after a short delay
        });

        // Add dragend event listener to handle the end of dragging
        li.addEventListener('dragend', function() {
            setTimeout(() => li.classList.remove('dragging'), 0); // Remove dragging class after a short delay
            draggedItem = null; // Clear the dragged item
            saveTasksOrder(); // Save the new order of tasks
        });

        // Add dragover event listener to allow dropping of dragged items
        li.addEventListener('dragover', function(e) {
            e.preventDefault(); // Prevent default behavior to allow drop
            const draggingElement = document.querySelector('.dragging'); // Get the currently dragging element
            if (draggingElement && draggingElement !== li) {
                const bounding = li.getBoundingClientRect(); // Get bounding rectangle of the list item
                const offset = bounding.y + (bounding.height / 2); // Calculate the midpoint of the list item
                // Insert the dragging element before or after the current list item based on mouse position
                if (e.clientY - offset > 0) {
                    li.parentNode.insertBefore(draggingElement, li.nextSibling);
                } else {
                    li.parentNode.insertBefore(draggingElement, li);
                }
            }
        });

        // Create a span element for the task text
        const taskText = document.createElement('span');
        taskText.textContent = task.task; // Set the text content to the task description
        taskText.className = task.completed ? 'completed' : ''; // Add completed class if task is completed
        taskText.contentEditable = false; // Make the task text non-editable by default
        li.appendChild(taskText); // Append the task text to the list item

        // Create a span element for the creation date
        const taskDate = document.createElement('span');
        taskDate.textContent = `Created on: ${task.createdAt}`; // Display the creation date
        taskDate.className = 'task-date'; // Add a class for styling
        li.appendChild(taskDate); // Append the creation date to the list item

        // Create a checkbox to mark the task as completed
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox'; // Set the input type to checkbox
        checkbox.checked = task.completed; // Set the checkbox state based on task completion
        // Add change event listener to update task completion status
        checkbox.addEventListener('change', function() {
            task.completed = checkbox.checked; // Update the task completion status
            saveTasks(tasks); // Save updated tasks to local storage
            setActiveFilter(filter); // Refresh the task list based on the current filter
        });
        li.insertBefore(checkbox, taskText); // Insert the checkbox before the task text

        // Create an edit button with a pencil icon
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>'; // Use Font Awesome pencil icon
        editBtn.className = 'edit-btn'; // Add class for styling
        // Add click event listener to enable inline editing
        editBtn.addEventListener('click', function() {
            taskText.contentEditable = true; // Make the task text editable
            taskText.classList.add('editable'); // Add editable styling
            taskText.focus(); // Focus on the task text for editing
        });

        // Add keydown event listener to handle Enter and Esc keys
        taskText.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default Enter key behavior
                task.task = taskText.textContent.trim(); // Update task text
                taskText.contentEditable = false; // Disable editing
                taskText.classList.remove('editable'); // Remove editable styling
                saveTasks(tasks); // Save updated tasks to local storage
            } else if (event.key === 'Escape') {
                event.preventDefault(); // Prevent default Esc key behavior
                taskText.textContent = task.task; // Revert to original task text
                taskText.contentEditable = false; // Disable editing
                taskText.classList.remove('editable'); // Remove editable styling
            }
        });

        // Create a remove button with an X icon
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '<i class="fas fa-times"></i>'; // Use Font Awesome X icon
        removeBtn.className = 'remove-btn'; // Add class for styling
        // Add click event listener to remove the task
        removeBtn.addEventListener('click', function() {
            const index = tasks.findIndex(t => t.id === task.id); // Find index of the task to remove
            tasks.splice(index, 1); // Remove the task from the array
            saveTasks(tasks); // Save updated tasks to local storage
            renderTasks(filter); // Re-render tasks with the current filter
            setActiveFilter(filter); // Refresh the task list based on the current filter
        });

        li.appendChild(editBtn); // Append the edit button to the list item
        li.appendChild(removeBtn); // Append the remove button to the list item
        taskList.appendChild(li); // Append the list item to the task list
    });
}

// Function to save the order of tasks after reordering
function saveTasksOrder() {
    const taskList = document.getElementById('taskList'); // Get the task list element
    // Map the list items to an array of task objects
    const tasks = Array.from(taskList.children).map(li => {
        const taskText = li.querySelector('span').textContent; // Get task text
        const completed = li.querySelector('input[type="checkbox"]').checked; // Get task completion status
        const createdAt = li.querySelector('.task-date').textContent.replace('Created on: ', ''); // Get creation date
        return { task: taskText, completed, createdAt }; // Return task object
    });
    saveTasks(tasks); // Save the reordered tasks to local storage
}

// Initial rendering of tasks with the 'all' filter
setActiveFilter('all'); // Set the default filter to 'all' and render tasks
