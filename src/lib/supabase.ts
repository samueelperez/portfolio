import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export interface CybersecurityKnowledge {
  id: string
  title: string
  content: string
  summary: string
  category: string
  subcategory: string
  tags: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  date_added: string
  last_updated: string
  sources: string[]
  related_concepts: string[]
  practical_examples: string[]
  tools: string[]
  status: 'draft' | 'complete' | 'review' | 'archived'
  importance: 'low' | 'medium' | 'high' | 'critical'
  type: 'concept' | 'technique' | 'tool' | 'vulnerability' | 'protocol' | 'framework'
}

export interface LearningPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  estimated_time: string
  concepts: string[]
  prerequisites: string[]
  learning_objectives: string[]
  status: 'active' | 'completed' | 'paused'
  progress: number
  current_concept_index: number
  created_at: string
  last_accessed: string
}

export interface UserProfile {
  id: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  interests: string[]
  completed_concepts: string[]
  current_path?: string
  learning_style: 'visual' | 'practical' | 'theoretical' | 'mixed'
  time_available: 'low' | 'medium' | 'high'
  goals: string[]
  long_term_goals: string[]
  target_specializations: string[]
  target_certifications: string[]
  career_aspirations: string[]
  platform: 'mac-m1' | 'mac-intel' | 'windows' | 'linux'
  tools: string[]
  created_at: string
  updated_at: string
} 