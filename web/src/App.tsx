import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import {
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  Gamepad2,
  Github,
  Menu,
  ShieldCheck,
  Star,
  UploadCloud,
  Users,
  X,
  XCircle,
} from 'lucide-react'
import {
  Link,
  NavLink,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'
import { api, type Game, type GameRank, type PlayerRank } from './api'
import './styles.css'

function Header() {
  const [open, setOpen] = useState(false)
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    api.health().then(() => setOnline(true)).catch(() => setOnline(false))
  }, [])

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/">
          <span>RECREIO</span>
          <strong>ARCADE</strong>
        </Link>

        <nav className={`main-nav ${open ? 'main-nav--open' : ''}`}>
          <NavLink to="/catalogo" onClick={() => setOpen(false)}>Catálogo</NavLink>
          <NavLink to="/ranking/jogadores" onClick={() => setOpen(false)}>Jogadores</NavLink>
          <NavLink to="/ranking/jogos" onClick={() => setOpen(false)}>Jogos</NavLink>
          <NavLink to="/enviar" onClick={() => setOpen(false)}>Enviar</NavLink>
          <NavLink to="/moderacao" onClick={() => setOpen(false)}>Curadoria</NavLink>
        </nav>

        <div className="header-status">
          <span className={`status-dot ${online === true ? 'is-online' : online === false ? 'is-offline' : ''}`} />
          <span>{online === true ? 'API ONLINE' : online === false ? 'API OFFLINE' : 'API...'}</span>
        </div>

        <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>RECREIO ARCADE • PORTAL G2</span>
      <span>Dados e rankings vêm da API da plataforma</span>
    </footer>
  )
}

function Layout({ title, eyebrow, children }: { title: string; eyebrow?: string; children: ReactNode }) {
  return (
    <div className="app-shell">
      <Header />
      <main className="page">
        <div className="page-heading">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
        </div>
        {children}
      </main>
      <Footer />
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="message message--error">
      <XCircle size={22} />
      <div><strong>Não foi possível consultar a API.</strong><p>{message}</p></div>
    </div>
  )
}

function Loading() {
  return <div className="panel panel--center">CONSULTANDO API...</div>
}

function GameCard({ game }: { game: Game }) {
  return (
    <Link className="game-card" to={`/jogos/${game.id}`}>
      <div className="game-card__art">
        {game.capa ? <img src={game.capa} alt="" /> : <Gamepad2 size={48} />}
        <span>APROVADO</span>
      </div>
      <div className="game-card__body">
        <h2>{game.nome}</h2>
        <p>{game.autores.join(' • ')}</p>
        <div className="game-card__meta">
          <span>{game.tema}</span>
          <span>{game.nivel}</span>
        </div>
        <div className="rating"><Star size={15} fill="currentColor" /> {game.nota_media.toFixed(1)}/5 <small>({game.votos} votos)</small></div>
      </div>
    </Link>
  )
}

function Catalogo() {
  const [games, setGames] = useState<Game[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.jogos().then(setGames).catch((e) => setError(e.message))
  }, [])

  return (
    <Layout title="CATÁLOGO" eyebrow="PLATAFORMA DE GESTÃO">
      <section className="panel">
        <div className="section-head">
          <div>
            <span className="eyebrow"><Gamepad2 size={15} /> JOGOS APROVADOS</span>
            <p>Somente versões aprovadas pela curadoria são publicadas aqui.</p>
          </div>
          <Link className="arcade-button arcade-button--yellow" to="/enviar"><UploadCloud size={17} /> ENVIAR JOGO</Link>
        </div>
        {error ? <ErrorBox message={error} /> : games.length === 0 ? <Loading /> : <div className="game-grid">{games.map((game) => <GameCard key={game.id} game={game} />)}</div>}
      </section>
    </Layout>
  )
}

function Detalhes() {
  const { id } = useParams()
  const [game, setGame] = useState<Game | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) api.jogo(id).then(setGame).catch((e) => setError(e.message))
  }, [id])

  if (error) return <Layout title="DETALHES"><ErrorBox message={error} /></Layout>
  if (!game) return <Layout title="DETALHES"><Loading /></Layout>

  return (
    <Layout title={game.nome} eyebrow="DETALHE DO JOGO">
      <section className="panel">
        <Link className="back-link" to="/catalogo"><ChevronLeft size={18} /> VOLTAR AO CATÁLOGO</Link>
        <div className="detail-grid">
          <div className="detail-cover">{game.capa ? <img src={game.capa} alt="" /> : <Gamepad2 size={76} />}<span>V{game.versao}</span></div>
          <div>
            <div className="tag-row"><span>{game.tema}</span><span>{game.nivel}</span><span>{game.classico_referencia || 'Clássico não informado'}</span></div>
            <h2 className="detail-title">{game.nome}</h2>
            <p className="lead">{game.resumo}</p>
            <div className="detail-meta">
              <span><Users size={16} /> {game.autores.join(', ')}</span>
              <span><Star size={16} /> {game.nota_media.toFixed(1)}/5 • {game.votos} votos</span>
            </div>
            <h3>Descrição</h3><p>{game.descricao}</p>
            <h3>Mecânica</h3><p>{game.mecanica || 'Não informado pela API.'}</p>
            <h3>Controles</h3><p className="code-like">{game.controles}</p>
            {game.repositorio_url && <a className="external-link" href={game.repositorio_url} target="_blank" rel="noreferrer"><Github size={17} /> REPOSITÓRIO <ExternalLink size={14} /></a>}
          </div>
        </div>

        <div className="detail-section">
          <h3>VERSÕES</h3>
          <div className="version-list">{(game.versoes || []).map((version) => <div className="version-row" key={version.id}><strong>v{version.versao}</strong><span className={`badge badge--${version.estado}`}>{version.estado}</span><small>{new Date(version.submetido_em).toLocaleDateString('pt-BR')}</small>{version.justificativa && <span>{version.justificativa}</span>}</div>)}</div>
        </div>

        <div className="detail-grid detail-grid--secondary">
          <div className="detail-section">
            <h3>FEEDBACK DOS JOGADORES</h3>
            {(game.feedbacks || []).length === 0 ? <p>Nenhum feedback recebido.</p> : (game.feedbacks || []).map((feedback, index) => <article className="feedback" key={`${feedback.apelido}-${index}`}><div><strong>{feedback.nota}/5</strong> • {feedback.apelido}</div><p>{feedback.comentario || 'Sem comentário.'}</p></article>)}
          </div>
          <div className="detail-section">
            <h3>TAXA DE ACERTO POR TEMA</h3>
            {(game.taxa_acerto_tema || []).map((item) => <div className="accuracy-row" key={item.tema}><span>{item.tema}</span><strong>{item.taxa.toFixed(1)}%</strong></div>)}
          </div>
        </div>
      </section>
    </Layout>
  )
}

function Enviar() {
  const [form, setForm] = useState({ nome: '', versao: '1.0.0', descricao: '', resumo: '', autores: '', controles: '', repositorio_url: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  function update(field: keyof typeof form, value: string) { setForm((current) => ({ ...current, [field]: value })) }

  async function submit(event: FormEvent) {
    event.preventDefault(); setState('sending'); setMessage('')
    try {
      await api.submeterJogo({ ...form, autores: form.autores.split(',').map((value) => value.trim()).filter(Boolean) })
      setState('success'); setMessage('Submissão enviada. O jogo entrou na fila de curadoria.');
      setForm({ nome: '', versao: '1.0.0', descricao: '', resumo: '', autores: '', controles: '', repositorio_url: '' })
    } catch (error) { setState('error'); setMessage(error instanceof Error ? error.message : 'Erro ao enviar a submissão.') }
  }

  return (
    <Layout title="ENVIAR JOGO" eyebrow="SUBMISSÃO">
      <section className="panel">
        <div className="section-head">
          <div><span className="eyebrow"><Github size={15} /> NOVO FLUXO</span><p>O G2 coleta os metadados e envia a URL do repositório para a API da plataforma. Validação e persistência não pertencem ao Portal.</p></div>
        </div>
        {state === 'success' && <div className="message message--success"><CheckCircle2 size={22} /> {message}</div>}
        {state === 'error' && <ErrorBox message={message} />}
        <form className="form-grid" onSubmit={submit}>
          <label>NOME DO JOGO<input value={form.nome} onChange={(e) => update('nome', e.target.value)} required /></label>
          <label>VERSÃO<input value={form.versao} onChange={(e) => update('versao', e.target.value)} placeholder="1.0.0" required /></label>
          <label className="field--wide">URL DO REPOSITÓRIO GITHUB<input type="url" value={form.repositorio_url} onChange={(e) => update('repositorio_url', e.target.value)} placeholder="https://github.com/usuario/repositorio" pattern="https://(www\\.)?github\\.com/.+/.+" required /><small>Fluxo confirmado pelo professor: o jogo é referenciado pelo repositório GitHub.</small></label>
          <label>AUTOR(ES)<input value={form.autores} onChange={(e) => update('autores', e.target.value)} placeholder="Autor 1, Autor 2" required /></label>
          <label>CONTROLES<textarea value={form.controles} onChange={(e) => update('controles', e.target.value)} required /></label>
          <label className="field--wide">RESUMO<textarea value={form.resumo} onChange={(e) => update('resumo', e.target.value)} required /></label>
          <label className="field--wide">DESCRIÇÃO<textarea value={form.descricao} onChange={(e) => update('descricao', e.target.value)} required /></label>
          <div className="form-actions field--wide"><button className="arcade-button arcade-button--yellow" disabled={state === 'sending'}>{state === 'sending' ? 'ENVIANDO...' : 'ENVIAR PARA CURADORIA'}</button></div>
        </form>
      </section>
    </Layout>
  )
}

function Moderacao() {
  const [games, setGames] = useState<Game[]>([])
  const [selected, setSelected] = useState<Game | null>(null)
  const [justificativa, setJustificativa] = useState('')
  const [curador, setCurador] = useState('CURADOR')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    try { setGames(await api.decisoesPendentes()); setError('') } catch (e) { setError(e instanceof Error ? e.message : 'Erro ao carregar a fila.') }
  }
  useEffect(() => { load() }, [])

  async function decide(decisao: 'aprovado' | 'reprovado') {
    if (!selected) return
    if (decisao === 'reprovado' && !justificativa.trim()) { setMessage('A reprovação exige justificativa.'); return }
    const versionId = selected.versoes?.[0]?.id
    if (!versionId) { setMessage('A API não informou o identificador da versão.'); return }
    try {
      await api.decidirVersao(versionId, { decisao, justificativa: justificativa.trim(), curador })
      setMessage(`Decisão registrada: ${decisao}.`); setSelected(null); setJustificativa(''); await load()
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Erro ao registrar decisão.') }
  }

  return (
    <Layout title="CURADORIA" eyebrow="PAINEL DO CURADOR">
      {error && <ErrorBox message={error} />}
      <section className="moderation-layout">
        <div className="panel moderation-list">
          <div className="section-head"><div><span className="eyebrow"><ShieldCheck size={15} /> FILA</span><p>Somente versões submetidas aguardam decisão.</p></div></div>
          {games.length === 0 ? <p>Nenhum jogo pendente.</p> : games.map((game) => <button className={`queue-item ${selected?.id === game.id ? 'is-selected' : ''}`} key={game.id} onClick={() => setSelected(game)}><strong>{game.nome}</strong><span>v{game.versao} • {game.autores.join(', ')}</span></button>)}
        </div>

        <div className="panel moderation-preview">
          {!selected ? <div className="empty-preview">SELECIONE UM JOGO PARA ANALISAR</div> : <>
            <div className="preview-head"><div><span className="eyebrow">PREVIEW DE CURADORIA</span><h2>{selected.nome}</h2></div><a className="external-link" href={selected.repositorio_url} target="_blank" rel="noreferrer"><Github size={16} /> REPOSITÓRIO</a></div>
            {selected.preview_url ? <iframe className="preview-frame" title={`Preview de ${selected.nome}`} src={selected.preview_url} sandbox="allow-scripts allow-forms" /> : <div className="preview-unavailable"><Gamepad2 size={46}/><p>A API ainda não forneceu `preview_url` para esta submissão.</p><a className="external-link" href={selected.repositorio_url} target="_blank" rel="noreferrer">ABRIR REPOSITÓRIO <ExternalLink size={14}/></a></div>}
            <div className="decision-box"><label>CURADOR<input value={curador} maxLength={60} onChange={(e) => setCurador(e.target.value)} /></label><label>JUSTIFICATIVA<textarea value={justificativa} onChange={(e) => setJustificativa(e.target.value)} placeholder="Obrigatória para reprovação." /></label><div className="decision-actions"><button className="arcade-button arcade-button--green" onClick={() => decide('aprovado')}>APROVAR</button><button className="arcade-button arcade-button--pink" onClick={() => decide('reprovado')}>REPROVAR</button></div>{message && <p className="inline-message">{message}</p>}</div>
          </>}
        </div>
      </section>
    </Layout>
  )
}

function RankingJogadores() {
  const [ranking, setRanking] = useState<PlayerRank[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [gameId, setGameId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { api.jogos().then(setGames).catch(() => undefined) }, [])
  useEffect(() => { api.rankingJogadores(gameId || undefined).then(setRanking).catch(() => setRanking([])) }, [gameId])

  async function anonymize(apelido: string) {
    try { const result = await api.anonimizarJogador(apelido); setMessage(`${result.apelido_anterior} foi anonimizado como ${result.apelido_novo}.`); setRanking(await api.rankingJogadores(gameId || undefined)) } catch (e) { setMessage(e instanceof Error ? e.message : 'Não foi possível anonimizar.') }
  }

  return (
    <Layout title="RANKING DE JOGADORES" eyebrow="RF-G07 / RF-G16">
      <section className="panel">
        <div className="toolbar"><label>FILTRAR POR JOGO<select value={gameId} onChange={(e) => setGameId(e.target.value)}><option value="">GERAL</option>{games.map((game) => <option value={game.id} key={game.id}>{game.nome}</option>)}</select></label></div>
        <div className="ranking-list">{ranking.map((player) => <div className="ranking-row" key={`${player.apelido}-${player.posicao}`}><strong className="rank-position">#{player.posicao}</strong><span className="rank-name">{player.apelido}</span><strong>{player.pontos.toLocaleString('pt-BR')}</strong><button className="text-button" onClick={() => anonymize(player.apelido)}>ANONIMIZAR</button></div>)}</div>
        {message && <p className="inline-message">{message}</p>}
      </section>
    </Layout>
  )
}

function RankingJogos() {
  const [ranking, setRanking] = useState<GameRank[]>([])
  useEffect(() => { api.rankingJogos().then(setRanking).catch(() => setRanking([])) }, [])
  return (
    <Layout title="RANKING DE JOGOS" eyebrow="RF-G08 / RF-G14">
      <section className="panel">
        <div className="ranking-explanation"><strong>Como a métrica funciona</strong><p>A API calcula uma média ponderada que combina nota e volume de votos. Com m = 5: <code>nota_ajustada = (v/(v+m))*R + (m/(v+m))*C</code>. Empates usam jogadores distintos e depois partidas.</p></div>
        <div className="ranking-list">{ranking.map((item) => <div className="ranking-row ranking-row--game" key={item.jogo_id}><strong className="rank-position">#{item.posicao}</strong><span className="rank-name"><strong>{item.jogo}</strong><small>{item.votos} votos • {item.partidas} partidas • {item.jogadores_distintos} jogadores</small></span><span><Star size={15}/> {item.nota.toFixed(1)}/5</span><strong>{item.nota_ajustada.toFixed(2)}</strong></div>)}</div>
      </section>
    </Layout>
  )
}

function App() {
  return <Routes><Route path="*" element={<Catalogo />} /><Route path="/catalogo" element={<Catalogo />} /><Route path="/jogos/:id" element={<Detalhes />} /><Route path="/enviar" element={<Enviar />} /><Route path="/moderacao" element={<Moderacao />} /><Route path="/ranking/jogadores" element={<RankingJogadores />} /><Route path="/ranking/jogos" element={<RankingJogos />} /></Routes>
}

export default App
