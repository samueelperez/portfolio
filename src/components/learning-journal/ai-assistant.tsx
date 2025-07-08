import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  Brain, 
  Lightbulb, 
  BookOpen, 
  Search,
  MessageSquare,
  Target,
  ArrowRight,
  Copy,
  RefreshCw
} from 'lucide-react';
import { gsap } from 'gsap';

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  difficulty: string;
  importance: string;
}

interface AIAssistantProps {
  knowledgeEntries: KnowledgeEntry[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedKnowledge?: KnowledgeEntry[];
}

export function AIAssistant({ knowledgeEntries }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! Soy tu asistente de IA especializado en ciberseguridad. Tengo acceso a toda tu base de conocimiento personal. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'chat' | 'search' | 'analyze'>('chat');
  
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      gsap.fromTo(chatRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const quickQuestions = [
    "¿Qué sé sobre SQL Injection?",
    "Explícame los fundamentos de criptografía",
    "¿Cuáles son las mejores herramientas de pentesting?",
    "¿Cómo funciona un ataque XSS?",
    "Dame ejemplos prácticos de análisis de malware",
    "¿Qué protocolos de red son más vulnerables?"
  ];

  const searchKnowledge = (query: string): KnowledgeEntry[] => {
    const searchTerm = query.toLowerCase();
    return knowledgeEntries.filter(entry => 
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.content.toLowerCase().includes(searchTerm) ||
      entry.summary.toLowerCase().includes(searchTerm) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      entry.category.toLowerCase().includes(searchTerm)
    );
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulación de respuesta de IA basada en el conocimiento personal
    const relevantEntries = searchKnowledge(userMessage);
    
    if (relevantEntries.length === 0) {
      return "No encuentro información específica sobre eso en tu base de conocimiento. ¿Te gustaría que te ayude a documentar este tema o tienes alguna otra pregunta?";
    }

    const entry = relevantEntries[0];
    return `Basándome en tu conocimiento sobre "${entry.title}":\n\n${entry.summary}\n\n${entry.content.substring(0, 300)}...\n\n¿Te gustaría que profundice en algún aspecto específico o que conecte esta información con otros temas relacionados?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular delay de IA
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputMessage);
      const relevantEntries = searchKnowledge(inputMessage);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        relatedKnowledge: relevantEntries.slice(0, 3)
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: '¡Hola! Soy tu asistente de IA especializado en ciberseguridad. Tengo acceso a toda tu base de conocimiento personal. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Asistente IA
          </h2>
          <p className="text-muted-foreground">
            Consulta tu base de conocimiento personal con IA
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            <Brain className="h-3 w-3 mr-1" />
            {knowledgeEntries.length} entradas disponibles
          </Badge>
          <Button variant="outline" size="sm" onClick={clearChat}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        </div>
      </div>

      {/* Mode Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={selectedMode === 'chat' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMode('chat')}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>
            <Button
              variant={selectedMode === 'search' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMode('search')}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Búsqueda Avanzada
            </Button>
            <Button
              variant={selectedMode === 'analyze' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMode('analyze')}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Análisis de Conocimiento
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Preguntas Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(question)}
                className="justify-start text-left h-auto p-3"
              >
                <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{question}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversación con IA
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'assistant' && (
                      <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Related Knowledge */}
                      {message.relatedKnowledge && message.relatedKnowledge.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium mb-2 flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            Conocimiento Relacionado:
                          </p>
                          <div className="space-y-2">
                            {message.relatedKnowledge.map((entry) => (
                              <div
                                key={entry.id}
                                className="p-2 bg-white dark:bg-gray-700 rounded border text-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{entry.title}</span>
                                  <Badge className="text-xs">{entry.category}</Badge>
                                </div>
                                <p className="text-muted-foreground text-xs mt-1">
                                  {entry.summary.substring(0, 100)}...
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.content)}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Pregunta sobre tu conocimiento de ciberseguridad..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Total Consultas
                </p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {messages.filter(m => m.type === 'user').length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Conocimiento Accesible
                </p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {knowledgeEntries.length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Categorías Cubiertas
                </p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {new Set(knowledgeEntries.map(e => e.category)).size}
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 