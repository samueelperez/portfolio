import OpenAI from 'openai'

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!openaiApiKey) {
  throw new Error('Missing OpenAI API key. Please set VITE_OPENAI_API_KEY in your environment variables.')
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
  dangerouslyAllowBrowser: true // Solo para desarrollo - en producción usar backend
})

// Función helper para limpiar y parsear JSON de la respuesta de IA
const parseAIResponse = (response: string): any => {
  // Limpiar la respuesta de markdown si viene con ```json
  let cleanResponse = response.trim()
  if (cleanResponse.startsWith('```json')) {
    cleanResponse = cleanResponse.replace(/^```json\n/, '').replace(/\n```$/, '')
  } else if (cleanResponse.startsWith('```')) {
    cleanResponse = cleanResponse.replace(/^```\n/, '').replace(/\n```$/, '')
  }
  
  try {
    return JSON.parse(cleanResponse)
  } catch (parseError) {
    console.error('Error parsing JSON response:', parseError)
    console.log('Raw response:', response)
    console.log('Clean response:', cleanResponse)
    throw new Error('Respuesta de IA no válida')
  }
}

export default openai

// Funciones de IA para ciberseguridad
export const generateLearningPath = async (
  userProfile: any,
  existingConcepts: any[],
  targetArea: string
): Promise<any> => {
  try {
    const prompt = `
Eres un experto en ciberseguridad que diseña rutas de aprendizaje personalizadas.

Perfil del usuario:
- Nivel: ${userProfile.level}
- Intereses: ${userProfile.interests.join(', ')}
- Estilo de aprendizaje: ${userProfile.learningStyle}
- Tiempo disponible: ${userProfile.timeAvailable}
- Objetivos: ${userProfile.goals.join(', ')}

Conceptos ya completados: ${existingConcepts.map(c => c.title).join(', ')}

Área objetivo: ${targetArea}

Genera una ruta de aprendizaje estructurada que incluya:
1. Título descriptivo
2. Descripción detallada
3. Lista de conceptos en orden de aprendizaje
4. Prerrequisitos claros
5. Objetivos de aprendizaje específicos
6. Tiempo estimado realista

Responde en formato JSON:
{
  "title": "Título de la ruta",
  "description": "Descripción detallada",
  "category": "categoría",
  "difficulty": "Beginner|Intermediate|Advanced|Expert",
  "estimated_time": "X horas/días",
  "concepts": ["concepto1", "concepto2", ...],
  "prerequisites": ["prerrequisito1", "prerrequisito2", ...],
  "learning_objectives": ["objetivo1", "objetivo2", ...]
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un experto en ciberseguridad especializado en diseño de rutas de aprendizaje. Responde siempre en formato JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const response = completion.choices[0]?.message?.content
    if (response) {
      return parseAIResponse(response)
    }
    
    throw new Error('No se pudo generar la ruta de aprendizaje')
  } catch (error) {
    console.error('Error generando ruta de aprendizaje:', error)
    throw error
  }
}

export const analyzeKnowledgeGaps = async (
  userProfile: any,
  existingConcepts: any[],
  allConcepts: any[]
): Promise<any> => {
  try {
    const prompt = `
Eres un experto en ciberseguridad que analiza gaps de conocimiento.

Perfil del usuario:
- Nivel: ${userProfile.level}
- Intereses: ${userProfile.interests.join(', ')}
- Conceptos completados: ${existingConcepts.map(c => c.title).join(', ')}

Todos los conceptos disponibles: ${allConcepts.map(c => `${c.title} (${c.category}, ${c.difficulty})`).join(', ')}

Analiza y responde en formato JSON:
{
  "gaps": [
    {
      "category": "categoría",
      "missing_concepts": ["concepto1", "concepto2"],
      "priority": "high|medium|low",
      "reason": "explicación"
    }
  ],
  "recommendations": [
    {
      "concept": "nombre del concepto",
      "priority": "high|medium|low",
      "reason": "por qué es importante aprenderlo ahora"
    }
  ],
  "next_steps": ["paso1", "paso2", "paso3"]
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un experto en ciberseguridad especializado en análisis de gaps de conocimiento. Responde siempre en formato JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 800
    })

    const response = completion.choices[0]?.message?.content
    if (response) {
      return parseAIResponse(response)
    }
    
    throw new Error('No se pudo analizar los gaps de conocimiento')
  } catch (error) {
    console.error('Error analizando gaps de conocimiento:', error)
    throw error
  }
}

export const suggestNextConcept = async (
  userProfile: any,
  completedConcepts: any[],
  allConcepts: any[]
): Promise<any> => {
  try {
    const prompt = `
Eres un experto en ciberseguridad que diseña rutas de aprendizaje para convertir a alguien en experto completo.

PERFIL DEL USUARIO:
- Nivel actual: ${userProfile.level}
- Intereses: ${userProfile.interests.join(', ')}
- Conceptos completados: ${completedConcepts.map(c => c.title).join(', ')}
- Plataforma: ${userProfile.platform} (Mac M1 con chip Apple Silicon)
- Herramientas disponibles: ${userProfile.tools.join(', ')}

OBJETIVOS AMBICIOSOS DEL USUARIO:
- Metas a largo plazo: ${userProfile.longTermGoals.join(', ')}
- Especializaciones objetivo: ${userProfile.targetSpecializations.join(', ')}
- Certificaciones objetivo: ${userProfile.targetCertifications.join(', ')}
- Aspiraciones profesionales: ${userProfile.careerAspirations.join(', ')}

Conceptos disponibles en biblioteca: ${allConcepts.map(c => `${c.title} (${c.category}, ${c.difficulty})`).join(', ')}

INSTRUCCIONES ESPECÍFICAS:
1. El usuario quiere convertirse en EXPERTO en TODAS las ramas de ciberseguridad
2. Debes crear un plan que cubra Red Team, Blue Team, Forense Digital, y más
3. Considera que el usuario tiene tiempo disponible: ${userProfile.timeAvailable}
4. El plan debe ser ambicioso pero estructurado y progresivo
5. Incluye tanto conceptos teóricos como guías prácticas
6. Considera las certificaciones objetivo para estructurar el aprendizaje
7. Balancea las diferentes especializaciones para crear un perfil completo

ADAPTACIÓN ESPECÍFICA PARA MAC M1:
- Todas las herramientas y comandos deben ser compatibles con macOS y Apple Silicon
- Usar Homebrew para instalaciones: brew install [herramienta]
- Considerar herramientas nativas de macOS cuando sea posible
- Adaptar comandos de Linux a equivalentes de macOS
- Incluir configuraciones específicas para M1 (Rosetta 2, ARM64, etc.)
- Sugerir alternativas nativas de macOS cuando las herramientas Linux no estén disponibles
- Considerar Docker Desktop para Mac M1 para herramientas que requieran Linux
- Incluir configuraciones de Terminal.app o iTerm2 específicas

Sugiere el siguiente paso de aprendizaje que puede ser:
1. Un concepto teórico avanzado
2. Una guía práctica especializada adaptada para Mac M1
3. Un roadmap completo para una especialización específica
4. Preparación para una certificación específica

Responde en formato JSON:
{
  "suggested_concept": "Nombre del concepto o área principal",
  "reason": "Explicación detallada de por qué este es el siguiente paso lógico hacia tus metas ambiciosas, considerando tu Mac M1",
  "difficulty_match": "Cómo se ajusta a tu nivel actual y objetivos",
  "prerequisites_met": true/false,
  "estimated_time": "Tiempo estimado total",
  "specialization_focus": "Red Team/Blue Team/Forense/etc",
  "certification_alignment": "Certificación relacionada si aplica",
  "platform_adaptation": "Adaptaciones específicas para Mac M1",
  "roadmap": [
    {
      "type": "concept" o "guide",
      "title": "Título del concepto o guía",
      "description": "Descripción breve",
      "time": "Tiempo estimado para este paso",
      "specialization": "Red Team/Blue Team/Forense/etc",
      "mac_commands": "Comandos específicos para Mac M1",
      "installation": "Instrucciones de instalación para Mac M1"
    }
  ],
  "related_concepts": ["concepto1", "concepto2", "concepto3"],
  "next_milestone": "Próximo hito importante en tu camino hacia la excelencia",
  "mac_tools": ["herramienta1", "herramienta2", "herramienta3"]
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un experto en ciberseguridad especializado en crear rutas de aprendizaje para convertir a principiantes en expertos completos. Diseñas planes ambiciosos pero estructurados que cubren todas las ramas de ciberseguridad. Tienes conocimiento profundo de macOS y Apple Silicon (M1/M2) y adaptas todas las herramientas y comandos específicamente para esta plataforma. Responde siempre en formato JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
    })

    const response = completion.choices[0]?.message?.content
    if (response) {
      return parseAIResponse(response)
    }
    
    throw new Error('No se pudo sugerir el siguiente concepto')
  } catch (error) {
    console.error('Error sugiriendo siguiente concepto:', error)
    throw error
  }
}

export const explainConcept = async (
  conceptTitle: string,
  userLevel: string,
  additionalContext?: string
): Promise<string> => {
  try {
    const prompt = `
Eres un experto en ciberseguridad que explica conceptos de manera clara y adaptada al nivel del usuario.

Concepto a explicar: ${conceptTitle}
Nivel del usuario: ${userLevel}
Plataforma del usuario: Mac M1 (Apple Silicon)
${additionalContext ? `Contexto adicional: ${additionalContext}` : ''}

Proporciona una explicación:
1. Clara y comprensible para el nivel ${userLevel}
2. Con ejemplos prácticos cuando sea posible
3. Relacionando con conceptos de ciberseguridad
4. Incluyendo casos de uso reales
5. Con consejos de seguridad relevantes
6. Adaptada específicamente para Mac M1 y macOS
7. Incluyendo comandos y herramientas compatibles con Apple Silicon
8. Considerando Homebrew, Terminal.app, y herramientas nativas de macOS

ADAPTACIONES PARA MAC M1:
- Usar comandos de macOS en lugar de Linux cuando sea posible
- Sugerir instalación con Homebrew: brew install [herramienta]
- Considerar alternativas nativas de macOS
- Incluir configuraciones específicas para M1 (ARM64)
- Mencionar Docker Desktop para Mac M1 cuando sea necesario
- Adaptar rutas de archivos a la estructura de macOS

Formato la respuesta en markdown con secciones claras.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un experto en ciberseguridad especializado en educación. Explicas conceptos de manera clara y práctica, con conocimiento profundo de macOS y Apple Silicon (M1/M2). Adaptas todas las herramientas, comandos y configuraciones específicamente para esta plataforma."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    return completion.choices[0]?.message?.content || 'No se pudo generar la explicación'
  } catch (error) {
    console.error('Error explicando concepto:', error)
    return 'Error al generar la explicación. Por favor, intenta de nuevo.'
  }
}

// Funciones para el sistema de ayuda de tareas
export const generateTaskExplanation = async (task: any): Promise<string> => {
  try {
    // Si hay un item específico, enfocarse en ese
    const isSpecificItem = task.currentItem;
    
    const prompt = isSpecificItem ? `
Eres un experto en ciberseguridad que explica cómo completar un paso específico de aprendizaje.

PASO ESPECÍFICO A EXPLICAR:
Título: ${task.currentItem.title}
Tipo: ${task.currentItem.type}
Descripción: ${task.currentItem.description}
Tiempo estimado: ${task.currentItem.time}

CONTEXTO DE LA TAREA COMPLETA:
Título: ${task.title}
Descripción: ${task.description}

ROADMAP COMPLETO:
${task.items.map((item: any, index: number) => `${index + 1}. ${item.title} (${item.type})`).join('\n')}

SIGUIENTE PASO EN EL ROADMAP:
${task.items.find((item: any, index: number) => item.title === task.currentItem.title && index < task.items.length - 1) ? 
  task.items[task.items.findIndex((item: any) => item.title === task.currentItem.title) + 1].title : 
  'No hay siguiente paso (es el último del roadmap)'}

Proporciona una explicación detallada que incluya:
1. Explicación clara del paso específico y su importancia
2. Pasos detallados para completar este item específico
3. Herramientas y recursos necesarios para este paso
4. Comandos específicos y ejemplos prácticos
5. Posibles dificultades y cómo superarlas
6. Cómo verificar que este paso se completó correctamente
7. Conexión con el siguiente paso del roadmap

La explicación debe ser:
- Muy específica al paso actual
- Clara y estructurada paso a paso
- Práctica y aplicable
- Incluir comandos específicos cuando sea relevante
- Adaptada para un usuario que quiere convertirse en experto
- Motivacional y orientada a resultados

IMPORTANTE: Formatea la respuesta en markdown con una estructura SIMPLE y PRÁCTICA:

### [Título del Concepto]

#### 1. Explicación del Paso Específico y su Importancia
Explica de forma clara y directa:
- Qué es el concepto
- Por qué es importante en ciberseguridad
- Ejemplos prácticos de la vida real
- Cómo se relaciona con otros conceptos

#### 2. Pasos Detallados para Completar este Ítem
Plan semanal simple y directo:

**Semana 1:**
- **Día 1:** [Actividad específica] - Objetivo: [objetivo claro]
- **Día 2:** [Actividad específica] - Objetivo: [objetivo claro]
- **Día 3:** [Actividad específica] - Objetivo: [objetivo claro]
- **Día 4:** [Actividad específica] - Objetivo: [objetivo claro]
- **Día 5:** [Actividad específica] - Objetivo: [objetivo claro]
- **Día 6:** [Actividad específica] - Objetivo: [objetivo claro]
- **Día 7:** Revisión y consolidación - Objetivo: Asegurar comprensión completa

#### 3. Comandos Específicos y Ejemplos Prácticos
Incluye UN comando útil y práctico:

\`\`\`bash
[comando específico]
\`\`\`

Explica brevemente qué hace y cómo se relaciona con el concepto.

#### 4. Cómo Verificar que Este Paso se Completó Correctamente
Criterios simples:
- [Criterio 1]
- [Criterio 2]
- [Criterio 3]

#### 5. Conexión con el Siguiente Paso del Roadmap
Explica brevemente cómo este concepto te prepara para el siguiente paso del roadmap: ${task.items.find((item: any, index: number) => item.title === task.currentItem.title && index < task.items.length - 1) ? 
  task.items[task.items.findIndex((item: any) => item.title === task.currentItem.title) + 1].title : 
  'No hay siguiente paso (es el último del roadmap)'}.

**Formato importante:**
- Usa \`###\` para títulos principales
- Usa \`####\` para subtítulos
- Usa \`-\` para listas con viñetas
- Usa \`**texto**\` para negritas
- Usa \`\`\`bash\` para bloques de código
- Mantén un tono motivacional pero directo
- NO incluyas secciones de herramientas/recursos ni dificultades
` : `
Eres un experto en ciberseguridad que explica cómo completar tareas de aprendizaje paso a paso.

TAREA A EXPLICAR:
Título: ${task.title}
Descripción: ${task.description}
Items del roadmap: ${task.items.map((item: any) => `${item.title} (${item.type}) - ${item.description}`).join('\n')}

Proporciona una explicación detallada que incluya:
1. Resumen general de la tarea y su importancia
2. Pasos específicos para completar cada item del roadmap
3. Herramientas y recursos necesarios
4. Consejos prácticos y mejores prácticas
5. Posibles dificultades y cómo superarlas
6. Cómo verificar que cada paso se completó correctamente

La explicación debe ser:
- Clara y estructurada paso a paso
- Práctica y aplicable
- Incluir comandos específicos cuando sea relevante
- Adaptada para un usuario que quiere convertirse en experto
- Motivacional y orientada a resultados

IMPORTANTE: Formatea la respuesta en markdown con una estructura SIMPLE y PRÁCTICA:

### [Título de la Tarea Completa]

#### 1. Resumen General de la Tarea y su Importancia
Explica de forma clara y directa:
- El objetivo general de la tarea
- Por qué es importante para tu desarrollo en ciberseguridad
- Qué aprenderás al completarla

#### 2. Pasos Específicos para Completar cada Item del Roadmap
Plan simple para cada paso:

**Paso 1: [Nombre del paso]**
- **Objetivo:** [Objetivo específico]
- **Actividades:** [Lista de actividades]
- **Tiempo:** [Duración]

**Paso 2: [Nombre del paso]**
- **Objetivo:** [Objetivo específico]
- **Actividades:** [Lista de actividades]
- **Tiempo:** [Duración]

[Continuar para cada paso]

#### 3. Cómo Verificar que Cada Paso se Completó Correctamente
Criterios simples:
- [Criterio 1]
- [Criterio 2]
- [Criterio 3]

#### 4. Próximos Pasos Después de Completar la Tarea
Explica brevemente qué puedes aprender después.

**Formato importante:**
- Usa \`###\` para títulos principales
- Usa \`####\` para subtítulos
- Usa \`-\` para listas con viñetas
- Usa \`**texto**\` para negritas
- Usa \`\`\`bash\` para bloques de código
- Mantén un tono motivacional pero directo
- NO incluyas secciones de herramientas/recursos, consejos ni dificultades
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un experto en ciberseguridad especializado en guiar estudiantes paso a paso en su aprendizaje. Proporcionas explicaciones claras, prácticas y motivacionales."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const response = completion.choices[0]?.message?.content
    if (response) {
      return response
    }
    
    throw new Error('No se pudo generar la explicación de la tarea')
  } catch (error) {
    console.error('Error generando explicación de tarea:', error)
    throw error
  }
}

export const generateHelpChatResponse = async (
  task: any,
  userMessage: string,
  chatHistory: Array<{role: 'user' | 'assistant', content: string}>
): Promise<string> => {
  try {
    // Si hay un item específico, enfocarse en ese
    const isSpecificItem = task.currentItem;
    
    const prompt = isSpecificItem ? `
Eres un tutor experto en ciberseguridad que ayuda a un estudiante a completar un paso específico de una tarea.

CONTEXTO DEL PASO ESPECÍFICO:
Título del paso: ${task.currentItem.title}
Tipo: ${task.currentItem.type}
Descripción: ${task.currentItem.description}
Tiempo estimado: ${task.currentItem.time}

CONTEXTO DE LA TAREA COMPLETA:
Título: ${task.title}
Descripción: ${task.description}

HISTORIAL DEL CHAT:
${chatHistory.map(msg => `${msg.role === 'user' ? 'Estudiante' : 'Tutor'}: ${msg.content}`).join('\n')}

PREGUNTA ACTUAL DEL ESTUDIANTE:
${userMessage}

Proporciona una respuesta útil que:
1. Responda directamente a la pregunta del estudiante sobre este paso específico
2. Sea muy específica al contexto del paso actual
3. Incluya ejemplos prácticos y comandos específicos cuando sea relevante
4. Sea motivacional y alentadora
5. Sugiera cómo proceder con este paso específico
6. Mantenga un tono profesional pero amigable

La respuesta debe ser:
- Muy específica al paso actual
- Clara y concisa
- Práctica y aplicable
- Incluir comandos específicos cuando sea relevante
- Motivacional para mantener el progreso
` : `
Eres un tutor experto en ciberseguridad que ayuda a un estudiante a completar una tarea específica.

CONTEXTO DE LA TAREA:
Título: ${task.title}
Descripción: ${task.description}
Items del roadmap: ${task.items.map((item: any) => `${item.title} (${item.type}) - ${item.description}`).join('\n')}

HISTORIAL DEL CHAT:
${chatHistory.map(msg => `${msg.role === 'user' ? 'Estudiante' : 'Tutor'}: ${msg.content}`).join('\n')}

PREGUNTA ACTUAL DEL ESTUDIANTE:
${userMessage}

Proporciona una respuesta útil que:
1. Responda directamente a la pregunta del estudiante
2. Sea específica al contexto de la tarea actual
3. Incluya ejemplos prácticos cuando sea relevante
4. Sea motivacional y alentadora
5. Sugiera próximos pasos si es apropiado
6. Mantenga un tono profesional pero amigable

La respuesta debe ser:
- Clara y concisa
- Práctica y aplicable
- Específica al contexto de la tarea
- Motivacional para mantener el progreso
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un tutor experto en ciberseguridad que ayuda a estudiantes a completar tareas de aprendizaje. Proporcionas respuestas claras, prácticas y motivacionales."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const response = completion.choices[0]?.message?.content
    if (response) {
      return response
    }
    
    throw new Error('No se pudo generar la respuesta del chat')
  } catch (error) {
    console.error('Error generando respuesta del chat:', error)
    throw error
  }
} 