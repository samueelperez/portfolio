import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Globe, 
  Lock, 
  Bug, 
  Search, 
  Code, 
  Target,
  CheckCircle,
  Play,
  BookOpen
} from 'lucide-react';
import { gsap } from 'gsap';

interface LearningTopic {
  id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  estimatedHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  resources: string[];
}

interface LearningArea {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  topics: LearningTopic[];
  totalTopics: number;
  completedTopics: number;
}

interface LearningAreasProps {
  areas: LearningArea[];
}

export function LearningAreas({ areas }: LearningAreasProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabsRef.current) {
      gsap.fromTo(tabsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const cards = contentRef.current.children;
      gsap.fromTo(cards,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [areas]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      <div ref={tabsRef}>
        <Tabs defaultValue={areas[0]?.id} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <TabsTrigger 
                key={area.id} 
                value={area.id}
                className="flex items-center gap-2"
              >
                {area.icon}
                <span className="hidden sm:inline">{area.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {areas.map((area) => (
            <TabsContent key={area.id} value={area.id} className="mt-6">
              <div className="space-y-4">
                {/* Area Overview */}
                <Card className={`border-l-4 ${area.color}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {area.icon}
                          {area.name}
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">
                          {area.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {area.completedTopics}/{area.totalTopics}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Topics completed
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={(area.completedTopics / area.totalTopics) * 100} 
                      className="mt-4"
                    />
                  </CardHeader>
                </Card>

                {/* Topics Grid */}
                <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {area.topics.map((topic) => (
                    <Card 
                      key={topic.id} 
                      className={`group hover:shadow-md transition-all duration-300 ${
                        topic.completed ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' : ''
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                                {topic.title}
                              </CardTitle>
                              {topic.completed && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {topic.description}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{topic.progress}%</span>
                          </div>
                          
                          <Progress 
                            value={topic.progress} 
                            className={`h-2 ${getProgressColor(topic.progress)}`}
                          />
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <Badge className={getDifficultyColor(topic.difficulty)}>
                                {topic.difficulty}
                              </Badge>
                              <span>{topic.estimatedHours}h</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <BookOpen className="h-3 w-3 mr-1" />
                                Resources
                              </Button>
                              <Button size="sm">
                                <Play className="h-3 w-3 mr-1" />
                                Start
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
} 