import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface CharacterDashboardProps {
  user: User;
}

export default function CharacterDashboard({ user }: CharacterDashboardProps) {
  const { data: weeklyProgress } = useQuery({
    queryKey: ["/api/weekly-progress"],
  });

  const expPercentage = user.experienceToNext ? 
    Math.round((user.experience / user.experienceToNext) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Character Avatar & Stats */}
      <div className="lg:col-span-1">
        <Card className="glass-morph rounded-2xl border-electric/30 bg-transparent text-center relative overflow-hidden">
          <div className="character-aura"></div>
          <CardContent className="pt-6 relative z-10">
            {/* Character Avatar */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img 
                src={user.profileImageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"} 
                alt="Shadow Hunter Character" 
                className="w-full h-full object-cover rounded-full border-4 border-electric animate-glow" 
                data-testid="img-character-avatar"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center border-2 border-midnight animate-level-up">
                <span className="text-midnight font-bold text-sm" data-testid="text-character-level">{user.level}</span>
              </div>
            </div>
            
            {/* Character Info */}
            <h3 className="text-xl font-orbitron font-bold glow-text text-gold mb-2" data-testid="text-character-name">
              {user.firstName || "Shadow Hunter"}
            </h3>
            <p className="text-electric mb-4" data-testid="text-character-class">{user.characterClass}</p>
            
            {/* EXP Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">EXP</span>
                <span className="text-sm text-gold font-semibold" data-testid="text-exp-progress">
                  {user.experience?.toLocaleString()} / {user.experienceToNext?.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="exp-bar h-full rounded-full animate-exp-fill" 
                  style={{ width: `${expPercentage}%` }}
                  data-testid="progress-exp-bar"
                ></div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-midnight/30 p-3 rounded-lg border border-electric/20">
                <i className="fas fa-fire text-gold mb-1"></i>
                <p className="text-gray-300">Current Streak</p>
                <p className="font-bold text-lg text-gold" data-testid="text-current-streak">
                  {user.currentStreak} days
                </p>
              </div>
              <div className="bg-midnight/30 p-3 rounded-lg border border-electric/20">
                <i className="fas fa-trophy text-electric mb-1"></i>
                <p className="text-gray-300">Achievements</p>
                <p className="font-bold text-lg text-electric" data-testid="text-total-achievements">
                  {user.totalAchievements}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Stats Panel */}
      <div className="lg:col-span-2">
        <Card className="glass-morph rounded-2xl border-electric/30 bg-transparent">
          <CardContent className="p-6">
            <h3 className="text-xl font-orbitron font-bold text-gold mb-6 glow-text">Hunter Statistics</h3>
            
            {/* Primary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-midnight/30 p-4 rounded-lg border border-red-500/20 text-center">
                <div className="text-2xl mb-2">💪</div>
                <p className="text-red-400 font-semibold">Strength</p>
                <p className="text-2xl font-bold text-red-400" data-testid="text-strength-stat">
                  {user.strengthStat}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-400 h-2 rounded-full" 
                    style={{ width: `${(user.strengthStat || 0)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-midnight/30 p-4 rounded-lg border border-blue-500/20 text-center">
                <div className="text-2xl mb-2">🧠</div>
                <p className="text-blue-400 font-semibold">Intelligence</p>
                <p className="text-2xl font-bold text-blue-400" data-testid="text-intelligence-stat">
                  {user.intelligenceStat}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full" 
                    style={{ width: `${(user.intelligenceStat || 0)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-midnight/30 p-4 rounded-lg border border-electric/20 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <p className="text-electric font-semibold">Discipline</p>
                <p className="text-2xl font-bold text-electric" data-testid="text-discipline-stat">
                  {user.disciplineStat}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-electric h-2 rounded-full" 
                    style={{ width: `${(user.disciplineStat || 0)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-midnight/30 p-4 rounded-lg border border-ethereal/20 text-center">
                <div className="text-2xl mb-2">👥</div>
                <p className="text-ethereal font-semibold">Social</p>
                <p className="text-2xl font-bold text-ethereal" data-testid="text-social-stat">
                  {user.socialStat}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-ethereal h-2 rounded-full" 
                    style={{ width: `${(user.socialStat || 0)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Weekly Progress Chart */}
            <div className="bg-midnight/20 p-4 rounded-lg border border-electric/20">
              <h4 className="font-semibold text-electric mb-4">Weekly Shadow Power</h4>
              <div className="flex items-end space-x-2 h-32">
                {weeklyProgress && weeklyProgress.length > 0 ? (
                  weeklyProgress.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="bg-gradient-to-t from-electric/60 to-gold/80 rounded-t w-full" 
                        style={{ height: `${Math.min((day.count / 5) * 100, 100)}%` }}
                        data-testid={`chart-day-${index}`}
                      ></div>
                      <span className="text-xs text-gray-400 mt-2">
                        {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                      </span>
                    </div>
                  ))
                ) : (
                  // Default placeholder bars
                  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div 
                        className="bg-gradient-to-t from-electric/60 to-gold/80 rounded-t w-full" 
                        style={{ height: '20%' }}
                        data-testid={`chart-day-${index}`}
                      ></div>
                      <span className="text-xs text-gray-400 mt-2">{day}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
