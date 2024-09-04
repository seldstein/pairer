import { createElement, getById, onEnter, sortObjects, appendChildren } from "./_functions.js";

// Grab allLists from local storage
export const allLists = JSON.parse(localStorage.getItem("All Lists")) || [];
// Grab some elements
const [listOfLists, renderedLists, firstSelect, secondSelect] = getById(
  "list-of-lists",
  "rendered-lists",
  "first-select",
  "second-select"
);

// Render all lists on page load
renderAllLists();

// Render all lists
export function renderAllLists() {
  // Clear the whole thing first to prevent duplicates (definitely not the most efficient way to do this)
  listOfLists.innerHTML = "";

  // Sort allLists by name
  // This is inside this function because renderAllLists is called elsewhere, and we want to make sure it's sorted every time
  sortObjects(allLists, "name");

  // Loop through every object in allLists and turn each one into a details element
  for (let list of allLists) {
    // Create some elements
    const [detailsEl, summary, newItemInput, deleteListBtn, listEl, container] =
      createElement("details", "summary", "input", "button", "ul", "div");

    summary.textContent = list.name;

    // Add a placeholder to the new item input
    newItemInput.placeholder = "Add list item";

    // Render loop through the list array in each object 
    for (let item of list.list.sort()) {
      const [itemEl, itemText, deleteItemBtn] = createElement(
        "li",
        "div",
        "button"
      );

      // Delete list item button properties
      Object.assign(deleteItemBtn, {
        classList: ["delete-item"],
        type: "button",
        textContent: "Delete Item",
      });

      // Delete list item button logic
      deleteItemBtn.onclick = function () {
        itemEl.remove();
        const index = list.list.indexOf(item);
        list.list.splice(index, 1);
        localStorage.setItem("All Lists", JSON.stringify(allLists));
        renderOptions();
      };

      // Build li element
      itemText.textContent = item;
      itemEl.appendChild(deleteItemBtn);
      itemEl.appendChild(itemText);
      // Add li to ul element
      listEl.appendChild(itemEl);
    }

    appendChildren(container, [newItemInput, deleteListBtn]);
    appendChildren(detailsEl, [summary, container, listEl]);

    // container.appendChild(newItemInput);
    // container.appendChild(deleteListBtn);

    // detailsEl.appendChild(summary);
    // detailsEl.appendChild(container);
    // detailsEl.appendChild(listEl);

    // Add new items to the list
    onEnter(newItemInput, function () {
      // Update list array
      // (List is the key in the list object(stored in allLists), and also the parameter in this loop. A bit confusing.)
      list.list.push(newItemInput.value);

      // Create li
      const itemEl = document.createElement("li");
      // Give it some content
      itemEl.textContent = newItemInput.value;
      // Add the list item to the list
      listEl.appendChild(itemEl);
      // Clear the input
      newItemInput.value = "";
      // Update allLists in local storage
      localStorage.setItem("All Lists", JSON.stringify(allLists));
    });

    // Delete list button
    Object.assign(deleteListBtn, {
      type: "button",
      textContent: "Delete List",
    });
    // Delete list button logic
    deleteListBtn.onclick = function () {
      detailsEl.remove();
      // Remove from local storage
      const index = allLists.findIndex((item) => item.name === list.name);
      if (index !== -1) {
        allLists.splice(index, 1);
        localStorage.setItem("All Lists", JSON.stringify(allLists));
        renderAllLists();
      }
      console.log(localStorage);
    };

    // Create fragment might be useful here
    listOfLists.appendChild(detailsEl);
  }

  renderOptions();
}

export function renderOptions() {
  // As with allLists, clearing the whole thing is probably not the best way to do this
  renderedLists.innerHTML = "";
  // Add a default option
  const defaultOption = `<option value="">--Choose list--</option>`;
  firstSelect.innerHTML = defaultOption;
  secondSelect.innerHTML = defaultOption;
  // Render saved lists as options
  for (let list of allLists) {
    const option = `<option>${list.name}</option>`;
    firstSelect.innerHTML += option;
    secondSelect.innerHTML += option;
  }
}
