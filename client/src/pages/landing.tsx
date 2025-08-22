import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-midnight/95 to-midnight/90 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-electric/20 to-gold/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-electric to-gold rounded-2xl flex items-center justify-center animate-float shadow-2xl">
                <i className="fas fa-sword text-midnight text-3xl"></i>
              </div>
            </div>
            
            <h1 className="text-6xl font-orbitron font-bold glow-text text-gold mb-6">
              Shadow Habits
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your habits into an epic RPG adventure. Level up like Sung Jin-Woo from Solo Leveling, 
              with real financial stakes and stunning visual progression. Every completed habit grants EXP and currency, 
              while failures result in actual money penalties.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-electric hover:bg-electric/80 text-white font-semibold px-8 py-4 text-lg animate-glow"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-login"
              >
                <i className="fas fa-play mr-2"></i>
                Begin Your Journey
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gold text-gold hover:bg-gold hover:text-midnight font-semibold px-8 py-4 text-lg"
                data-testid="button-learn-more"
              >
                <i className="fas fa-info-circle mr-2"></i>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-orbitron font-bold text-gold mb-4">
            Become the Shadow Monarch
          </h2>
          <p className="text-xl text-gray-400">
            Experience habit tracking like never before with our revolutionary gamification system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glass-morph border-electric/30 bg-transparent">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-electric/20 to-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-level-up-alt text-electric text-2xl"></i>
              </div>
              <CardTitle className="text-xl font-semibold text-electric">
                RPG Progression System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 text-center">
                Level up your character, unlock new classes, and build powerful skill trees as you master your habits.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-morph border-gold/30 bg-transparent">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-electric/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-dollar-sign text-gold text-2xl"></i>
              </div>
              <CardTitle className="text-xl font-semibold text-gold">
                Real Financial Stakes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 text-center">
                Put your money where your mouth is. Failed habits result in automatic donations to causes you dislike.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-morph border-ethereal/30 bg-transparent">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-ethereal/20 to-electric/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trophy text-ethereal text-2xl"></i>
              </div>
              <CardTitle className="text-xl font-semibold text-ethereal">
                Epic Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 text-center">
                Unlock legendary achievements, earn rewards, and build the ultimate habit-crushing character.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-electric/10 to-gold/10 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-orbitron font-bold text-gold mb-6">
            Ready to Level Up Your Life?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of Shadow Hunters who have transformed their habits into epic adventures.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-electric to-gold hover:from-electric/80 hover:to-gold/80 text-midnight font-bold px-12 py-4 text-xl animate-glow"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-start-journey"
          >
            <i className="fas fa-rocket mr-3"></i>
            Start Your Epic Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
