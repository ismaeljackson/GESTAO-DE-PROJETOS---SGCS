-- ============================================================
-- SGCS - Sistema de Gerenciamento de Chamados para Síndicos
-- Schema SQL para Supabase (PostgreSQL 15+)
-- Versão: 1.0
-- Data: 16/09/2026
-- ============================================================

-- ============================================================
-- EXTENSOES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABELA: PROFILES (estende auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_completo TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'sindico' CHECK (role IN ('sindico', 'admin', 'morador')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'Perfis de usuario que estendem auth.users do Supabase Auth';

-- ============================================================
-- TABELA: CONDOMINIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS condominios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL,
    cep TEXT,
    quantidade_unidades INTEGER DEFAULT 0 CHECK (quantidade_unidades >= 0),
    sindico_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE condominios IS 'Condominios gerenciados pelos sindicos';

-- ============================================================
-- TABELA: TIPOS_CHAMADO
-- ============================================================
CREATE TABLE IF NOT EXISTS tipos_chamado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    cor TEXT NOT NULL DEFAULT '#3B82F6',
    icone TEXT NOT NULL DEFAULT 'file-text',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE tipos_chamado IS 'Tipos/categorias de chamados (Manutencao, Seguranca, etc)';

-- ============================================================
-- TABELA: SUBTIPOS_CHAMADO
-- ============================================================
CREATE TABLE IF NOT EXISTS subtipos_chamado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_id UUID NOT NULL REFERENCES tipos_chamado(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE subtipos_chamado IS 'Subcategorias vinculadas aos tipos de chamado';

-- ============================================================
-- TABELA: CHAMADOS
-- ============================================================
CREATE TABLE IF NOT EXISTS chamados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_sequencial SERIAL,
    condominio_id UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
    tipo_id UUID NOT NULL REFERENCES tipos_chamado(id),
    subtipo_id UUID REFERENCES subtipos_chamado(id),

    -- Solicitante
    solicitante_nome TEXT NOT NULL,
    solicitante_email TEXT,
    solicitante_telefone TEXT,
    solicitante_unidade TEXT,

    -- Conteudo
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    prioridade TEXT NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    status TEXT NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_andamento', 'aguardando', 'resolvido', 'cancelado', 'reaberto')),

    -- Responsavel
    responsavel_id UUID REFERENCES profiles(id),

    -- Datas
    data_abertura TIMESTAMPTZ DEFAULT NOW(),
    data_previsao TIMESTAMPTZ,
    data_encerramento TIMESTAMPTZ,

    -- Auditoria
    criado_por UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE chamados IS 'Chamados/demandas dos condominos';

-- ============================================================
-- TABELA: CHAMADO_TIMELINE
-- ============================================================
CREATE TABLE IF NOT EXISTS chamado_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chamado_id UUID NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES profiles(id),
    tipo_evento TEXT NOT NULL CHECK (tipo_evento IN ('criacao', 'status_alterado', 'prioridade_alterada', 'comentario', 'anexo', 'encerramento', 'reabertura')),
    descricao TEXT NOT NULL,
    dados_adicionais JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE chamado_timeline IS 'Timeline/historico de eventos de cada chamado';

-- ============================================================
-- TABELA: CHAMADO_ANEXOS
-- ============================================================
CREATE TABLE IF NOT EXISTS chamado_anexos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chamado_id UUID NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
    nome_arquivo TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    tipo_mime TEXT,
    tamanho_bytes INTEGER,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE chamado_anexos IS 'Anexos/arquivos vinculados aos chamados';

-- ============================================================
-- TABELA: NOTIFICACOES
-- ============================================================
CREATE TABLE IF NOT EXISTS notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'info' CHECK (tipo IN ('info', 'sucesso', 'aviso', 'erro')),
    referencia_tipo TEXT,
    referencia_id UUID,
    lida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE notificacoes IS 'Notificacoes internas para os usuarios';

-- ============================================================
-- INDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_condominios_sindico ON condominios(sindico_id);
CREATE INDEX IF NOT EXISTS idx_condominios_ativo ON condominios(ativo);

CREATE INDEX IF NOT EXISTS idx_subtipos_tipo ON subtipos_chamado(tipo_id);
CREATE INDEX IF NOT EXISTS idx_subtipos_ativo ON subtipos_chamado(ativo);

CREATE INDEX IF NOT EXISTS idx_chamados_condominio ON chamados(condominio_id);
CREATE INDEX IF NOT EXISTS idx_chamados_status ON chamados(status);
CREATE INDEX IF NOT EXISTS idx_chamados_prioridade ON chamados(prioridade);
CREATE INDEX IF NOT EXISTS idx_chamados_criado_por ON chamados(criado_por);
CREATE INDEX IF NOT EXISTS idx_chamados_responsavel ON chamados(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_chamados_data_abertura ON chamados(data_abertura DESC);

CREATE INDEX IF NOT EXISTS idx_timeline_chamado ON chamado_timeline(chamado_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_autor ON chamado_timeline(autor_id);

CREATE INDEX IF NOT EXISTS idx_anexos_chamado ON chamado_anexos(chamado_id);

CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes(usuario_id, lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_created ON notificacoes(created_at DESC);

-- ============================================================
-- FUNCOES
-- ============================================================

-- Funcao: atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funcao: criar profile automaticamente ao registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nome_completo, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.email),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'sindico')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funcao: criar evento de timeline ao inserir chamado
CREATE OR REPLACE FUNCTION handle_chamado_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO chamado_timeline (chamado_id, autor_id, tipo_evento, descricao, dados_adicionais)
    VALUES (
        NEW.id,
        NEW.criado_por,
        'criacao',
        'Chamado criado',
        jsonb_build_object(
            'numero', NEW.numero_sequencial,
            'titulo', NEW.titulo,
            'status', NEW.status,
            'prioridade', NEW.prioridade
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funcao: criar notificacao ao alterar status do chamado
CREATE OR REPLACE FUNCTION handle_chamado_status_change()
RETURNS TRIGGER AS $$
DECLARE
    v_sindico_id UUID;
BEGIN
    -- Busca o sindico do condominio
    SELECT sindico_id INTO v_sindico_id
    FROM condominios
    WHERE id = NEW.condominio_id;

    -- So notifica se o status mudou
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO notificacoes (usuario_id, titulo, mensagem, tipo, referencia_tipo, referencia_id)
        VALUES (
            v_sindico_id,
            'Status alterado',
            'Chamado #' || NEW.numero_sequencial || ' mudou de ' || OLD.status || ' para ' || NEW.status,
            'info',
            'chamado',
            NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funcao: estatisticas do dashboard
CREATE OR REPLACE FUNCTION get_dashboard_stats(p_sindico_id UUID)
RETURNS TABLE (
    total_condominios BIGINT,
    chamados_abertos BIGINT,
    chamados_em_andamento BIGINT,
    chamados_resolvidos_mes BIGINT,
    chamados_urgentes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM condominios WHERE sindico_id = p_sindico_id AND ativo = TRUE) AS total_condominios,
        (SELECT COUNT(*) FROM chamados c
         JOIN condominios cond ON c.condominio_id = cond.id
         WHERE cond.sindico_id = p_sindico_id AND c.status = 'aberto') AS chamados_abertos,
        (SELECT COUNT(*) FROM chamados c
         JOIN condominios cond ON c.condominio_id = cond.id
         WHERE cond.sindico_id = p_sindico_id AND c.status = 'em_andamento') AS chamados_em_andamento,
        (SELECT COUNT(*) FROM chamados c
         JOIN condominios cond ON c.condominio_id = cond.id
         WHERE cond.sindico_id = p_sindico_id AND c.status = 'resolvido'
         AND c.data_encerramento >= DATE_TRUNC('month', NOW())) AS chamados_resolvidos_mes,
        (SELECT COUNT(*) FROM chamados c
         JOIN condominios cond ON c.condominio_id = cond.id
         WHERE cond.sindico_id = p_sindico_id AND c.prioridade = 'urgente' AND c.status NOT IN ('resolvido', 'cancelado')) AS chamados_urgentes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Trigger: atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_condominios_updated_at
    BEFORE UPDATE ON condominios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chamados_updated_at
    BEFORE UPDATE ON chamados
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: criar profile ao registrar usuario
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: criar timeline ao inserir chamado
CREATE TRIGGER on_chamado_created
    AFTER INSERT ON chamados
    FOR EACH ROW EXECUTE FUNCTION handle_chamado_insert();

-- Trigger: notificar ao alterar status do chamado
CREATE TRIGGER on_chamado_status_updated
    AFTER UPDATE ON chamados
    FOR EACH ROW EXECUTE FUNCTION handle_chamado_status_change();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios veem seu proprio perfil"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Usuarios atualizam seu proprio perfil"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Condominios
ALTER TABLE condominios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sindico ve seus condominios"
ON condominios FOR ALL
USING (sindico_id = auth.uid());

-- Tipos de chamado (visiveis para todos autenticados, editaveis apenas por admin)
ALTER TABLE tipos_chamado ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tipos visiveis para autenticados"
ON tipos_chamado FOR SELECT
TO authenticated
USING (TRUE);

CREATE POLICY "Tipos editaveis por admin"
ON tipos_chamado FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Subtipos de chamado
ALTER TABLE subtipos_chamado ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subtipos visiveis para autenticados"
ON subtipos_chamado FOR SELECT
TO authenticated
USING (TRUE);

CREATE POLICY "Subtipos editaveis por admin"
ON subtipos_chamado FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Chamados
ALTER TABLE chamados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sindico ve chamados de seus condominios"
ON chamados FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM condominios
        WHERE condominios.id = chamados.condominio_id
        AND condominios.sindico_id = auth.uid()
    )
);

-- Chamado Timeline
ALTER TABLE chamado_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sindico ve timeline de seus chamados"
ON chamado_timeline FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM chamados
        JOIN condominios ON chamados.condominio_id = condominios.id
        WHERE chamados.id = chamado_timeline.chamado_id
        AND condominios.sindico_id = auth.uid()
    )
);

-- Chamado Anexos
ALTER TABLE chamado_anexos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sindico ve anexos de seus chamados"
ON chamado_anexos FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM chamados
        JOIN condominios ON chamados.condominio_id = condominios.id
        WHERE chamados.id = chamado_anexos.chamado_id
        AND condominios.sindico_id = auth.uid()
    )
);

-- Notificacoes
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve suas proprias notificacoes"
ON notificacoes FOR ALL
USING (usuario_id = auth.uid());

-- ============================================================
-- SEED: TIPOS DE CHAMADO PADRAO
-- ============================================================
INSERT INTO tipos_chamado (nome, descricao, cor, icone) VALUES
('Manutencao', 'Problemas de manutencao predial, reparos e conservacao', '#3B82F6', 'wrench'),
('Seguranca', 'Questoes relacionadas a seguranca do condominio', '#EF4444', 'shield'),
('Limpeza', 'Servicos de limpeza, higienizacao e conservacao de areas comuns', '#10B981', 'sparkles'),
('Financeiro', 'Assuntos financeiros, cobrancas, inadimplencia e orcamentos', '#F59E0B', 'dollar-sign'),
('Administrativo', 'Documentacao, assembleias, comunicados e questoes administrativas', '#8B5CF6', 'file-text'),
('Reclamacao', 'Reclamacoes de moradores sobre ruidos, convivencia ou outros', '#EC4899', 'message-circle')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: SUBTIPOS DE CHAMADO PADRAO
-- ============================================================
INSERT INTO subtipos_chamado (tipo_id, nome, descricao) VALUES
-- Manutencao
((SELECT id FROM tipos_chamado WHERE nome = 'Manutencao'), 'Hidraulica', 'Vazamentos, encanamentos, torneiras, caixa dagua'),
((SELECT id FROM tipos_chamado WHERE nome = 'Manutencao'), 'Eletrica', 'Quedas de energia, lampadas, disjuntores, tomadas'),
((SELECT id FROM tipos_chamado WHERE nome = 'Manutencao'), 'Elevador', 'Falhas, manutencao preventiva e corretiva de elevadores'),
-- Seguranca
((SELECT id FROM tipos_chamado WHERE nome = 'Seguranca'), 'Portaria', 'Falhas na portaria, controle de acesso, portoes'),
((SELECT id FROM tipos_chamado WHERE nome = 'Seguranca'), 'CFTV', 'Cameras de seguranca, gravacao, monitoramento'),
-- Limpeza
((SELECT id FROM tipos_chamado WHERE nome = 'Limpeza'), 'Area Comum', 'Limpeza de halls, escadas, salao de festas, piscina'),
((SELECT id FROM tipos_chamado WHERE nome = 'Limpeza'), 'Coleta de Lixo', 'Coleta seletiva, descarte irregular, lixeiras'),
-- Financeiro
((SELECT id FROM tipos_chamado WHERE nome = 'Financeiro'), 'Inadimplencia', 'Moradores inadimplentes, negociacao, cobranca'),
((SELECT id FROM tipos_chamado WHERE nome = 'Financeiro'), 'Orcamento', 'Orcamentos de obras, servicos e compras'),
-- Administrativo
((SELECT id FROM tipos_chamado WHERE nome = 'Administrativo'), 'Assembleia', 'Convocacao, atas, votacoes e decisoes de assembleia'),
((SELECT id FROM tipos_chamado WHERE nome = 'Administrativo'), 'Documentacao', 'Registro de atas, contratos, documentos legais'),
-- Reclamacao
((SELECT id FROM tipos_chamado WHERE nome = 'Reclamacao'), 'Ruido', 'Reclamacoes de barulho excessivo, horarios indevidos'),
((SELECT id FROM tipos_chamado WHERE nome = 'Reclamacao'), 'Convivencia', 'Conflitos entre moradores, estacionamento, pets')
ON CONFLICT DO NOTHING;

-- ============================================================
-- CONFIGURACAO DE STORAGE (executar via Dashboard do Supabase)
-- ============================================================
-- Criar buckets manualmente no Dashboard do Supabase:
-- 1. Bucket: "chamado-anexos" (Privado)
--    - Pasta: chamado-{uuid}/
--    - Tipos permitidos: image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
--    - Tamanho maximo: 5MB
--
-- 2. Bucket: "avatars" (Privado)
--    - Pasta: user-{uuid}/
--    - Tipos permitidos: image/*
--    - Tamanho maximo: 2MB
--
-- RLS dos buckets (executar no SQL Editor):
--
-- CREATE POLICY "Sindico acessa anexos de seus chamados"
-- ON storage.objects FOR ALL
-- USING (
--     bucket_id = 'chamado-anexos'
--     AND EXISTS (
--         SELECT 1 FROM chamados c
--         JOIN condominios cond ON c.condominio_id = cond.id
--         WHERE cond.sindico_id = auth.uid()
--         AND storage.objects.name LIKE 'chamado-' || c.id || '/%'
--     )
-- );
--
-- CREATE POLICY "Usuario acessa seu proprio avatar"
-- ON storage.objects FOR ALL
-- USING (
--     bucket_id = 'avatars'
--     AND storage.objects.name LIKE 'user-' || auth.uid() || '/%'
-- );

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
