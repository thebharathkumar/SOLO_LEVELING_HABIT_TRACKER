import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import CharacterDashboard from "@/components/character-dashboard";
import HabitTracker from "@/components/habit-tracker";
import SkillSystem from "@/components/skill-system";
import FinancialSystem from "@/components/financial-system";
import AchievementSystem from "@/components/achievement-system";
import AddHabitModal from "@/components/add-habit-modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight via-midnight/95 to-midnight/90 flex items-center justify-center">
        <div className="glass-morph rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-electric to-gold rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <i className="fas fa-sword text-midnight text-2xl"></i>
          </div>
          <p className="text-white text-lg">Loading your shadow realm...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-midnight/95 to-midnight/90 text-white">
      {/* Navigation Header */}
      <header className="glass-morph border-b border-electric/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-electric to-gold rounded-lg flex items-center justify-center animate-float">
                <i className="fas fa-sword text-midnight text-xl"></i>
              </div>
              <h1 className="text-2xl font-orbitron font-bold glow-text text-gold">Shadow Habits</h1>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-midnight/50 px-4 py-2 rounded-full border border-electric/30">
                <div className="w-8 h-8 bg-gradient-to-br from-gold to-electric rounded-full flex items-center justify-center text-midnight font-bold">
                  <span data-testid="text-user-level">{user.level}</span>
                </div>
                <span className="font-semibold" data-testid="text-user-title">{user.title}</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-midnight/50 px-3 py-2 rounded-full border border-gold/30">
                <i className="fas fa-coins text-gold"></i>
                <span className="text-gold font-semibold" data-testid="text-user-currency">{user.currency?.toLocaleString()}</span>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="border-gold text-gold hover:bg-gold hover:text-midnight"
                onClick={() => window.location.href = '/api/logout'}
                data-testid="button-logout"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Character Dashboard Section */}
        <section className="mb-12">
          <CharacterDashboard user={user} />
        </section>

        {/* Daily Habits Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-orbitron font-bold glow-text text-gold">Daily Quests</h2>
            <Button 
              className="bg-electric hover:bg-electric/80 px-4 py-2 rounded-lg font-semibold transition-all animate-glow"
              onClick={() => setIsAddHabitModalOpen(true)}
              data-testid="button-new-quest"
            >
              <i className="fas fa-plus mr-2"></i>New Quest
            </Button>
          </div>
          <HabitTracker />
        </section>

        {/* Character Classes & Skill Tree */}
        <section className="mb-12">
          <SkillSystem />
        </section>

        {/* Financial Stakes Section */}
        <section className="mb-12">
          <FinancialSystem />
        </section>

        {/* Achievements Section */}
        <section className="mb-12">
          <AchievementSystem />
        </section>
      </div>

      {/* Credits Footer */}
      <footer className="glass-morph border-t border-electric/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-electric to-gold rounded-lg flex items-center justify-center animate-float">
                <i className="fas fa-code text-midnight text-sm"></i>
              </div>
              <h3 className="text-xl font-orbitron font-bold glow-text text-gold">Shadow Habits</h3>
            </div>
            <p className="text-gray-300 mb-2">
              A Solo Leveling inspired habit tracker with RPG gamification
            </p>
            <div className="flex items-center justify-center space-x-2 text-electric">
              <i className="fas fa-heart text-blood"></i>
              <span className="text-white">Made with passion by</span>
              <span className="font-orbitron font-bold text-gold glow-text">Bharath</span>
            </div>
            <div className="mt-3 text-gray-400 text-sm">
              <span>Level up your life, one quest at a time</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Add Habit Modal */}
      <AddHabitModal 
        isOpen={isAddHabitModalOpen} 
        onClose={() => setIsAddHabitModalOpen(false)} 
      />
    </div>
  );
}
