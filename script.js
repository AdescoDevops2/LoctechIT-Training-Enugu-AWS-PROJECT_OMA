// ==========================================
// AWS API GATEWAY URL
// ==========================================

const API_URL = "YOUR_API_GATEWAY_URL/todos";


// ==========================================
// LOAD TASKS
// ==========================================

async function loadTasks() {

    const loading = document.getElementById("loading");
    const todoList = document.getElementById("todoList");

    loading.style.display = "block";

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        const data = await response.json();

        console.log("API Response:", data);

        displayTasks(data);

    } catch (error) {

        console.error("Error:", error);

        todoList.innerHTML = `
            <li>
                Unable to load tasks.
            </li>
        `;

    } finally {

        loading.style.display = "none";
    }
}


// ==========================================
// DISPLAY TASKS
// ==========================================

function displayTasks(tasks) {

    const todoList = document.getElementById("todoList");

    todoList.innerHTML = "";

    if (!tasks || tasks.length === 0) {

        todoList.innerHTML = `
            <li>No tasks available.</li>
        `;

        return;
    }

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "todo-item";

        li.innerHTML = `
            <span class="${task.completed ? "completed" : ""}">
                ${task.task}
            </span>

            <button
                class="delete-btn"
                onclick="deleteTask('${task.id}')">
                Delete
            </button>
        `;

        todoList.appendChild(li);

    });
}


// ==========================================
// ADD TASK
// ==========================================

async function addTask() {

    const input = document.getElementById("taskInput");

    const task = input.value.trim();

    if (!task) {

        alert("Please enter a task.");

        return;
    }

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                task: task
            })

        });

        if (!response.ok) {
            throw new Error("Failed to add task");
        }

        input.value = "";

        alert("Task added successfully!");

        loadTasks();

    } catch (error) {

        console.error("Error:", error);

        alert("Unable to add task.");

    }
}


// ==========================================
// DELETE TASK
// ==========================================

async function deleteTask(id) {

    if (!confirm("Delete this task?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        alert("Task deleted.");

        loadTasks();

    } catch (error) {

        console.error("Error:", error);

        alert("Unable to delete task.");

    }
}


// ==========================================
// LOAD TASKS WHEN PAGE OPENS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadTasks
);
