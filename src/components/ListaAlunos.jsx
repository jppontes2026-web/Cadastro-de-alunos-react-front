
export default function ListaAlunos({
  alunos,
  carregando,
  erro,
  atualizar,
  filtro,
  aoFiltrar,
  aoEditar,
  aoExcluir
}) {
  const visiveis = alunos.filter(aluno =>
    aluno.nome.toLocaleLowerCase('pt-BR').includes(filtro.toLocaleLowerCase('pt-BR')),
  );

  return (
    <section aria-labelledby="titulo-lista" aria-busy={carregando}>
      <p className="etiqueta">02 / CONSULTAR</p>

      <div className="cabecalho-lista">
        <h2 id="titulo-lista">
          Alunos <span className="contador">{alunos.length}</span>
        </h2>

        <button
          type="button"
          className="secundario"
          onClick={atualizar}
          disabled={carregando}
        >
          {carregando ? 'Carregando…' : 'Atualizar lista'}
        </button>
      </div>

      <label htmlFor="filtro">Filtrar por nome</label>

      <input
        id="filtro"
        type="search"
        value={filtro}
        onChange={e => aoFiltrar(e.target.value)}
        placeholder="Digite parte do nome"
      />

      {erro && <p role="alert" className="erro">{erro}</p>}

      {carregando && <p role="status">Consultando o banco…</p>}

      {!carregando && !erro && alunos.length === 0 &&
        <p>Nenhum aluno cadastrado ainda.</p>
      }

      {alunos.length > 0 && visiveis.length === 0 &&
        <p>Nenhum nome corresponde ao filtro.</p>
      }

      <ul>
        {visiveis.map(aluno => (
          <li key={aluno.id}>
            <strong>{aluno.nome}</strong>

            <span>{aluno.email}</span>

            <span className="curso">{aluno.curso}</span>

            <div className="acoes-aluno">
              <button
                type="button"
                className="secundario"
                onClick={() => aoEditar(aluno)}
              >
                Editar
              </button>

              <button
                type="button"
                className="excluir"
                onClick={() => aoExcluir(aluno.id)}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
