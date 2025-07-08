import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Clock, 
  Tag, 
  Heart, 
  MessageCircle,
  Share2
} from 'lucide-react';
import { gsap } from 'gsap';

interface BlogEntry {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  date: string;
  readTime: number;
  tags: string[];
  likes: number;
  comments: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface BlogEntriesProps {
  entries: BlogEntry[];
}

export function BlogEntries({ entries }: BlogEntriesProps) {
  const entriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (entriesRef.current) {
      const cards = entriesRef.current.children;
      
      gsap.fromTo(cards, 
        { 
          opacity: 0, 
          y: 100,
          rotationX: 15
        },
        { 
          opacity: 1, 
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        }
      );
    }
  }, [entries]);

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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Network Security': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'Web Security': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'Cryptography': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
      'Penetration Testing': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      'Malware Analysis': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      'Forensics': 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <div ref={entriesRef} className="space-y-6">
      {entries.map((entry) => (
        <Card 
          key={entry.id} 
          className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getCategoryColor(entry.category)}>
                    {entry.category}
                  </Badge>
                  <Badge className={getDifficultyColor(entry.difficulty)}>
                    {entry.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {entry.title}
                </CardTitle>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {entry.excerpt}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={entry.author.avatar} alt={entry.author.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {entry.author.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{entry.author.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{entry.date}</span>
                    <span>•</span>
                    <span>{entry.readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{entry.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{entry.comments}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button size="sm">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Read More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 