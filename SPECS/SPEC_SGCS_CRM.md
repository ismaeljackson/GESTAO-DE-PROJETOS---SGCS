# 📄 SPEC Técnica — SGCS (Sistema de Gerenciamento de Chamados para Síndicos)

**Versão:** 1.0  
**Data:** 02/09/2026  
**Stack:** HTML + CSS + JS + Supabase  
**Padrão:** Single-Page Application (SPA) via Vanilla JS + Alpine.js  
**Entrega:** Arquivos estáticos servidos via CDN / hospedagem estática

---

## 1. Visão Geral

Desenvolver um CRM web completo para **síndicos profissionais** gerenciarem **múltiplos condomínios** e seus **chamados** (demandas dos condôminos). O sistema centraliza o atendimento, substituindo o fluxo disperso de WhatsApp, ligações e e-mails.

### 1.1 Principais Funcionalidades
- Autenticação e autorização (RBAC)
- Gestão de condomínios
- Gestão de chamados com tipos/subtipos
- Timeline de acompanhamento por chamado
- Dashboard com métricas
- Notificações internas
- Perfil de usuário

### 1.2 Fora do Escopo
- Agendamento de visitas/espaços
- Controle de ponto de inspeção
- Sistema de portaria/encomendas

---

## 2. Stack Tecnológica (Todas via CDN — zero build/dependências)

| Camada | Biblioteca | CDN | Propósito |
|--------|-----------|-----|-----------|
| **Estilização** | Tailwind CSS v3 | `cdn.tailwindcss.com` | Utility-first CSS, responsivo, tema customizado |
| **Reatividade** | Alpine.js v3 | `unpkg.com/alpinejs` | Binding de dados, estado, eventos sem React/Vue |
| **Banco/Auth** | Supabase JS v2 | `unpkg.com/@supabase/supabase-js` | PostgreSQL, Auth, Realtime, Storage, RLS |
| **Ícones** | Lucide Icons | `unpkg.com/lucide` | Ícones consistentes e leves |
| **Notificações** | Notyf v3 | `unpkg.com/notyf` | Toasts de sucesso/erro/aviso |
| **Gráficos** | Chart.js v4 | `unpkg.com/chart.js` | Dashboards e relatórios visuais |
| **Máscaras** | IMask v7 | `unpkg.com/imask` | Máscaras em inputs (telefone, CEP, CPF) |
| **Data/Tempo** | date-fns v3 (ESM) | `esm.sh/date-fns` | Manipulação de datas em português |
| **Validação** | Zod v3 (ESM) | `esm.sh/zod` | Schema validation dos formulários |

> **Regra de Ouro:** Todas as bibliotecas são carregadas via `<script>` ou `importmap`. **Nenhum build tool** (Vite, Webpack, etc.) deve ser necessário.

---

## 3. Arquitetura da Aplicação

```
┌─────────────────────────────────────────┐
│           Browser (Cliente)             │
│  ┌─────────┐ ┌─────────┐ ┌───────────┐ │
│  │  HTML   │ │ Alpine  │ │  Supabase │ │
│  │  Pages  │ │   JS    │ │   Client  │ │
│  └─────────┘ └─────────┘ └───────────┘ │
│         ↑ Realtime (WebSocket)          │
└─────────┬───────────────────────────────┘
          │ REST / Auth / Realtime / Storage
┌─────────┴───────────────────────────────┐
│           Supabase Cloud                │
│  ┌─────────┐ ┌─────────┐ ┌───────────┐ │
│  │  Auth   │ │PostgreSQL│ │  Storage  │ │
│  │ (JWT)   │ │  (RLS)  │ │  (Images) │ │
│  └─────────┘ └─────────┘ └───────────┘ │
└─────────────────────────────────────────┘
```

### 3.1 Padrão de Navegação (SPA Híbrida)
- **Estrutura:** Cada "página" é um arquivo HTML separado (`index.html`, `chamados.html`, `condominios.html`, etc.)
- **Layout compartilhado:** Sidebar + Header + Content via `<template>` ou `fetch()` de fragmentos HTML
- **Autenticação:** Middleware em JS que verifica sessão antes de renderizar conteúdo protegido
- **Rotas protegidas:** Redirecionamento automático para `login.html` se não houver sessão ativa

---

## 4. Modelo de Dados (Supabase / PostgreSQL)

### 4.1 Tabelas Principais

```sql
-- Perfis de usuário (estende auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_completo TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'sindico' CHECK (role IN ('sindico', 'admin', 'morador')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Condomínios
CREATE TABLE condominios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL,
    cep TEXT,
    quantidade_unidades INTEGER DEFAULT 0,
    sindico_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tipos de chamado
CREATE TABLE tipos_chamado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    cor TEXT DEFAULT '#3B82F6', -- Tailwind blue-500
    icone TEXT DEFAULT 'file-text',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subtipos de chamado
CREATE TABLE subtipos_chamado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_id UUID NOT NULL REFERENCES tipos_chamado(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chamados
CREATE TABLE chamados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_sequencial SERIAL, -- Número visual do chamado (#0001)
    condominio_id UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
    tipo_id UUID NOT NULL REFERENCES tipos_chamado(id),
    subtipo_id UUID REFERENCES subtipos_chamado(id),

    -- Solicitante
    solicitante_nome TEXT NOT NULL,
    solicitante_email TEXT,
    solicitante_telefone TEXT,
    solicitante_unidade TEXT, -- Apartamento/Bloco

    -- Conteúdo
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    prioridade TEXT NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    status TEXT NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_andamento', 'aguardando', 'resolvido', 'cancelado', 'reaberto')),

    -- Responsável
    responsavel_id UUID REFERENCES profiles(id),

    -- Datas
    data_abertura TIMESTAMPTZ DEFAULT NOW(),
    data_previsao TIMESTAMPTZ,
    data_encerramento TIMESTAMPTZ,

    -- Auditoria
    criado_por UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline / Histórico do chamado
CREATE TABLE chamado_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chamado_id UUID NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES profiles(id),
    tipo_evento TEXT NOT NULL CHECK (tipo_evento IN ('criacao', 'status_alterado', 'prioridade_alterada', 'comentario', 'anexo', 'encerramento', 'reabertura')),
    descricao TEXT NOT NULL,
    dados_adicionais JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anexos dos chamados
CREATE TABLE chamado_anexos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chamado_id UUID NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
    nome_arquivo TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    tipo_mime TEXT,
    tamanho_bytes INTEGER,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notificações internas
CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'info' CHECK (tipo IN ('info', 'sucesso', 'aviso', 'erro')),
    referencia_tipo TEXT, -- 'chamado', 'condominio'
    referencia_id UUID,
    lida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Row Level Security (RLS) — Regras Obrigatórias

```sql
-- Profiles: usuário vê apenas seu próprio perfil (admin vê todos)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem seu próprio perfil"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Condomínios: síndico vê apenas seus condomínios
ALTER TABLE condominios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Síndico vê seus condomínios"
ON condominios FOR ALL
USING (sindico_id = auth.uid());

-- Chamados: visíveis apenas dentro dos condomínios do síndico
ALTER TABLE chamados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Síndico vê chamados de seus condomínios"
ON chamados FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM condominios 
        WHERE condominios.id = chamados.condominio_id 
        AND condominios.sindico_id = auth.uid()
    )
);
```

---

## 5. Estrutura de Arquivos

```
/sgcs/
├── index.html              # Login
├── dashboard.html          # Painel principal
├── chamados/
│   ├── index.html          # Listagem de chamados
│   ├── novo.html           # Criar chamado
│   └── detalhe.html        # Detalhe do chamado (timeline)
├── condominios/
│   ├── index.html          # Listagem de condomínios
│   └── form.html           # Criar/Editar condomínio
├── configuracoes/
│   ├── tipos-chamado.html  # CRUD de tipos/subtipos
│   └── perfil.html         # Perfil do usuário
├── assets/
│   ├── css/
│   │   └── app.css         # Estilos customizados (além do Tailwind)
│   ├── js/
│   │   ├── config.js       # Configuração do Supabase (URL + KEY)
│   │   ├── auth.js         # Funções de autenticação
│   │   ├── supabase.js     # Cliente Supabase inicializado
│   │   ├── utils.js        # Helpers (formatDate, formatCurrency, etc.)
│   │   ├── validators.js   # Schemas Zod para validação
│   │   ├── ui.js           # Funções de UI (toasts, modais, loaders)
│   │   └── components.js   # Componentes reutilizáveis (sidebar, header, cards)
│   └── img/
│       └── logo.svg
└── 404.html
```

---

## 6. Configuração do Supabase Client

```javascript
// assets/js/config.js
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anon-publica';

// assets/js/supabase.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## 7. Fluxos de Tela e Funcionalidades

### 7.1 Tela de Login (`index.html`)

| Elemento | Descrição |
|----------|-----------|
| **Campos** | E-mail, Senha |
| **Ações** | Entrar, "Esqueci minha senha" |
| **Validação** | Zod schema — e-mail válido, senha mín. 6 chars |
| **Pós-login** | Redireciona para `dashboard.html` |
| **Layout** | Centralizado, ilustração lateral (desktop), fundo gradiente |

```javascript
// Schema de validação
const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
});
```

### 7.2 Dashboard (`dashboard.html`)

**Widgets obrigatórios:**
- **Cards de resumo:** Chamados abertos, em andamento, resolvidos (mês), total de condomínios
- **Gráfico de pizza:** Distribuição de chamados por status (Chart.js)
- **Gráfico de barras:** Chamados por prioridade
- **Lista:** Últimos 5 chamados abertos (com link para detalhe)
- **Ações rápidas:** "Novo Chamado", "Novo Condomínio"

**Dados:** Agregações via Supabase RPC (funções PostgreSQL) ou `count()` com filtros.

### 7.3 Listagem de Chamados (`chamados/index.html`)

| Recurso | Implementação |
|---------|--------------|
| **Tabela/Grid** | Cards responsivos (mobile) + tabela (desktop) |
| **Filtros** | Por status, prioridade, condomínio, tipo, período |
| **Busca** | Full-text search no título e descrição |
| **Ordenação** | Por data (mais recente), prioridade, status |
| **Paginação** | Offset/limit com botões "Anterior/Próximo" |
| **Ações** | Ver detalhe, Editar, Alterar status, Excluir (soft delete) |
| **Número visual** | `#0001`, `#0002`... (usar `numero_sequencial`) |

**Cores de prioridade (Tailwind):**
- `baixa` → verde (`bg-green-100 text-green-800`)
- `media` → azul (`bg-blue-100 text-blue-800`)
- `alta` → laranja (`bg-orange-100 text-orange-800`)
- `urgente` → vermelho (`bg-red-100 text-red-800`)

### 7.4 Detalhe do Chamado (`chamados/detalhe.html?id=UUID`)

**Layout:** Duas colunas (desktop) / empilhado (mobile)

**Coluna Esquerda (70%):**
- Cabeçalho: Número, título, status badge, prioridade badge
- Dados do solicitante (nome, unidade, contato)
- Descrição completa
- **Timeline** (mais importante): Lista cronológica de eventos com:
  - Ícone do tipo de evento (Lucide)
  - Autor e data/hora
  - Descrição do evento
  - Anexos (se houver)
- **Formulário de comentário:** Textarea + botão "Adicionar comentário"
- **Upload de anexo:** Input file → Supabase Storage

**Coluna Direita (30%):**
- Ações rápidas: Alterar status, Alterar prioridade, Atribuir responsável
- Datas: Abertura, previsão, encerramento
- Condomínio vinculado (link)

**Regra:** Toda alteração de status gera um evento na `chamado_timeline`.

### 7.5 Cadastro de Chamado (`chamados/novo.html`)

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| Condomínio | Select | Sim | Lista dos condomínios do síndico |
| Tipo | Select | Sim | Populado da tabela `tipos_chamado` |
| Subtipo | Select | Não | Filtrado pelo tipo selecionado (cascata) |
| Solicitante Nome | Text | Sim | |
| Solicitante E-mail | Email | Não | |
| Solicitante Telefone | Tel | Não | Máscara IMask |
| Solicitante Unidade | Text | Não | Ex: "Bloco A - Apt 101" |
| Título | Text | Sim | Máx. 150 chars |
| Descrição | Textarea | Sim | Máx. 2000 chars |
| Prioridade | Select | Sim | Padrão: média |
| Anexos | File | Não | Múltiplos, máx. 5MB cada |

**Fluxo pós-salvamento:**
1. Insere na tabela `chamados`
2. Cria evento na `chamado_timeline` (tipo: `criacao`)
3. Cria notificação para o síndico
4. Redireciona para detalhe do chamado com toast de sucesso

### 7.6 Gestão de Condomínios (`condominios/index.html`)

- CRUD completo (listar, criar, editar, inativar)
- Card por condomínio com: nome, endereço, qtd. unidades, qtd. chamados ativos
- Busca por nome/cidade
- Ao inativar: condomínio não aparece mais nos selects de novo chamado

### 7.7 Configurações — Tipos e Subtipos (`configuracoes/tipos-chamado.html`)

- CRUD de tipos (nome, descrição, cor, ícone)
- CRUD de subtipos vinculados a um tipo
- Ícones selecionáveis via grid do Lucide
- Cores via input color ou preset de cores Tailwind

### 7.8 Perfil do Usuário (`configuracoes/perfil.html`)

- Editar nome, telefone, avatar (upload para Supabase Storage)
- Alterar senha (via Supabase Auth)
- Preferências: notificações por e-mail

---

## 8. Regras de Negócio

| # | Regra |
|---|-------|
| R01 | Um síndico só visualiza/edita condomínios e chamados de sua própria carteira |
| R02 | O número sequencial do chamado é único e incremental por todo o sistema |
| R03 | Todo chamado deve ter pelo menos um evento na timeline (o de criação) |
| R04 | Chamados com status `resolvido` ou `cancelado` não podem ser editados, apenas reabertos |
| R05 | Ao reabrir um chamado, o status volta para `reaberto` e gera evento na timeline |
| R06 | Subtipos são opcionais, mas quando preenchidos devem pertencer ao tipo selecionado |
| R07 | Anexos são armazenados no Supabase Storage, bucket `chamado-anexos`, pasta `chamado-{uuid}/` |
| R08 | Notificações são marcadas como lidas automaticamente ao visualizar o item referenciado |
| R09 | O dashboard exibe apenas dados dos últimos 30 dias por padrão (filtro alterável) |
| R10 | E-mail do solicitante, se informado, recebe cópia das atualizações (futuro — não implementar agora, apenas preparar campo) |

---

## 9. Segurança & LGPD

| Requisito | Implementação |
|-----------|--------------|
| **Autenticação** | Supabase Auth (JWT, refresh token automático) |
| **Autorização** | RLS em todas as tabelas — nunca confiar no frontend |
| **Senhas** | Mín. 6 caracteres, hash gerenciado pelo Supabase Auth |
| **Dados pessoais** | Criptografia em trânsito (HTTPS), RLS no acesso |
| **Anexos** | Bucket privado no Storage, acesso via signed URL |
| **Logs** | Timeline serve como audit trail de todas as ações |
| **Exclusão** | Soft delete (campo `ativo` ou status `cancelado`) — não remover dados |

---

## 10. Integrações (Preparadas para Futuro)

O sistema deve estar arquitetado para receber as seguintes integrações (sem implementar agora, mas com estrutura preparada):

| Integração | Preparação |
|------------|-----------|
| **WhatsApp Business API** | Campo `solicitante_telefone` já validado; tabela `notificacoes` pronta para canal WhatsApp |
| **E-mail transacional** | Campo `solicitante_email` presente; estrutura de templates pode ser adicionada |
| **Calendário/Google Calendar** | Campo `data_previsao` permite vinculação futura |
| **Relatórios PDF** | Estrutura de dados permite exportação; biblioteca `jsPDF` ou `pdfmake` pode ser adicionada via CDN |

---

## 11. UX/UI — Diretrizes Visuais

### 11.1 Paleta de Cores (Tailwind)
- **Primária:** `blue-600` (`#2563EB`) — ações principais
- **Secundária:** `slate-700` (`#334155`) — textos, headers
- **Fundo:** `slate-50` (`#F8FAFC`) — background geral
- **Card:** `white` com sombra suave
- **Sucesso:** `green-500`
- **Aviso:** `amber-500`
- **Erro:** `red-500`

### 11.2 Tipografia
- **Fonte:** Inter (Google Fonts)
- **Títulos:** `font-semibold`, `text-2xl` a `text-xl`
- **Corpo:** `text-sm` a `text-base`, `text-slate-600`

### 11.3 Componentes Reutilizáveis (JS)

```javascript
// ui.js — Funções obrigatórias

// Toast de notificação
function showToast(message, type = 'success') { /* usa Notyf */ }

// Modal genérico
function openModal(title, content, onConfirm) { /* Alpine + HTML */ }

// Loader global
function showLoader() { /* overlay com spinner */ }
function hideLoader() { /* remove overlay */ }

// Confirmação de exclusão
function confirmDelete(message, onConfirm) { /* modal de confirmação */ }

// Badge de status
function statusBadge(status) { /* retorna HTML do badge colorido */ }

// Badge de prioridade  
function priorityBadge(priority) { /* retorna HTML do badge colorido */ }
```

### 11.4 Layout Base

```
┌────────────────────────────────────────────┐
│  [Logo]  SGCS          [🔔] [👤 Perfil]   │  ← Header fixo (h-16)
├──────────┬─────────────────────────────────┤
│          │                                 │
│  🏠 Dash │      CONTEÚDO DA PÁGINA         │
│  📋 Cham │                                 │
│  🏢 Cond │                                 │
│  ⚙️ Config                                 │
│          │                                 │
│  v1.0.0  │                                 │
└──────────┴─────────────────────────────────┘
   Sidebar (w-64)      Main (flex-1, p-6)
   (colapsável mobile)
```

---

## 12. Performance & Boas Práticas

| Requisito | Implementação |
|-----------|--------------|
| **Lazy loading** | Imagens e anexos com `loading="lazy"` |
| **Paginação** | Nunca carregar mais de 20 registros por vez |
| **Debounce** | Busca em tempo real com debounce de 300ms |
| **Cache** | Dados de tipos/subtipos e condomínios cacheados em `sessionStorage` |
| **Otimista** | Atualizações de status refletidas na UI antes da resposta do Supabase |
| **Offline** | Mensagem amigável se `navigator.onLine === false` |

---

## 13. Critérios de Aceitação

- [ ] Usuário consegue se autenticar e acessar o dashboard
- [ ] Síndico cadastra condomínios e visualiza apenas os seus
- [ ] Síndico cria chamados vinculados a um condomínio
- [ ] Chamados possuem número sequencial visual (#0001)
- [ ] Timeline registra automaticamente criação, alterações de status e comentários
- [ ] Filtros e busca funcionam na listagem de chamados
- [ ] Dashboard exibe gráficos com dados reais
- [ ] Upload e download de anexos funcionam corretamente
- [ ] Notificações aparecem para eventos relevantes
- [ ] RLS impede que um síndico acesse dados de outro (testar com 2 contas)
- [ ] Layout responsivo funciona em mobile (320px+) e desktop
- [ ] Todas as bibliotecas carregam via CDN sem erro de CORS

---

## 14. Checklist de Entrega

```
□ Arquivos HTML para todas as telas listadas
□ Assets JS organizados em módulos (ES6 imports)
□ Tailwind configurado com tema customizado
□ Supabase client conectado e testado
□ RLS aplicado em todas as tabelas
□ Ícones Lucide renderizados em todos os botões/links
□ Toasts Notyf em todas as ações de CRUD
□ Máscaras IMask nos campos de telefone/CEP
□ Validação Zod em todos os formulários
□ Chart.js nos gráficos do dashboard
□ date-fns para formatação de datas em PT-BR
□ README.md com instruções de deploy
```

---

> **Nota para o Agente de IA:** Esta SPEC deve ser seguida rigorosamente. Priorize funcionalidade sobre estética, mas mantenha o design limpo e profissional com Tailwind. Teste cada fluxo de ponta a ponta antes de considerar uma tela "pronta". Use Supabase Realtime para atualizações em tempo real quando aplicável (ex: nova notificação).
