'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Brain, Calendar, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  totalDecks: number;
  totalCards: number;
  recentActivity: number;
}

export function DashboardStats({ totalDecks, totalCards, recentActivity }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Decks',
      value: totalDecks,
      icon: BookOpen,
      description: 'Created decks',
    },
    {
      title: 'Total Cards',
      value: totalCards,
      icon: Brain,
      description: 'Flashcards available',
    },
    {
      title: 'Study Sessions',
      value: recentActivity,
      icon: TrendingUp,
      description: 'This week',
    },
    {
      title: 'Days Streak',
      value: 0, // TODO: Implement streak tracking
      icon: Calendar,
      description: 'Current streak',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
