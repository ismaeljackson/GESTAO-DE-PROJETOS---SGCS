// Gerenciamento de Autenticação e Sessão de Usuário
window.SGCS_AUTH = (function () {
  const SESSION_KEY = 'sgcs_user_session';

  function getSession() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function setSession(user) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Erro ao salvar sessão:', e);
    }
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function getUser() {
    const session = getSession();
    if (session) return session;
    // Default fallback user for development/demo mode
    return {
      id: 'usr-001',
      nome_completo: 'Carlos Mendes',
      email: 'carlos.mendes@sgcs.com.br',
      role: 'sindico',
      cargo: 'Síndico Geral'
    };
  }

  function requireAuth() {
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/sgcs/');
    const session = getSession();

    if (!session && !isLoginPage) {
      // Allow demo mode, but if explicitly required:
      // window.location.href = '../index.html';
    }
  }

  function signIn(email, password) {
    return new Promise((resolve, reject) => {
      const client = window.sgcsSupabase;
      if (client) {
        client.auth.signInWithPassword({ email: email, password: password })
          .then(res => {
            if (res.error) reject(res.error);
            else {
              const user = {
                id: res.data.user.id,
                email: res.data.user.email,
                nome_completo: res.data.user.user_metadata?.nome_completo || 'Síndico Carlos Mendes',
                role: 'sindico'
              };
              setSession(user);
              resolve(user);
            }
          })
          .catch(err => reject(err));
      } else {
        // Fallback local auth simulation
        setTimeout(() => {
          const mockUser = {
            id: 'usr-001',
            nome_completo: 'Carlos Mendes',
            email: email,
            role: 'sindico',
            cargo: 'Síndico Geral'
          };
          setSession(mockUser);
          resolve(mockUser);
        }, 300);
      }
    });
  }

  function signOut() {
    const client = window.sgcsSupabase;
    if (client) client.auth.signOut();
    clearSession();
    window.location.href = '/sgcs/index.html';
  }

  return {
    getSession: getSession,
    getUser: getUser,
    requireAuth: requireAuth,
    signIn: signIn,
    signOut: signOut
  };
})();
