import { supabase, CybersecurityKnowledge, LearningPath, UserProfile } from './supabase'

// Funciones para CybersecurityKnowledge
export const getConcepts = async (): Promise<CybersecurityKnowledge[]> => {
  const { data, error } = await supabase
    .from('cybersecurity_concepts')
    .select('*')
    .order('date_added', { ascending: false })

  if (error) {
    console.error('Error fetching concepts:', error)
    return []
  }

  return data || []
}

export const addConcept = async (concept: Omit<CybersecurityKnowledge, 'id' | 'date_added' | 'last_updated'>): Promise<CybersecurityKnowledge | null> => {
  const now = new Date().toISOString()
  const newConcept = {
    ...concept,
    date_added: now,
    last_updated: now
  }

  const { data, error } = await supabase
    .from('cybersecurity_concepts')
    .insert([newConcept])
    .select()
    .single()

  if (error) {
    console.error('Error adding concept:', error)
    return null
  }

  return data
}

export const updateConcept = async (id: string, updates: Partial<CybersecurityKnowledge>): Promise<CybersecurityKnowledge | null> => {
  const { data, error } = await supabase
    .from('cybersecurity_concepts')
    .update({ ...updates, last_updated: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating concept:', error)
    return null
  }

  return data
}

export const deleteConcept = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('cybersecurity_concepts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting concept:', error)
    return false
  }

  return true
}

// Funciones para LearningPath
export const getLearningPaths = async (): Promise<LearningPath[]> => {
  const { data, error } = await supabase
    .from('learning_paths')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching learning paths:', error)
    return []
  }

  return data || []
}

export const addLearningPath = async (path: Omit<LearningPath, 'id' | 'created_at' | 'last_accessed'>): Promise<LearningPath | null> => {
  const now = new Date().toISOString()
  const newPath = {
    ...path,
    created_at: now,
    last_accessed: now
  }

  const { data, error } = await supabase
    .from('learning_paths')
    .insert([newPath])
    .select()
    .single()

  if (error) {
    console.error('Error adding learning path:', error)
    return null
  }

  return data
}

export const updateLearningPath = async (id: string, updates: Partial<LearningPath>): Promise<LearningPath | null> => {
  const { data, error } = await supabase
    .from('learning_paths')
    .update({ ...updates, last_accessed: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating learning path:', error)
    return null
  }

  return data
}

export const deleteLearningPath = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('learning_paths')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting learning path:', error)
    return false
  }

  return true
}

// Funciones para UserProfile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  // Por ahora usamos un ID fijo, en el futuro se puede implementar autenticación
  const userId = 'default-user'
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export const createUserProfile = async (profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile | null> => {
  const now = new Date().toISOString()
  const newProfile = {
    ...profile,
    id: 'default-user',
    created_at: now,
    updated_at: now
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .insert([newProfile])
    .select()
    .single()

  if (error) {
    console.error('Error creating user profile:', error)
    return null
  }

  return data
}

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  const userId = 'default-user'
  
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    return null
  }

  return data
}

// Función para migrar datos existentes
export const migrateExistingData = async (existingConcepts: any[]): Promise<void> => {
  console.log('Starting data migration...')
  
  for (const concept of existingConcepts) {
    // Convertir formato de datos existente al formato de Supabase
    const supabaseConcept = {
      title: concept.title,
      content: concept.content,
      summary: concept.summary,
      category: concept.category,
      subcategory: concept.subcategory,
      tags: concept.tags,
      difficulty: concept.difficulty,
      sources: concept.sources,
      related_concepts: concept.relatedConcepts,
      practical_examples: concept.practicalExamples,
      tools: concept.tools,
      status: concept.status,
      importance: concept.importance,
      type: concept.type
    }

    const result = await addConcept(supabaseConcept)
    if (result) {
      console.log(`Migrated concept: ${concept.title}`)
    } else {
      console.error(`Failed to migrate concept: ${concept.title}`)
    }
  }
  
  console.log('Data migration completed!')
} 