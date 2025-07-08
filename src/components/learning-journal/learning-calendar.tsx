import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Target,
  CheckCircle,
  Play,
  BookOpen
} from 'lucide-react';
import { gsap } from 'gsap';

interface LearningSession {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  status: 'completed' | 'scheduled' | 'missed';
  type: 'lab' | 'theory' | 'practice' | 'review';
}

interface LearningCalendarProps {
  sessions: LearningSession[];
}

export function LearningCalendar({ sessions }: LearningCalendarProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (calendarRef.current) {
      gsap.fromTo(calendarRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'missed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <Play className="h-4 w-4" />;
      case 'theory':
        return <BookOpen className="h-4 w-4" />;
      case 'practice':
        return <Target className="h-4 w-4" />;
      case 'review':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lab':
        return 'text-purple-600 dark:text-purple-400';
      case 'theory':
        return 'text-blue-600 dark:text-blue-400';
      case 'practice':
        return 'text-green-600 dark:text-green-400';
      case 'review':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  });

  const upcomingSessions = sessions
    .filter(session => {
      const sessionDate = new Date(session.date);
      const today = new Date();
      return sessionDate > today;
    })
    .slice(0, 5);

  return (
    <div ref={calendarRef} className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Learning Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {getMonthName(currentMonth)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Today's Sessions */}
      {todaySessions.length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-lg">Today's Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getTypeColor(session.type)}`}>
                      {getTypeIcon(session.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{session.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {session.time} • {session.duration}min • {session.topic}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getTypeColor(session.type)}`}>
                      {getTypeIcon(session.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{session.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(session.date)} • {session.time} • {session.duration}min
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.topic}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming sessions scheduled</p>
                <Button className="mt-3" size="sm">
                  Schedule Session
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {sessions.filter(s => s.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Scheduled
                </p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {sessions.filter(s => s.status === 'scheduled').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Total Hours
                </p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {sessions.reduce((total, session) => total + session.duration, 0) / 60}h
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