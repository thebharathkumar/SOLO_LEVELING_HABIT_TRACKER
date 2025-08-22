import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skill, UserSkill } from "@shared/schema";

const characterClasses = [
  {
    id: 'shadow-assassin',
    name: 'Shadow Assassin',
    description: 'Master of stealth and precision',
    bonusHabits: ['Exercise', 'Meditation', 'Sleep'],
    expMultiplier: 1.2,
    unlockLevel: 1,
    icon: 'fas fa-user-ninja',
    active: true
  },
  {
    id: 'knowledge-mage',
    name: 'Knowledge Mage',
    description: 'Scholar of wisdom and learning',
    bonusHabits: ['Reading', 'Learning', 'Writing'],
    expMultiplier: 1.3,
    unlockLevel: 10,
    icon: 'fas fa-hat-wizard',
    active: false
  },
  {
    id: 'discipline-warrior',
    name: 'Discipline Warrior',
    description: 'Guardian of order and routine',
    bonusHabits: ['Diet', 'Routine', 'Punctuality'],
    expMultiplier: 1.1,
    unlockLevel: 15,
    icon: 'fas fa-shield',
    active: false
  },
  {
    id: 'social-paladin',
    name: 'Social Paladin',
    description: 'Champion of connection and community',
    bonusHabits: ['Communication', 'Networking', 'Helping'],
    expMultiplier: 1.25,
    unlockLevel: 20,
    icon: 'fas fa-hands-helping',
    active: false
  }
];

const defaultSkills = [
  {
    id: 'streak-shield',
    name: 'Streak Shield',
    description: 'Protect one missed day per week',
    icon: '🛡️',
    tier: 1,
    cost: 500,
    requiredLevel: 5,
    unlocked: true
  },
  {
    id: 'time-warp',
    name: 'Time Warp',
    description: 'Complete yesterday\'s missed habit',
    icon: '⏰',
    tier: 2,
    cost: 800,
    requiredLevel: 10,
    unlocked: true
  },
  {
    id: 'exp-multiplier',
    name: 'EXP Multiplier',
    description: '2x EXP for perfect weeks',
    icon: '⚡',
    tier: 3,
    cost: 1200,
    requiredLevel: 15,
    unlocked: false
  },
  {
    id: 'penalty-reduction',
    name: 'Penalty Reduction',
    description: '50% off financial penalties',
    icon: '💰',
    tier: 3,
    cost: 2000,
    requiredLevel: 25,
    unlocked: false
  }
];

export default function SkillSystem() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const { data: userSkills = [] } = useQuery<UserSkill[]>({
    queryKey: ["/api/user-skills"],
  });

  const unlockSkillMutation = useMutation({
    mutationFn: async (skillId: string) => {
      return apiRequest("POST", `/api/unlock-skill/${skillId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-skills"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Skill Unlocked!",
        description: "New shadow ability acquired!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to unlock skill: " + error.message,
        variant: "destructive",
      });
    },
  });

  const isSkillUnlocked = (skillId: string) => {
    return userSkills.some(userSkill => userSkill.skillId === skillId);
  };

  const handleUnlockSkill = (skillId: string) => {
    unlockSkillMutation.mutate(skillId);
  };

  return (
    <div>
      <h2 className="text-3xl font-orbitron font-bold glow-text text-gold mb-6">Hunter Specialization</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Character Classes */}
        <Card className="glass-morph rounded-2xl border-electric/30 bg-transparent">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-electric mb-6">Available Classes</h3>
            
            <div className="space-y-4">
              {characterClasses.map((charClass) => (
                <div 
                  key={charClass.id}
                  className={`p-4 rounded-lg border-2 ${
                    charClass.active 
                      ? 'bg-gradient-to-r from-electric/20 to-midnight/50 border-electric' 
                      : 'bg-midnight/30 border-gray-600 opacity-60'
                  }`}
                  data-testid={`card-class-${charClass.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        charClass.active ? 'bg-electric' : 'bg-gray-600'
                      }`}>
                        <i className={`${charClass.icon} ${
                          charClass.active ? 'text-midnight' : 'text-gray-400'
                        } text-xl`}></i>
                      </div>
                      <div>
                        <h4 className={`font-semibold text-lg ${
                          charClass.active ? 'text-electric' : 'text-gray-400'
                        }`} data-testid={`text-class-name-${charClass.id}`}>
                          {charClass.name}
                        </h4>
                        <p className={`text-sm ${
                          charClass.active ? 'text-gray-400' : 'text-gray-500'
                        }`} data-testid={`text-class-description-${charClass.id}`}>
                          {charClass.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          {charClass.bonusHabits.map((habit) => (
                            <span 
                              key={habit}
                              className={`text-xs px-2 py-1 rounded ${
                                charClass.active ? 'bg-electric/20' : 'bg-gray-700'
                              }`}
                            >
                              {habit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${
                        charClass.active ? 'text-gold' : 'text-gray-400'
                      }`} data-testid={`text-class-status-${charClass.id}`}>
                        {charClass.active ? 'ACTIVE' : `LEVEL ${charClass.unlockLevel}`}
                      </span>
                      <p className={`text-sm ${
                        charClass.active ? 'text-electric' : 'text-gray-500'
                      }`}>
                        +{Math.round((charClass.expMultiplier - 1) * 100)}% EXP
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Skill Tree */}
        <Card className="glass-morph rounded-2xl border-electric/30 bg-transparent">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-electric mb-6">Shadow Abilities</h3>
            
            {/* Skill Tree Visualization */}
            <div className="relative mb-6">
              {/* Tier 1 Skills */}
              <div className="flex justify-center mb-8">
                <div 
                  className="skill-node bg-gold rounded-full w-16 h-16 flex flex-col items-center justify-center border-4 border-gold/50 cursor-pointer"
                  data-testid="skill-node-tier-1"
                >
                  <i className="fas fa-shield text-midnight text-xl"></i>
                  <span className="text-xs font-semibold text-midnight">Shield</span>
                </div>
              </div>
              
              {/* Connection Lines */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-px skill-line h-8"></div>
              
              {/* Tier 2 Skills */}
              <div className="flex justify-center space-x-16 mb-8">
                <div 
                  className="skill-node bg-electric rounded-full w-16 h-16 flex flex-col items-center justify-center border-4 border-electric/50 cursor-pointer"
                  data-testid="skill-node-tier-2-1"
                >
                  <i className="fas fa-clock text-midnight text-xl"></i>
                  <span className="text-xs font-semibold text-midnight">Time</span>
                </div>
                <div 
                  className="skill-node bg-gray-600 rounded-full w-16 h-16 flex flex-col items-center justify-center border-4 border-gray-500 opacity-50 cursor-not-allowed"
                  data-testid="skill-node-tier-2-2"
                >
                  <i className="fas fa-bolt text-gray-400 text-xl"></i>
                  <span className="text-xs font-semibold text-gray-400">Power</span>
                </div>
              </div>
              
              {/* Connection Lines */}
              <div className="absolute top-32 left-1/4 w-1/2 skill-line h-px"></div>
              <div className="absolute top-32 left-1/4 transform -translate-x-1/2 w-px skill-line h-8"></div>
              <div className="absolute top-32 right-1/4 transform translate-x-1/2 w-px skill-line h-8"></div>
              
              {/* Tier 3 Skills */}
              <div className="flex justify-center">
                <div 
                  className="skill-node bg-gray-600 rounded-full w-16 h-16 flex flex-col items-center justify-center border-4 border-gray-500 opacity-50 cursor-not-allowed"
                  data-testid="skill-node-tier-3"
                >
                  <i className="fas fa-crown text-gray-400 text-xl"></i>
                  <span className="text-xs font-semibold text-gray-400">Master</span>
                </div>
              </div>
            </div>
            
            {/* Skill Descriptions */}
            <div className="space-y-3">
              {defaultSkills.map((skill) => {
                const unlocked = skill.unlocked;
                return (
                  <div 
                    key={skill.id}
                    className={`p-3 rounded-lg border ${
                      unlocked 
                        ? (skill.tier === 1 ? 'bg-midnight/30 border-gold/20' : 'bg-midnight/30 border-electric/20')
                        : 'bg-midnight/30 border-gray-600 opacity-60'
                    }`}
                    data-testid={`card-skill-${skill.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-semibold ${
                          unlocked 
                            ? (skill.tier === 1 ? 'text-gold' : 'text-electric')
                            : 'text-gray-400'
                        }`} data-testid={`text-skill-name-${skill.id}`}>
                          {skill.icon} {skill.name}
                        </h4>
                        <p className={`text-sm ${unlocked ? 'text-gray-400' : 'text-gray-500'}`}>
                          {skill.description}
                        </p>
                      </div>
                      <div className="text-right">
                        {unlocked ? (
                          <span className={`font-semibold ${
                            skill.tier === 1 ? 'text-gold' : 'text-electric'
                          }`} data-testid={`text-skill-status-${skill.id}`}>
                            UNLOCKED
                          </span>
                        ) : (
                          <span className="text-gray-400 font-semibold" data-testid={`text-skill-level-${skill.id}`}>
                            LEVEL {skill.requiredLevel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
