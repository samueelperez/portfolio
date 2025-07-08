-- Crear tabla para conceptos de ciberseguridad
CREATE TABLE cybersecurity_concepts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')) NOT NULL,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sources TEXT[] DEFAULT '{}',
  related_concepts TEXT[] DEFAULT '{}',
  practical_examples TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('draft', 'complete', 'review', 'archived')) DEFAULT 'complete',
  importance TEXT CHECK (importance IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  type TEXT CHECK (type IN ('concept', 'technique', 'tool', 'vulnerability', 'protocol', 'framework')) NOT NULL
);

-- Crear tabla para rutas de aprendizaje
CREATE TABLE learning_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')) NOT NULL,
  estimated_time TEXT NOT NULL,
  concepts TEXT[] DEFAULT '{}',
  prerequisites TEXT[] DEFAULT '{}',
  learning_objectives TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  current_concept_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para perfiles de usuario
CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')) DEFAULT 'Beginner',
  interests TEXT[] DEFAULT '{}',
  completed_concepts TEXT[] DEFAULT '{}',
  current_path TEXT,
  learning_style TEXT CHECK (learning_style IN ('visual', 'practical', 'theoretical', 'mixed')) DEFAULT 'mixed',
  time_available TEXT CHECK (time_available IN ('low', 'medium', 'high')) DEFAULT 'medium',
  goals TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_concepts_category ON cybersecurity_concepts(category);
CREATE INDEX idx_concepts_difficulty ON cybersecurity_concepts(difficulty);
CREATE INDEX idx_concepts_type ON cybersecurity_concepts(type);
CREATE INDEX idx_concepts_status ON cybersecurity_concepts(status);
CREATE INDEX idx_concepts_importance ON cybersecurity_concepts(importance);
CREATE INDEX idx_concepts_date_added ON cybersecurity_concepts(date_added);

CREATE INDEX idx_learning_paths_category ON learning_paths(category);
CREATE INDEX idx_learning_paths_status ON learning_paths(status);
CREATE INDEX idx_learning_paths_created_at ON learning_paths(created_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE cybersecurity_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para permitir acceso público (por ahora)
CREATE POLICY "Allow public read access to concepts" ON cybersecurity_concepts
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to concepts" ON cybersecurity_concepts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to concepts" ON cybersecurity_concepts
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to concepts" ON cybersecurity_concepts
  FOR DELETE USING (true);

CREATE POLICY "Allow public read access to learning paths" ON learning_paths
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to learning paths" ON learning_paths
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to learning paths" ON learning_paths
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to learning paths" ON learning_paths
  FOR DELETE USING (true);

CREATE POLICY "Allow public read access to user profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to user profiles" ON user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to user profiles" ON user_profiles
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to user profiles" ON user_profiles
  FOR DELETE USING (true); 