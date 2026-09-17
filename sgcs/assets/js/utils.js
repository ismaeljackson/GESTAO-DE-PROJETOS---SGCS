// Helpers e utilitários universais SGCS
window.SGCS_UTILS = {
  formatDate: function (dateStr) {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  },

  formatDateOnly: function (dateStr) {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  },

  maskPhone: function (value) {
    if (!value) return '';
    let clean = value.replace(/\D/g, '').slice(0, 11);
    if (clean.length > 10) {
      return '(' + clean.slice(0, 2) + ') ' + clean.slice(2, 7) + '-' + clean.slice(7);
    } else if (clean.length > 6) {
      return '(' + clean.slice(0, 2) + ') ' + clean.slice(2, 6) + '-' + clean.slice(6);
    } else if (clean.length > 2) {
      return '(' + clean.slice(0, 2) + ') ' + clean.slice(2);
    }
    return clean;
  },

  maskCEP: function (value) {
    if (!value) return '';
    let clean = value.replace(/\D/g, '').slice(0, 8);
    if (clean.length > 5) {
      return clean.slice(0, 5) + '-' + clean.slice(5);
    }
    return clean;
  },

  getStatusBadgeHTML: function (status) {
    const statusMap = {
      aberto: { label: 'Aberto', bg: 'bg-primary-fixed/60', text: 'text-primary', icon: 'radio_button_checked' },
      em_andamento: { label: 'Em Andamento', bg: 'bg-surface-container-highest', text: 'text-secondary', icon: 'hourglass_top' },
      aguardando: { label: 'Aguardando', bg: 'bg-surface-container', text: 'text-on-surface', icon: 'pending' },
      resolvido: { label: 'Resolvido', bg: 'bg-secondary-fixed/40', text: 'text-on-secondary-fixed-variant', icon: 'check_circle' },
      cancelado: { label: 'Cancelado', bg: 'bg-surface-container-low', text: 'text-outline', icon: 'cancel' },
      reaberto: { label: 'Reaberto', bg: 'bg-error-container/40', text: 'text-error', icon: 'replay' }
    };
    const conf = statusMap[status] || { label: status, bg: 'bg-surface-container', text: 'text-on-surface', icon: 'help' };
    return `<span class="inline-flex items-center gap-1 px-space-xs py-0.5 rounded ${conf.bg} ${conf.text} font-label-sm text-label-sm font-semibold"><span class="material-symbols-outlined text-[13px]">${conf.icon}</span>${conf.label}</span>`;
  },

  getPriorityBadgeHTML: function (priority) {
    const priorityMap = {
      critica: { label: 'Crítica', bg: 'bg-error-container', text: 'text-on-error-container', dot: 'bg-error animate-pulse' },
      urgente: { label: 'Urgente', bg: 'bg-error-container', text: 'text-on-error-container', dot: 'bg-error animate-pulse' },
      alta: { label: 'Alta', bg: 'bg-surface-container-high', text: 'text-primary', dot: 'bg-secondary' },
      media: { label: 'Média', bg: 'bg-surface-container', text: 'text-on-surface-variant', dot: 'bg-outline' },
      baixa: { label: 'Baixa', bg: 'bg-surface-container-low', text: 'text-outline', dot: 'bg-outline-variant' }
    };
    const conf = priorityMap[priority] || { label: priority, bg: 'bg-surface-container', text: 'text-on-surface', dot: 'bg-outline' };
    return `<span class="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded ${conf.bg} ${conf.text} font-label-sm text-label-sm font-bold"><span class="w-1.5 h-1.5 rounded-full ${conf.dot}"></span>${conf.label}</span>`;
  }
};
