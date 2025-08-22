import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Penalty, Reward } from "@shared/schema";

export default function FinancialSystem() {
  const { data: penalties = [] } = useQuery<Penalty[]>({
    queryKey: ["/api/penalties", { unpaid: true }],
    queryFn: async () => {
      const res = await fetch('/api/penalties?unpaid=true', {
        credentials: "include",
      });
      if (!res.ok) throw new Error('Failed to fetch penalties');
      return res.json();
    },
  });

  const { data: rewards = [] } = useQuery<Reward[]>({
    queryKey: ["/api/rewards", { unclaimed: true }],
    queryFn: async () => {
      const res = await fetch('/api/rewards?unclaimed=true', {
        credentials: "include",
      });
      if (!res.ok) throw new Error('Failed to fetch rewards');
      return res.json();
    },
  });

  const totalPenalties = penalties.reduce((sum, penalty) => sum + parseFloat(penalty.amount), 0);
  const totalRewards = rewards.reduce((sum, reward) => sum + parseFloat(reward.amount), 0);

  const handleProcessPayment = () => {
    if (penalties.length === 0) return;
    
    // Check if payment is configured
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      alert('Payment processing is not configured yet. This is a demo of the financial penalty system.');
      return;
    }
    
    const penaltyIds = penalties.map(p => p.id);
    const amount = totalPenalties;
    
    // Redirect to checkout page with penalty data
    const params = new URLSearchParams({
      penaltyIds: JSON.stringify(penaltyIds),
      amount: amount.toString()
    });
    window.location.href = `/checkout?${params.toString()}`;
  };

  const handleClaimRewards = () => {
    // This would integrate with payment processing to send money to user
    alert('Reward claiming feature coming soon!');
  };

  return (
    <div>
      <h2 className="text-3xl font-orbitron font-bold glow-text text-gold mb-6">Stakes & Accountability</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Penalty System */}
        <Card className="glass-morph rounded-2xl border-blood/30 bg-transparent">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-blood mb-6">Penalty System</h3>
            
            <div className="space-y-4">
              <div className="bg-midnight/30 p-4 rounded-lg border border-blood/20">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blood">Current Penalties</h4>
                  <span className="text-blood font-bold" data-testid="text-total-penalties">
                    ${totalPenalties.toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                  {penalties.length > 0 ? (
                    penalties.map((penalty) => (
                      <div key={penalty.id} className="flex justify-between items-center" data-testid={`penalty-${penalty.id}`}>
                        <span className="text-gray-400">
                          {penalty.reason || 'Missed habit'}
                        </span>
                        <span className="text-blood">${parseFloat(penalty.amount).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400">No pending penalties</p>
                      <p className="text-sm text-ethereal">Keep up the good work!</p>
                    </div>
                  )}
                </div>
                
                {penalties.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blood/20">
                    <Button 
                      className="w-full bg-blood hover:bg-red-700 text-white font-semibold transition-all"
                      onClick={handleProcessPayment}
                      data-testid="button-process-payment"
                    >
                      <i className="fas fa-credit-card mr-2"></i>
                      Process Payment
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Penalty Destinations */}
              <div className="bg-midnight/30 p-4 rounded-lg border border-gray-600">
                <h4 className="font-semibold text-gray-300 mb-3">Penalty Destinations</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Political Opposition Party</span>
                    <span className="text-blood">Most Common</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Competitor Company</span>
                    <span className="text-blood">Business Related</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cause You Dislike</span>
                    <span className="text-blood">Personal Choice</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Rewards System */}
        <Card className="glass-morph rounded-2xl border-ethereal/30 bg-transparent">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-ethereal mb-6">Reward System</h3>
            
            <div className="space-y-4">
              <div className="bg-midnight/30 p-4 rounded-lg border border-ethereal/20">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-ethereal">Earned Rewards</h4>
                  <span className="text-ethereal font-bold" data-testid="text-total-rewards">
                    ${totalRewards.toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                  {rewards.length > 0 ? (
                    rewards.map((reward) => (
                      <div key={reward.id} className="flex justify-between items-center" data-testid={`reward-${reward.id}`}>
                        <span className="text-gray-400">
                          {reward.reason || 'Achievement unlocked'}
                        </span>
                        <span className="text-ethereal">+${parseFloat(reward.amount).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400">No rewards available</p>
                      <p className="text-sm text-gold">Complete more quests to earn rewards!</p>
                    </div>
                  )}
                </div>
                
                {rewards.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-ethereal/20">
                    <Button 
                      className="w-full bg-ethereal hover:bg-green-600 text-midnight font-semibold transition-all"
                      onClick={handleClaimRewards}
                      data-testid="button-claim-rewards"
                    >
                      <i className="fas fa-gift mr-2"></i>
                      Claim Rewards
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Payment Method Setup */}
              <div className="bg-midnight/30 p-4 rounded-lg border border-electric/20">
                <h4 className="font-semibold text-electric mb-3">Payment Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-midnight/50 rounded border border-gray-600">
                    <div className="flex items-center space-x-3">
                      <i className="fab fa-cc-stripe text-electric text-xl"></i>
                      <span className="text-gray-300">Stripe Connected</span>
                    </div>
                    <span className="text-ethereal text-sm">Active</span>
                  </div>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-electric text-electric hover:bg-electric hover:text-midnight font-semibold transition-all"
                    data-testid="button-update-payment"
                  >
                    <i className="fas fa-cog mr-2"></i>
                    Update Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
