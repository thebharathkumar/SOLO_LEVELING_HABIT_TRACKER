import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Achievement, UserAchievement } from "@shared/schema";

export default function AchievementSystem() {
  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: userAchievements = [] } = useQuery<UserAchievement[]>({
    queryKey: ["/api/user-achievements"],
  });

  const isAchievementUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievementId === achievementId);
  };

  const getAchievementProgress = (achievementId: string) => {
    const userAchievement = userAchievements.find(ua => ua.achievementId === achievementId);
    return userAchievement?.progress || 0;
  };

  // Mock achievements if none exist in database
  const mockAchievements = [
    {
      id: '1',
      name: 'Streak Master',
      description: 'Complete 14 days streak',
      icon: 'fas fa-fire',
      category: 'streak',
      requirement: 14,
      expReward: 200,
      currencyReward: 100,
      rarity: 'epic',
      isSecret: false,
      createdAt: new Date(),
      unlocked: true,
      progress: 14
    },
    {
      id: '2',
      name: 'Iron Will',
      description: 'Complete 100 workouts',
      icon: 'fas fa-dumbbell',
      category: 'habit',
      requirement: 100,
      expReward: 500,
      currencyReward: 250,
      rarity: 'rare',
      isSecret: false,
      createdAt: new Date(),
      unlocked: false,
      progress: 73
    },
    {
      id: '3',
      name: 'Shadow Lord',
      description: 'Reach level 25',
      icon: 'fas fa-crown',
      category: 'level',
      requirement: 25,
      expReward: 1000,
      currencyReward: 500,
      rarity: 'legendary',
      isSecret: false,
      createdAt: new Date(),
      unlocked: false,
      progress: 0
    },
    {
      id: '4',
      name: 'Perfect Month',
      description: '30 days no missed habits',
      icon: 'fas fa-star',
      category: 'streak',
      requirement: 30,
      expReward: 2000,
      currencyReward: 1000,
      rarity: 'legendary',
      isSecret: false,
      createdAt: new Date(),
      unlocked: true,
      progress: 30
    }
  ];

  const displayAchievements = achievements.length > 0 ? achievements : mockAchievements;

  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          bg: 'from-electric to-gold',
          border: 'border-electric/50',
          text: 'text-electric',
          badge: 'bg-gradient-to-r from-electric to-gold text-midnight'
        };
      case 'epic':
        return {
          bg: 'from-gold to-yellow-500',
          border: 'border-gold/30',
          text: 'text-gold',
          badge: 'bg-gold/20 text-gold'
        };
      case 'rare':
        return {
          bg: 'from-electric/60 to-purple-500/60',
          border: 'border-electric/30',
          text: 'text-electric',
          badge: 'bg-electric/20 text-electric'
        };
      default:
        return {
          bg: 'from-gray-600/60 to-gray-500/60',
          border: 'border-gray-600',
          text: 'text-gray-400',
          badge: 'bg-gray-700 text-gray-400'
        };
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-orbitron font-bold glow-text text-gold mb-6">Achievements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayAchievements.map((achievement: any) => {
          const unlocked = achievement.unlocked || isAchievementUnlocked(achievement.id);
          const progress = achievement.progress || getAchievementProgress(achievement.id);
          const colors = getRarityColors(achievement.rarity);
          const progressPercentage = achievement.requirement ? Math.min((progress / achievement.requirement) * 100, 100) : 0;
          
          return (
            <Card 
              key={achievement.id}
              className={`glass-morph rounded-xl text-center border bg-transparent ${
                unlocked ? colors.border + ' animate-glow' : 'border-gray-600 opacity-60'
              } ${achievement.rarity === 'legendary' && unlocked ? 'relative overflow-hidden' : ''}`}
              data-testid={`card-achievement-${achievement.id}`}
            >
              {achievement.rarity === 'legendary' && unlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-electric/10 to-gold/10 animate-pulse"></div>
              )}
              
              <CardContent className="p-6 relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${
                  unlocked ? colors.bg : 'bg-gray-600'
                } rounded-full flex items-center justify-center mx-auto mb-4 ${
                  unlocked ? 'animate-float' : ''
                }`}>
                  <i className={`${achievement.icon} ${
                    unlocked ? 'text-midnight' : 'text-gray-400'
                  } text-2xl`}></i>
                </div>
                
                <h3 className={`font-semibold mb-2 ${
                  unlocked ? colors.text : 'text-gray-400'
                }`} data-testid={`text-achievement-name-${achievement.id}`}>
                  {achievement.name}
                </h3>
                
                <p className={`text-sm mb-3 ${
                  unlocked ? 'text-gray-400' : 'text-gray-500'
                }`} data-testid={`text-achievement-description-${achievement.id}`}>
                  {achievement.description}
                </p>
                
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                  {unlocked ? 'UNLOCKED' : 
                   achievement.requirement && progress > 0 ? `${progress}/${achievement.requirement}` :
                   achievement.rarity.toUpperCase()}
                </div>
                
                {!unlocked && achievement.requirement && progress > 0 && (
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className={`bg-electric h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${progressPercentage}%` }}
                      data-testid={`progress-achievement-${achievement.id}`}
                    ></div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
