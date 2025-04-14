import { setLocalStorage } from "./localStorage";

let touchStartItem = null;
let startTouchY = 0;

export const addTouchSupport = (item) => {
  item.addEventListener("touchstart", (e) => {
    touchStartItem = item;
    startTouchY = e.touches[0].clientY;
    setTimeout(() => (item.style.visibity = "hidden"), 0);
  });

  item.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const overElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = overElement?.closest("ul[data-column]");
    const draggingOverItem = overElement?.closest("li.task-item");

    if (dropZone && touchStartItem && !dropZone.contains(touchStartItem)) {
      dropZone.appendChild(touchStartItem);
    } else if (draggingOverItem && draggingOverItem !== touchStartItem) {
      const bounding = draggingOverItem.getBoundingClientRect();
      const offset = touch.clientY - bounding.top;

      if (offset < bounding.height / 2) {
        draggingOverItem.parentNode.insertBefore(
          touchStartItem,
          draggingOverItem
        );
      } else {
        draggingOverItem.parentNode.insertBefore(
          touchStartItem,
          draggingOverItem.nextSibling
        );
      }
    }
  });

  item.addEventListener("touchend", (e) => {
    if (touchStartItem) {
      touchStartItem.style.visibity = "visible";

      const parent = touchStartItem.closest("ul[data-column]");
      const columnId = parent.dataset.column;
      const updatedTasks = Array.from(parent.querySelectorAll("li span")).map(
        (span) => span.textContent
      );
      setLocalStorage(columnId, updatedTasks);

      touchStartItem = null;
    }
  });
};
