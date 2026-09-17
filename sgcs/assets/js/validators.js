// Schemas de Validação de Formulários
window.SGCS_VALIDATORS = {
  validateLogin: function (data) {
    const errors = {};
    if (!data.email || !data.email.includes('@')) {
      errors.email = 'Insira um e-mail válido.';
    }
    if (!data.password || data.password.length < 6) {
      errors.password = 'A senha deve ter no mínimo 6 caracteres.';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors
    };
  },

  validateCondominio: function (data) {
    const errors = {};
    if (!data.nome || !data.nome.trim()) errors.nome = 'Nome é obrigatório.';
    if (!data.endereco || !data.endereco.trim()) errors.endereco = 'Endereço é obrigatório.';
    if (!data.cidade || !data.cidade.trim()) errors.cidade = 'Cidade é obrigatória.';
    if (!data.estado || !data.estado.trim()) errors.estado = 'Estado é obrigatório.';
    if (!data.cep || !data.cep.trim()) errors.cep = 'CEP é obrigatório.';
    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors
    };
  },

  validateChamado: function (data) {
    const errors = {};
    if (!data.condominio_id) errors.condominio_id = 'Selecione um condomínio.';
    if (!data.tipo_id) errors.tipo_id = 'Selecione o tipo de chamado.';
    if (!data.solicitante_nome || !data.solicitante_nome.trim()) errors.solicitante_nome = 'Nome do solicitante é obrigatório.';
    if (!data.titulo || !data.titulo.trim()) errors.titulo = 'Título é obrigatório.';
    if (!data.descricao || !data.descricao.trim()) errors.descricao = 'Descrição é obrigatória.';
    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors
    };
  }
};
