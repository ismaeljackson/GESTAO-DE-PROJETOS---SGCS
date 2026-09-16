# 📋 Plano de Execução — SGCS
## Tarefas Independentes para Desenvolvimento por Agente de IA

**Versão:** 1.1  
**Baseado em:** SPEC_SGCS_CRM.md v1.0  
**Data:** 02/09/2026

---

## 🎯 Princípio de Independência

Cada tarefa abaixo foi desenhada para ser **desenvolvida, testada e validada isoladamente**.  
Quando uma tarefa precisa consumir algo de outra, ela deve usar **dados mock/stub** ou **interfaces stub** que serão substituídas na fase de integração.

> **Regra:** Nenhuma tarefa deve "esperar" outra para começar. Se houver dependência, crie um stub/mock.

---

## 🧭 Instruções Gerais para o Agente de IA

### 1. Registro de Alterações (Obrigatório)
Toda correção, ajuste, alteração de escopo, decisão técnica ou dúvida encontrada durante o desenvolvimento **DEVE** ser registrada no arquivo:

```
/BACKLOG.md
```

Formato de entrada:
```markdown
## YYYY-MM-DD HH:MM
- **Tarefa:** [Número/Nome]
- **Tipo:** [correção | ajuste | alteração | dúvida | decisão]
- **Descrição:** [O que foi identificado e o que foi feito]
- **Status:** [resolvido | pendente | aguardando-interação-humana]
```

### 2. Interação Humana (Obrigatório)
Sempre que houver **dúvida, ambiguidade, conflito de requisitos ou decisão de design que impacte o escopo**, o agente deve:
- **Parar** o desenvolvimento da tarefa corrente
- **Registrar** a dúvida no `BACKLOG.md`
- **Solicitar** interação humana antes de prosseguir

> Não assuma. Não chute. Pergunte.

### 3. UI/UX — Diretrizes Visuais (Obrigatório)
- **Interface limpa e profissional** — sem poluição visual
- **Otimização de espaço** — use grids densos, tabelas compactas, cards informativos
- **Sem emojis** — em nenhum lugar do código, labels, botões ou mensagens
- **Ícones via Lucide** — única fonte de ícones permitida
- **Tailwind CSS** — utility-first, tema customizado via config
- **Responsivo** — mobile-first, breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Fonte:** Inter (Google Fonts)
- **Cores:**
  - Primária: `blue-600` (#2563EB)
  - Secundária: `slate-700` (#334155)
  - Fundo: `slate-50` (#F8FAFC)
  - Cards: `white` com shadow-sm
  - Sucesso: `green-500`
  - Aviso: `amber-500`
  - Erro: `red-500`

---

## 📁 Estrutura de Pastas Esperada (Tarefa 0)

```
/sgcs/
├── index.html
├── dashboard.html
├── chamados/
│   ├── index.html
│   ├── novo.html
│   └── detalhe.html
├── condominios/
│   ├── index.html
│   └── form.html
├── configuracoes/
│   ├── tipos-chamado.html
│   └── perfil.html
├── assets/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── supabase.js
│   │   ├── utils.js
│   │   ├── validators.js
│   │   ├── ui.js
│   │   └── components.js
│   └── img/
│       └── logo.svg
├── BACKLOG.md          ← CRIAR E MANTER ATUALIZADO
└── 404.html
```

---

## 📦 Tarefas

---

### Tarefa 1 — Setup Base do Projeto
**Independência:** Sem dependências

**Objetivo:** Criar a estrutura de arquivos e o esqueleto HTML/CSS/JS que servirá de base para todo o projeto.

**Entregáveis:**
1. Criar estrutura de pastas conforme especificado acima
2. Arquivo `assets/js/config.js` com constantes `SUPABASE_URL` e `SUPABASE_ANON_KEY` (placeholder)
3. Arquivo `assets/js/supabase.js` — importa e exporta cliente Supabase via CDN ESM
4. Arquivo `assets/css/app.css` — configurações customizadas do Tailwind (tema, fonte Inter, cores)
5. Template HTML base (`_base.html` ou fragmento) contendo:
   - Importmap para todas as bibliotecas via CDN
   - Script do Tailwind CSS v3
   - Script do Alpine.js v3 (defer)
   - Script do Lucide (inicialização automática de ícones)
   - Meta tags responsivas e charset UTF-8
6. `index.html` (login) usando o template base

**Importmap esperado:**
```html
<script type="importmap">
{
  "imports": {
    "@supabase/supabase-js": "https://esm.sh/@supabase/supabase-js@2",
    "zod": "https://esm.sh/zod@3",
    "date-fns": "https://esm.sh/date-fns@3",
    "date-fns/locale": "https://esm.sh/date-fns@3/locale/pt-BR"
  }
}
</script>
```

**Scripts CDN no head:**
- Tailwind CSS: `https://cdn.tailwindcss.com` (com config customizada inline)
- Alpine.js: `https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js` (defer)
- Lucide: `https://unpkg.com/lucide@latest`
- Notyf: CSS + JS via CDN
- Chart.js: `https://unpkg.com/chart.js@4`
- IMask: `https://unpkg.com/imask@7`

**Stub necessário:** Nenhum.

**Critérios de aceitação:**
- [ ] Todas as bibliotecas carregam sem erro de CORS
- [ ] Tailwind renderiza classes customizadas corretamente
- [ ] Lucide ícones são renderizados via `lucide.createIcons()`
- [ ] Importmap resolve módulos ESM corretamente
- [ ] `index.html` exibe formulário de login estilizado

---

### Tarefa 2 — Schema do Banco de Dados (Supabase)
**Independência:** Sem dependências (SQL puro)

**Objetivo:** Criar todas as tabelas, índices, triggers, funções e políticas RLS no Supabase.

**Entregáveis:**
1. Script SQL completo (`schema.sql`) com:
   - Tabela `profiles` (trigger para criar perfil automaticamente no signup)
   - Tabela `condominios`
   - Tabela `tipos_chamado` (com seed de 5 tipos padrão)
   - Tabela `subtipos_chamado` (com seed de 2-3 subtipos por tipo)
   - Tabela `chamados` (com `numero_sequencial` como SERIAL)
   - Tabela `chamado_timeline`
   - Tabela `chamado_anexos`
   - Tabela `notificacoes`
2. Índices em:
   - `chamados(condominio_id, status)`
   - `chamados(criado_por)`
   - `chamado_timeline(chamado_id, created_at)`
   - `notificacoes(usuario_id, lida)`
3. Função PostgreSQL `get_dashboard_stats(sindico_id UUID)` retornando:
   - total_condominios
   - chamados_abertos
   - chamados_em_andamento
   - chamados_resolvidos_mes
4. Trigger para criar evento de timeline automaticamente ao inserir `chamado`
5. Trigger para criar notificação ao alterar status do chamado
6. RLS em TODAS as tabelas:
   - `profiles`: usuário vê apenas seu próprio perfil
   - `condominios`: sindico_id = auth.uid()
   - `chamados`: EXISTS condomínio do síndico
   - `chamado_timeline`: EXISTS chamado do síndico
   - `chamado_anexos`: EXISTS chamado do síndico
   - `notificacoes`: usuario_id = auth.uid()

**Stub necessário:** Nenhum.

**Critérios de aceitação:**
- [ ] Script SQL executa sem erros no SQL Editor do Supabase
- [ ] RLS está ativo em todas as tabelas
- [ ] Seed de tipos e subtipos populado
- [ ] Trigger de timeline funciona (testar INSERT em chamados)
- [ ] Função `get_dashboard_stats` retorna dados corretos

---

### Tarefa 3 — Módulo de Autenticação
**Independência:** Depende apenas do Setup Base (Tarefa 1)

**Objetivo:** Implementar login, registro, logout, recuperação de senha e middleware de sessão.

**Entregáveis:**
1. `assets/js/auth.js` com funções:
   - `signUp(email, password, nome_completo)` — registra em auth.users + trigger cria profile
   - `signIn(email, password)` — autentica e armazena sessão
   - `signOut()` — limpa sessão e redireciona para login
   - `resetPassword(email)` — envia e-mail de recuperação
   - `getSession()` — retorna sessão ativa ou null
   - `getUser()` — retorna usuário logado com dados do profile
   - `requireAuth()` — middleware: redireciona para `index.html` se não autenticado
2. `index.html` (login) funcional:
   - Formulário com validação Zod
   - Toggle entre login e registro
   - Link "Esqueci minha senha"
   - Toasts Notyf para feedback
3. Proteção de rotas: em cada página protegida, chamar `requireAuth()` no `DOMContentLoaded`

**Stub necessário:** Use Supabase local/placeholder. Se Supabase não estiver configurado, criar mock de `supabase.auth` que simula sessão com usuário fake após 500ms.

**Critérios de aceitação:**
- [ ] Usuário consegue registrar (cria auth.user + profile)
- [ ] Usuário consegue logar (sessão persistente via localStorage)
- [ ] Usuário consegue deslogar
- [ ] Páginas protegidas redirecionam para login se não autenticado
- [ ] Recuperação de senha envia e-mail (testar via Supabase)
- [ ] Validação Zod exibe mensagens de erro nos campos

---

### Tarefa 4 — Componentes Reutilizáveis de UI
**Independência:** Sem dependências (puro HTML/CSS/JS frontend)

**Objetivo:** Criar biblioteca de componentes visuais reutilizáveis, sem lógica de negócio.

**Entregáveis:**
1. `assets/js/ui.js` com funções puras (sem dependência de Supabase):
   - `showToast(message, type)` — tipos: success, error, warning, info (usa Notyf)
   - `showLoader()` / `hideLoader()` — overlay fullscreen com spinner (usa Lucide: `loader-2`)
   - `openModal({ title, content, confirmText, cancelText, onConfirm, onCancel })` — modal genérico
   - `confirmDelete(message, onConfirm)` — modal de confirmação de exclusão
   - `statusBadge(status)` — retorna HTML string do badge colorido por status
   - `priorityBadge(priority)` — retorna HTML string do badge colorido por prioridade
   - `emptyState(message, icon)` — estado vazio com ícone Lucide e texto
   - `pagination({ currentPage, totalPages, onPageChange })` — componente de paginação
2. `assets/js/components.js` — funções que retornam HTML string:
   - `renderSidebar(activeItem)` — sidebar com navegação, marcação de ativo, colapsável mobile
   - `renderHeader({ userName, notificationCount })` — header com logo, notificações, avatar dropdown
   - `renderCard({ title, value, icon, trend, color })` — card de métrica do dashboard
   - `renderTable({ headers, rows, actions })` — tabela responsiva com ações
   - `renderChamadoCard(chamado)` — card compacto de chamado para listagem mobile

**Diretrizes visuais:**
- Sem emojis em nenhum lugar
- Ícones exclusivamente via Lucide (`<i data-lucide="nome"></i>`)
- Espaço otimizado: padding reduzido (p-3, p-4), fontes compactas (text-sm)
- Cores de status/prioridade conforme SPEC

**Stub necessário:** Nenhum.

**Critérios de aceitação:**
- [ ] Todos os componentes renderizam corretamente em HTML isolado
- [ ] Toasts aparecem nas 4 variações de tipo
- [ ] Loader cobre a tela e pode ser removido
- [ ] Modal funciona com confirmação e cancelamento
- [ ] Sidebar colapsa em mobile (hamburger menu)
- [ ] Header exibe badge de notificação
- [ ] Tabela adapta para cards em mobile

---

### Tarefa 5 — Layout Base Compartilhado
**Independência:** Depende da Tarefa 4 (componentes UI)

**Objetivo:** Criar o layout com sidebar + header + content que será compartilhado por todas as páginas internas.

**Entregáveis:**
1. `assets/js/layout.js` — função `initLayout()` que:
   - Injere sidebar e header no `<body>` antes do conteúdo
   - Marca o item ativo na sidebar baseado no `data-page` do body
   - Gerencia estado de colapso da sidebar (mobile)
   - Exibe nome do usuário logado no header
   - Dropdown de perfil/logout no header
2. Arquivo `dashboard.html` como página de teste do layout:
   - Chama `initLayout()`
   - Área de conteúdo vazia (placeholder)
   - Deve funcionar com dados mock do usuário

**Stub necessário:** Se `auth.js` não estiver pronto, usar mock de usuário:
```javascript
const mockUser = { nome_completo: 'Síndico Teste', email: 'teste@sgcs.com', avatar_url: null };
```

**Critérios de aceitação:**
- [ ] Layout renderiza sidebar + header + content em todas as larguras de tela
- [ ] Sidebar colapsa/expande em mobile
- [ ] Item ativo da sidebar destacado visualmente
- [ ] Dropdown de perfil funciona (abre/fecha)
- [ ] Logout redireciona para login
- [ ] Scroll do content independente do sidebar/header

---

### Tarefa 6 — Dashboard
**Independência:** Depende do Layout (T5). Usa mock de dados se T2/T3 não estiverem prontas.

**Objetivo:** Página inicial com métricas e gráficos.

**Entregáveis:**
1. `dashboard.html` completo:
   - 4 cards de resumo: Condomínios, Abertos, Em Andamento, Resolvidos (mês)
   - Gráfico de pizza (Chart.js): distribuição de chamados por status
   - Gráfico de barras (Chart.js): chamados por prioridade
   - Tabela/cards: últimos 5 chamados abertos
   - Botões de ação rápida: "Novo Chamado", "Novo Condomínio"
2. `assets/js/dashboard.js`:
   - `loadDashboardStats()` — busca dados (ou usa mock)
   - `renderCharts(data)` — inicializa Chart.js
   - `loadRecentChamados()` — busca últimos 5 chamados

**Stub/Mock de dados (usar se Supabase não disponível):**
```javascript
const mockStats = {
  total_condominios: 3,
  chamados_abertos: 12,
  chamados_em_andamento: 5,
  chamados_resolvidos_mes: 8
};
const mockChamados = [
  { id: '1', numero_sequencial: 1, titulo: 'Vazamento no hall', status: 'aberto', prioridade: 'alta', solicitante_nome: 'João Silva', created_at: '2026-09-01T10:00:00Z' },
  // ... mais 4
];
```

**Critérios de aceitação:**
- [ ] Cards exibem valores corretos (mock ou real)
- [ ] Gráficos Chart.js renderizam com dados
- [ ] Últimos chamados listados com link para detalhe
- [ ] Layout responsivo (gráficos empilham em mobile)
- [ ] Ações rápidas redirecionam para as páginas corretas

---

### Tarefa 7 — CRUD de Condomínios
**Independência:** Depende do Layout (T5). Usa mock se T2/T3 não estiverem prontas.

**Objetivo:** Gestão completa de condomínios.

**Entregáveis:**
1. `condominios/index.html`:
   - Grid de cards com: nome, endereço, cidade/estado, qtd. unidades, qtd. chamados ativos
   - Busca por nome/cidade (debounce 300ms)
   - Botão "Novo Condomínio"
   - Ações por card: Editar, Inativar/Ativar
   - Paginação
2. `condominios/form.html`:
   - Formulário unificado para criar e editar (detecta via query param `?id=UUID`)
   - Campos: nome, endereco, cidade, estado, cep (máscara IMask), quantidade_unidades
   - Validação Zod
   - Toast de sucesso/erro
3. `assets/js/condominios.js`:
   - `listCondominios(filters, page)`
   - `getCondominio(id)`
   - `createCondominio(data)`
   - `updateCondominio(id, data)`
   - `toggleAtivo(id, ativo)`

**Stub/Mock:**
```javascript
const mockCondominios = [
  { id: '1', nome: 'Edifício Aurora', endereco: 'Rua das Flores, 123', cidade: 'São Paulo', estado: 'SP', cep: '01001-000', quantidade_unidades: 50, ativo: true, chamados_count: 5 },
  // ... mais 2
];
```

**Critérios de aceitação:**
- [ ] Listagem exibe cards com dados corretos
- [ ] Busca filtra em tempo real (debounce)
- [ ] Criação salva no Supabase (ou mock)
- [ ] Edição carrega dados existentes
- [ ] Inativar esconde condomínio dos selects de chamado
- [ ] Paginação funciona

---

### Tarefa 8 — CRUD de Tipos de Chamado
**Independência:** Depende do Layout (T5). Usa mock se T2 não estiver pronta.

**Objetivo:** Cadastro de tipos de chamado com ícones e cores.

**Entregáveis:**
1. `configuracoes/tipos-chamado.html`:
   - Seção "Tipos": lista em tabela com nome, descrição, cor (preview), ícone (Lucide), ativo
   - Formulário inline ou modal para criar/editar tipo
   - Grid selecionável de ícones Lucide (20 ícones comuns)
   - Input color para cor ou preset de cores Tailwind
   - Seção "Subtipos": lista filtrada por tipo selecionado
   - CRUD de subtipos vinculados ao tipo ativo
2. `assets/js/tipos-chamado.js`:
   - `listTipos()`
   - `createTipo(data)`
   - `updateTipo(id, data)`
   - `listSubtipos(tipoId)`
   - `createSubtipo(data)`
   - `updateSubtipo(id, data)`

**Stub/Mock:**
```javascript
const mockTipos = [
  { id: '1', nome: 'Manutenção', descricao: 'Problemas de manutenção', cor: '#3B82F6', icone: 'wrench', ativo: true },
  { id: '2', nome: 'Segurança', descricao: 'Questões de segurança', cor: '#EF4444', icone: 'shield', ativo: true },
];
```

**Critérios de aceitação:**
- [ ] Tipos listados com preview de cor e ícone
- [ ] Grid de ícones Lucide permite seleção
- [ ] Subtipos filtrados dinamicamente por tipo
- [ ] CRUD funcional (criar, editar, ativar/inativar)
- [ ] Validação Zod nos formulários

---

### Tarefa 9 — CRUD de Chamados (Listagem e Criação)
**Independência:** Depende do Layout (T5) e idealmente T7/T8 (mas pode usar mocks). Usa mock se T2 não estiver pronta.

**Objetivo:** Criar e listar chamados.

**Entregáveis:**
1. `chamados/index.html`:
   - Filtros: status (select multi), prioridade (select), condomínio (select), tipo (select), período (date range)
   - Busca full-text no título/descrição (debounce)
   - Ordenação: data (padrão), prioridade, status
   - Visualização: tabela (desktop) / cards (mobile)
   - Paginação (20 itens/página)
   - Botão "Novo Chamado"
   - Ações: Ver, Editar (se aberto), Alterar Status
2. `chamados/novo.html`:
   - Formulário com todos os campos da tabela `chamados`
   - Select de condomínio: popula do Supabase (ou mock)
   - Select de tipo: popula do Supabase (ou mock)
   - Select de subtipo: cascata (filtra por tipo selecionado)
   - Máscara IMask no telefone
   - Validação Zod completa
   - Upload de anexos (múltiplos, max 5MB cada)
   - Após salvar: redireciona para `detalhe.html?id=UUID`
3. `assets/js/chamados.js`:
   - `listChamados(filters)`
   - `createChamado(data, anexos)`
   - `getChamado(id)`
   - `updateChamado(id, data)`

**Stub/Mock:**
```javascript
const mockChamados = [
  { id: '1', numero_sequencial: 1, titulo: 'Vazamento no hall', status: 'aberto', prioridade: 'alta', tipo: { nome: 'Manutenção' }, condominio: { nome: 'Edifício Aurora' }, solicitante_nome: 'João Silva', created_at: '2026-09-01T10:00:00Z' },
];
```

**Critérios de aceitação:**
- [ ] Filtros combinados funcionam
- [ ] Busca em tempo real com debounce
- [ ] Ordenação alterna ascendente/descendente
- [ ] Formulário de criação valida todos os campos
- [ ] Subtipos filtram corretamente por tipo
- [ ] Upload de anexos prepara arquivos (envio real na Tarefa 12)
- [ ] Redirecionamento após criação funciona

---

### Tarefa 10 — Detalhe do Chamado + Timeline
**Independência:** Depende do Layout (T5). Pode usar mock se T2/T9 não estiverem prontas.

**Objetivo:** Página de detalhe completa com timeline interativa.

**Entregáveis:**
1. `chamados/detalhe.html?id=UUID`:
   - **Coluna principal (70%):**
     - Cabeçalho: `#0001 — Título`, badges de status e prioridade
     - Dados do solicitante (nome, unidade, e-mail, telefone)
     - Descrição completa
     - **Timeline:** lista cronológica com:
       - Ícone Lucide por tipo de evento
       - Nome do autor + data/hora formatada (date-fns, pt-BR)
       - Descrição do evento
       - Anexos vinculados ao evento (se houver)
     - Formulário de comentário: textarea + botão "Adicionar"
     - Upload de anexo no contexto do comentário
   - **Coluna lateral (30%):**
     - Ações rápidas: Alterar Status (select), Alterar Prioridade (select), Atribuir Responsável
     - Datas: abertura, previsão, encerramento
     - Link para condomínio
     - Botão "Reabrir" (se resolvido/cancelado)
2. `assets/js/chamado-detalhe.js`:
   - `loadChamado(id)`
   - `loadTimeline(chamadoId)`
   - `addComentario(chamadoId, texto)`
   - `alterarStatus(chamadoId, novoStatus)`
   - `alterarPrioridade(chamadoId, novaPrioridade)`
   - `reabrirChamado(chamadoId)`

**Regras de timeline:**
- Toda alteração de status gera evento na `chamado_timeline`
- Todo comentário gera evento do tipo `comentario`
- Reabertura gera evento `reabertura` e muda status para `reaberto`

**Stub/Mock:**
```javascript
const mockChamado = {
  id: '1', numero_sequencial: 1, titulo: 'Vazamento no hall', descricao: '...',
  status: 'em_andamento', prioridade: 'alta',
  solicitante_nome: 'João Silva', solicitante_unidade: 'Bloco A - 101',
  tipo: { nome: 'Manutenção', cor: '#3B82F6', icone: 'wrench' },
  condominio: { nome: 'Edifício Aurora' },
  created_at: '2026-09-01T10:00:00Z'
};
const mockTimeline = [
  { id: '1', tipo_evento: 'criacao', descricao: 'Chamado criado', autor: { nome_completo: 'Síndico Teste' }, created_at: '2026-09-01T10:00:00Z' },
  { id: '2', tipo_evento: 'status_alterado', descricao: 'Status alterado de Aberto para Em Andamento', autor: { nome_completo: 'Síndico Teste' }, created_at: '2026-09-01T11:00:00Z' },
];
```

**Critérios de aceitação:**
- [ ] Detalhe carrega todos os dados do chamado
- [ ] Timeline exibe eventos em ordem cronológica (mais recente no topo)
- [ ] Cada evento mostra ícone correto do Lucide
- [ ] Comentário adicionado aparece na timeline sem refresh
- [ ] Alteração de status atualiza badge e gera evento
- [ ] Reabertura funciona apenas para chamados resolvidos/cancelados
- [ ] Layout responsivo (colunas empilham em mobile)

---

### Tarefa 11 — Upload e Gerenciamento de Anexos
**Independência:** Depende do Layout (T5). Pode ser testada isoladamente com mock.

**Objetivo:** Upload, listagem e download de arquivos vinculados a chamados.

**Entregáveis:**
1. `assets/js/anexos.js`:
   - `uploadAnexo(chamadoId, file)` — upload para Supabase Storage bucket `chamado-anexos`, pasta `chamado-{chamadoId}/`
   - `listAnexos(chamadoId)` — lista anexos do chamado
   - `downloadAnexo(anexoId)` — gera signed URL e inicia download
   - `deleteAnexo(anexoId)` — remove do storage e da tabela
2. Integração em `chamados/novo.html`:
   - Input file múltiplo com preview de nome/tamanho
   - Validação: max 5MB, tipos permitidos (jpg, png, pdf, doc, docx)
   - Upload ocorre após criação do chamado (ou junto, se possível)
3. Integração em `chamados/detalhe.html`:
   - Lista de anexos na timeline e/ou aba dedicada
   - Ícone por tipo de arquivo (Lucide: `file-text`, `image`, `file`)
   - Botão de download e exclusão (com confirmação)

**Configuração de Storage necessária:**
- Bucket `chamado-anexos` (privado)
- RLS: usuário só acessa anexos de chamados de seus condomínios

**Stub/Mock:**
```javascript
const mockAnexos = [
  { id: '1', nome_arquivo: 'foto_vazamento.jpg', tipo_mime: 'image/jpeg', tamanho_bytes: 2048000 },
];
```

**Critérios de aceitação:**
- [ ] Upload funciona para múltiplos arquivos
- [ ] Validação de tamanho e tipo funciona
- [ ] Anexos aparecem listados no detalhe do chamado
- [ ] Download inicia corretamente
- [ ] Exclusão remove arquivo do storage e do banco
- [ ] Ícone correto por tipo de arquivo

---

### Tarefa 12 — Sistema de Notificações
**Independência:** Depende do Layout (T5). Pode ser testado com mock.

**Objetivo:** Notificações internas para eventos do sistema.

**Entregáveis:**
1. `assets/js/notificacoes.js`:
   - `getNotificacoesNaoLidas()` — busca notificações não lidas do usuário
   - `marcarComoLida(notificacaoId)` — atualiza flag `lida`
   - `marcarTodasComoLidas()` — batch update
   - `criarNotificacao(data)` — usado por triggers ou funções (pode ser server-side)
   - `renderNotificacoesDropdown()` — HTML do dropdown no header
2. Integração no header (Tarefa 4/5):
   - Badge vermelho com contador de não lidas
   - Dropdown ao clicar no sino (Lucide: `bell`)
   - Lista das últimas 10 notificações
   - Click na notificação marca como lida e redireciona para o item
3. Integração em eventos:
   - Ao criar chamado: notificação para o síndico
   - Ao alterar status: notificação para o síndico
   - Ao receber comentário: notificação para o responsável

**Stub/Mock:**
```javascript
const mockNotificacoes = [
  { id: '1', titulo: 'Novo chamado', mensagem: 'Chamado #0001 foi criado', tipo: 'info', lida: false, referencia_tipo: 'chamado', referencia_id: '1', created_at: '2026-09-01T10:00:00Z' },
];
```

**Critérios de aceitação:**
- [ ] Badge exibe contagem correta de não lidas
- [ ] Dropdown lista notificações com ícone por tipo
- [ ] Click marca como lida e redireciona
- [ ] "Marcar todas como lidas" funciona
- [ ] Notificações geradas automaticamente em eventos (ou mock simulando)

---

### Tarefa 13 — Perfil do Usuário
**Independência:** Depende do Layout (T5) e T3 (autenticação). Pode usar mock.

**Objetivo:** Página de configurações do usuário logado.

**Entregáveis:**
1. `configuracoes/perfil.html`:
   - Formulário: nome_completo, email (readonly), telefone (máscara IMask)
   - Upload de avatar: preview, crop simples (ou resize), upload para Supabase Storage bucket `avatars`
   - Seção "Segurança": alterar senha (senha atual, nova senha, confirmação)
   - Preferências: checkbox notificações por e-mail
   - Validação Zod
2. `assets/js/perfil.js`:
   - `loadPerfil()` — carrega dados do profile
   - `updatePerfil(data)` — atualiza profile
   - `uploadAvatar(file)` — upload para Storage
   - `changePassword(senhaAtual, novaSenha)` — via Supabase Auth

**Stub/Mock:**
```javascript
const mockProfile = {
  id: '1', nome_completo: 'Síndico Teste', email: 'teste@sgcs.com',
  telefone: '(11) 99999-9999', avatar_url: null, role: 'sindico'
};
```

**Critérios de aceitação:**
- [ ] Dados do perfil carregam corretamente
- [ ] Edição salva alterações
- [ ] Upload de avatar funciona (preview + storage)
- [ ] Alteração de senha valida e executa via Supabase
- [ ] Validação Zod em todos os campos

---

### Tarefa 14 — Integração e Testes Finais
**Independência:** Depende de TODAS as tarefas anteriores.

**Objetivo:** Integrar todos os módulos, remover mocks, testar fluxos end-to-end.

**Entregáveis:**
1. Remover todos os mocks/stubs e conectar ao Supabase real
2. Testar fluxo completo:
   - Registrar → Logar → Dashboard → Criar Condomínio → Criar Tipo → Criar Chamado → Adicionar Comentário → Alterar Status → Ver Timeline → Upload Anexo → Ver Notificação → Editar Perfil → Logout
3. Testar RLS com 2 contas de síndico diferentes
4. Testar responsividade em 320px, 768px, 1024px, 1440px
5. Testar offline: mensagem amigável quando `navigator.onLine === false`
6. Criar `README.md` com:
   - Descrição do projeto
   - Stack utilizada
   - Instruções de configuração do Supabase (tabelas, RLS, storage buckets)
   - Como rodar localmente (servidor estático: `npx serve` ou Live Server)
   - Variáveis de ambiente (config.js)
   - Estrutura de pastas

**Critérios de aceitação:**
- [ ] Fluxo end-to-end funciona sem erros
- [ ] RLS impede acesso cruzado entre síndicos
- [ ] Responsividade validada nos 4 breakpoints
- [ ] Offline handler funciona
- [ ] README.md completo e claro
- [ ] BACKLOG.md atualizado com todas as correções feitas

---

## 📋 Resumo das Dependências

```
T1 (Setup Base)
├── T2 (Schema SQL) ──→ independente
├── T3 (Auth) ────────→ depende T1
├── T4 (UI Components) → independente
│   └── T5 (Layout) ────→ depende T4
│       ├── T6 (Dashboard) ─────→ depende T5 (mock ok)
│       ├── T7 (Condomínios) ───→ depende T5 (mock ok)
│       ├── T8 (Tipos) ─────────→ depende T5 (mock ok)
│       ├── T9 (Chamados CRUD) ─→ depende T5 (mock ok)
│       ├── T10 (Detalhe/Timeline)→ depende T5 (mock ok)
│       ├── T11 (Anexos) ───────→ depende T5 (mock ok)
│       ├── T12 (Notificações) ─→ depende T5 (mock ok)
│       └── T13 (Perfil) ───────→ depende T5 (mock ok)
└── T14 (Integração) ───→ depende de TODAS
```

---

## 📝 Instruções de Execução para o Agente

1. **Sempre inicie pelo BACKLOG.md vazio**
2. **Escolha uma tarefa** e desenvolva até os critérios de aceitação estarem 100%
3. **Registre** qualquer correção, ajuste ou dúvida no BACKLOG.md
4. **Se surgir dúvida:** pare, registre no BACKLOG.md, e solicite interação humana
5. **Não use emojis** em código, labels, mensagens ou documentação
6. **Use apenas ícones Lucide** para representação visual
7. **Otimize espaço:** layouts compactos, informação densa, sem espaçamento excessivo
8. **Teste isoladamente:** cada tarefa deve funcionar sozinha antes de integrar
9. **Mantenha consistência:** siga os padrões de código estabelecidos nas tarefas anteriores
