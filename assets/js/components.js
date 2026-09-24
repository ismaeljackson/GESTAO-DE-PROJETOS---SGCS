export const uiComponents = {
  getSidebar: (activePath, basePath = '/GESTAO-DE-PROJETOS---SGCS/') => `
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
        <a href="${basePath}dashboard.html" class="flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors ${activePath === 'dashboard' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
          <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          <span class="font-label-md text-label-md">Dashboard</span>
        </a>
        <a href="${basePath}chamados/" class="flex items-center justify-between px-space-sm py-space-xs rounded transition-colors ${activePath === 'chamados' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
          <div class="flex items-center gap-space-sm">
            <i data-lucide="clipboard-list" class="w-5 h-5"></i>
            <span class="font-label-md text-label-md">Chamados</span>
          </div>
          <span id="badge-chamados" class="px-space-2xs py-[2px] rounded-full bg-error text-on-error font-label-sm text-label-sm leading-none" style="display: none;">0</span>
        </a>
        <a href="${basePath}condominios/" class="flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors ${activePath === 'condominios' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
          <i data-lucide="building-2" class="w-5 h-5"></i>
          <span class="font-label-md text-label-md">Condomínios</span>
        </a>
        <a href="${basePath}configuracoes/tipos-chamado.html" class="flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors ${activePath === 'tipos-chamado' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
          <i data-lucide="tags" class="w-5 h-5"></i>
          <span class="font-label-md text-label-md">Tipos de Chamado</span>
        </a>
        <a href="${basePath}configuracoes/perfil.html" class="flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors ${activePath === 'configuracoes' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
          <i data-lucide="settings" class="w-5 h-5"></i>
          <span class="font-label-md text-label-md">Configurações</span>
        </a>
      </nav>
    </div>
    <div class="p-space-md border-t border-outline/20 flex flex-col gap-space-sm bg-primary">
      <div class="flex items-center gap-space-sm">
        <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
          <img id="sidebar-user-avatar" src="" alt="Avatar" class="w-full h-full object-cover" style="display: none;">
          <i id="sidebar-user-icon" data-lucide="user" class="w-5 h-5 text-on-primary"></i>
        </div>
        <div class="flex flex-col min-w-0 flex-1">
          <span id="sidebar-user-name" class="font-label-md text-label-md text-on-primary truncate font-bold">Carregando...</span>
          <span id="sidebar-user-role" class="font-body-sm text-body-sm text-on-primary-container truncate">Carregando...</span>
        </div>
      </div>
      <div class="flex items-center justify-between text-outline-variant">
        <span class="font-label-sm text-label-sm">SGCS v2.4</span>
        <button id="btn-logout" class="text-on-primary-container hover:text-error transition-colors" title="Sair">
          <i data-lucide="log-out" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </aside>`,

  getHeader: (breadcrumbs, basePath = '/GESTAO-DE-PROJETOS---SGCS/') => `
  <header class="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-[2rem]">
    <div class="flex items-center gap-[1rem]">
      <div class="flex items-center gap-[0.5rem] text-on-surface-variant font-body-sm text-body-sm">
        <span class="font-label-md text-label-md font-semibold text-primary">SGCS</span>
        ${breadcrumbs ? breadcrumbs.map(b => `<i data-lucide="chevron-right" class="w-4 h-4 text-outline"></i><span class="font-body-sm text-body-sm ${b.active ? 'text-primary font-bold' : 'text-on-surface-variant'}">${b.label}</span>`).join('') : ''}
      </div>
    </div>
    <div class="flex items-center gap-[1rem]">
      <div class="relative" x-data="{ open: false }">
        <button @click="open = !open" class="relative w-9 h-9 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant">
          <i data-lucide="bell" class="w-5 h-5"></i>
          <span id="header-notif-badge" class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest" style="display: none;"></span>
        </button>
        <div x-show="open" @click.away="open = false" class="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded shadow-lg border border-outline/20 z-50 p-space-sm" style="display: none;">
          <div class="flex items-center justify-between mb-[0.5rem]">
            <span class="font-label-md font-bold text-on-surface">Notificações</span>
            <button id="btn-read-all-notifs" class="text-primary text-label-sm hover:underline">Marcar lidas</button>
          </div>
          <div id="header-notif-list" class="flex flex-col gap-[0.25rem] max-h-64 overflow-y-auto">
            <!-- Notifications injected here -->
          </div>
        </div>
      </div>
      <div class="h-6 w-[1px] bg-outline-variant"></div>
      <div class="flex items-center gap-[0.75rem] cursor-pointer p-[0.25rem] rounded hover:bg-surface-container-high transition-colors" onclick="window.location.href='${basePath}configuracoes/perfil.html'">
        <div class="flex flex-col text-right">
          <span id="header-user-name" class="font-label-md text-label-md font-bold text-on-surface leading-tight">Carregando...</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant leading-none">Ativo</span>
        </div>
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
          <img id="header-user-avatar" src="" alt="Avatar" class="w-full h-full object-cover" style="display: none;">
          <i id="header-user-icon" data-lucide="user" class="w-4 h-4 text-on-primary"></i>
        </div>
      </div>
    </div>
  </header>`
};
