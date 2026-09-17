# 🏢 SGCS — Sistema de Gerenciamento de Chamados para Síndicos

**SGCS** é um CRM web completo desenvolvido para síndicos profissionais gerenciarem múltiplos condomínios, chamados e demandas de condôminos em uma única plataforma centralizada.

Este projeto utiliza como base de interface o Design System e layouts gerados pelo **Google Stitch** (localizados na pasta `THEME/`).

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Propósito |
|--------|-----------|-----------|
| **Frontend** | HTML5 + Vanilla JS | Single Page Application (SPA) híbrida e modular |
| **Estilização** | Tailwind CSS v3 (CDN) | Design system responsivo com tokens customizados do Stitch |
| **Tipografia** | Poppins & Open Sans | Fontes do Google Fonts conforme Design System |
| **Ícones** | Material Symbols Outlined | Ícones corporativos limpos (sem emojis) |
| **Backend & Banco** | Supabase JS v2 | PostgreSQL, Authentication e Row Level Security (RLS) |
| **Notificações** | Notyf v3 | Toast notifications de feedback ao usuário |
| **Validação** | Zod / Validators JS | Validação de schemas em formulários |

---

## 📁 Estrutura do Projeto

```
.
├── SPECS/                      # Documentação técnica, SPEC, Design System e Schema SQL
│   ├── SPEC_SGCS_CRM.md
│   ├── DESIGN SYSTEM.md
│   ├── PLANO_EXECUCAO_SGCS.md
│   └── schema_sgcs.sql
├── THEME/                      # Templates e telas geradas pelo Google Stitch
│   ├── dashboard_sgcs_1/
│   ├── dashboard_sgcs_2/
│   ├── chamados_sgcs/
│   ├── detalhe_do_chamado_0048_sgcs/
│   ├── condom_nios_sgcs/
│   └── sgcs_gest_o_predial/
├── sgcs/                       # Aplicação Principal SGCS
│   ├── index.html              # Tela de Login
│   ├── dashboard.html          # Dashboard Operacional
│   ├── chamados/
│   │   ├── index.html          # Listagem de Chamados
│   │   ├── novo.html           # Abertura de Chamado
│   │   └── detalhe.html        # Detalhes, Timeline e Anexos
│   ├── condominios/
│   │   └── index.html          # Gestão de Condomínios (Grid e Drawer)
│   ├── configuracoes/
│   │   ├── tipos-chamado.html  # CRUD de Tipos e Subtipos
│   │   └── perfil.html         # Perfil e Credenciais do Síndico
│   ├── assets/
│   │   ├── css/
│   │   │   └── app.css         # Estilos customizados
│   │   └── js/
│   │       ├── config.js       # Configurações de API Supabase
│   │       ├── supabase.js     # Cliente Supabase
│   │       ├── auth.js         # Módulo de Autenticação e Sessão
│   │       ├── layout.js       # Gerenciador do Layout Stitch
│   │       ├── ui.js           # Notificações e Loaders
│   │       ├── utils.js        # Máscaras (CEP/Telefone) e Badges
│   │       └── validators.js   # Validações de Formulário
│   └── BACKLOG.md              # Registro de Decisões Técnicas e Tarefas
└── README.md
```

---

## 🚀 Como Executar Localmente

Como o projeto é construído sem ferramentas de build (zero build step), basta servir a pasta estática através de qualquer servidor HTTP:

### Opção 1: Python HTTP Server (Recomendado)
```bash
python3 -m http.server 8080
```
Acesse no navegador: `http://localhost:8080/sgcs/`

### Opção 2: Node.js `serve`
```bash
npx serve .
```
Acesse no navegador: `http://localhost:3000/sgcs/`

---

## 🔐 Configuração do Supabase (Opcional)

Para conectar a uma instância real do Supabase:

1. Execute o script SQL em `SPECS/schema_sgcs.sql` no **SQL Editor** do seu painel do Supabase.
2. Edite o arquivo `sgcs/assets/js/config.js` inserindo suas credenciais:
   ```javascript
   window.SGCS_CONFIG = {
     SUPABASE_URL: 'https://seu-projeto.supabase.co',
     SUPABASE_ANON_KEY: 'sua-chave-anon-publica'
   };
   ```
3. Se nenhuma chave for fornecida, a aplicação executa em modo **Demo/Mock** com dados reais de exemplo.

---

## 📜 Licença e Especificações
Desenvolvido conforme `SPECS/SPEC_SGCS_CRM.md` e `SPECS/DESIGN SYSTEM.md`.
