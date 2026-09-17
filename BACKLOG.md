# BACKLOG — SGCS (Sistema de Gerenciamento de Chamados para Síndicos)

## 2026-09-16 12:00
- **Tarefa:** Tarefa 1 — Setup Base do Projeto e Integração Supabase/Theme
- **Tipo:** decisão
- **Descrição:** Estrutura base criada com Tailwind CSS v3, Material Symbols, Google Fonts (Poppins / Open Sans), Supabase JS v2 CDN e Notyf. Configuração do Supabase apontando para o endpoint e API Key do projeto.
- **Status:** resolvido

## 2026-09-16 12:30
- **Tarefa:** Tarefa 2 — Módulo de Autenticação e Componentes UI
- **Tipo:** implementação
- **Descrição:** Criadas as funções de Auth (login, signup, session, profile) em `auth.js`, helpers de UI em `ui.js`, renderizadores de layout em `layout.js` e a página de login responsiva `index.html`.
- **Status:** resolvido

## 2026-09-16 12:50
- **Tarefa:** Tarefa 3 — Gestão de Condomínios
- **Tipo:** implementação
- **Descrição:** Criado o serviço de condomínios (`condominios-service.js`) e a interface em `condominios/index.html` integrada ao Supabase (listar, criar, editar, inativar, buscar).
- **Status:** resolvido

## 2026-09-16 13:10
- **Tarefa:** Tarefa 4 — Tipos e Subtipos de Chamado
- **Tipo:** implementação
- **Descrição:** Criado serviço `tipos-service.js` e interface `configuracoes/tipos-chamado.html` para cadastro e gerenciamento dinâmico de tipos e subtipos de chamado no Supabase.
- **Status:** resolvido

## 2026-09-16 13:40
- **Tarefa:** Tarefa 5 — Dashboard e Gestão/Abertura de Chamados
- **Tipo:** implementação
- **Descrição:** Desenvolvido o Dashboard interativo em `dashboard.html` integrado a `get_dashboard_stats()`, listagem de chamados em `chamados/index.html` com filtros em tempo real e formulário de abertura de chamados em `chamados/novo.html`.
- **Status:** resolvido

## 2026-09-16 14:10
- **Tarefa:** Tarefa 6 — Detalhe do Chamado, Timeline e Anexos
- **Tipo:** implementação
- **Descrição:** Desenvolvida a tela de detalhe `chamados/detalhe.html` com visualização completa, linha do tempo de auditoria (comentários/despachos) e envio/listagem de anexos via Supabase Storage.
- **Status:** resolvido

## 2026-09-16 14:30
- **Tarefa:** Tarefa 7 — Perfil do Usuário e Polimento Geral
- **Tipo:** implementação
- **Descrição:** Implementada a tela de perfil do síndico em `configuracoes/perfil.html` para atualização de dados, garantindo ausência de emojis e alinhamento com as diretrizes do Design System.
- **Status:** resolvido

## 2026-09-17 01:15
- **Tarefa:** Tarefa 8 — Correção de URLs e Caminhos Relativos (Compatibilidade GitHub Pages)
- **Tipo:** correção
- **Descrição:** Substituídas todas as URLs absolutas iniciadas com `/` por caminhos relativos em HTML e JS para compatibilizar o carregamento de CSS, JS e navegação em subdiretórios (ex: GitHub Pages).
- **Status:** resolvido
