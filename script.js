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

// Variable to store the current filter
let currentFilter = 'all';

// Variable to store the current sort order
let sortAscending = true;

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
        const now = new Date();
        const newTask = {
            id: Date.now(), // Unique identifier for the task
            task: taskText, // Task description
            completed: false, // Task completion status
            createdAt: now.toLocaleDateString(), // Store the creation date
            createdTime: now.toLocaleTimeString() // Store the creation time
        };
        tasks.push(newTask); // Add the new task to the end of the tasks array
        saveTasks(tasks); // Save updated tasks array to local storage
        setActiveFilter(currentFilter); // Update the task list and counter with the current filter
        taskInput.value = ''; // Clear the input field
    }
}

// Set the active filter and update the task display accordingly
function setActiveFilter(filter) {
    currentFilter = filter; // Update the current filter
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

// Render tasks on the screen based on the selected filter and sort order
function renderTasks(filter) {
    const tasks = getTasks(); // Retrieve tasks from local storage
    // Filter tasks based on the active filter
    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true; // Return all tasks if filter is 'all'
    });

    // Sort tasks based on the creation date and time
    filteredTasks.sort((a, b) => {
        const dateA = new Date(`${a.createdAt} ${a.createdTime}`);
        const dateB = new Date(`${b.createdAt} ${b.createdTime}`);
        return sortAscending ? dateA - dateB : dateB - dateA;
    });

    const taskList = document.getElementById('taskList'); // Get the task list element
    taskList.innerHTML = ''; // Clear the current task list

    // Iterate over each filtered and sorted task and create list items
    filteredTasks.forEach(task => {
        const li = document.createElement('li'); // Create a list item element

        // Create a span element for the task text
        const taskText = document.createElement('span');
        taskText.textContent = task.task; // Set the text content to the task description
        taskText.className = task.completed ? 'completed' : ''; // Add completed class if task is completed
        taskText.contentEditable = false; // Make the task text non-editable by default
        li.appendChild(taskText); // Append the task text to the list item

        // Create a button for showing more information
        const infoBtn = document.createElement('button');
        infoBtn.innerHTML = '<i class="fas fa-book"></i>'; // Use Font Awesome book icon
        infoBtn.className = 'info-btn'; // Add class for styling
        // Add click event listener to show task information
        infoBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the event from bubbling up
            showTaskInfo(task, infoBtn); // Call function to show task info
        });
        li.appendChild(infoBtn); // Append the info button to the list item

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

// Function to show task information in a popup
function showTaskInfo(task, button) {
    // Create a div for the info window
    const infoWindow = document.createElement('div');
    infoWindow.className = 'info-window'; // Add class for styling

    // Add task name and creation date/time to the info window
    const taskName = document.createElement('p');
    taskName.innerHTML = `<span class="label">Task:</span> ${task.task}`; // Use bold label
    const taskCreated = document.createElement('p');
    taskCreated.innerHTML = `<span class="label">Created on:</span> ${task.createdAt} at ${task.createdTime}`; // Use bold label

    infoWindow.appendChild(taskName);
    infoWindow.appendChild(taskCreated);

    // Append the info window to the body
    document.body.appendChild(infoWindow);

    // Position the info window near the button
    const rect = button.getBoundingClientRect();
    infoWindow.style.top = `${rect.bottom + window.scrollY}px`;
    infoWindow.style.left = `${rect.left + window.scrollX}px`;
    infoWindow.style.display = 'block';

    // Close the info window when clicking outside
    document.addEventListener('click', function closeInfoWindow(e) {
        if (!infoWindow.contains(e.target) && e.target !== button) {
            infoWindow.remove(); // Remove the info window when clicking outside
            document.removeEventListener('click', closeInfoWindow);
        }
    });
}

// Function to toggle the sort order and re-render tasks
function toggleSortOrder() {
    sortAscending = !sortAscending; // Toggle the sort order
    renderTasks(currentFilter); // Re-render tasks with the new sort order
}

// Create and append the sort button
const sortBtn = document.createElement('button');
sortBtn.innerHTML = '<i class="fas fa-sort"></i>'; // Use Font Awesome sort icon
sortBtn.className = 'sort-btn'; // Add class for styling
sortBtn.addEventListener('click', toggleSortOrder); // Add click event to toggle sort order
document.querySelector('.filter-section').insertBefore(sortBtn, document.querySelector('.filter-dropdown'));
