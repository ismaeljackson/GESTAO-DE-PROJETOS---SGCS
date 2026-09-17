// Inicialização do Cliente Supabase com suporte a CDN e Mock Fallback
(function () {
  const config = window.SGCS_CONFIG || {};
  let client = null;

  if (window.supabase && config.SUPABASE_URL && !config.SUPABASE_URL.includes('seu-projeto')) {
    try {
      client = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn('Erro ao inicializar cliente Supabase:', e);
    }
  }

  window.sgcsSupabase = client;
})();
