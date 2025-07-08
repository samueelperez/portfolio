import { useEffect, useRef, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { 
  BookOpen, 
  TrendingUp, 
  Target,
  Clock,
  Brain,
  Database,
  Lightbulb,
  Plus,
  Search,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Globe,
  Lock,
  Bug,
  Shield,
  Code,
  Terminal,
  Network,
  FileText,
  Book,
  Library,
  Tag,
  CheckCircle,
  Loader2,
  ArrowRight,
  Trophy,
  HelpCircle,
  MessageCircle,
  Send
} from 'lucide-react';
import { gsap } from 'gsap';
import { 
  getConcepts, 
  deleteConcept,
  getLearningPaths,
  migrateExistingData
} from '../lib/database';
import { supabase } from '../lib/supabase';
import { CybersecurityKnowledge, UserProfile } from '../lib/supabase';
import { 
  suggestNextConcept,
  generateTaskExplanation,
  generateHelpChatResponse
} from '../lib/openai';

export default function CybersecurityLibrary() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [newConceptType, setNewConceptType] = useState<'concept' | 'guide'>('concept');
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedEntry, setSelectedEntry] = useState<CybersecurityKnowledge | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<CybersecurityKnowledge | null>(null);
  const [showLearningPathsModal, setShowLearningPathsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showTasks, setShowTasks] = useState(false);
  const [showNextStepModal, setShowNextStepModal] = useState(false);
  const [completedTask, setCompletedTask] = useState<any>(null);
  
  // Estados para el sistema de ayuda
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [currentHelpTask, setCurrentHelpTask] = useState<any>(null);
  const [helpExplanation, setHelpExplanation] = useState<string>('');
  const [helpChatMessages, setHelpChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [helpChatInput, setHelpChatInput] = useState('');
  const [isLoadingHelp, setIsLoadingHelp] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'default-user',
    level: 'Beginner',
    interests: [],
    completed_concepts: [],
    learning_style: 'mixed',
    time_available: 'high',
    goals: [
      'Dominar fundamentos sólidos de ciberseguridad',
      'Desarrollar habilidades prácticas avanzadas',
      'Construir una base de conocimiento completa'
    ],
    long_term_goals: [
      'Convertirse en experto en ciberseguridad',
      'Dominar todas las ramas: Red Team, Blue Team, Forense Digital',
      'Ser reconocido como uno de los mejores en el campo',
      'Contribuir al avance de la ciberseguridad'
    ],
    target_specializations: [
      'Red Team (Penetration Testing)',
      'Blue Team (Defensa y Respuesta a Incidentes)',
      'Forense Digital (Digital Forensics)',
      'Análisis de Malware',
      'Seguridad de Aplicaciones Web',
      'Seguridad de Infraestructura',
      'Threat Intelligence',
      'Seguridad en la Nube'
    ],
    target_certifications: [
      'OSCP (Offensive Security Certified Professional)',
      'CEH (Certified Ethical Hacker)',
      'CISSP (Certified Information Systems Security Professional)',
      'CISM (Certified Information Security Manager)',
      'GCFE (GIAC Certified Forensic Examiner)',
      'GCFA (GIAC Certified Forensic Analyst)',
      'AWS Security Specialty',
      'Azure Security Engineer'
    ],
    career_aspirations: [
      'Líder de equipo de ciberseguridad',
      'Consultor senior en ciberseguridad',
      'Investigador de amenazas',
      'Arquitecto de seguridad',
      'Instructor de ciberseguridad',
      'Contribuir a la comunidad de seguridad'
    ],
    platform: 'mac-m1',
    tools: [
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  // Learning Paths State
  // const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  
  // Knowledge Base State
  const [knowledgeBase, setKnowledgeBase] = useState<CybersecurityKnowledge[]>([]);

  // Datos iniciales para migración
  const initialConcepts = [
    {
      id: '1',
      title: 'SQL Injection',
      content: 'SQL Injection es una técnica de ataque que permite a un atacante insertar código SQL malicioso en consultas de base de datos. Esto puede resultar en acceso no autorizado a datos sensibles, modificación de datos, o incluso la eliminación completa de una base de datos.\n\nTipos principales:\n1. Union-based SQL Injection\n2. Boolean-based SQL Injection\n3. Time-based SQL Injection\n4. Error-based SQL Injection\n\nPrevención:\n- Usar prepared statements\n- Validar y sanitizar inputs\n- Implementar WAF\n- Principio de menor privilegio',
      summary: 'Técnica de ataque que permite insertar código SQL malicioso en consultas de base de datos',
      category: 'web-security',
      subcategory: 'injection',
      tags: ['SQL Injection', 'OWASP', 'Database Security', 'Web Security'],
      difficulty: 'Intermediate',
      date_added: '2024-01-15T10:00:00Z',
      last_updated: '2024-01-15T10:00:00Z',
      sources: ['OWASP Top 10', 'PortSwigger Web Security Academy'],
      related_concepts: ['XSS', 'CSRF', 'Input Validation'],
      practicalExamples: ['DVWA SQL Injection Lab', 'Burp Suite Practice'],
      tools: ['Burp Suite', 'SQLMap', 'OWASP ZAP'],
      status: 'complete',
      importance: 'high',
      type: 'vulnerability'
    },
    {
      id: '2',
      title: 'Escaneo de Puertos con Nmap',
      content: 'Guía práctica para realizar escaneos de puertos usando Nmap, una herramienta esencial para auditorías de seguridad.\n\n## Requisitos Previos\n- Linux/Unix o Windows con Nmap instalado\n- Conocimientos básicos de redes\n- Permisos para escanear la red objetivo\n\n## Pasos del Escaneo\n\n### 1. Instalación de Nmap\n```bash\n# Ubuntu/Debian\nsudo apt update\nsudo apt install nmap\n\n# CentOS/RHEL\nsudo yum install nmap\n\n# macOS\nbrew install nmap\n```\n\n### 2. Escaneo Básico\n```bash\n# Escaneo de puertos comunes\nnmap 192.168.1.1\n\n# Escaneo de todos los puertos\nnmap -p- 192.168.1.1\n\n# Escaneo con detección de servicios\nnmap -sV 192.168.1.1\n```\n\n### 3. Escaneo Avanzado\n```bash\n# Escaneo sigiloso (SYN scan)\nnmap -sS 192.168.1.1\n\n# Escaneo con scripts de detección\nnmap --script=vuln 192.168.1.1\n\n# Escaneo de rango de IPs\nnmap 192.168.1.0/24\n```\n\n## Interpretación de Resultados\n- Puerto abierto: Servicio disponible\n- Puerto cerrado: No hay servicio\n- Puerto filtrado: Bloqueado por firewall\n\n## Mejores Prácticas\n- Siempre obtener autorización antes de escanear\n- Usar en entornos controlados\n- Documentar todos los escaneos\n- Respetar las políticas de red',
      summary: 'Guía práctica para realizar escaneos de puertos usando Nmap',
      category: 'network-security',
      subcategory: 'reconnaissance',
      tags: ['Nmap', 'Port Scanning', 'Network Security', 'Reconnaissance'],
      difficulty: 'Beginner',
      date_added: '2024-01-16T10:00:00Z',
      last_updated: '2024-01-16T10:00:00Z',
      sources: ['Nmap Official Documentation', 'HackTheBox Academy'],
      related_concepts: ['Network Reconnaissance', 'Port Scanning', 'Network Security'],
      practicalExamples: ['Escaneo de red local', 'Auditoría de servidores'],
      tools: ['Nmap', 'Zenmap', 'NSE Scripts'],
      status: 'complete',
      importance: 'high',
      type: 'guide'
    },
    {
      id: '3',
      title: 'Análisis de Procesos en Linux',
      content: 'Guía para analizar y gestionar procesos en sistemas Linux usando comandos de terminal.\n\n## Comandos Esenciales\n\n### 1. Ver Procesos Activos\n```bash\n# Listar todos los procesos\nps aux\n\n# Procesos en tiempo real\nhtop\n\n# Procesos de un usuario específico\nps -u username\n\n# Procesos con formato personalizado\nps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu\n```\n\n### 2. Información Detallada de Procesos\n```bash\n# Información de un proceso específico\nps -p PID -o pid,ppid,cmd,etime,pcpu,pmem\n\n# Ver procesos en árbol\npstree\n\n# Información de memoria\nfree -h\n\n# Uso de CPU\ntop\n```\n\n### 3. Gestión de Procesos\n```bash\n# Terminar proceso\nkill PID\n\n# Terminar proceso forzadamente\nkill -9 PID\n\n# Pausar proceso\nkill -STOP PID\n\n# Continuar proceso\nkill -CONT PID\n```\n\n### 4. Análisis de Recursos\n```bash\n# Uso de CPU por proceso\ntop -p PID\n\n# Uso de memoria\ncat /proc/PID/status\n\n# Archivos abiertos por proceso\nlsof -p PID\n\n# Conexiones de red\nnetstat -tulpn | grep PID\n```\n\n## Casos de Uso en Ciberseguridad\n- Detectar procesos maliciosos\n- Analizar consumo de recursos\n- Identificar conexiones sospechosas\n- Monitorear actividad del sistema\n\n## Herramientas Avanzadas\n- `strace`: Seguimiento de llamadas al sistema\n- `ltrace`: Seguimiento de llamadas a librerías\n- `perf`: Análisis de rendimiento\n- `iotop`: Monitoreo de I/O',
      summary: 'Guía para analizar y gestionar procesos en sistemas Linux',
      category: 'system-security',
      subcategory: 'monitoring',
      tags: ['Linux', 'Process Analysis', 'System Monitoring', 'Terminal'],
      difficulty: 'Beginner',
      date_added: '2024-01-17T10:00:00Z',
              last_updated: '2024-01-17T10:00:00Z',
      sources: ['Linux Documentation', 'Red Hat System Administration'],
              related_concepts: ['System Monitoring', 'Process Management', 'Linux Security'],
      practicalExamples: ['Detectar malware', 'Optimizar rendimiento'],
      tools: ['ps', 'htop', 'top', 'lsof', 'netstat'],
      status: 'complete',
      importance: 'medium',
      type: 'guide'
    }
  ];

  // Cargar datos desde Supabase
  const loadDataFromSupabase = async () => {
    setIsLoading(true);
    try {
      // Cargar conceptos
      const concepts = await getConcepts();
      setKnowledgeBase(concepts);
      
      // Cargar rutas de aprendizaje
      // const paths = await getLearningPaths();
      // setLearningPaths(paths);
      
      // Por ahora, usar perfil local en lugar de Supabase para evitar errores
      updateProfileFromConcepts();
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Migrar datos existentes a Supabase
  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      await migrateExistingData(initialConcepts);
      await loadDataFromSupabase(); // Recargar datos después de la migración
    } catch (error) {
      console.error('Error during migration:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  useEffect(() => {
    loadDataFromSupabase();
  }, []);

  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  const handleDeleteEntry = (entry: CybersecurityKnowledge) => {
    setEntryToDelete(entry);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (entryToDelete) {
      const success = await deleteConcept(entryToDelete.id);
      if (success) {
        setKnowledgeBase(prev => prev.filter(item => item.id !== entryToDelete.id));
        setShowDeleteModal(false);
        setEntryToDelete(null);
      } else {
        console.error('Failed to delete concept');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  // Función para crear nuevo concepto
  // const handleCreateConcept = async (conceptData: any) => {
  //   const newConcept = await addConcept(conceptData);
  //   if (newConcept) {
  //     setKnowledgeBase(prev => [newConcept, ...prev]);
  //     setShowAddModal(false);
  //   } else {
  //     console.error('Failed to create concept');
  //   }
  // };

  // Función para actualizar perfil de usuario
  // const handleUpdateUserProfile = async (updates: Partial<UserProfile>) => {
  //   const updatedProfile = await updateUserProfile(updates);
  //   if (updatedProfile) {
  //     setUserProfile(updatedProfile);
  //   }
  // };



  const getNextConceptSuggestion = async () => {
    try {
      setIsLoading(true);
      setShowSuggestion(false);
      setAiSuggestion(null);
      
      // Actualizar perfil automáticamente
      updateProfileFromConcepts();
      
      // Obtener conceptos completados
      const completedConcepts = knowledgeBase.filter(concept => 
        userProfile.completed_concepts.includes(concept.id)
      );
      
      // Si no hay conceptos, crear sugerencia básica
      if (knowledgeBase.length === 0) {
        setAiSuggestion({
          suggested_concept: "Fundamentos de Ciberseguridad",
          reason: "Como no tienes conceptos en tu biblioteca, te sugiero empezar con los fundamentos básicos de ciberseguridad. Esto te dará una base sólida para continuar aprendiendo.",
          difficulty_match: "Perfecto para principiantes",
          prerequisites_met: true,
          estimated_time: "2-3 semanas",
          roadmap: [
            {
              type: "concept",
              title: "Principios de Seguridad",
              description: "Confidencialidad, Integridad y Disponibilidad (CIA)",
              time: "1 semana"
            },
            {
              type: "guide",
              title: "Configuración Básica de Linux",
              description: "Instalar y configurar una máquina virtual Linux",
              time: "3-4 días"
            },
            {
              type: "guide",
              title: "Comandos Básicos de Terminal",
              description: "Navegación, gestión de archivos y permisos",
              time: "2-3 días"
            },
            {
              type: "guide",
              title: "Escaneo de Puertos con Nmap",
              description: "Aprender a realizar escaneos básicos de red",
              time: "1 semana"
            },
            {
              type: "concept",
              title: "Modelo OSI y TCP/IP",
              description: "Fundamentos de redes y comunicación",
              time: "1 semana"
            }
          ],
          related_concepts: ["Conceptos básicos de redes", "Introducción a vulnerabilidades web", "Principios de seguridad"]
        });
        setShowSuggestion(true);
        return;
      }
      
      // Obtener sugerencia de IA
      const suggestion = await suggestNextConcept(userProfile, completedConcepts, knowledgeBase);
      setAiSuggestion(suggestion);
      setShowSuggestion(true);
      
    } catch (error) {
      console.error('Error obteniendo sugerencia:', error);
      setAiSuggestion({
        suggested_concept: "Error al obtener sugerencia",
        reason: "Hubo un problema al analizar tu biblioteca. Por favor, intenta de nuevo.",
        difficulty_match: "N/A",
        prerequisites_met: false,
        estimated_time: "N/A",
        related_concepts: []
      });
      setShowSuggestion(true);
    } finally {
      setIsLoading(false);
    }
  };

  // const explainConceptWithAI = async (conceptTitle: string) => {
  //   try {
  //     setIsLoading(true);
  //     
  //     // Obtener explicación con IA
  //     const explanation = await explainConcept(conceptTitle, userProfile.level);
  //     
  //     // Mostrar explicación en un modal
  //     console.log('Explicación generada:', explanation);
  //     
  //     // Aquí podrías mostrar la explicación en un modal más elaborado
  //     alert(`Explicación de ${conceptTitle}:\n\n${explanation}`);
  //     
  //   } catch (error) {
  //     console.error('Error explicando concepto:', error);
  //     alert('Error al generar explicación. Por favor, intenta de nuevo.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const categories = [
    { id: 'all', name: 'Todas', icon: <Library className="h-4 w-4" />, color: 'bg-gray-100 text-gray-700' },
    { id: 'web-security', name: 'Seguridad Web', icon: <Globe className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700' },
    { id: 'network-security', name: 'Seguridad de Redes', icon: <Network className="h-4 w-4" />, color: 'bg-green-100 text-green-700' },
    { id: 'cryptography', name: 'Criptografía', icon: <Lock className="h-4 w-4" />, color: 'bg-purple-100 text-purple-700' },
    { id: 'penetration-testing', name: 'Testing de Penetración', icon: <Bug className="h-4 w-4" />, color: 'bg-red-100 text-red-700' },
    { id: 'digital-forensics', name: 'Forensia Digital', icon: <Search className="h-4 w-4" />, color: 'bg-orange-100 text-orange-700' }
  ];

  const types = [
    { id: 'all', name: 'Todos', icon: <Book className="h-4 w-4" /> },
    { id: 'concept', name: 'Conceptos', icon: <Lightbulb className="h-4 w-4" /> },
    { id: 'technique', name: 'Técnicas', icon: <Target className="h-4 w-4" /> },
    { id: 'tool', name: 'Herramientas', icon: <Terminal className="h-4 w-4" /> },
    { id: 'vulnerability', name: 'Vulnerabilidades', icon: <Shield className="h-4 w-4" /> },
    { id: 'protocol', name: 'Protocolos', icon: <Code className="h-4 w-4" /> },
    { id: 'framework', name: 'Frameworks', icon: <FileText className="h-4 w-4" /> }
  ];

  const filteredEntries = knowledgeBase.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesType = selectedType === 'all' || entry.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-orange-100 text-orange-700';
      case 'Expert': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'concept': return 'bg-blue-100 text-blue-700';
      case 'technique': return 'bg-purple-100 text-purple-700';
      case 'tool': return 'bg-green-100 text-green-700';
      case 'vulnerability': return 'bg-red-100 text-red-700';
      case 'protocol': return 'bg-orange-100 text-orange-700';
      case 'framework': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : <BookOpen className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-700';
  };

  const getTypeIcon = (type: string) => {
    const typeObj = types.find(t => t.id === type);
    return typeObj ? typeObj.icon : <Book className="h-4 w-4" />;
  };

  // Función para detectar automáticamente el nivel basándose en los conceptos
  const detectUserLevel = (concepts: CybersecurityKnowledge[]): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' => {
    if (concepts.length === 0) return 'Beginner';
    
    const difficultyCounts = {
      Beginner: 0,
      Intermediate: 0,
      Advanced: 0,
      Expert: 0
    };
    
    concepts.forEach(concept => {
      difficultyCounts[concept.difficulty]++;
    });
    
    const total = concepts.length;
    const beginnerRatio = difficultyCounts.Beginner / total;
    const intermediateRatio = difficultyCounts.Intermediate / total;
    const advancedRatio = difficultyCounts.Advanced / total;
    const expertRatio = difficultyCounts.Expert / total;
    
    if (expertRatio > 0.3 || (advancedRatio > 0.4 && total > 10)) return 'Expert';
    if (advancedRatio > 0.3 || (intermediateRatio > 0.5 && total > 8)) return 'Advanced';
    if (intermediateRatio > 0.4 || (beginnerRatio < 0.6 && total > 5)) return 'Intermediate';
    return 'Beginner';
  };

  // Función para detectar automáticamente los intereses basándose en las categorías
  const detectUserInterests = (concepts: CybersecurityKnowledge[]): string[] => {
    if (concepts.length === 0) return [];
    
    const categoryCounts: { [key: string]: number } = {};
    
    concepts.forEach(concept => {
      categoryCounts[concept.category] = (categoryCounts[concept.category] || 0) + 1;
    });
    
    // Ordenar categorías por frecuencia y tomar las top 3
    const sortedCategories = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
    
    return sortedCategories;
  };

  // Función para actualizar automáticamente el perfil basándose en los conceptos
  const updateProfileFromConcepts = () => {
    const detectedLevel = detectUserLevel(knowledgeBase);
    const detectedInterests = detectUserInterests(knowledgeBase);
    
    setUserProfile(prev => ({
      ...prev,
      level: detectedLevel,
      interests: detectedInterests
    }));
  };

  // Actualizar perfil cuando cambien los conceptos
  useEffect(() => {
    if (knowledgeBase.length > 0) {
      updateProfileFromConcepts();
    }
  }, [knowledgeBase]);

  // Funciones para manejar tareas
  const addTaskFromRoadmap = async (roadmap: any) => {
    const newTask = {
      id: Date.now().toString(),
      title: roadmap.suggested_concept,
      description: roadmap.reason,
      items: roadmap.roadmap.map((item: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        title: item.title,
        description: item.description,
        type: item.type,
        time: item.time,
        completed: false
      })),
      createdAt: new Date().toISOString(),
      completed: false,
      progress: 0
    };
    
    try {
      // Guardar en Supabase
      const { error } = await supabase
        .from('tasks')
        .insert([{
          title: newTask.title,
          description: newTask.description,
          items: newTask.items,
          progress: newTask.progress,
          completed: newTask.completed,
          user_id: 'default-user' // Por ahora usar ID fijo
        }]);

      if (error) throw error;

      // Actualizar estado local
      setTasks(prev => [newTask, ...prev]);
      setShowSuggestion(false);
      setAiSuggestion(null);
    } catch (error) {
      console.error('Error guardando tarea:', error);
      // Fallback: guardar solo en estado local
      setTasks(prev => [newTask, ...prev]);
      setShowSuggestion(false);
      setAiSuggestion(null);
    }
  };

  const toggleTaskItem = async (taskId: string, itemId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedItems = task.items.map((item: any) => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const completedCount = updatedItems.filter((item: any) => item.completed).length;
        const progress = Math.round((completedCount / updatedItems.length) * 100);
        
        const updatedTask = {
          ...task,
          items: updatedItems,
          progress,
          completed: progress === 100
        };

        // Actualizar en Supabase
        supabase
          .from('tasks')
          .update({ 
            items: updatedItems,
            progress,
            completed: progress === 100
          })
          .eq('id', taskId)
          .then(({ error }) => {
            if (error) console.error('Error actualizando tarea:', error);
          });

        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Eliminar de Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      // Actualizar estado local
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      // Fallback: eliminar solo del estado local
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  // Cargar tareas desde Supabase
  const loadTasksFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', 'default-user')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setTasks(data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          items: task.items || [],
          createdAt: task.created_at,
          completed: task.completed,
          progress: task.progress
        })));
      }
    } catch (error) {
      console.error('Error cargando tareas:', error);
    }
  };

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasksFromSupabase();
  }, []);

  // Función para solicitar siguiente paso a la IA
  const requestNextStep = async (completedTask: any) => {
    try {
      setIsLoading(true);
      setShowNextStepModal(true);
      setCompletedTask(completedTask);
      
      // Actualizar perfil automáticamente
      updateProfileFromConcepts();
      
      // Obtener conceptos completados
      const completedConcepts = knowledgeBase.filter(concept => 
        userProfile.completed_concepts.includes(concept.id)
      );
      
      // Crear contexto del task completado con objetivos ambiciosos
      const taskContext = `El usuario acaba de completar el roadmap: "${completedTask.title}". 
      Este roadmap incluía: ${completedTask.items.map((item: any) => `${item.title} (${item.type})`).join(', ')}.
      
      OBJETIVOS AMBICIOSOS DEL USUARIO:
      - Quiere convertirse en EXPERTO en TODAS las ramas de ciberseguridad
      - Especializaciones objetivo: ${userProfile.target_specializations.join(', ')}
      - Certificaciones objetivo: ${userProfile.target_certifications.join(', ')}
      - Metas a largo plazo: ${userProfile.long_term_goals.join(', ')}
      
      Basándote en esto y sus metas ambiciosas, sugiere el siguiente paso de aprendizaje que sea más avanzado, complementario, o que abra nuevas especializaciones. Considera que el usuario quiere dominar Red Team, Blue Team, Forense Digital, y todas las ramas de ciberseguridad.`;
      
      // Obtener sugerencia de IA
      const suggestion = await suggestNextConcept(userProfile, completedConcepts, knowledgeBase);
      
      // Agregar contexto del task completado
      const enhancedSuggestion = {
        ...suggestion,
        reason: `${suggestion.reason}\n\n${taskContext}`,
        previous_completed: completedTask.title,
        progress_towards_expertise: `Completaste "${completedTask.title}" - un paso más hacia tu meta de convertirte en experto completo en ciberseguridad.`
      };
      
      setAiSuggestion(enhancedSuggestion);
      setShowSuggestion(true);
      
    } catch (error) {
      console.error('Error obteniendo siguiente paso:', error);
      setAiSuggestion({
        suggested_concept: "Error al obtener sugerencia",
        reason: "Hubo un problema al analizar tu progreso hacia tus metas ambiciosas. Por favor, intenta de nuevo.",
        difficulty_match: "N/A",
        prerequisites_met: false,
        estimated_time: "N/A",
        related_concepts: [],
        previous_completed: completedTask.title,
        progress_towards_expertise: "Continuando tu camino hacia la excelencia en ciberseguridad."
      });
      setShowSuggestion(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones para el sistema de ayuda
  const openHelpModal = async (task: any) => {
    setCurrentHelpTask(task);
    setShowHelpModal(true);
    setHelpChatMessages([]);
    setHelpChatInput('');
    setIsLoadingHelp(true);
    
    try {
      // Generar explicación inicial de la tarea o item específico
      const explanation = await generateTaskExplanation(task);
      setHelpExplanation(explanation);
    } catch (error) {
      console.error('Error generating task explanation:', error);
      setHelpExplanation('Error al generar la explicación. Intenta de nuevo.');
    } finally {
      setIsLoadingHelp(false);
    }
  };

  const sendHelpChatMessage = async () => {
    if (!helpChatInput.trim() || !currentHelpTask) return;
    
    const userMessage = helpChatInput.trim();
    setHelpChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setHelpChatInput('');
    setIsLoadingChat(true);
    
    try {
      const response = await generateHelpChatResponse(currentHelpTask, userMessage, helpChatMessages);
      setHelpChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error generating chat response:', error);
      setHelpChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Lo siento, hubo un error al procesar tu pregunta. Intenta de nuevo.' 
      }]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  return (
    <>
      <Nav />
      <div ref={pageRef} className="min-h-screen bg-white dark:bg-black">
        {/* Floating light elements */}
        <div className="light x1"></div>
        <div className="light x2"></div>
        <div className="light x3"></div>
        <div className="light x4"></div>
        <div className="light x5"></div>
        <div className="light x6"></div>
        <div className="light x7"></div>
        <div className="light x8"></div>
        <div className="light x9"></div>



        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8 shadow-md opacity-100 relative z-10">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar en la biblioteca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {types.map(type => (
                    <option key={type.id} value={type.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setShowLearningPathsModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  ¿Qué aprender ahora?
                </Button>
                <Button
                  onClick={() => setShowTasks(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mis Tareas ({tasks.length})
                </Button>
              </div>
            </div>
          </div>

          {/* Knowledge Grid */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredEntries.map((entry) => (
              <Dialog key={entry.id}>
                <DialogTrigger asChild>
                  <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer group transition-all duration-200 hover:shadow-md shadow-md opacity-100 relative z-10">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`p-2 rounded-md ${getCategoryColor(entry.category)}`}>
                              {getCategoryIcon(entry.category)}
                            </div>
                            <Badge className={`${getTypeColor(entry.type)} text-xs font-medium`}>
                              {entry.type}
                            </Badge>
                            <Badge className={`${getDifficultyColor(entry.difficulty)} text-xs font-medium`}>
                              {entry.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {entry.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {entry.summary}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                          {entry.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{entry.tags.length - 3}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{new Date(entry.date_added).toLocaleDateString()}</span>
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3" />
                            <span>Ver detalles</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                      <div className={`p-2 rounded-md ${getCategoryColor(entry.category)}`}>
                        {getCategoryIcon(entry.category)}
                      </div>
                      {entry.title}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${getTypeColor(entry.type)}`}>
                        {getTypeIcon(entry.type)} {entry.type}
                      </Badge>
                      <Badge className={`${getDifficultyColor(entry.difficulty)}`}>
                        {entry.difficulty}
                      </Badge>
                      <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {entry.status}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                        {entry.content}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-semibold mb-2 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tags:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Tools */}
                    {entry.tools.length > 0 && (
                      <div>
                        <h4 className="text-gray-900 dark:text-white font-semibold mb-2">Herramientas Relacionadas:</h4>
                        <div className="flex flex-wrap gap-2">
                          {entry.tools.map((tool, index) => (
                            <Badge key={index} className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Concepts */}
                    {entry.related_concepts.length > 0 && (
                      <div>
                        <h4 className="text-gray-900 dark:text-white font-semibold mb-2">Conceptos Relacionados:</h4>
                        <div className="flex flex-wrap gap-2">
                          {entry.related_concepts.map((concept: string, index: number) => (
                            <Badge key={index} className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                              {concept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sources */}
                    {entry.sources.length > 0 && (
                      <div>
                        <h4 className="text-gray-900 dark:text-white font-semibold mb-2">Fuentes:</h4>
                        <div className="space-y-1">
                          {entry.sources.map((source, index) => (
                            <div key={index} className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                              <ExternalLink className="h-3 w-3" />
                              {source}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Compartir
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeleteEntry(entry)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {/* Empty State */}
          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <Library className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No se encontraron conceptos</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Intenta ajustar los filtros o agregar un nuevo concepto
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Concepto
              </Button>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md opacity-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Conceptos</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isLoading ? '...' : knowledgeBase.length}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md opacity-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Categorías</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isLoading ? '...' : new Set(knowledgeBase.map(e => e.category)).size}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md opacity-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Tipos</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isLoading ? '...' : new Set(knowledgeBase.map(e => e.type)).size}
                    </p>
                  </div>
                  <Book className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md opacity-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Última Actualización</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {isLoading ? '...' : 
                        knowledgeBase.length > 0 ? 
                          new Date(Math.max(...knowledgeBase.map(e => new Date(e.last_updated).getTime()))).toLocaleDateString() : 
                          'N/A'
                      }
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Migration Button (solo mostrar si no hay datos) */}
          {!isLoading && knowledgeBase.length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
                    Base de Datos Vacía
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    No hay conceptos en la base de datos. ¿Quieres migrar los conceptos iniciales?
                  </p>
                </div>
                <Button 
                  onClick={handleMigration}
                  disabled={isMigrating}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {isMigrating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Migrando...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Migrar Datos
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            size="lg" 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Add New Concept Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-2xl bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Agregar Nuevo {newConceptType === 'concept' ? 'Concepto' : 'Guía'}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Completa la información del nuevo {newConceptType === 'concept' ? 'concepto' : 'guía práctica'} de ciberseguridad.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tipo de Contenido
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewConceptType('concept')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      newConceptType === 'concept'
                        ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    Concepto Teórico
                  </button>
                  <button
                    onClick={() => setNewConceptType('guide')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      newConceptType === 'guide'
                        ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300'
                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Terminal className="h-4 w-4" />
                    Guía Práctica
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {newConceptType === 'concept' 
                    ? 'Conceptos teóricos, definiciones y explicaciones de temas de ciberseguridad.'
                    : 'Guías paso a paso, tutoriales y ejercicios prácticos con comandos y herramientas.'
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: SQL Injection"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {categories.slice(1).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {types.slice(1).map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dificultad
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resumen
                </label>
                <textarea
                  placeholder="Breve descripción del concepto..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contenido
                </label>
                <textarea
                  placeholder="Contenido detallado del concepto..."
                  rows={8}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (separados por comas)
                </label>
                <input
                  type="text"
                  placeholder="Ej: SQL Injection, OWASP, Database Security"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  onClick={() => setShowAddModal(false)}
                  variant="outline" 
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Cancelar
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear {newConceptType === 'concept' ? 'Concepto' : 'Guía'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Learning Assistant Modal */}
        <Dialog open={showLearningPathsModal} onOpenChange={setShowLearningPathsModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Asistente de IA para Aprendizaje
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                La IA analizará tu biblioteca de conceptos y te sugerirá el siguiente aspecto sobre el que deberías profundizar.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {!showSuggestion ? (
                <>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      ¿En qué deberías profundizar?
                    </h3>
                    <p className="text-purple-700 dark:text-purple-300 text-sm">
                      La IA analizará tu biblioteca de conceptos y te sugerirá el siguiente aspecto 
                      sobre el que deberías profundizar para mejorar en ciberseguridad.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      onClick={() => getNextConceptSuggestion()}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                          Analizando tu conocimiento...
                        </>
                      ) : (
                        <>
                          <Brain className="h-5 w-5 mr-3" />
                          ¿Qué debería aprender ahora?
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Basado en {knowledgeBase.length} conceptos en tu biblioteca
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Recomendación de IA
                    </h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Basado en el análisis de tu biblioteca, aquí está tu siguiente paso recomendado.
                    </p>
                  </div>
                  
                  {aiSuggestion && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                      <div className="space-y-4">
                        <div className="text-center">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {aiSuggestion.suggested_concept}
                          </h4>
                          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-300">
                            Recomendado por IA
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-2">¿Por qué este concepto?</h5>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                              {aiSuggestion.reason}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Tiempo estimado</div>
                              <div className="font-semibold text-gray-900 dark:text-white">{aiSuggestion.estimated_time}</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Nivel de ajuste</div>
                              <div className="font-semibold text-gray-900 dark:text-white">{aiSuggestion.difficulty_match}</div>
                            </div>
                          </div>
                          
                          {aiSuggestion.roadmap && aiSuggestion.roadmap.length > 0 && (
                            <div>
                              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Roadmap de Aprendizaje</h5>
                              <div className="space-y-3">
                                {aiSuggestion.roadmap.map((item: any, index: number) => (
                                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex-shrink-0">
                                      {item.type === 'concept' ? (
                                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                      ) : (
                                        <Terminal className="h-5 w-5 text-green-600 dark:text-green-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h6 className="font-medium text-gray-900 dark:text-white text-sm">
                                          {item.title}
                                        </h6>
                                        <Badge 
                                          variant="outline" 
                                          className={`text-xs ${
                                            item.type === 'concept' 
                                              ? 'border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300' 
                                              : 'border-green-200 text-green-700 dark:border-green-700 dark:text-green-300'
                                          }`}
                                        >
                                          {item.type === 'concept' ? 'Concepto' : 'Guía'}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          {item.time}
                                        </Badge>
                                      </div>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {aiSuggestion.related_concepts && aiSuggestion.related_concepts.length > 0 && (
                            <div>
                              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Conceptos relacionados</h5>
                              <div className="flex flex-wrap gap-2">
                                {aiSuggestion.related_concepts.map((concept: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {concept}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      onClick={() => addTaskFromRoadmap(aiSuggestion)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Añadir a Tareas
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowSuggestion(false);
                        setAiSuggestion(null);
                      }}
                      variant="outline" 
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      Nueva Análisis
                    </Button>
                    <Button 
                      onClick={() => setShowLearningPathsModal(false)}
                      variant="outline" 
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      Cerrar
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>



        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Esta acción eliminará permanentemente el concepto de tu biblioteca.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                ¿Estás seguro de que quieres eliminar el concepto <strong className="text-gray-900 dark:text-white">"{entryToDelete?.title}"</strong>?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Esta acción no se puede deshacer. El concepto será eliminado permanentemente de tu biblioteca.
              </p>
              
              <div className="flex items-center gap-4 pt-4">
                <Button 
                  onClick={cancelDelete}
                  variant="outline" 
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Next Step Modal */}
        <Dialog open={showNextStepModal} onOpenChange={setShowNextStepModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-green-500" />
                ¡Excelente! ¿Qué sigue?
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Basándome en lo que acabas de completar, aquí tienes tu siguiente paso de aprendizaje.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {!showSuggestion ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Analizando tu progreso y preparando tu siguiente paso...
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      ¡Has completado "{completedTask?.title}"!
                    </h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Ahora es momento de continuar tu aprendizaje con el siguiente paso recomendado.
                    </p>
                  </div>
                  
                  {aiSuggestion && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                      <div className="space-y-4">
                        <div className="text-center">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {aiSuggestion.suggested_concept}
                          </h4>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
                            Siguiente Paso Recomendado
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-2">¿Por qué este paso?</h5>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                              {aiSuggestion.reason}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Tiempo estimado</div>
                              <div className="font-semibold text-gray-900 dark:text-white">{aiSuggestion.estimated_time}</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Nivel de ajuste</div>
                              <div className="font-semibold text-gray-900 dark:text-white">{aiSuggestion.difficulty_match}</div>
                            </div>
                          </div>
                          
                          {aiSuggestion.roadmap && aiSuggestion.roadmap.length > 0 && (
                            <div>
                              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Roadmap de Aprendizaje</h5>
                              <div className="space-y-3">
                                {aiSuggestion.roadmap.map((item: any, index: number) => (
                                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex-shrink-0">
                                      {item.type === 'concept' ? (
                                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                      ) : (
                                        <Terminal className="h-5 w-5 text-green-600 dark:text-green-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h6 className="font-medium text-gray-900 dark:text-white text-sm">
                                          {item.title}
                                        </h6>
                                        <Badge 
                                          variant="outline" 
                                          className={`text-xs ${
                                            item.type === 'concept' 
                                              ? 'border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300' 
                                              : 'border-green-200 text-green-700 dark:border-green-700 dark:text-green-300'
                                          }`}
                                        >
                                          {item.type === 'concept' ? 'Concepto' : 'Guía'}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          {item.time}
                                        </Badge>
                                      </div>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      onClick={() => addTaskFromRoadmap(aiSuggestion)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Añadir a Tareas
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowNextStepModal(false);
                        setShowSuggestion(false);
                        setAiSuggestion(null);
                        setCompletedTask(null);
                      }}
                      variant="outline" 
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      Cerrar
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Tasks Modal */}
        <Dialog open={showTasks} onOpenChange={setShowTasks}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                Mis Tareas de Aprendizaje
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Roadmaps sugeridos por la IA que puedes completar paso a paso.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No tienes tareas pendientes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Usa la herramienta "¿Qué aprender ahora?" para obtener sugerencias de la IA y añadirlas como tareas.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {task.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>Progreso: {task.progress}%</span>
                            <span>Creado: {new Date(task.createdAt).toLocaleDateString()}</span>
                            {task.completed && (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
                                Completado
                              </Badge>
                            )}
                          </div>
                        </div>
                                                 <div className="flex items-center gap-2">
                           {task.completed && (
                             <Button
                               onClick={() => requestNextStep(task)}
                               className="bg-green-600 hover:bg-green-700 text-white"
                               size="sm"
                             >
                               <ArrowRight className="h-4 w-4 mr-2" />
                               Siguiente Paso
                             </Button>
                           )}
                           <Button
                             onClick={() => deleteTask(task.id)}
                             variant="outline"
                             size="sm"
                             className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Task Items */}
                      <div className="space-y-3">
                        {task.items.map((item: any) => (
                          <div 
                            key={item.id} 
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                              item.completed 
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                            }`}
                          >
                            <button
                              onClick={() => toggleTaskItem(task.id, item.id)}
                              className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-colors ${
                                item.completed
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                              }`}
                            >
                              {item.completed && <CheckCircle className="h-4 w-4" />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-medium text-sm ${
                                  item.completed 
                                    ? 'text-green-700 dark:text-green-300 line-through' 
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                  {item.title}
                                </h4>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    item.type === 'concept' 
                                      ? 'border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300' 
                                      : 'border-green-200 text-green-700 dark:border-green-700 dark:text-green-300'
                                  }`}
                                >
                                  {item.type === 'concept' ? 'Concepto' : 'Guía'}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {item.time}
                                </Badge>
                                <Button
                                  onClick={() => openHelpModal({...task, currentItem: item})}
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/20 ml-auto"
                                >
                                  <HelpCircle className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className={`text-xs ${
                                item.completed 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Help Modal */}
        <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-500" />
                Ayuda: {currentHelpTask?.currentItem ? currentHelpTask.currentItem.title : currentHelpTask?.title}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                {currentHelpTask?.currentItem 
                  ? `Explicación detallada y chat de ayuda para completar este paso específico.`
                  : `Explicación detallada y chat de ayuda para completar esta tarea paso a paso.`
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Explicación de la tarea */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  {currentHelpTask?.currentItem ? 'Explicación del Paso' : 'Explicación de la Tarea'}
                </h3>
                {isLoadingHelp ? (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generando explicación...
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                    <div 
                      className="markdown-content"
                      dangerouslySetInnerHTML={{ 
                        __html: helpExplanation
                          .replace(/\n/g, '<br>')
                          .replace(/### (.*?)(?=\n|$)/g, '<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">$1</h3>')
                          .replace(/#### (.*?)(?=\n|$)/g, '<h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">$1</h4>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                          .replace(/```bash\n([\s\S]*?)\n```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-x-auto my-3"><code>$1</code></pre>')
                          .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-x-auto my-3"><code>$1</code></pre>')
                          .replace(/- (.*?)(?=\n|$)/g, '<li class="ml-4 mb-1">$1</li>')
                          .replace(/(<li.*?<\/li>)/g, '<ul class="list-disc ml-6 mb-3">$1</ul>')
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Chat de ayuda */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  Chat de Ayuda
                </h3>
                
                {/* Mensajes del chat */}
                <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                  {helpChatMessages.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Haz una pregunta sobre esta tarea para obtener ayuda personalizada.</p>
                    </div>
                  ) : (
                    helpChatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isLoadingChat && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Pensando...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input del chat */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={helpChatInput}
                    onChange={(e) => setHelpChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendHelpChatMessage()}
                    placeholder="Escribe tu pregunta sobre esta tarea..."
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoadingChat}
                  />
                  <Button
                    onClick={sendHelpChatMessage}
                    disabled={!helpChatInput.trim() || isLoadingChat}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => setShowHelpModal(false)}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  );
} 