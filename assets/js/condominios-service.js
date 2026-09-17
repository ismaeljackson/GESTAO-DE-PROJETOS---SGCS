import { supabase } from './supabase.js';

export async function getCondominios() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from('condominios')
    .select('*')
    .order('nome', { ascending: true });

  if (error) {
    console.error('Erro ao buscar condomínios:', error);
    return [];
  }
  return data;
}

export async function createCondominio(condo) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Sessão expirada. Faça login novamente.');

  const payload = {
    ...condo,
    sindico_id: session.user.id
  };

  const { data, error } = await supabase
    .from('condominios')
    .insert([payload])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateCondominio(id, condo) {
  const { data, error } = await supabase
    .from('condominios')
    .update(condo)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

export async function toggleAtivoCondominio(id, ativo) {
  const { data, error } = await supabase
    .from('condominios')
    .update({ ativo })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}
