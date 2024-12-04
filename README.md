# Challenge: TODO List

## [Deploy on Vercel](https://to-do-list-ebon-pi-13.vercel.app/)

## Overview

This is a simple Todo List application built using HTML, CSS, and JavaScript. The application allows users to add, edit, remove, and filter tasks. Tasks are stored in the browser's local storage, so they persist even after the page is refreshed.

## Features

- Add new tasks to the list.
- Mark tasks as completed.
- Edit existing tasks.
- Remove tasks from the list.
- Filter tasks to show all, pending, or completed tasks.
- Drag and drop to reorder tasks.
- Tasks are saved in local storage.

## Technologies Used

- HTML for the structure of the application.
- CSS for styling and layout.
- JavaScript for interactivity and functionality.

## A bit about the project's JavaScript (script.js)

- **Key Functions**:
  - `getTasks` and `saveTasks`: Handle retrieving and storing tasks in local storage.
  - `addTask`: Adds a new task to the list and updates local storage.
  - `setActiveFilter`: Updates the task list based on the selected filter (all, pending, completed).
  - `renderTasks`: Renders tasks on the page according to the current filter.
  - `saveTasksOrder`: Saves the order of tasks after they have been reordered via drag-and-drop.
- **Event Listeners**:
  - For button clicks to add tasks and apply filters.
  - For the input field to add tasks when the "Enter" key is pressed.
  - For drag-and-drop functionality to reorder tasks.

This Todo List project demonstrates the use of basic web technologies to create a functional and interactive application. It provides a good foundation for understanding how to build web applications with persistent data storage.
