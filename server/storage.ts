import {
  users,
  habits,
  habitCompletions,
  achievements,
  userAchievements,
  skills,
  userSkills,
  penalties,
  rewards,
  type User,
  type UpsertUser,
  type InsertHabit,
  type Habit,
  type InsertHabitCompletion,
  type HabitCompletion,
  type Achievement,
  type UserAchievement,
  type Skill,
  type UserSkill,
  type Penalty,
  type Reward,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStats(userId: string, stats: Partial<User>): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User>;

  // Habit operations
  getUserHabits(userId: string): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit>;
  deleteHabit(id: string): Promise<void>;

  // Habit completion operations
  getHabitCompletions(userId: string, date?: string): Promise<HabitCompletion[]>;
  completeHabit(completion: InsertHabitCompletion): Promise<HabitCompletion>;
  getWeeklyProgress(userId: string): Promise<any[]>;

  // Achievement operations
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;

  // Skill operations
  getAllSkills(): Promise<Skill[]>;
  getUserSkills(userId: string): Promise<UserSkill[]>;
  unlockSkill(userId: string, skillId: string): Promise<UserSkill>;

  // Financial operations
  getUserPenalties(userId: string, unpaidOnly?: boolean): Promise<Penalty[]>;
  createPenalty(penalty: Omit<Penalty, 'id' | 'createdAt' | 'paidAt'>): Promise<Penalty>;
  markPenaltyPaid(penaltyId: string, paymentIntentId: string): Promise<Penalty>;
  getUserRewards(userId: string, unclaimedOnly?: boolean): Promise<Reward[]>;
  createReward(reward: Omit<Reward, 'id' | 'createdAt' | 'claimedAt'>): Promise<Reward>;
  markRewardClaimed(rewardId: string): Promise<Reward>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStats(userId: string, stats: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserHabits(userId: string): Promise<Habit[]> {
    return await db
      .select()
      .from(habits)
      .where(and(eq(habits.userId, userId), eq(habits.isActive, true)))
      .orderBy(desc(habits.createdAt));
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const [newHabit] = await db.insert(habits).values(habit).returning();
    return newHabit;
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    const [habit] = await db
      .update(habits)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(habits.id, id))
      .returning();
    return habit;
  }

  async deleteHabit(id: string): Promise<void> {
    await db.update(habits).set({ isActive: false }).where(eq(habits.id, id));
  }

  async getHabitCompletions(userId: string, date?: string): Promise<HabitCompletion[]> {
    const conditions = [eq(habitCompletions.userId, userId)];
    if (date) {
      conditions.push(eq(habitCompletions.date, date));
    }
    
    return await db
      .select()
      .from(habitCompletions)
      .where(and(...conditions))
      .orderBy(desc(habitCompletions.completedAt));
  }

  async completeHabit(completion: InsertHabitCompletion): Promise<HabitCompletion> {
    const [newCompletion] = await db
      .insert(habitCompletions)
      .values(completion)
      .returning();
    return newCompletion;
  }

  async getWeeklyProgress(userId: string): Promise<any[]> {
    // Get last 7 days of completions
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return await db
      .select({
        date: habitCompletions.date,
        count: sql<number>`count(*)`.as('count')
      })
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.userId, userId),
          gte(habitCompletions.completedAt, sevenDaysAgo)
        )
      )
      .groupBy(habitCompletions.date)
      .orderBy(habitCompletions.date);
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).orderBy(achievements.category, achievements.requirement);
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt));
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const [achievement] = await db
      .insert(userAchievements)
      .values({ userId, achievementId })
      .returning();
    return achievement;
  }

  async getAllSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.tier, skills.requiredLevel);
  }

  async getUserSkills(userId: string): Promise<UserSkill[]> {
    return await db
      .select()
      .from(userSkills)
      .where(eq(userSkills.userId, userId))
      .orderBy(desc(userSkills.unlockedAt));
  }

  async unlockSkill(userId: string, skillId: string): Promise<UserSkill> {
    const [skill] = await db
      .insert(userSkills)
      .values({ userId, skillId })
      .returning();
    return skill;
  }

  async getUserPenalties(userId: string, unpaidOnly: boolean = false): Promise<Penalty[]> {
    const conditions = [eq(penalties.userId, userId)];
    if (unpaidOnly) {
      conditions.push(eq(penalties.isPaid, false));
    }
    
    return await db
      .select()
      .from(penalties)
      .where(and(...conditions))
      .orderBy(desc(penalties.createdAt));
  }

  async createPenalty(penalty: Omit<Penalty, 'id' | 'createdAt' | 'paidAt'>): Promise<Penalty> {
    const [newPenalty] = await db.insert(penalties).values(penalty).returning();
    return newPenalty;
  }

  async markPenaltyPaid(penaltyId: string, paymentIntentId: string): Promise<Penalty> {
    const [penalty] = await db
      .update(penalties)
      .set({ 
        isPaid: true, 
        stripePaymentIntentId: paymentIntentId,
        paidAt: new Date()
      })
      .where(eq(penalties.id, penaltyId))
      .returning();
    return penalty;
  }

  async getUserRewards(userId: string, unclaimedOnly: boolean = false): Promise<Reward[]> {
    const conditions = [eq(rewards.userId, userId)];
    if (unclaimedOnly) {
      conditions.push(eq(rewards.isClaimed, false));
    }
    
    return await db
      .select()
      .from(rewards)
      .where(and(...conditions))
      .orderBy(desc(rewards.createdAt));
  }

  async createReward(reward: Omit<Reward, 'id' | 'createdAt' | 'claimedAt'>): Promise<Reward> {
    const [newReward] = await db.insert(rewards).values(reward).returning();
    return newReward;
  }

  async markRewardClaimed(rewardId: string): Promise<Reward> {
    const [reward] = await db
      .update(rewards)
      .set({ 
        isClaimed: true,
        claimedAt: new Date()
      })
      .where(eq(rewards.id, rewardId))
      .returning();
    return reward;
  }
}

export const storage = new DatabaseStorage();
