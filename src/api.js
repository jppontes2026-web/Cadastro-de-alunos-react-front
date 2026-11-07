
export async function requisitar(caminho, opcoes = {}) {
  const resposta = await fetch(caminho, opcoes);

  const dados = await resposta.json().catch(() => {
    throw new Error(
      'Resposta inesperada. Confira o backend e o proxy do Vite.'
    );
  });

  if (!resposta.ok) {
    throw new Error(
      dados.erro || dados.mensagem || 'Não foi possível concluir a operação.'
    );
  }

  return dados;
}

export function listarAlunos(signal) {
  return requisitar('/api/alunos', { signal });
}

export function cadastrarAluno(dados) {
  return requisitar('/api/alunos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados),
  });
}

export function editarAluno(id, dados) {
  return requisitar(`/api/alunos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
}

export function excluirAluno(id) {
  return requisitar(`/api/alunos/${id}`, {
    method: 'DELETE'
  });
}
