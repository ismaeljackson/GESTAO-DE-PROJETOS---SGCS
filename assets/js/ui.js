import { uiComponents } from './components.js';
import { auth } from './auth.js';
import { supabase } from './supabase.js';

export const ui = {
  async renderLayout(activePath, breadcrumbs, basePath = '../') {
    const body = document.querySelector('body');
    let wrapper = document.getElementById('app-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = 'app-wrapper';
      wrapper.className = 'flex min-h-screen bg-background';
      const main = document.createElement('main');
      main.className = 'flex-1 pl-64 pt-16 w-full';
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      wrapper.appendChild(main);
      body.appendChild(wrapper);
    }

    wrapper.insertAdjacentHTML('afterbegin', uiComponents.getSidebar(activePath, basePath));
    wrapper.insertAdjacentHTML('afterbegin', uiComponents.getHeader(breadcrumbs, basePath));

    if (window.lucide) {
      window.lucide.createIcons();
    }

    await this.loadUserProfile(basePath);
    this.setupLogout(basePath);
  },

  async loadUserProfile(basePath) {
    try {
      const { data: { session } } = await auth.getSession();
      if (!session) {
        window.location.href = basePath + 'index.html';
        return;
      }

      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (data) {
        document.getElementById('sidebar-user-name').textContent = data.nome_completo;
        document.getElementById('sidebar-user-role').textContent = data.role;
        document.getElementById('header-user-name').textContent = data.nome_completo;
        if (data.avatar_url) {
            document.getElementById('sidebar-user-icon').style.display = 'none';
            document.getElementById('sidebar-user-avatar').style.display = 'block';
            document.getElementById('sidebar-user-avatar').src = data.avatar_url;
            document.getElementById('header-user-icon').style.display = 'none';
            document.getElementById('header-user-avatar').style.display = 'block';
            document.getElementById('header-user-avatar').src = data.avatar_url;
        }
      }
    } catch (e) {
      console.error('Error loading profile', e);
    }
  },

  setupLogout(basePath) {
    const btn = document.getElementById('btn-logout');
    if (btn) {
      btn.addEventListener('click', async () => {
        await auth.logout();
        window.location.href = basePath + 'index.html';
      });
    }
  }
};
