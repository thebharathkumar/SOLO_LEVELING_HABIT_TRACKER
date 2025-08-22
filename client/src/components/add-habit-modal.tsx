import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertHabitSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = insertHabitSchema.extend({
  penalty: z.string().min(1, "Penalty amount is required"),
});

type FormData = z.infer<typeof formSchema>;

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddHabitModal({ isOpen, onClose }: AddHabitModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      expReward: 50,
      penalty: "15",
      penaltyDestination: "",
    },
  });

  const createHabitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const habitData = {
        ...data,
        penalty: parseFloat(data.penalty).toFixed(2),
      };
      return apiRequest("POST", "/api/habits", habitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({
        title: "Quest Created!",
        description: "Your new habit quest has been added to your journey.",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create habit: " + error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createHabitMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-morph border-electric/30 bg-midnight/95 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron font-bold text-gold flex items-center">
            <i className="fas fa-plus-circle text-electric mr-3"></i>
            Create New Quest
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-semibold">Quest Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Morning Workout" 
                      className="bg-midnight/50 border-electric/30 text-white placeholder-gray-400 focus:border-electric focus:ring-2 focus:ring-electric/20"
                      data-testid="input-habit-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-semibold">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger 
                        className="bg-midnight/50 border-electric/30 text-white focus:border-electric focus:ring-2 focus:ring-electric/20"
                        data-testid="select-habit-category"
                      >
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-midnight border-electric/30">
                      <SelectItem value="physical" className="text-white hover:bg-electric/20">
                        Physical Training
                      </SelectItem>
                      <SelectItem value="mental" className="text-white hover:bg-electric/20">
                        Mental Discipline
                      </SelectItem>
                      <SelectItem value="knowledge" className="text-white hover:bg-electric/20">
                        Knowledge Pursuit
                      </SelectItem>
                      <SelectItem value="social" className="text-white hover:bg-electric/20">
                        Social Skills
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expReward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-semibold">EXP Reward</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="50" 
                      min="10" 
                      max="100"
                      className="bg-midnight/50 border-electric/30 text-white placeholder-gray-400 focus:border-electric focus:ring-2 focus:ring-electric/20"
                      data-testid="input-habit-exp"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="penalty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-semibold">Failure Penalty ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="15" 
                      min="5" 
                      max="100"
                      step="0.01"
                      className="bg-midnight/50 border-electric/30 text-white placeholder-gray-400 focus:border-electric focus:ring-2 focus:ring-electric/20"
                      data-testid="input-habit-penalty"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="penaltyDestination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-semibold">Penalty Destination</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger 
                        className="bg-midnight/50 border-electric/30 text-white focus:border-electric focus:ring-2 focus:ring-electric/20"
                        data-testid="select-penalty-destination"
                      >
                        <SelectValue placeholder="Select Destination" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-midnight border-electric/30">
                      <SelectItem value="political" className="text-white hover:bg-electric/20">
                        Political Opposition
                      </SelectItem>
                      <SelectItem value="competitor" className="text-white hover:bg-electric/20">
                        Competitor Company
                      </SelectItem>
                      <SelectItem value="cause" className="text-white hover:bg-electric/20">
                        Cause You Dislike
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={handleClose}
                data-testid="button-cancel-habit"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-electric hover:bg-electric/80 text-white font-semibold animate-glow"
                disabled={createHabitMutation.isPending}
                data-testid="button-create-habit"
              >
                {createHabitMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus mr-2"></i>
                    Create Quest
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
