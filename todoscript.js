document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskButton = document.getElementById("addTaskButton");
  const todoList = document.getElementById("todoList");
  const deleteDoneTasks = document.getElementById("deleteDoneTasks");
  const deleteAllTasks = document.getElementById("deleteAllTasks");
  const allTasksButton = document.getElementById("allTasks");
  const doneTasksButton = document.getElementById("doneTasks");
  const todoTasksButton = document.getElementById("todoTasks");
  const confirmationModal = document.getElementById("confirmationPopup");
  const confirmDeleteButton = document.getElementById("confirmDeleteButton");
  const cancelDeleteButton = document.getElementById("cancelDeleteButton");
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";
  const renderTasks = (filter = "all") => {
    todoList.innerHTML = "";

    tasks
      .filter((task) => {
        if (filter === "done") return task.done;
        if (filter === "todo") return !task.done;
        return true;
      })
      .forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.className = "task-item";
        listItem.innerHTML = `
         <div class="todo-item">

        <span style="${
          task.done ? "text-decoration: line-through;color: red;" : ""
        }">${task.name}</span>
        <div class="task-actions" >
          
          <input type="checkbox"    ${
            task.done ? "checked" : ""
          } data-index="${index}" class="toggle-task" id="checkbox">
          <button data-index="${index}" class="edit-task" id="icon"><i data-index="${index}" class="fa-solid fa-pen edit-task" style="color: #FFD43B;"></i></button>
          <button data-index="${index}" class="delete-task"  id="icon"><i data-index="${index}" class="fa-solid fa-trash delete-task " style="color: #d70909;"></i>
          </button>
        </div>
        </div>
      `;
        todoList.appendChild(listItem);
      });
  };

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(currentFilter);
  };

  addTaskButton.addEventListener("click", () => {
    const taskName = taskInput.value.trim();
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";

    if (!taskName) {
      errorMessage.textContent = "Task cannot be empty.";
      return;
    }
    if (taskName.length < 5) {
      errorMessage.textContent = "Task must be at least 5 characters long.";
      return;
    }
    if (/\d/.test(taskName)) {
      errorMessage.textContent = "Task cannot contain numbers.";
      return;
    }

    tasks.push({ name: taskName, done: false });
    saveTasks();
    taskInput.value = "";
  });

  todoList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("toggle-task")) {
      tasks[index].done = !tasks[index].done;
    }
    if (e.target.classList.contains("edit-task")) {
      const currentTaskName = tasks[index].name;
      const modal = document.getElementById("editPopup");
      const modalInput = document.getElementById("modalInput");
      const modalError = document.getElementById("modalError");
      const saveButton = document.getElementById("saveButton");
      const cancelButton = document.getElementById("cancelButton");

      modalInput.value = currentTaskName;
      modalError.textContent = "";

      modal.style.display = "flex";

      saveButton.onclick = () => {
        const newName = modalInput.value.trim();

        if (!newName) {
          modalError.textContent = "Task cannot be empty.";
          return;
        }

        if (newName.length < 5) {
          modalError.textContent = "Task must be at least 5 characters long.";
          return;
        }

        if (/\d/.test(newName)) {
          modalError.textContent = "Task cannot contain numbers.";
          return;
        }

        tasks[index].name = newName;
        saveTasks();
        modal.style.display = "none";
      };

      cancelButton.onclick = () => {
        modal.style.display = "none";
      };
    }
    if (e.target.classList.contains("delete-task")) {
      confirmationModal.style.display = "flex";

      confirmDeleteButton.onclick = () => {
        tasks.splice(index, 1);
        saveTasks();
        confirmationModal.style.display = "none";
      };

      cancelDeleteButton.onclick = () => {
        confirmationModal.style.display = "none";
      };
    }
    saveTasks();
  });

  allTasksButton.addEventListener("click", () => {
    currentFilter = "all";
    renderTasks("all");
  });

  doneTasksButton.addEventListener("click", () => {
    currentFilter = "done";
    renderTasks("done");
  });

  todoTasksButton.addEventListener("click", () => {
    currentFilter = "todo";
    renderTasks("todo");
  });
  deleteDoneTasks.addEventListener("click", () => {
    const filteredTasks = tasks.filter((task) => !task.done);
    tasks.length = 0;
    tasks.push(...filteredTasks);
    saveTasks();
  });

  deleteAllTasks.addEventListener("click", () => {
    if (tasks.length === 0) {
      return;
    }


    confirmationModal.style.display = "flex";

    confirmDeleteButton.onclick = () => {
      tasks.length = 0;
      saveTasks();
      confirmationModal.style.display = "none";
    };

    cancelDeleteButton.onclick = () => {
      confirmationModal.style.display = "none";
    };
  });

  renderTasks(currentFilter);
});
