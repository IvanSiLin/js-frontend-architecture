import uniqueId from 'lodash/uniqueId.js';

// BEGIN
export default function render() {

  const listsContainer = document.querySelector('[data-container="lists"]');
  const tasksContainer = document.querySelector('[data-container="tasks"]');

  const lists = [{ name: 'General', id: uniqueId(), tasks: [] }];
  

  function renderLists() {

    listsContainer.innerHTML = '';
    const ul = document.createElement('ul');
    lists.forEach((list) => {

      const li = document.createElement('li');
      if (list.id === activeListId) {

        const b = document.createElement('b');
        b.textContent = list.name;
        li.appendChild(b);

      } else {

        const a = document.createElement('a');
        a.href = `#${list.id}`;
        a.textContent = list.name;
        li.appendChild(a);
      }
      ul.appendChild(li);
    });
    listsContainer.appendChild(ul);
  }
  

  function renderTasks() {

    tasksContainer.innerHTML = '';
    const ul = document.createElement('ul');
    const activeList = lists.find((list) => list.id === activeListId);

    if (activeList) {

      activeList.tasks.forEach((task) => {

        const li = document.createElement('li');
        li.textContent = task;
        ul.appendChild(li);
      });
    }

    if (ul.innerHTML.length !== 0){

      tasksContainer.appendChild(ul);
    }
  }

  function addList(event) {

    event.preventDefault();
    const input = event.target.elements.name;
    const newListName = input.value.trim();

    if (newListName === '') {

      return;
    }

    const existingList = lists.find((list) => list.name === newListName);
    if (existingList) {

      input.value = '';
      return;
    }

    const newList = { name: newListName, id: uniqueId(), tasks: [] };
    lists.push(newList);
    renderLists();
    input.value = '';
  }

  function addTask(event) {

    event.preventDefault();
    const input = event.target.elements.name;
    const newTaskName = input.value.trim();

    if (newTaskName === '') {

      return;
    }

    const activeList = lists.find((list) => list.id === activeListId);

    if (activeList) {

      activeList.tasks.push(newTaskName);
      renderTasks();
      
      input.value = '';
    }
  }

  function setActiveList(listId) {

    activeListId = listId;
    renderLists();
    renderTasks();
  }

  let activeListId = lists[0].id;

  listsContainer.addEventListener('click', (event) => {

    event.preventDefault();
    const target = event.target;
    if (target.tagName === 'A') {

      const listId = target.getAttribute('href').substring(1);
      const listExists = lists.some((list) => list.id === listId);

      if (listExists) {

        setActiveList(listId);
      }
    }
  });

  tasksContainer.addEventListener('click', (event) => {

    event.preventDefault();
    const target = event.target;
    if (target.tagName === 'LI') {
      
    }
  });

  const newListForm = document.querySelector('[data-container="new-list-form"]');
  newListForm.addEventListener('submit', addList);

  const newTaskForm = document.querySelector('[data-container="new-task-form"]');
  newTaskForm.addEventListener('submit', addTask);

  renderLists();
  renderTasks();
}
// END

