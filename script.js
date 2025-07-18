const form = document.querySelector("#form");
const inputDescricao = document.querySelector("#descricao");
const selectPrioridade = document.querySelector("#prioridade");
const listaTarefas = document.querySelector("#listaTarefas");

document.addEventListener("DOMContentLoaded", carregarTarefas);

form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const descricao = inputDescricao.value.trim();
  const prioridade = selectPrioridade.value;

  if (!descricao) {
    const alerta = document.getElementById("alertaTarefaDescricao");
    alerta.classList.remove("d-none");
    setTimeout(() => {
      alerta.classList.add("d-none");
    }, 5000);
    return;
  }

  if (!prioridade) {
    const alerta = document.getElementById("alertaTarefaPrioridade");
    alerta.classList.remove("d-none");
    setTimeout(() => {
      alerta.classList.add("d-none");
    }, 5000);
    return;
  }

  const tarefa = {
    descricao,
    prioridade,
    concluida: false,
  };

  adicionarTarefaNaTabela(tarefa);
  salvarTarefaNoLocalStorage(tarefa);

  inputDescricao.value = "";
  selectPrioridade.value = "";
});

function adicionarTarefaNaTabela(tarefa) {
  const linha = document.createElement("tr");

  const colunaDescricao = document.createElement("td");
  colunaDescricao.textContent = tarefa.descricao;
  colunaDescricao.classList.add("descricao-tarefa");
  if (tarefa.concluida) {
    colunaDescricao.classList.add("text-muted");
  } else {
    colunaDescricao.classList.add("fw-bold");
  }

  const colunaPrioridade = document.createElement("td");
  const spanBadge = document.createElement("span");

  if (tarefa.prioridade === "Alta") {
    spanBadge.className = "badge bg-danger ";
    spanBadge.textContent = "Alta";
  } else if (tarefa.prioridade === "Média") {
    spanBadge.className = "badge bg-warning text-dark";
    spanBadge.textContent = "Média";
  } else {
    spanBadge.className = "badge bg-success";
    spanBadge.textContent = "Baixa";
  }

  colunaPrioridade.appendChild(spanBadge);

  const colunaAcao = document.createElement("td");

  const botaoConcluir = document.createElement("button");
  botaoConcluir.innerHTML = tarefa.concluida
    ? '<i class="bi bi-check-circle-fill me-1"></i>Concluída'
    : '<i class="bi bi-circle me-1"></i>A Concluir';

  botaoConcluir.className = tarefa.concluida
    ? "btn btn-secondary btn-sm"
    : "btn btn-success btn-sm";

  if (tarefa.concluida) {
    botaoConcluir.disabled = true;
  }

  botaoConcluir.addEventListener("click", function () {
    tarefa.concluida = true;
    colunaDescricao.classList.remove("fw-bold");
    colunaDescricao.classList.add("text-muted");

    botaoConcluir.innerHTML =
      '<i class="bi bi-check-circle-fill me-1"></i>Concluída';
    botaoConcluir.className = "btn btn-secondary btn-sm";
    botaoConcluir.disabled = true;

    atualizarTarefasNoLocalStorage();
  });

  const botaoRemover = document.createElement("button");
  botaoRemover.innerHTML = '<i class="bi bi-trash3-fill me-1"></i>Remover';
  botaoRemover.className = "btn btn-danger btn-sm ms-2";

  botaoRemover.addEventListener("click", function () {
    linha.remove();
    removerTarefaDoLocalStorage(tarefa);
  });

  colunaAcao.appendChild(botaoConcluir);
  colunaAcao.appendChild(botaoRemover);

  linha.appendChild(colunaDescricao);
  linha.appendChild(colunaPrioridade);
  linha.appendChild(colunaAcao);

  listaTarefas.appendChild(linha);
}

function obterTarefasDoLocalStorage() {
  return JSON.parse(localStorage.getItem("tarefas")) || [];
}

function salvarTarefaNoLocalStorage(tarefa) {
  const tarefas = obterTarefasDoLocalStorage();
  tarefas.push(tarefa);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function atualizarTarefasNoLocalStorage() {
  const linhas = listaTarefas.querySelectorAll("tr");
  const tarefasAtualizadas = [];

  linhas.forEach((linha) => {
    const descricao = linha.children[0].textContent;
    const prioridade = linha.children[1].textContent;
    const concluida = linha.children[0].classList.contains("text-muted");

    tarefasAtualizadas.push({ descricao, prioridade, concluida });
  });

  localStorage.setItem("tarefas", JSON.stringify(tarefasAtualizadas));
}

function carregarTarefas() {
  const tarefas = obterTarefasDoLocalStorage();
  tarefas.forEach((tarefa) => adicionarTarefaNaTabela(tarefa));
}
