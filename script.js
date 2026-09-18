// ============================================
// ELEMENTS
// ============================================

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const taskDate =
    document.getElementById("taskDate");

const taskTime =
    document.getElementById("taskTime");

const taskPriority =
    document.getElementById("taskPriority");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const totalTasks =
    document.getElementById("totalTasks");

const activeTasks =
    document.getElementById("activeTasks");

const completedTasks =
    document.getElementById("completedTasks");

const searchInput =
    document.getElementById("searchInput");

const filters =
    document.querySelectorAll(".filter");

const dayName =
    document.getElementById("dayName");

const currentDate =
    document.getElementById("currentDate");


// EDIT MODAL

const editModal =
    document.getElementById("editModal");

const editTaskInput =
    document.getElementById("editTaskInput");

const editDate =
    document.getElementById("editDate");

const editTime =
    document.getElementById("editTime");

const editPriority =
    document.getElementById("editPriority");

const saveEdit =
    document.getElementById("saveEdit");

const closeModal =
    document.getElementById("closeModal");


// ============================================
// DATA
// ============================================

let tasks =
    JSON.parse(
        localStorage.getItem("focusboard_tasks")
    ) || [];


let currentFilter = "all";

let editingTaskId = null;


// ============================================
// SAVE
// ============================================

function saveTasks() {

    localStorage.setItem(
        "focusboard_tasks",
        JSON.stringify(tasks)
    );

}


// ============================================
// DATE
// ============================================

function showCurrentDate() {

    const today = new Date();

    const days = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY"
    ];

    const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
    ];

    dayName.textContent =
        days[today.getDay()];

    currentDate.textContent =
        String(today.getDate()).padStart(2, "0")
        + " "
        + months[today.getMonth()]
        + " "
        + today.getFullYear();

}

showCurrentDate();


// ============================================
// ADD TASK
// ============================================

taskForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const text =
            taskInput.value.trim();

        if (!text) {
            return;
        }


        const task = {

            id: Date.now(),

            text: text,

            date: taskDate.value,

            time: taskTime.value,

            priority: taskPriority.value,

            completed: false

        };


        tasks.unshift(task);

        saveTasks();

        taskForm.reset();

        taskPriority.value = "medium";

        renderTasks();

        taskInput.focus();

    }
);


// ============================================
// RENDER
// ============================================

function renderTasks() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    let filteredTasks =
        tasks.filter(task => {

            const matchesSearch =
                task.text
                    .toLowerCase()
                    .includes(searchTerm);


            let matchesFilter = true;


            if (
                currentFilter === "active"
            ) {

                matchesFilter =
                    !task.completed;

            }


            if (
                currentFilter === "completed"
            ) {

                matchesFilter =
                    task.completed;

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";


        filteredTasks.forEach(
            task => {

                taskList.appendChild(
                    createTaskElement(task)
                );

            }
        );

    }


    updateStatistics();

}


// ============================================
// CREATE TASK ELEMENT
// ============================================

function createTaskElement(task) {

    const item =
        document.createElement("div");

    item.className =
        "task-item"
        + (
            task.completed
                ? " completed"
                : ""
        );


    let dateText = "";

    if (task.date) {

        const date =
            new Date(
                task.date + "T00:00:00"
            );

        dateText =
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

    }


    let timeText =
        task.time
            ? "• " + task.time
            : "";


    item.innerHTML = `

        <button
            class="check-button"
            title="Complete task"
        >
            ✓
        </button>


        <div class="task-content">

            <h4></h4>

            <div class="task-meta">

                ${
                    dateText
                        ? `<span>📅 ${dateText}</span>`
                        : ""
                }

                ${
                    timeText
                        ? `<span>${timeText}</span>`
                        : ""
                }

                <span
                    class="priority ${task.priority}"
                >
                    ${task.priority}
                </span>

            </div>

        </div>


        <div class="task-actions">

            <button
                class="task-action edit"
                title="Edit"
            >
                ✎
            </button>

            <button
                class="task-action delete"
                title="Delete"
            >
                ×
            </button>

        </div>

    `;


    // Safe text insertion

    item.querySelector(
        ".task-content h4"
    ).textContent = task.text;


    // Complete

    item.querySelector(
        ".check-button"
    ).addEventListener(
        "click",
        () => toggleTask(task.id)
    );


    // Edit

    item.querySelector(
        ".edit"
    ).addEventListener(
        "click",
        () => openEditModal(task.id)
    );


    // Delete

    item.querySelector(
        ".delete"
    ).addEventListener(
        "click",
        () => deleteTask(task.id)
    );


    return item;

}


// ============================================
// COMPLETE TASK
// ============================================

function toggleTask(id) {

    tasks =
        tasks.map(task => {

            if (task.id === id) {

                return {
                    ...task,
                    completed:
                        !task.completed
                };

            }

            return task;

        });


    saveTasks();

    renderTasks();

}


// ============================================
// DELETE TASK
// ============================================

function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );

    saveTasks();

    renderTasks();

}


// ============================================
// EDIT MODAL
// ============================================

function openEditModal(id) {

    const task =
        tasks.find(
            task => task.id === id
        );

    if (!task) {
        return;
    }


    editingTaskId = id;

    editTaskInput.value =
        task.text;

    editDate.value =
        task.date;

    editTime.value =
        task.time;

    editPriority.value =
        task.priority;


    editModal.classList.add(
        "show"
    );

    editTaskInput.focus();

}


// ============================================
// SAVE EDIT
// ============================================

saveEdit.addEventListener(
    "click",
    function() {

        const newText =
            editTaskInput.value.trim();

        if (!newText) {
            return;
        }


        tasks =
            tasks.map(task => {

                if (
                    task.id ===
                    editingTaskId
                ) {

                    return {

                        ...task,

                        text: newText,

                        date:
                            editDate.value,

                        time:
                            editTime.value,

                        priority:
                            editPriority.value

                    };

                }

                return task;

            });


        saveTasks();

        closeEditModal();

        renderTasks();

    }
);


// ============================================
// CLOSE MODAL
// ============================================

function closeEditModal() {

    editModal.classList.remove(
        "show"
    );

    editingTaskId = null;

}

closeModal.addEventListener(
    "click",
    closeEditModal
);


// Click outside modal

editModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            editModal
        ) {

            closeEditModal();

        }

    }
);


// ESCAPE KEY

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeEditModal();

        }

    }
);


// ============================================
// FILTERS
// ============================================

filters.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            filters.forEach(
                btn =>
                    btn.classList.remove(
                        "active"
                    )
            );


            this.classList.add(
                "active"
            );


            currentFilter =
                this.dataset.filter;


            renderTasks();

        }
    );

});


// ============================================
// SEARCH
// ============================================

searchInput.addEventListener(
    "input",
    renderTasks
);


// ============================================
// STATISTICS
// ============================================

function updateStatistics() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    const active =
        total - completed;


    totalTasks.textContent =
        total;

    activeTasks.textContent =
        active;

    completedTasks.textContent =
        completed;

}


// ============================================
// INITIAL RENDER
// ============================================

renderTasks();
