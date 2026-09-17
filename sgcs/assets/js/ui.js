// Sistema de Interface e Notificações (Toasts, Modais e Loaders)
window.SGCS_UI = (function () {
  let notyfInstance = null;

  function getNotyf() {
    if (!notyfInstance && window.Notyf) {
      notyfInstance = new window.Notyf({
        duration: 3500,
        position: { x: 'right', y: 'bottom' },
        dismissible: true
      });
    }
    return notyfInstance;
  }

  function showToast(message, type = 'success') {
    const notyf = getNotyf();
    if (notyf) {
      if (type === 'error') notyf.error(message);
      else if (type === 'warning' || type === 'info') notyf.open({ type: 'warning', message: message, background: '#346092' });
      else notyf.success(message);
    } else {
      // Fallback Toast
      const toastEl = document.getElementById('sgcs-toast');
      if (toastEl) {
        const msgEl = document.getElementById('sgcs-toast-message');
        if (msgEl) msgEl.textContent = message;
        toastEl.classList.remove('translate-y-20', 'opacity-0');
        toastEl.classList.add('translate-y-0', 'opacity-100');
        setTimeout(() => {
          toastEl.classList.add('translate-y-20', 'opacity-0');
          toastEl.classList.remove('translate-y-0', 'opacity-100');
        }, 3500);
      } else {
        alert(message);
      }
    }
  }

  function showLoader() {
    let loader = document.getElementById('sgcs-global-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'sgcs-global-loader';
      loader.className = 'fixed inset-0 z-50 bg-primary/30 backdrop-blur-xs flex items-center justify-center transition-opacity';
      loader.innerHTML = `
        <div class="bg-surface-container-lowest p-space-lg rounded shadow-xl flex items-center gap-space-md">
          <span class="material-symbols-outlined text-primary text-[28px] animate-spin">progress_activity</span>
          <span class="font-label-md text-label-md text-primary font-bold">Carregando dados...</span>
        </div>
      `;
      document.body.appendChild(loader);
    }
    loader.classList.remove('hidden');
  }

  function hideLoader() {
    const loader = document.getElementById('sgcs-global-loader');
    if (loader) loader.classList.add('hidden');
  }

  return {
    showToast: showToast,
    showLoader: showLoader,
    hideLoader: hideLoader
  };
})();
