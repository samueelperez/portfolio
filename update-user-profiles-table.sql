-- Script para actualizar la tabla user_profiles con campos para objetivos ambiciosos y plataforma Mac M1
-- Ejecutar en Supabase SQL Editor

-- Agregar nuevas columnas para objetivos ambiciosos y plataforma
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS long_term_goals TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_specializations TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_certifications TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS career_aspirations TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'mac-m1',
ADD COLUMN IF NOT EXISTS tools TEXT[] DEFAULT '{}';

-- Actualizar la tabla con datos por defecto para el usuario existente
UPDATE user_profiles 
SET 
  long_term_goals = ARRAY[
    'Convertirse en experto en ciberseguridad',
    'Dominar todas las ramas: Red Team, Blue Team, Forense Digital',
    'Ser reconocido como uno de los mejores en el campo',
    'Contribuir al avance de la ciberseguridad'
  ],
  target_specializations = ARRAY[
    'Red Team (Penetration Testing)',
    'Blue Team (Defensa y Respuesta a Incidentes)',
    'Forense Digital (Digital Forensics)',
    'Análisis de Malware',
    'Seguridad de Aplicaciones Web',
    'Seguridad de Infraestructura',
    'Threat Intelligence',
    'Seguridad en la Nube'
  ],
  target_certifications = ARRAY[
    'OSCP (Offensive Security Certified Professional)',
    'CEH (Certified Ethical Hacker)',
    'CISSP (Certified Information Systems Security Professional)',
    'CISM (Certified Information Security Manager)',
    'GCFE (GIAC Certified Forensic Examiner)',
    'GCFA (GIAC Certified Forensic Analyst)',
    'AWS Security Specialty',
    'Azure Security Engineer'
  ],
  career_aspirations = ARRAY[
    'Líder de equipo de ciberseguridad',
    'Consultor senior en ciberseguridad',
    'Investigador de amenazas',
    'Arquitecto de seguridad',
    'Instructor de ciberseguridad',
    'Contribuir a la comunidad de seguridad'
  ],
  goals = ARRAY[
    'Dominar fundamentos sólidos de ciberseguridad',
    'Desarrollar habilidades prácticas avanzadas',
    'Construir una base de conocimiento completa'
  ],
  platform = 'mac-m1',
  tools = ARRAY[
    'Burp Suite',
    'SQLMap',
    'OWASP ZAP',
    'Nmap',
    'Zenmap',
    'NSE Scripts',
    'strace',
    'ltrace',
    'perf',
    'iotop',
    'top',
    'lsof',
    'netstat'
  ],
  time_available = 'high'
WHERE id = 'default-user';

-- Si no existe el usuario, crearlo
INSERT INTO user_profiles (
  id, 
  level, 
  interests, 
  completed_concepts, 
  learning_style, 
  time_available, 
  goals, 
  long_term_goals, 
  target_specializations, 
  target_certifications, 
  career_aspirations, 
  platform,
  tools,
  created_at, 
  updated_at
) 
SELECT 
  'default-user',
  'Beginner',
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  'mixed',
  'high',
  ARRAY[
    'Dominar fundamentos sólidos de ciberseguridad',
    'Desarrollar habilidades prácticas avanzadas',
    'Construir una base de conocimiento completa'
  ],
  ARRAY[
    'Convertirse en experto en ciberseguridad',
    'Dominar todas las ramas: Red Team, Blue Team, Forense Digital',
    'Ser reconocido como uno de los mejores en el campo',
    'Contribuir al avance de la ciberseguridad'
  ],
  ARRAY[
    'Red Team (Penetration Testing)',
    'Blue Team (Defensa y Respuesta a Incidentes)',
    'Forense Digital (Digital Forensics)',
    'Análisis de Malware',
    'Seguridad de Aplicaciones Web',
    'Seguridad de Infraestructura',
    'Threat Intelligence',
    'Seguridad en la Nube'
  ],
  ARRAY[
    'OSCP (Offensive Security Certified Professional)',
    'CEH (Certified Ethical Hacker)',
    'CISSP (Certified Information Systems Security Professional)',
    'CISM (Certified Information Security Manager)',
    'GCFE (GIAC Certified Forensic Examiner)',
    'GCFA (GIAC Certified Forensic Analyst)',
    'AWS Security Specialty',
    'Azure Security Engineer'
  ],
  ARRAY[
    'Líder de equipo de ciberseguridad',
    'Consultor senior en ciberseguridad',
    'Investigador de amenazas',
    'Arquitecto de seguridad',
    'Instructor de ciberseguridad',
    'Contribuir a la comunidad de seguridad'
  ],
  'mac-m1',
  ARRAY[
    'Burp Suite',
    'SQLMap',
    'OWASP ZAP',
    'Nmap',
    'Zenmap',
    'NSE Scripts',
    'strace',
    'ltrace',
    'perf',
    'iotop',
    'top',
    'lsof',
    'netstat'
  ],
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles WHERE id = 'default-user'
);

-- Verificar que los cambios se aplicaron correctamente
SELECT 
  id,
  level,
  platform,
  time_available,
  array_length(goals, 1) as goals_count,
  array_length(long_term_goals, 1) as long_term_goals_count,
  array_length(target_specializations, 1) as specializations_count,
  array_length(target_certifications, 1) as certifications_count,
  array_length(career_aspirations, 1) as aspirations_count,
  array_length(tools, 1) as tools_count
FROM user_profiles 
WHERE id = 'default-user'; 