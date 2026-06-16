// === Captura dos elementos ===
const taskInput = document.getElementById('taskInput');
const addBtn    = document.getElementById('addBtn');
const taskList  = document.getElementById('taskList');
const counter   = document.getElementById('counter');
const emptyMsg  = document.getElementById('emptyMsg');

// === Carrega tarefas salvas no localStorage ===
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Renderiza as tarefas salvas ao iniciar a página
tasks.forEach(task => renderTask(task));
updateUI();

// === Eventos ===
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addTask();
});

// === Funções ===

function addTask() {
  const text = taskInput.value.trim();

  // Validação: impede tarefa vazia
  if (!text) {
    taskInput.focus();
    taskInput.style.borderColor = '#D4596E';
    setTimeout(() => { taskInput.style.borderColor = ''; }, 800);
    return;
  }

  const task = { id: Date.now(), text, completed: false };
  tasks.push(task);
  saveTasks();
  renderTask(task);

  // Limpa o input após adicionar
  taskInput.value = '';
  taskInput.focus();

  updateUI();
}

function renderTask(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;
  if (task.completed) li.classList.add('completed');

  // Texto clicável (marcar como concluída)
  const span = document.createElement('span');
  span.classList.add('task-text');
  span.textContent = task.text;
  span.addEventListener('click', () => toggleTask(task.id, li));

  // Botão excluir
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = 'Excluir';
  deleteBtn.addEventListener('click', () => removeTask(task.id, li));

  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

function toggleTask(id, li) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  li.classList.toggle('completed');
  saveTasks();
  updateUI();
}

function removeTask(id, li) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  li.remove();
  updateUI();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateUI() {
  const pending = tasks.filter(t => !t.completed).length;
  counter.textContent = `${pending} tarefa(s) pendente(s)`;

  if (tasks.length === 0) {
    emptyMsg.classList.remove('hidden');
  } else {
    emptyMsg.classList.add('hidden');
  }
}
