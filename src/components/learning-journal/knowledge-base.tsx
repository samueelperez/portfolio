import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Brain,
  Network,
  Globe,
  Lock,
  Bug,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import { gsap } from 'gsap';

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  subcategory: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  dateCreated: string;
  lastModified: string;
  sources: string[];
  relatedTopics: string[];
  practicalExamples: string[];
  tools: string[];
  status: 'draft' | 'complete' | 'review';
  importance: 'low' | 'medium' | 'high' | 'critical';
}

interface KnowledgeBaseProps {
  entries: KnowledgeEntry[];
  onAddEntry: (entry: KnowledgeEntry) => void;
  onUpdateEntry: (id: string, entry: Partial<KnowledgeEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

export function KnowledgeBase({ entries, onAddEntry }: KnowledgeBaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<KnowledgeEntry>>({
    title: '',
    content: '',
    summary: '',
    category: '',
    subcategory: '',
    tags: [],
    difficulty: 'Beginner',
    sources: [],
    relatedTopics: [],
    practicalExamples: [],
    tools: [],
    status: 'draft',
    importance: 'medium'
  });

  const baseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (baseRef.current) {
      gsap.fromTo(baseRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  const categories = [
    { id: 'network-security', name: 'Network Security', icon: <Network className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    { id: 'web-security', name: 'Web Security', icon: <Globe className="h-4 w-4" />, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
    { id: 'cryptography', name: 'Cryptography', icon: <Lock className="h-4 w-4" />, color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
    { id: 'malware-analysis', name: 'Malware Analysis', icon: <Bug className="h-4 w-4" />, color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
    { id: 'forensics', name: 'Digital Forensics', icon: <Search className="h-4 w-4" />, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
    { id: 'penetration-testing', name: 'Penetration Testing', icon: <Target className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' },
    { id: 'incident-response', name: 'Incident Response', icon: <Shield className="h-4 w-4" />, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' },
    { id: 'tools', name: 'Security Tools', icon: <Zap className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' }
  ];

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || entry.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleAddEntry = () => {
    if (newEntry.title && newEntry.content) {
      const entry: KnowledgeEntry = {
        id: Date.now().toString(),
        title: newEntry.title!,
        content: newEntry.content!,
        summary: newEntry.summary || '',
        category: newEntry.category || '',
        subcategory: newEntry.subcategory || '',
        tags: newEntry.tags || [],
        difficulty: newEntry.difficulty || 'Beginner',
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        sources: newEntry.sources || [],
        relatedTopics: newEntry.relatedTopics || [],
        practicalExamples: newEntry.practicalExamples || [],
        tools: newEntry.tools || [],
        status: newEntry.status || 'draft',
        importance: newEntry.importance || 'medium'
      };
      onAddEntry(entry);
      setNewEntry({
        title: '',
        content: '',
        summary: '',
        category: '',
        subcategory: '',
        tags: [],
        difficulty: 'Beginner',
        sources: [],
        relatedTopics: [],
        practicalExamples: [],
        tools: [],
        status: 'draft',
        importance: 'medium'
      });
      setIsAddingEntry(false);
    }
  };

  return (
    <div ref={baseRef} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Knowledge Base
          </h2>
          <p className="text-muted-foreground">
            Documenta y organiza todo tu conocimiento de ciberseguridad
          </p>
        </div>
        <Button onClick={() => setIsAddingEntry(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Entrada
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar en tu conocimiento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">Todas las dificultades</option>
                <option value="Beginner">Principiante</option>
                <option value="Intermediate">Intermedio</option>
                <option value="Advanced">Avanzado</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Entry Modal */}
      {isAddingEntry && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Nueva Entrada de Conocimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  placeholder="Título del tema..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Categoría</label>
                <select
                  value={newEntry.category}
                  onChange={(e) => setNewEntry({...newEntry, category: e.target.value})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Resumen</label>
              <Textarea
                value={newEntry.summary}
                onChange={(e) => setNewEntry({...newEntry, summary: e.target.value})}
                placeholder="Breve resumen del tema..."
                rows={2}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Contenido Detallado</label>
              <Textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                placeholder="Documenta todo lo que sabes sobre este tema..."
                rows={6}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Dificultad</label>
                <select
                  value={newEntry.difficulty}
                  onChange={(e) => setNewEntry({...newEntry, difficulty: e.target.value as any})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="Beginner">Principiante</option>
                  <option value="Intermediate">Intermedio</option>
                  <option value="Advanced">Avanzado</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Importancia</label>
                <select
                  value={newEntry.importance}
                  onChange={(e) => setNewEntry({...newEntry, importance: e.target.value as any})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Estado</label>
                <select
                  value={newEntry.status}
                  onChange={(e) => setNewEntry({...newEntry, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="draft">Borrador</option>
                  <option value="complete">Completo</option>
                  <option value="review">En revisión</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddEntry} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Guardar Entrada
              </Button>
              <Button variant="outline" onClick={() => setIsAddingEntry(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Entries */}
      <div className="space-y-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {categories.find(cat => cat.id === entry.category)?.icon}
                      <Badge className={categories.find(cat => cat.id === entry.category)?.color}>
                        {categories.find(cat => cat.id === entry.category)?.name}
                      </Badge>
                      <Badge className={getDifficultyColor(entry.difficulty)}>
                        {entry.difficulty}
                      </Badge>
                      <Badge className={getImportanceColor(entry.importance)}>
                        {entry.importance}
                      </Badge>
                      {entry.status === 'complete' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {entry.title}
                    </CardTitle>
                    {entry.summary && (
                      <p className="text-muted-foreground mt-2">
                        {entry.summary}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="prose prose-sm max-w-none mb-4">
                  <div className="line-clamp-3">
                    {entry.content}
                  </div>
                </div>
                
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>📅 {new Date(entry.dateCreated).toLocaleDateString()}</span>
                    {entry.tools.length > 0 && (
                      <span>🛠️ {entry.tools.length} herramientas</span>
                    )}
                    {entry.practicalExamples.length > 0 && (
                      <span>💡 {entry.practicalExamples.length} ejemplos</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-3 w-3 mr-1" />
                      Ver Completo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Link className="h-3 w-3 mr-1" />
                      Conectar IA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No hay entradas de conocimiento</h3>
            <p className="text-muted-foreground mb-4">
              Comienza a documentar tu aprendizaje de ciberseguridad
            </p>
            <Button onClick={() => setIsAddingEntry(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Entrada
            </Button>
          </Card>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Total Entradas
                </p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {entries.length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Completadas
                </p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {entries.filter(e => e.status === 'complete').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Categorías
                </p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {new Set(entries.map(e => e.category)).size}
                </p>
              </div>
              <Tag className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Última Actualización
                </p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                  {entries.length > 0 ? 
                    new Date(Math.max(...entries.map(e => new Date(e.lastModified).getTime()))).toLocaleDateString() : 
                    'N/A'
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 