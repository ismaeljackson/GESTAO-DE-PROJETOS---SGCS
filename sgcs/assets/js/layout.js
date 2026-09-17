// Componente de Layout Compartilhado (Header + Sidebar) extraído do Google Stitch
window.SGCS_LAYOUT = (function () {
  function initLayout(activePath) {
    const user = window.SGCS_AUTH ? window.SGCS_AUTH.getUser() : { nome_completo: 'Carlos Mendes', cargo: 'Síndico Geral' };

    // Inject Sidebar if element exists
    const sidebarContainer = document.getElementById('sgcs-sidebar-container');
    if (sidebarContainer) {
      sidebarContainer.innerHTML = `
        <aside class="fixed left-0 top-0 h-full w-64 bg-primary text-on-primary z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div class="flex flex-col">
            <div class="h-16 px-space-md flex items-center gap-space-sm bg-primary border-b border-outline/20">
              <div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-bold text-headline-sm">S</div>
              <div class="flex flex-col">
                <span class="font-headline-sm text-headline-sm tracking-tight text-on-primary leading-none">SGCS</span>
                <span class="font-label-sm text-label-sm text-on-primary-container tracking-wider uppercase">Gestão Predial</span>
              </div>
            </div>
            <div class="px-space-md pt-space-md pb-space-xs">
              <span class="font-label-sm text-label-sm uppercase tracking-wider text-outline-variant font-bold">Menu Operacional</span>
            </div>
            <nav class="flex flex-col gap-space-2xs px-space-xs">
              <a href="/sgcs/dashboard.html" class="flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors ${activePath === 'dashboard' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
                <span class="material-symbols-outlined text-[20px]">space_dashboard</span>
                <span class="font-label-md text-label-md">Dashboard</span>
              </a>
              <a href="/sgcs/chamados/index.html" class="flex items-center justify-between px-space-sm py-space-xs rounded transition-colors ${activePath === 'chamados' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
                <div class="flex items-center gap-space-sm">
                  <span class="material-symbols-outlined text-[20px]">assignment</span>
                  <span class="font-label-md text-label-md">Chamados</span>
                </div>
                <span class="px-space-2xs py-[2px] rounded-full bg-error text-on-error font-label-sm text-label-sm leading-none">14</span>
              </a>
              <a href="/sgcs/condominios/index.html" class="flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors ${activePath === 'condominios' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
                <span class="material-symbols-outlined text-[20px]">apartment</span>
                <span class="font-label-md text-label-md">Condomínios</span>
              </a>
              <a href="/sgcs/configuracoes/tipos-chamado.html" class="flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors ${activePath === 'tipos-chamado' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
                <span class="material-symbols-outlined text-[20px]">category</span>
                <span class="font-label-md text-label-md">Tipos de Chamado</span>
              </a>
              <a href="/sgcs/configuracoes/perfil.html" class="flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors ${activePath === 'perfil' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary'}">
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
                <span class="font-label-md text-label-md text-on-primary truncate font-bold">${user.nome_completo}</span>
                <span class="font-body-sm text-body-sm text-on-primary-container truncate">${user.cargo || 'Síndico Geral'}</span>
              </div>
            </div>
            <div class="flex items-center justify-between text-outline-variant">
              <span class="font-label-sm text-label-sm">SGCS v2.4</span>
              <button onclick="SGCS_AUTH.signOut()" title="Sair" class="text-on-primary-container hover:text-on-primary font-label-sm text-label-sm flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">logout</span> Sair
              </button>
            </div>
          </div>
        </aside>
      `;
    }

    // Inject Header if element exists
    const headerContainer = document.getElementById('sgcs-header-container');
    if (headerContainer) {
      headerContainer.innerHTML = `
        <header class="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-margin-desktop">
          <div class="flex items-center gap-space-md">
            <div class="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
              <span class="font-label-md text-label-md font-semibold text-primary">SGCS</span>
              <span class="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
              <span class="font-body-sm text-body-sm text-on-surface-variant">Administração</span>
            </div>
            <div class="h-5 w-[1px] bg-outline-variant mx-space-2xs"></div>
            <div class="flex items-center gap-space-2xs bg-surface-container-low px-space-sm py-space-2xs rounded border border-outline-variant/40 text-on-surface cursor-pointer">
              <span class="material-symbols-outlined text-[18px] text-secondary">business</span>
              <span class="font-label-md text-label-md font-semibold text-on-surface">Todos os Condomínios (3)</span>
              <span class="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_drop_down</span>
            </div>
          </div>
          <div class="flex items-center gap-space-md">
            <button class="relative w-9 h-9 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant" type="button" title="Notificações">
              <span class="material-symbols-outlined text-[22px]">notifications</span>
              <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
            </button>
            <div class="h-6 w-[1px] bg-outline-variant"></div>
            <a href="/sgcs/configuracoes/perfil.html" class="flex items-center gap-space-sm cursor-pointer p-space-2xs rounded hover:bg-surface-container-high transition-colors">
              <div class="flex flex-col text-right">
                <span class="font-label-md text-label-md font-bold text-on-surface leading-tight">${user.nome_completo}</span>
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
  }

  return {
    initLayout: initLayout
  };
})();
