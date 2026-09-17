import { supabase } from './supabase.js';

export async function getChamadoAnexos(chamadoId) {
  const { data, error } = await supabase
    .from('chamado_anexos')
    .select('*')
    .eq('chamado_id', chamadoId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar anexos:', error);
    return [];
  }
  return data;
}

export async function uploadAnexo(chamadoId, file) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Sessão expirada');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `chamado-${chamadoId}/${fileName}`;

  // Upload no bucket "chamado-anexos"
  const { error: uploadError } = await supabase.storage
    .from('chamado-anexos')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Erro ao fazer upload no storage:', uploadError);
  }

  // Registrar na tabela chamado_anexos
  const { data, error } = await supabase
    .from('chamado_anexos')
    .insert([{
      chamado_id: chamadoId,
      nome_arquivo: file.name,
      storage_path: filePath,
      tipo_mime: file.type,
      tamanho_bytes: file.size,
      uploaded_by: session.user.id
    }])
    .select();

  if (error) throw error;
  return data[0];
}
