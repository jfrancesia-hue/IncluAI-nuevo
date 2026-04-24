-- ============================================
-- IncluIA — Schema de Base de Datos (Supabase/PostgreSQL)
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: perfiles
-- Se crea automáticamente al registrarse un usuario
-- ============================================
CREATE TABLE perfiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  nivel_educativo TEXT,
  institucion TEXT,
  localidad TEXT,
  provincia TEXT DEFAULT 'No especificada',
  rol TEXT NOT NULL DEFAULT 'docente' CHECK (rol IN ('docente', 'admin')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basico', 'profesional', 'premium')),
  plan_activo_hasta TIMESTAMPTZ,
  consultas_mes INTEGER NOT NULL DEFAULT 0,
  mes_actual TEXT NOT NULL DEFAULT to_char(NOW(), 'YYYY-MM'), -- para resetear contador mensual
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsqueda por email
CREATE INDEX idx_perfiles_email ON perfiles(email);

-- ============================================
-- TABLA: consultas
-- Cada guía generada por la IA
-- ============================================
CREATE TABLE consultas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  nivel TEXT NOT NULL,
  subnivel TEXT,
  anio_grado TEXT,
  materia TEXT NOT NULL,
  contenido TEXT NOT NULL,
  discapacidades TEXT[] NOT NULL,
  cantidad_alumnos INTEGER NOT NULL DEFAULT 1,
  situacion_apoyo TEXT NOT NULL,
  contexto_aula TEXT,
  objetivo_clase TEXT,
  respuesta_ia TEXT,
  tokens_usados INTEGER,
  feedback_estrellas INTEGER CHECK (feedback_estrellas BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para consultas frecuentes
CREATE INDEX idx_consultas_user ON consultas(user_id);
CREATE INDEX idx_consultas_fecha ON consultas(created_at DESC);
CREATE INDEX idx_consultas_nivel ON consultas(nivel);
CREATE INDEX idx_consultas_discapacidades ON consultas USING GIN(discapacidades);

-- ============================================
-- TABLA: guias_guardadas
-- Cuando el docente guarda una guía en favoritos
-- ============================================
CREATE TABLE guias_guardadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consulta_id UUID NOT NULL REFERENCES consultas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  es_favorita BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guias_user ON guias_guardadas(user_id);

-- ============================================
-- TABLA: pagos
-- Registro de pagos de Mercado Pago
-- ============================================
CREATE TABLE pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  monto_ars NUMERIC(10,2) NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('basico', 'profesional', 'premium')),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado', 'devuelto')),
  mercadopago_payment_id TEXT,
  mercadopago_status TEXT,
  periodo_inicio TIMESTAMPTZ,
  periodo_fin TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pagos_user ON pagos(user_id);
CREATE INDEX idx_pagos_mp_id ON pagos(mercadopago_payment_id);

-- ============================================
-- FUNCIONES
-- ============================================

-- Función: resetear contador mensual si cambió el mes
CREATE OR REPLACE FUNCTION resetear_contador_mensual()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.mes_actual != to_char(NOW(), 'YYYY-MM') THEN
    NEW.consultas_mes := 0;
    NEW.mes_actual := to_char(NOW(), 'YYYY-MM');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_reset_mensual
  BEFORE UPDATE ON perfiles
  FOR EACH ROW
  EXECUTE FUNCTION resetear_contador_mensual();

-- Función: incrementar contador de consultas del docente
CREATE OR REPLACE FUNCTION incrementar_consultas(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_consultas INTEGER;
  v_mes TEXT;
BEGIN
  SELECT consultas_mes, mes_actual INTO v_consultas, v_mes
  FROM perfiles WHERE id = p_user_id;
  
  -- Si cambió el mes, resetear
  IF v_mes != to_char(NOW(), 'YYYY-MM') THEN
    v_consultas := 0;
  END IF;
  
  v_consultas := v_consultas + 1;
  
  UPDATE perfiles 
  SET consultas_mes = v_consultas,
      mes_actual = to_char(NOW(), 'YYYY-MM'),
      updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN v_consultas;
END;
$$ LANGUAGE plpgsql;

-- Función: crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO perfiles (id, nombre, apellido, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: crear perfil al registrarse
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE guias_guardadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;

-- Perfiles: cada usuario ve y edita solo su perfil
CREATE POLICY "Usuarios ven su propio perfil"
  ON perfiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuarios editan su propio perfil"
  ON perfiles FOR UPDATE
  USING (auth.uid() = id);

-- Consultas: cada usuario ve solo sus consultas
CREATE POLICY "Usuarios ven sus consultas"
  ON consultas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios crean sus consultas"
  ON consultas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios actualizan sus consultas (feedback)"
  ON consultas FOR UPDATE
  USING (auth.uid() = user_id);

-- Guías guardadas: cada usuario ve solo las suyas
CREATE POLICY "Usuarios ven sus guías"
  ON guias_guardadas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios guardan guías"
  ON guias_guardadas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios eliminan sus guías"
  ON guias_guardadas FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios actualizan sus guías"
  ON guias_guardadas FOR UPDATE
  USING (auth.uid() = user_id);

-- Pagos: cada usuario ve solo sus pagos
CREATE POLICY "Usuarios ven sus pagos"
  ON pagos FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- VISTA: estadísticas (para futuro panel admin)
-- ============================================
CREATE OR REPLACE VIEW estadisticas_generales AS
SELECT
  COUNT(DISTINCT p.id) AS total_docentes,
  COUNT(c.id) AS total_consultas,
  COUNT(CASE WHEN c.created_at > NOW() - INTERVAL '30 days' THEN 1 END) AS consultas_ultimo_mes,
  COUNT(CASE WHEN c.created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS consultas_ultima_semana,
  ROUND(AVG(c.feedback_estrellas), 2) AS promedio_feedback,
  COUNT(DISTINCT CASE WHEN p.plan = 'free' THEN p.id END) AS usuarios_free,
  COUNT(DISTINCT CASE WHEN p.plan = 'basico' THEN p.id END) AS usuarios_basico,
  COUNT(DISTINCT CASE WHEN p.plan = 'profesional' THEN p.id END) AS usuarios_profesional,
  COUNT(DISTINCT CASE WHEN p.plan = 'premium' THEN p.id END) AS usuarios_premium
FROM perfiles p
LEFT JOIN consultas c ON p.id = c.user_id;
