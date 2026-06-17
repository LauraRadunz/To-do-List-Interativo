// === Captura dos elementos do DOM ===
// Seleciona os elementos da página para interagir com o usuário
const campoTarefa   = document.getElementById('taskInput');
const botaoAdicionar = document.getElementById('addBtn');
const listaTarefas  = document.getElementById('taskList');
const contador      = document.getElementById('counter');
const msgVazia      = document.getElementById('emptyMsg');

// === Inicialização de Dados ===
// Carrega as tarefas salvas. Se não houver nada, começa com uma lista vazia.
let minhasTarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

// Renderiza na tela as tarefas que já estavam salvas
minhasTarefas.forEach(tarefa => renderizarTarefa(tarefa));
atualizarInterface(); 

// === Configuração de Eventos ===
// Adiciona ação ao clique do botão
botaoAdicionar.addEventListener('click', adicionarTarefa);

// Adiciona ação ao pressionar a tecla "Enter" no campo de texto
campoTarefa.addEventListener('keydown', function (evento) {
  if (evento.key === 'Enter') adicionarTarefa();
});

// === Funções Principais ===

function adicionarTarefa() {
  const texto = campoTarefa.value.trim(); // Remove espaços extras

  // Validação: se o texto estiver vazio, destaca o campo e para a execução
  if (!texto) {
    campoTarefa.focus();
    campoTarefa.style.borderColor = '#D4596E';
    setTimeout(() => { campoTarefa.style.borderColor = ''; }, 800);
    return;
  }

  // Cria o objeto da nova tarefa
  const novaTarefa = { id: Date.now(), texto: texto, concluida: false };
  
  minhasTarefas.push(novaTarefa); // Adiciona ao array principal
  salvarNoLocalStorage();         // Salva no banco do navegador
  renderizarTarefa(novaTarefa);   // Exibe na tela

  campoTarefa.value = ''; // Limpa o campo
  campoTarefa.focus();    // Foca de volta para facilitar nova digitação
  atualizarInterface();   // Atualiza contador e avisos
}

function renderizarTarefa(tarefa) {
  const itemLista = document.createElement('li'); // Cria o <li>
  itemLista.dataset.id = tarefa.id;              // Define o ID único
  if (tarefa.concluida) itemLista.classList.add('completed');

  const spanTexto = document.createElement('span'); // Cria o texto da tarefa
  spanTexto.classList.add('task-text');
  spanTexto.textContent = tarefa.texto;
  // Ao clicar no texto, altera o estado entre concluído/pendente
  spanTexto.addEventListener('click', () => alternarStatus(tarefa.id, itemLista));

  const botaoExcluir = document.createElement('button'); // Cria botão excluir
  botaoExcluir.classList.add('delete-btn');
  botaoExcluir.textContent = 'Excluir';
  // Ao clicar no botão, remove a tarefa
  botaoExcluir.addEventListener('click', () => removerTarefa(tarefa.id, itemLista));

  itemLista.appendChild(spanTexto);
  itemLista.appendChild(botaoExcluir);
  listaTarefas.appendChild(itemLista);
}

function alternarStatus(id, itemLista) {
  const tarefa = minhasTarefas.find(t => t.id === id); // Localiza a tarefa
  if (!tarefa) return;
  
  tarefa.concluida = !tarefa.concluida; // Inverte o status
  itemLista.classList.toggle('completed'); // Alterna o estilo CSS
  salvarNoLocalStorage();
  atualizarInterface();
}

function removerTarefa(id, itemLista) {
  // Remove do array usando filter (mantém todos, menos o que tem o ID clicado)
  minhasTarefas = minhasTarefas.filter(t => t.id !== id);
  salvarNoLocalStorage();
  itemLista.remove(); // Remove da tela
  atualizarInterface();
}

function salvarNoLocalStorage() {
  // Converte o array para formato texto (JSON) e guarda no navegador
  localStorage.setItem('tarefas', JSON.stringify(minhasTarefas));
}

function atualizarInterface() {
  // Conta apenas as que estão pendentes
  const pendentes = minhasTarefas.filter(t => !t.concluida).length;
  contador.textContent = `${pendentes} tarefa(s) pendente(s)`;

  // Mostra ou esconde a mensagem de lista vazia
  if (minhasTarefas.length === 0) {
    msgVazia.classList.remove('hidden');
  } else {
    msgVazia.classList.add('hidden');
  }
}