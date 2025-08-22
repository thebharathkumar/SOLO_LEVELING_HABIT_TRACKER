import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Habit } from "@shared/schema";

interface HabitCompletionData {
  habitId: string;
  date: string;
  expGained: number;
}

export default function HabitTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ["/api/habits"],
  });

  const { data: todayCompletions = [] } = useQuery({
    queryKey: ["/api/habit-completions", today],
    queryFn: async () => {
      const res = await fetch(`/api/habit-completions?date=${today}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error('Failed to fetch completions');
      return res.json();
    },
  });

  const completeHabitMutation = useMutation({
    mutationFn: async (data: HabitCompletionData) => {
      return apiRequest("POST", "/api/habit-completions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habit-completions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Quest Completed!",
        description: "You gained EXP and currency!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to complete habit: " + error.message,
        variant: "destructive",
      });
    },
  });

  const getHabitIcon = (category: string) => {
    switch (category) {
      case 'physical': return 'fas fa-dumbbell';
      case 'mental': return 'fas fa-leaf';
      case 'knowledge': return 'fas fa-book';
      case 'social': return 'fas fa-users';
      default: return 'fas fa-check';
    }
  };

  const getHabitIconColor = (category: string) => {
    switch (category) {
      case 'physical': return 'text-gold';
      case 'mental': return 'text-electric';
      case 'knowledge': return 'text-blue-400';
      case 'social': return 'text-ethereal';
      default: return 'text-gray-400';
    }
  };

  const isHabitCompleted = (habitId: string) => {
    return todayCompletions.some((completion: any) => completion.habitId === habitId);
  };

  const handleToggleHabit = (habit: Habit) => {
    if (isHabitCompleted(habit.id)) {
      toast({
        title: "Already Completed",
        description: "You've already completed this quest today!",
        variant: "destructive",
      });
      return;
    }

    completeHabitMutation.mutate({
      habitId: habit.id,
      date: today,
      expGained: habit.expReward || 50,
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-morph rounded-xl border-electric/30 bg-transparent animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-midnight/30 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <Card className="glass-morph rounded-xl border-electric/30 bg-transparent text-center">
        <CardContent className="p-12">
          <div className="w-20 h-20 bg-midnight/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-sword text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Quests Available</h3>
          <p className="text-gray-400 mb-6">Create your first habit to begin your shadow journey!</p>
        </CardContent>
      </Card>
    );
  }

  const completedToday = habits.filter(habit => isHabitCompleted(habit.id)).length;
  const totalExpToday = habits
    .filter(habit => isHabitCompleted(habit.id))
    .reduce((sum, habit) => sum + (habit.expReward || 0), 0);
  const potentialPenalty = habits
    .filter(habit => !isHabitCompleted(habit.id))
    .reduce((sum, habit) => sum + parseFloat(habit.penalty || '0'), 0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {habits.map((habit) => {
          const completed = isHabitCompleted(habit.id);
          return (
            <Card 
              key={habit.id} 
              className="habit-card glass-morph rounded-xl border-electric/30 bg-transparent"
              data-testid={`card-habit-${habit.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-electric/20 rounded-lg flex items-center justify-center">
                      <i className={`${getHabitIcon(habit.category)} ${getHabitIconColor(habit.category)} text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg" data-testid={`text-habit-name-${habit.id}`}>
                        {habit.name}
                      </h3>
                      <p className="text-sm text-gray-400 capitalize" data-testid={`text-habit-category-${habit.id}`}>
                        {habit.category}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost"
                    size="sm"
                    className={`w-8 h-8 rounded-full transition-all ${
                      completed 
                        ? 'bg-ethereal hover:bg-ethereal/80 animate-glow' 
                        : 'bg-gray-600 hover:bg-ethereal'
                    }`}
                    onClick={() => handleToggleHabit(habit)}
                    disabled={completed || completeHabitMutation.isPending}
                    data-testid={`button-toggle-habit-${habit.id}`}
                  >
                    <i className={`fas fa-check ${completed ? 'text-midnight' : 'text-gray-400'}`}></i>
                  </Button>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Streak</span>
                    <span className="text-sm text-gold font-semibold" data-testid={`text-habit-streak-${habit.id}`}>
                      {habit.currentStreak} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">EXP Reward</span>
                    <span className="text-sm text-electric font-semibold" data-testid={`text-habit-exp-${habit.id}`}>
                      +{habit.expReward} EXP
                    </span>
                  </div>
                </div>
                
                <div className="bg-midnight/30 p-3 rounded-lg border border-blood/20">
                  <p className="text-xs text-gray-400 mb-1">Next Penalty</p>
                  <p className="text-blood font-semibold" data-testid={`text-habit-penalty-${habit.id}`}>
                    ${parseFloat(habit.penalty || '0').toFixed(2)} to {habit.penaltyDestination || 'Cause You Dislike'}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Daily Summary */}
      <Card className="glass-morph rounded-xl border-electric/30 bg-transparent">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-ethereal mb-2" data-testid="text-daily-completed">
                {completedToday} / {habits.length}
              </div>
              <p className="text-gray-400">Quests Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold mb-2" data-testid="text-daily-exp">
                +{totalExpToday} EXP
              </div>
              <p className="text-gray-400">Today's Experience</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blood mb-2" data-testid="text-daily-penalty">
                -${potentialPenalty.toFixed(2)}
              </div>
              <p className="text-gray-400">Potential Penalty</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
