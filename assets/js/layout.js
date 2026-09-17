import { getCurrentUserProfile, signOut } from './auth.js';

export function renderSidebar(activePage = 'dashboard', unreadCount = 0) {
  return `
    <aside class="fixed left-0 top-0 h-full w-64 bg-primary text-on-primary z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div class="flex flex-col">
        <div class="h-16 px-space-md flex items-center gap-space-sm bg-primary border-b border-outline/20">
          <div class="flex flex-col">
            <span class="font-headline-sm text-headline-sm tracking-tight text-on-primary leading-none">SGCS</span>
            <span class="font-label-sm text-label-sm text-on-primary-container tracking-wider uppercase">Gestão Predial</span>
          </div>
        </div>
        <div class="px-space-md pt-space-md pb-space-xs">
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-outline-variant font-bold">Menu Operacional</span>
        </div>
        <nav class="flex flex-col gap-space-2xs px-space-xs">
          <a href="/dashboard.html" class="flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors ${activePage === 'dashboard' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
            <span class="material-symbols-outlined text-[20px]">space_dashboard</span>
            <span class="font-label-md text-label-md">Dashboard</span>
          </a>
          <a href="/chamados/index.html" class="flex items-center justify-between px-space-sm py-space-xs rounded transition-colors ${activePage === 'chamados' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
            <div class="flex items-center gap-space-sm">
              <span class="material-symbols-outlined text-[20px]">assignment</span>
              <span class="font-label-md text-label-md">Chamados</span>
            </div>
            ${unreadCount > 0 ? `<span class="px-space-2xs py-[2px] rounded-full bg-error text-on-error font-label-sm text-label-sm leading-none">${unreadCount}</span>` : ''}
          </a>
          <a href="/condominios/index.html" class="flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors ${activePage === 'condominios' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
            <span class="material-symbols-outlined text-[20px]">apartment</span>
            <span class="font-label-md text-label-md">Condomínios</span>
          </a>
          <a href="/configuracoes/tipos-chamado.html" class="flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors ${activePage === 'tipos-chamado' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
            <span class="material-symbols-outlined text-[20px]">category</span>
            <span class="font-label-md text-label-md">Tipos de Chamado</span>
          </a>
          <a href="/configuracoes/perfil.html" class="flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors ${activePage === 'perfil' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
            <span class="material-symbols-outlined text-[20px]">tune</span>
            <span class="font-label-md text-label-md">Configurações</span>
          </a>
        </nav>
      </div>
      <div class="p-space-md border-t border-outline/20 flex flex-col gap-space-sm bg-primary">
        <div class="flex items-center gap-space-sm">
          <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
            <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
          <div class="flex flex-col min-w-0 flex-1">
            <span id="sidebar-user-name" class="font-label-md text-label-md text-on-primary truncate font-bold">Síndico Geral</span>
            <span class="font-body-sm text-body-sm text-on-primary-container truncate">Síndico Profissional</span>
          </div>
          <button id="btn-logout" class="text-outline-variant hover:text-on-primary p-1 rounded transition-colors" title="Sair">
            <span class="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
        <div class="flex items-center justify-between text-outline-variant">
          <span class="font-label-sm text-label-sm">SGCS v2.4</span>
          <span class="w-2 h-2 rounded-full bg-secondary"></span>
        </div>
      </div>
    </aside>
  `;
}

export function renderHeader(activeTitle = 'Administração') {
  return `
    <header class="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-margin-desktop">
      <div class="flex items-center gap-space-md">
        <div class="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
          <span class="font-label-md text-label-md font-semibold text-primary">SGCS</span>
          <span class="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant">${activeTitle}</span>
        </div>
      </div>
      <div class="flex items-center gap-space-md">
        <button id="btn-notifications" class="relative w-9 h-9 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant" type="button">
          <span class="material-symbols-outlined text-[22px]">notifications</span>
          <span id="notif-badge" class="hidden absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
        </button>
        <div class="h-6 w-[1px] bg-outline-variant"></div>
        <a href="/configuracoes/perfil.html" class="flex items-center gap-space-sm cursor-pointer p-space-2xs rounded hover:bg-surface-container-high transition-colors">
          <div class="flex flex-col text-right">
            <span id="header-user-name" class="font-label-md text-label-md font-bold text-on-surface leading-tight">Síndico</span>
            <span class="font-body-sm text-body-sm text-on-surface-variant leading-none">Administrador Ativo</span>
          </div>
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </a>
      </div>
    </header>
  `;
}

export async function initLayout(activePage = 'dashboard', title = 'Administração') {
  const sidebarContainer = document.getElementById('app-sidebar');
  const headerContainer = document.getElementById('app-header');

  if (sidebarContainer) sidebarContainer.innerHTML = renderSidebar(activePage);
  if (headerContainer) headerContainer.innerHTML = renderHeader(title);

  const profile = await getCurrentUserProfile();
  if (profile && profile.nome_completo) {
    const sidebarName = document.getElementById('sidebar-user-name');
    const headerName = document.getElementById('header-user-name');
    if (sidebarName) sidebarName.textContent = profile.nome_completo;
    if (headerName) headerName.textContent = profile.nome_completo;
  }

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      signOut();
    });
  }
}
