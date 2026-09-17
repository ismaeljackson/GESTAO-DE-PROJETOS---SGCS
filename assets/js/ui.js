// ui.js - Funções globais de UI (toasts, modais, loaders, badges)

let notyfInstance = null;

export function getNotyf() {
  if (!notyfInstance && window.Notyf) {
    notyfInstance = new Notyf({
      duration: 4000,
      position: { x: 'right', y: 'bottom' },
      dismissible: true
    });
  }
  return notyfInstance;
}

export function showToast(message, type = 'success') {
  const notyf = getNotyf();
  if (notyf) {
    if (type === 'success') notyf.success(message);
    else if (type === 'error') notyf.error(message);
    else notyf.open({ type: 'info', message, background: '#346092' });
  } else {
    alert(message);
  }
}

export function showLoader() {
  let loader = document.getElementById('global-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.className = 'fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center';
    loader.innerHTML = `
      <div class="bg-surface-container-lowest p-space-lg rounded shadow-xl flex items-center gap-space-sm">
        <span class="material-symbols-outlined text-primary text-[28px] animate-spin">progress_activity</span>
        <span class="font-label-md text-label-md text-primary">Carregando dados...</span>
      </div>
    `;
    document.body.appendChild(loader);
  }
  loader.classList.remove('hidden');
}

export function hideLoader() {
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.classList.add('hidden');
  }
}

export function statusBadge(status) {
  switch (status) {
    case 'aberto':
      return `<span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-error"></span>Aberto</span>`;
    case 'em_andamento':
      return `<span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-secondary-fixed/50 text-secondary font-label-sm text-label-sm font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>Em Andamento</span>`;
    case 'aguardando':
      return `<span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-outline"></span>Aguardando</span>`;
    case 'resolvido':
      return `<span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-secondary-fixed/40 text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold"><span class="material-symbols-outlined text-[13px]">check_circle</span>Resolvido</span>`;
    case 'cancelado':
      return `<span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container-high text-outline font-label-sm text-label-sm font-semibold">Cancelado</span>`;
    default:
      return `<span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm">${status}</span>`;
  }
}

export function priorityBadge(priority) {
  switch (priority) {
    case 'urgente':
    case 'critica':
      return `<span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold"><span class="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>Crítica</span>`;
    case 'alta':
      return `<span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container-highest text-secondary font-label-sm text-label-sm font-bold"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>Alta</span>`;
    case 'media':
      return `<span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-bold"><span class="w-1.5 h-1.5 rounded-full bg-outline"></span>Média</span>`;
    case 'baixa':
      return `<span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container text-outline font-label-sm text-label-sm font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>Baixa</span>`;
    default:
      return `<span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm">${priority}</span>`;
  }
}
