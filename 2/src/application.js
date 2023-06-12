import axios from 'axios';

const routes = {
  tasksPath: () => '/api/tasks',
};

// BEGIN
export default async function todo() {
  
  const form = document.querySelector('form');
  const input = document.querySelector('input[name="name"]');
  const ul = document.getElementById('tasks');


  function addTask(task) {

    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.textContent = task.name;
  
    const existingTasks = Array.from(ul.children);
    const indexToInsert = existingTasks.findIndex((existingTask) => existingTask.textContent > task.name);
  
    if (indexToInsert === -1) {

      ul.appendChild(li);
    } else {

      ul.insertBefore(li, existingTasks[indexToInsert]);
    }
  }
  
  async function loadTasks() {

    try {

      const response = await axios.get(routes.tasksPath());
      const tasks = response.data.items;
      tasks.forEach((task) => addTask(task));
    } catch (error) {

      console.error('Error loading tasks:', error);
    }
  }

  async function addTaskHandler(event) {

    event.preventDefault();
    const taskName = input.value;
    if (!taskName) return;

    try {

      const response = await axios.post(routes.tasksPath(), { name: taskName });

      if (response.status === 201) {

        const newTask = { name: taskName };
        addTask(newTask);
        input.value = '';
      }

    } catch (error) {

      console.error('Error adding task:', error);
    }
  }

  form.addEventListener('submit', addTaskHandler);


  await loadTasks();
}
// END