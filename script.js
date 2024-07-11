const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemFilter = document.getElementById('filter');
const clearBtn = document.getElementById('clear');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach(item => addItemToDOM(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(capsFirstLetter(itemToEdit.textContent));
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem.toLowerCase())) {
      alert('That item already is in the list');
      return;
    }
  }
  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);
  
  checkUI();

  itemInput.value = '';
}

function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(capsFirstLetter(item)));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  itemList.appendChild(li);
}

function capsFirstLetter(sentence) {
  const splitSent = sentence.toLowerCase().split(" ");
  for (let i = 0; i < splitSent.length; i++) {
    splitSent[i] = splitSent[i][0].toUpperCase() + splitSent[i].slice(1);
  }
  return splitSent.join(" ");
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);
  // COnvert to JSON string and set to local storage
  localStorage.setItem('items', capsFirstLetter(JSON.stringify(itemsFromStorage)));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(capsFirstLetter(localStorage.getItem('items')));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();

  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = capsFirstLetter(item.textContent);
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent.toLowerCase());

    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while(itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // Clear from localStorage
  localStorage.removeItem('items');
  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = capsFirstLetter(e.target.value);

  items.forEach(item => {
    const itemName = capsFirstLetter(item.firstChild.textContent);
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });

}

function checkUI() {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i>  Add Item';
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  checkUI();
}

init();