import { setLocalStorage, getLocalStorage } from "./localStorage";

const form = document.getElementById("form");
const input = document.getElementById("name");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = input.value;
  if (input) {
    setLocalStorage("username", inputValue);
    window.location.href = "/home";
  } else {
    alert("Please enter your name!");
  }
});
