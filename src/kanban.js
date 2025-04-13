import { format } from "date-fns";
import { setLocalStorage, getLocalStorage } from "./localStorage";

const username = getLocalStorage("username");

const welcomeMessage = document.querySelector("#welcome");
const userDate = document.querySelector("#date");
const modal = document.querySelector("#modal");
const cancel = document.querySelector("#cancel");
const taskForm = document.querySelector("#newTaskForm");
const taskContainer = document.querySelectorAll("ul[data-column]");
const addIcon = document.querySelectorAll(".add-icon");
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

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTaskInput = document.querySelector("#newTaskInput");
  const taskValue = newTaskInput.value.trim();

  if (!taskValue) return;

  const targetUI = document.querySelector(`ul[data-column="${currentStatus}"]`);

  const newList = document.createElement("li");
  newList.innerHTML = `
                <span>${taskValue}</span>
                <i id="delete" class="fa-regular fa-trash-can delete-btn"></i>
  `;

  targetUI.appendChild(newList);

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
  const columnId = ul.dataset.column;
  const tasks = getLocalStorage(columnId) || [];

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <span>${task}</span>
    <i id="delete" class="fa-regular fa-trash-can delete-btn"></i>
`;
    ul.appendChild(li);
  });
});
