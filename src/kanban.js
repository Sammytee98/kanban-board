import { format } from "date-fns";
import { setLocalStorage, getLocalStorage } from "./localStorage";

const username = getLocalStorage("username");

const welcomeMessage = document.getElementById("welcome");
const userDate = document.getElementById("date");
const addIcon = document.getElementById("addIcon");
const todoContainer = document.getElementById("todoCon");
const progressContainer = document.getElementById("progressCon");
const reviewContainer = document.getElementById("reviewCon");
const doneContainer = document.getElementById("doneCon");
const modal = document.getElementById("modal");
const cancel = document.getElementById("cancel");
const addTask = document.getElementById("addTask");
const newTask = document.getElementById("newTask");

const formattedName = (name) => {
  const firstLetter = name.slice(0, 1).toLocaleUpperCase();
  const restOfLetter = name.slice(1, name.length).toLocaleLowerCase();
  return firstLetter + restOfLetter;
};

const currDate = new Date();
const formatedDate = format(currDate, "PPPP");

welcomeMessage.textContent = `Welcome to dashboard, ${formattedName(username)}`;
userDate.textContent = formatedDate;

addIcon.addEventListener("click", () => (modal.style.display = "block"));

cancel.addEventListener("click", () => (modal.style.display = "none"));

addTask.addEventListener("submit", (e) => {
  e.preventDefault();
});
