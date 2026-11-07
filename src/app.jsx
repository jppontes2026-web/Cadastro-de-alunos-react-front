
import { useEffect, useRef, useState } from 'react';

import {
  listarAlunos,
  editarAluno,
  excluirAluno
} from './api.js';

import FormularioAluno from './components/FormularioAluno.jsx';
import ListaAlunos from './components/ListaAlunos.jsx';

export default function App() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [filtro, setFiltro] = useState('');
  const [alunoEditando, setAlunoEditando] = useState(null);

  const consulta = useRef(null);

  // Atualizar lista de alunos
  async function atualizar() {
    consulta.current?.abort();

    const controle = new AbortController();
    consulta.current = controle;

    setCarregando(true);
    setErro('');

    try {
      const lista = await listarAlunos(controle.signal);

      if (!controle.signal.aborted) {
        setAlunos(lista);
      }

    } catch (falha) {
      if (!controle.signal.aborted) {
        setErro(falha.message || 'Confira o backend.');
      }

    } finally {
      if (!controle.signal.aborted) {
        setCarregando(false);
      }
    }
  }

  // Carregar alunos ao abrir a aplicação
  useEffect(() => {
    atualizar();

    return () => consulta.current?.abort();
  }, []);

  // Adicionar aluno
  function adicionar(aluno) {
    consulta.current?.abort();

    setCarregando(false);
    setErro('');

    setAlunos(anteriores => [
      aluno,
      ...anteriores.filter(item => item.id !== aluno.id)
    ]);

    setFiltro('');
  }

  // Selecionar aluno para editar
  function iniciarEdicao(aluno) {
    setAlunoEditando(aluno);
    setErro('');
  }

  // Salvar alterações ou cancelar edição
  async function salvarEdicao(dados) {
    if (dados === null) {
      setAlunoEditando(null);
      setErro('');
      return;
    }

    try {
      await editarAluno(alunoEditando.id, dados);

      setAlunoEditando(null);
      setErro('');

      await atualizar();

    } catch (falha) {
      setErro(falha.message || 'Erro ao editar aluno.');
      throw falha;
    }
  }

  // Excluir aluno
  async function handleExcluir(id) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este aluno?'
    );

    if (!confirmar) return;

    try {
      await excluirAluno(id);

      setAlunos(anteriores =>
        anteriores.filter(aluno => aluno.id !== id)
      );

      setErro('');

      if (alunoEditando?.id === id) {
        setAlunoEditando(null);
      }

    } catch (falha) {
      setErro(falha.message || 'Erro ao excluir aluno.');
    }
  }

  return (
    <main>

      <header>
        <p className="etiqueta">
          AULA PRÁTICA 5 / REACT + API + SQLITE
        </p>

        <h1>
          Da tela ao banco. ☕
          <br />
          <span>Agora com React.</span>
        </h1>

        <p>
          Cadastre alunos, acompanhe a lista e veja
          seus dados persistirem.
        </p>
      </header>

      <div className="painel">

        <FormularioAluno
          aoCadastrar={adicionar}
          alunoEditando={alunoEditando}
          aoAtualizar={salvarEdicao}
        />

        <ListaAlunos
          alunos={alunos}
          carregando={carregando}
          erro={erro}
          atualizar={atualizar}
          filtro={filtro}
          aoFiltrar={setFiltro}
          aoEditar={iniciarEdicao}
          aoExcluir={handleExcluir}
        />

      </div>

      <footer>
        React cuida da interface. Flask valida. SQLite guarda.
      </footer>

    </main>
  );
}
