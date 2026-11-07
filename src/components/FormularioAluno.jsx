
import { useEffect, useRef, useState } from 'react';
import { cadastrarAluno } from '../api.js';

const vazio = { nome: '', email: '', curso: '' };

export default function FormularioAluno({
  aoCadastrar,
  alunoEditando,
  aoAtualizar
}) {
  const [campos, setCampos] = useState(vazio);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(false);
  const enviando = useRef(false);

  // Preencher formulário ao selecionar um aluno
  useEffect(() => {
    if (alunoEditando) {
      setCampos({
        nome: alunoEditando.nome,
        email: alunoEditando.email,
        curso: alunoEditando.curso
      });

      setMensagem('Editando aluno...');
      setErro(false);
    } else {
      setCampos(vazio);
      setMensagem('');
    }
  }, [alunoEditando]);

  function alterar(evento) {
    const { name, value } = evento.target;

    setCampos(anteriores => ({
      ...anteriores,
      [name]: value
    }));
  }

  async function enviar(evento) {
    evento.preventDefault();

    if (enviando.current) return;

    enviando.current = true;
    setSalvando(true);
    setErro(false);
    setMensagem('Salvando…');

    try {
      if (alunoEditando) {
        // Atualizar aluno existente
        await aoAtualizar(campos);

        setMensagem('Aluno atualizado com sucesso!');
      } else {
        // Cadastrar novo aluno
        const aluno = await cadastrarAluno(campos);

        aoCadastrar(aluno);

        setCampos(vazio);
        setMensagem('Aluno cadastrado com sucesso!');
      }

    } catch (falha) {
      setErro(true);
      setMensagem(
        falha.message || 'Não foi possível salvar os dados.'
      );

    } finally {
      enviando.current = false;
      setSalvando(false);
    }
  }

  return (
    <section aria-labelledby="titulo-form">

      <p className="etiqueta">01 / CADASTRAR</p>

      <h2 id="titulo-form">
        {alunoEditando ? 'Editar aluno' : 'Novo aluno'}
      </h2>

      <form onSubmit={enviar}>

        <fieldset disabled={salvando}>
          <legend className="sr-only">Dados do aluno</legend>

          <label htmlFor="nome">Nome</label>

          <input
            id="nome"
            name="nome"
            value={campos.nome}
            onChange={alterar}
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
          />

          <label htmlFor="email">E-mail</label>

          <input
            id="email"
            name="email"
            type="email"
            value={campos.email}
            onChange={alterar}
            required
            maxLength={120}
            autoComplete="email"
          />

          <label htmlFor="curso">Curso</label>

          <input
            id="curso"
            name="curso"
            value={campos.curso}
            onChange={alterar}
            required
            minLength={2}
            maxLength={80}
          />

          <button type="submit">
            {salvando
              ? 'Salvando…'
              : alunoEditando
                ? 'Salvar alterações'
                : 'Cadastrar aluno'}
          </button>

          {alunoEditando && (
            <button
              type="button"
              className="secundario"
              onClick={() => aoAtualizar(null)}
            >
              Cancelar edição
            </button>
          )}

        </fieldset>
      </form>

      <p
        role="status"
        aria-live="polite"
        className={erro ? 'mensagem erro' : 'mensagem'}
      >
        {mensagem}
      </p>

    </section>
  );
}
