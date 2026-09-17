import { supabase } from './supabase.js';

export async function getTiposChamado() {
  const { data, error } = await supabase
    .from('tipos_chamado')
    .select('*')
    .order('nome', { ascending: true });

  if (error) {
    console.error('Erro ao buscar tipos de chamado:', error);
    return [];
  }
  return data;
}

export async function createTipoChamado(tipo) {
  const { data, error } = await supabase
    .from('tipos_chamado')
    .insert([tipo])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateTipoChamado(id, tipo) {
  const { data, error } = await supabase
    .from('tipos_chamado')
    .update(tipo)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

export async function getSubtiposChamado(tipoId = null) {
  let query = supabase.from('subtipos_chamado').select('*');
  if (tipoId) {
    query = query.eq('tipo_id', tipoId);
  }
  const { data, error } = await query.order('nome', { ascending: true });

  if (error) {
    console.error('Erro ao buscar subtipos de chamado:', error);
    return [];
  }
  return data;
}

export async function createSubtipoChamado(subtipo) {
  const { data, error } = await supabase
    .from('subtipos_chamado')
    .insert([subtipo])
    .select();

  if (error) throw error;
  return data[0];
}
