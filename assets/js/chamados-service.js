import { supabase } from './supabase.js';

export async function getDashboardStats() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase.rpc('get_dashboard_stats', {
    p_sindico_id: session.user.id
  });

  if (error || !data || data.length === 0) {
    // Fallback manual se a rpc falhar ou não retornar dados
    const { count: condominiosCount } = await supabase
      .from('condominios')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', true);

    const { count: abertosCount } = await supabase
      .from('chamados')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'aberto');

    const { count: andamentoCount } = await supabase
      .from('chamados')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'em_andamento');

    const { count: resolvidosCount } = await supabase
      .from('chamados')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'resolvido');

    return {
      total_condominios: condominiosCount || 0,
      chamados_abertos: abertosCount || 0,
      chamados_em_andamento: andamentoCount || 0,
      chamados_resolvidos_mes: resolvidosCount || 0,
      chamados_urgentes: 0
    };
  }

  return data[0];
}

export async function getChamados(filters = {}) {
  let query = supabase
    .from('chamados')
    .select(`
      *,
      condominios(id, nome),
      tipos_chamado(id, nome, cor, icone),
      subtipos_chamado(id, nome)
    `)
    .order('created_at', { ascending: false });

  if (filters.condominio_id) {
    query = query.eq('condominio_id', filters.condominio_id);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.prioridade) {
    query = query.eq('prioridade', filters.prioridade);
  }
  if (filters.tipo_id) {
    query = query.eq('tipo_id', filters.tipo_id);
  }
  if (filters.search) {
    query = query.or(`titulo.ilike.%${filters.search}%,solicitante_nome.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Erro ao buscar chamados:', error);
    return [];
  }
  return data;
}

export async function getChamadoById(id) {
  const { data, error } = await supabase
    .from('chamados')
    .select(`
      *,
      condominios(id, nome, endereco, cidade, estado),
      tipos_chamado(id, nome, cor, icone),
      subtipos_chamado(id, nome)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar chamado:', error);
    return null;
  }
  return data;
}

export async function createChamado(chamado) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Sessão expirada');

  const payload = {
    ...chamado,
    criado_por: session.user.id
  };

  const { data, error } = await supabase
    .from('chamados')
    .insert([payload])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateChamadoStatus(id, status) {
  const { data, error } = await supabase
    .from('chamados')
    .update({ status, updated_at: new Date() })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateChamadoPrioridade(id, prioridade) {
  const { data, error } = await supabase
    .from('chamados')
    .update({ prioridade, updated_at: new Date() })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

export async function getChamadoTimeline(chamadoId) {
  const { data, error } = await supabase
    .from('chamado_timeline')
    .select(`
      *,
      profiles(nome_completo, email)
    `)
    .eq('chamado_id', chamadoId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar timeline:', error);
    return [];
  }
  return data;
}

export async function addTimelineComentario(chamadoId, descricao) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Sessão expirada');

  const payload = {
    chamado_id: chamadoId,
    autor_id: session.user.id,
    tipo_evento: 'comentario',
    descricao: descricao
  };

  const { data, error } = await supabase
    .from('chamado_timeline')
    .insert([payload])
    .select();

  if (error) throw error;
  return data[0];
}
