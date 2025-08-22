import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Make Stripe optional for development
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = ({ amount, penaltyIds }: { amount: number; penaltyIds: string[] }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: 'if_required'
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Mark penalties as paid
      try {
        await apiRequest("POST", "/api/process-penalty-payment", {
          paymentIntentId: paymentIntent.id,
          penaltyIds
        });
        
        toast({
          title: "Payment Successful",
          description: "Your penalties have been processed!",
        });
        
        // Redirect back to home
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (error) {
        toast({
          title: "Payment Processed",
          description: "Payment successful but failed to update records. Please contact support.",
          variant: "destructive",
        });
      }
    }

    setIsProcessing(false);
  };

  return (
    <Card className="glass-morph border-blood/30 bg-transparent max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-orbitron text-blood text-center">
          Process Penalty Payment
        </CardTitle>
        <div className="text-center">
          <div className="text-3xl font-bold text-blood mb-2">
            ${amount.toFixed(2)}
          </div>
          <p className="text-gray-400">
            {penaltyIds.length} penalty{penaltyIds.length !== 1 ? 'ies' : ''} to process
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />
          <Button 
            type="submit" 
            disabled={!stripe || isProcessing}
            className="w-full bg-blood hover:bg-red-700 text-white font-semibold py-3"
            data-testid="button-submit-payment"
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="fas fa-credit-card mr-2"></i>
                Pay ${amount.toFixed(2)}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [penaltyIds, setPenaltyIds] = useState<string[]>([]);
  const [paymentNotConfigured, setPaymentNotConfigured] = useState(false);

  useEffect(() => {
    // Check if Stripe is configured
    if (!stripePromise) {
      setPaymentNotConfigured(true);
      return;
    }

    // Get penalty data from URL params or state
    const urlParams = new URLSearchParams(window.location.search);
    const penaltyIdsParam = urlParams.get('penaltyIds');
    const amountParam = urlParams.get('amount');

    if (penaltyIdsParam && amountParam) {
      const ids = JSON.parse(penaltyIdsParam);
      const totalAmount = parseFloat(amountParam);
      
      setPenaltyIds(ids);
      setAmount(totalAmount);

      // Create PaymentIntent
      apiRequest("POST", "/api/create-payment-intent", { 
        amount: totalAmount,
        penaltyIds: ids 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
          setPaymentNotConfigured(true);
        });
    }
  }, []);

  if (paymentNotConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight via-midnight/95 to-midnight/90 flex items-center justify-center p-4">
        <Card className="glass-morph border-electric/30 bg-transparent max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-orbitron text-electric text-center">
              Payment Not Configured
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-electric to-gold rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-exclamation-triangle text-midnight text-2xl"></i>
            </div>
            <p className="text-gray-400">
              Payment processing is not set up yet. You can still track your habits and build streaks without financial penalties.
            </p>
            <Button 
              className="bg-electric hover:bg-electric/80 text-white font-semibold"
              onClick={() => window.location.href = '/'}
            >
              <i className="fas fa-home mr-2"></i>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight via-midnight/95 to-midnight/90 flex items-center justify-center">
        <div className="glass-morph rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blood to-electric rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <i className="fas fa-credit-card text-white text-2xl"></i>
          </div>
          <p className="text-white text-lg">Preparing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-midnight/95 to-midnight/90 flex items-center justify-center p-4">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm amount={amount} penaltyIds={penaltyIds} />
      </Elements>
    </div>
  );
}
