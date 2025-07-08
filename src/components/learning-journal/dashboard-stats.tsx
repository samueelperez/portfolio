import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Trophy, TrendingUp, Clock, Calendar } from 'lucide-react';
import { gsap } from 'gsap';

interface DashboardStatsProps {
  totalHours: number;
  completedTopics: number;
  totalTopics: number;
  currentStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export function DashboardStats({
  totalHours,
  completedTopics,
  totalTopics,
  currentStreak,
  weeklyGoal,
  weeklyProgress
}: DashboardStatsProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (statsRef.current) {
      const stats = statsRef.current.children;
      
      gsap.fromTo(stats, 
        { 
          opacity: 0, 
          y: 50,
          scale: 0.8
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );
    }
  }, []);

  useEffect(() => {
    if (progressRef.current) {
      gsap.fromTo(progressRef.current,
        { width: 0 },
        { 
          width: `${weeklyProgress}%`,
          duration: 1.5,
          ease: "power2.out",
          delay: 0.5
        }
      );
    }
  }, [weeklyProgress]);

  const completionRate = Math.round((completedTopics / totalTopics) * 100);

  return (
    <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Hours */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Total Hours
          </CardTitle>
          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {totalHours}h
          </div>
          <p className="text-xs text-muted-foreground">
            Time invested in learning
          </p>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
            Completion Rate
          </CardTitle>
          <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {completionRate}%
          </div>
          <p className="text-xs text-muted-foreground">
            {completedTopics} of {totalTopics} topics completed
          </p>
        </CardContent>
      </Card>

      {/* Current Streak */}
      <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">
            Current Streak
          </CardTitle>
          <Trophy className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
            {currentStreak} days
          </div>
          <p className="text-xs text-muted-foreground">
            Keep it going! 🔥
          </p>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Weekly Goal
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {weeklyProgress}%
          </div>
          <div className="mt-2">
            <Progress 
              value={weeklyProgress} 
              className="h-2"
              ref={progressRef}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {weeklyGoal}h goal this week
          </p>
        </CardContent>
      </Card>

      {/* Learning Areas */}
      <Card className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-200/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Learning Areas
          </CardTitle>
          <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              Network Security
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              Web Security
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              Cryptography
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Next Session */}
      <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-200/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-teal-600 dark:text-teal-400">
            Next Session
          </CardTitle>
          <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-teal-700 dark:text-teal-300">
            Today, 20:00
          </div>
          <p className="text-xs text-muted-foreground">
            Penetration Testing Lab
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 