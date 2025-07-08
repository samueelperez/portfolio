# Configuración de Supabase

## 🚀 Pasos para configurar la base de datos

### 1. Acceder a Supabase Dashboard
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión con tu cuenta
3. Accede a tu proyecto: `rooxytiqwdinroifbomm`

### 2. Crear las tablas
1. Ve a la sección **SQL Editor**
2. Copia y pega el contenido del archivo `supabase-schema.sql`
3. Ejecuta el script SQL

### 3. Verificar la configuración
1. Ve a **Table Editor**
2. Deberías ver 3 tablas:
   - `cybersecurity_concepts`
   - `learning_paths`
   - `user_profiles`

### 4. Configurar variables de entorno (opcional)
Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://rooxytiqwdinroifbomm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvb3h5dGlxd2RpbnJvaWZib21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzMxOTgsImV4cCI6MjA2NzU0OTE5OH0.Gh8ZNpLR5fAd3jv2OkdI9G29T6pqyLc51g8medVKsN8
```

## 📊 Estructura de la Base de Datos

### Tabla: cybersecurity_concepts
- `id`: UUID (clave primaria)
- `title`: Título del concepto
- `content`: Contenido detallado
- `summary`: Resumen breve
- `category`: Categoría (web-security, network-security, etc.)
- `subcategory`: Subcategoría
- `tags`: Array de etiquetas
- `difficulty`: Nivel de dificultad
- `date_added`: Fecha de creación
- `last_updated`: Última actualización
- `sources`: Fuentes de información
- `related_concepts`: Conceptos relacionados
- `practical_examples`: Ejemplos prácticos
- `tools`: Herramientas relacionadas
- `status`: Estado del concepto
- `importance`: Nivel de importancia
- `type`: Tipo de contenido

### Tabla: learning_paths
- `id`: UUID (clave primaria)
- `title`: Título de la ruta
- `description`: Descripción
- `category`: Categoría
- `difficulty`: Dificultad
- `estimated_time`: Tiempo estimado
- `concepts`: Array de conceptos
- `prerequisites`: Prerrequisitos
- `learning_objectives`: Objetivos de aprendizaje
- `status`: Estado de la ruta
- `progress`: Progreso (0-100)
- `current_concept_index`: Índice del concepto actual
- `created_at`: Fecha de creación
- `last_accessed`: Último acceso

### Tabla: user_profiles
- `id`: ID del usuario
- `level`: Nivel del usuario
- `interests`: Intereses
- `completed_concepts`: Conceptos completados
- `current_path`: Ruta actual
- `learning_style`: Estilo de aprendizaje
- `time_available`: Tiempo disponible
- `goals`: Objetivos
- `created_at`: Fecha de creación
- `updated_at`: Última actualización

## 🔧 Funciones disponibles

### Conceptos
- `getConcepts()`: Obtener todos los conceptos
- `addConcept(concept)`: Agregar nuevo concepto
- `updateConcept(id, updates)`: Actualizar concepto
- `deleteConcept(id)`: Eliminar concepto

### Rutas de Aprendizaje
- `getLearningPaths()`: Obtener todas las rutas
- `addLearningPath(path)`: Agregar nueva ruta
- `updateLearningPath(id, updates)`: Actualizar ruta
- `deleteLearningPath(id)`: Eliminar ruta

### Perfiles de Usuario
- `getUserProfile()`: Obtener perfil del usuario
- `createUserProfile(profile)`: Crear perfil
- `updateUserProfile(updates)`: Actualizar perfil

### Migración
- `migrateExistingData(concepts)`: Migrar datos existentes

## 🚀 Uso

1. Ejecuta el servidor de desarrollo: `npm run dev`
2. Si la base de datos está vacía, verás un botón "Migrar Datos"
3. Haz clic en el botón para migrar los conceptos iniciales
4. ¡Listo! Tu biblioteca ahora usa Supabase

## 🔒 Seguridad

- Las tablas tienen Row Level Security (RLS) habilitado
- Por ahora, las políticas permiten acceso público
- En el futuro se puede implementar autenticación de usuarios

## 📈 Monitoreo

- Ve a **Logs** en Supabase para ver las consultas
- Usa **Table Editor** para ver los datos en tiempo real
- **Database** para ver la estructura de las tablas 