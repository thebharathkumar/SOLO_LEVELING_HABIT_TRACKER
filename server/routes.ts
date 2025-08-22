import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertHabitSchema, insertHabitCompletionSchema } from "@shared/schema";
import { z } from "zod";

// Make Stripe optional for development
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Habit routes
  app.get('/api/habits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habits = await storage.getUserHabits(userId);
      res.json(habits);
    } catch (error) {
      console.error("Error fetching habits:", error);
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  app.post('/api/habits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("Creating habit for user:", userId);
      console.log("Request body:", req.body);
      
      const habitData = insertHabitSchema.parse({ ...req.body, userId });
      console.log("Parsed habit data:", habitData);
      
      const habit = await storage.createHabit(habitData);
      console.log("Created habit:", habit);
      
      res.json(habit);
    } catch (error) {
      console.error("Error creating habit:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
      }
      res.status(400).json({ 
        message: "Failed to create habit", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.put('/api/habits/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const habit = await storage.updateHabit(id, updates);
      res.json(habit);
    } catch (error) {
      console.error("Error updating habit:", error);
      res.status(400).json({ message: "Failed to update habit" });
    }
  });

  app.delete('/api/habits/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteHabit(id);
      res.json({ message: "Habit deleted successfully" });
    } catch (error) {
      console.error("Error deleting habit:", error);
      res.status(400).json({ message: "Failed to delete habit" });
    }
  });

  // Habit completion routes
  app.get('/api/habit-completions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date } = req.query;
      const completions = await storage.getHabitCompletions(userId, date as string);
      res.json(completions);
    } catch (error) {
      console.error("Error fetching completions:", error);
      res.status(500).json({ message: "Failed to fetch completions" });
    }
  });

  app.post('/api/habit-completions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const completionData = insertHabitCompletionSchema.parse({ ...req.body, userId });
      const completion = await storage.completeHabit(completionData);
      
      // Update user stats (this would be expanded with proper leveling logic)
      const user = await storage.getUser(userId);
      if (user) {
        const expGained = completionData.expGained || 50;
        const currentExp = user.experience || 0;
        const currentLevel = user.level || 1;
        const currentExpToNext = user.experienceToNext || 100;
        const currentCurrency = user.currency || 0;
        
        const newExp = currentExp + expGained;
        let newLevel = currentLevel;
        let newExpToNext = currentExpToNext;
        
        // Simple leveling calculation
        if (newExp >= currentExpToNext) {
          newLevel += 1;
          newExpToNext = newLevel * 100;
        }
        
        await storage.updateUserStats(userId, {
          experience: newExp,
          level: newLevel,
          experienceToNext: newExpToNext,
          currency: currentCurrency + 10
        });
      }
      
      res.json(completion);
    } catch (error) {
      console.error("Error completing habit:", error);
      res.status(400).json({ message: "Failed to complete habit" });
    }
  });

  app.get('/api/weekly-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getWeeklyProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching weekly progress:", error);
      res.status(500).json({ message: "Failed to fetch weekly progress" });
    }
  });

  // Achievement routes
  app.get('/api/achievements', isAuthenticated, async (req: any, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get('/api/user-achievements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Skill routes
  app.get('/api/skills', isAuthenticated, async (req: any, res) => {
    try {
      const skills = await storage.getAllSkills();
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.get('/api/user-skills', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userSkills = await storage.getUserSkills(userId);
      res.json(userSkills);
    } catch (error) {
      console.error("Error fetching user skills:", error);
      res.status(500).json({ message: "Failed to fetch user skills" });
    }
  });

  app.post('/api/unlock-skill/:skillId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { skillId } = req.params;
      const userSkill = await storage.unlockSkill(userId, skillId);
      res.json(userSkill);
    } catch (error) {
      console.error("Error unlocking skill:", error);
      res.status(400).json({ message: "Failed to unlock skill" });
    }
  });

  // Financial routes
  app.get('/api/penalties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { unpaid } = req.query;
      const penalties = await storage.getUserPenalties(userId, unpaid === 'true');
      res.json(penalties);
    } catch (error) {
      console.error("Error fetching penalties:", error);
      res.status(500).json({ message: "Failed to fetch penalties" });
    }
  });

  app.get('/api/rewards', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { unclaimed } = req.query;
      const rewards = await storage.getUserRewards(userId, unclaimed === 'true');
      res.json(rewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });

  // Stripe payment routes (optional)
  app.post("/api/create-payment-intent", isAuthenticated, async (req: any, res) => {
    if (!stripe) {
      return res.status(501).json({ message: "Payment processing is not configured" });
    }
    
    try {
      const { amount, penaltyIds } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: req.user.claims.sub,
          penaltyIds: JSON.stringify(penaltyIds || [])
        }
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post('/api/process-penalty-payment', isAuthenticated, async (req: any, res) => {
    if (!stripe) {
      return res.status(501).json({ message: "Payment processing is not configured" });
    }
    
    try {
      const { paymentIntentId, penaltyIds } = req.body;
      
      // Mark penalties as paid
      for (const penaltyId of penaltyIds) {
        await storage.markPenaltyPaid(penaltyId, paymentIntentId);
      }
      
      res.json({ message: "Penalties processed successfully" });
    } catch (error) {
      console.error("Error processing penalty payment:", error);
      res.status(400).json({ message: "Failed to process penalty payment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
