import { constructNow, format } from "date-fns";
import { setLocalStorage, getLocalStorage } from "./localStorage";
import { addTouchSupport } from "./touchHelper";

const username = getLocalStorage("username");

const welcomeMessage = document.querySelector("#welcome");
const userDate = document.querySelector("#date");
const modal = document.querySelector("#modal");
const cancel = document.querySelector("#cancel");
const taskForm = document.querySelector("#newTaskForm");
const taskContainer = document.querySelectorAll("ul[data-column]");
const addIcon = document.querySelectorAll(".add-icon");
let draggedItem = null;
let currentStatus;

const formattedName = (name) => {
  const firstLetter = name.slice(0, 1).toLocaleUpperCase();
  const restOfLetter = name.slice(1, name.length).toLocaleLowerCase();
  return firstLetter + restOfLetter;
};

const currDate = new Date();
const formatedDate = format(currDate, "PPPP");

welcomeMessage.textContent = `Welcome to dashboard, ${formattedName(username)}`;
userDate.textContent = formatedDate;

addIcon.forEach((btn) => {
  btn.addEventListener("click", () => {
    const taskClass = document.querySelector(".task-class");
    currentStatus = btn.dataset.status;

    const titleFirstLetter = currentStatus.slice(0, 1).toLocaleUpperCase();
    const titleRestLetter = currentStatus
      .slice(1, currentStatus.length)
      .toLocaleLowerCase();
    const taskStatus = titleFirstLetter + titleRestLetter;
    taskClass.textContent = taskStatus;

    if (taskStatus === "Progress") taskClass.textContent = `In ${taskStatus}`;

    modal.style.display = "block";

    setTimeout(() => {
      document.querySelector("#newTaskInput").focus();
    }, 50);
  });
});

const handleDragStart = (e) => {
  draggedItem = e.target;
  setTimeout(() => (draggedItem.style.visibility = "hidden"), 0);
};

const handleDragEnd = (e) => {
  e.target.style.visibility = "visible";
  draggedItem = null;

  const parent = e.target.closest("ul");
  const columnId = parent.dataset.column;
  const updatedTasks = Array.from(parent.querySelectorAll("li span")).map(
    (span) => span.textContent
  );
  setLocalStorage(columnId, updatedTasks);
};

const handleDragOver = (e) => {
  e.preventDefault();
  const draggingOverItem = e.target.closest("li");
  const container = e.currentTarget;

  if (!draggedItem || !draggingOverItem || draggingOverItem === draggedItem)
    return;

  const bounding = draggingOverItem.getBoundingClientRect();
  const offset = e.clientY - bounding.top;

  if (offset < bounding.height / 2) {
    container.insertBefore(draggedItem, draggingOverItem);
  } else {
    container.insertBefore(draggedItem, draggingOverItem.nextSibling);
  }
};

const handleDragDrop = (e) => {
  e.preventDefault();
  if (draggedItem && e.currentTarget !== draggedItem.parentElement) {
    e.currentTarget.appendChild(draggedItem);

    const newColumnId = e.currentTarget.dataset.column;
    const updatedTasks = Array.from(
      e.currentTarget.querySelectorAll("li span")
    ).map((span) => span.textContent);
    setLocalStorage(newColumnId, updatedTasks);

    // Updating the previous column
    const prevColumnId = draggedItem.closest("ul")?.dataset.column;
    if (prevColumnId && prevColumnId !== newColumnId) {
      const prevColumn = document.querySelector(
        `ul[data-column="${prevColumnId}"]`
      );
      const prevTasks = Array.from(prevColumn.querySelectorAll("li span")).map(
        (span) => span.textContent
      );
      setLocalStorage(prevColumnId, prevTasks);
    }
  }
};

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTaskInput = document.querySelector("#newTaskInput");
  const taskValue = newTaskInput.value.trim();

  if (!taskValue) return;

  const targetUI = document.querySelector(`ul[data-column="${currentStatus}"]`);

  const newTask = document.createElement("li");
  newTask.classList.add("task-item");
  newTask.innerHTML = `
      <span>${taskValue}</span>
      <i id="delete" class="fa-regular fa-trash-can delete-btn"></i>
  `;
  newTask.setAttribute("draggable", "true");
  newTask.addEventListener("dragstart", handleDragStart);
  newTask.addEventListener("dragend", handleDragEnd);

  addTouchSupport(newTask);
  targetUI.appendChild(newTask);

  const updatedTasks = Array.from(targetUI.querySelectorAll("li span")).map(
    (span) => span.textContent
  );
  setLocalStorage(currentStatus, updatedTasks);

  newTaskInput.value = "";
  modal.style.display = "none";
});

taskContainer.forEach((ul) => {
  ul.addEventListener("click", (e) => {
    if (e.target && e.target.id === "delete") {
      const li = e.target.closest("li");
      if (li) {
        li.remove();

        const updatedTasks = Array.from(ul.querySelectorAll("li span")).map(
          (span) => span.textContent
        );
        const columnId = ul.dataset.column;
        setLocalStorage(columnId, updatedTasks);
      }
    }
  });
});

cancel.addEventListener("click", () => (modal.style.display = "none"));

taskContainer.forEach((ul) => {
  ul.addEventListener("dragover", (e) => handleDragOver(e));
  ul.addEventListener("drop", handleDragDrop);
  const columnId = ul.dataset.column;
  const tasks = getLocalStorage(columnId) || [];

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.innerHTML = `
    <span>${task}</span>
    <i id="delete" class="fa-regular fa-trash-can delete-btn"></i>
`;

    li.setAttribute("draggable", "true");
    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragend", handleDragEnd);

    addTouchSupport(li);

    ul.appendChild(li);
  });
});
