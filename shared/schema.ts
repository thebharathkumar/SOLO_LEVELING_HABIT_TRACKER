import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Gamification fields
  level: integer("level").default(1),
  experience: integer("experience").default(0),
  experienceToNext: integer("experience_to_next").default(100),
  currency: integer("currency").default(0),
  characterClass: varchar("character_class").default("Shadow Assassin"),
  title: varchar("title").default("Shadow Hunter"),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  totalAchievements: integer("total_achievements").default(0),
  // Stats
  strengthStat: integer("strength_stat").default(10),
  intelligenceStat: integer("intelligence_stat").default(10),
  disciplineStat: integer("discipline_stat").default(10),
  socialStat: integer("social_stat").default(10),
  // Stripe integration
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habits = pgTable("habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // physical, mental, knowledge, social
  icon: varchar("icon").default("fas fa-check"),
  expReward: integer("exp_reward").default(50),
  penalty: decimal("penalty", { precision: 10, scale: 2 }).default("15.00"),
  penaltyDestination: varchar("penalty_destination"), // political, competitor, cause
  isActive: boolean("is_active").default(true),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  totalCompletions: integer("total_completions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habitCompletions = pgTable("habit_completions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  habitId: varchar("habit_id").notNull().references(() => habits.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  completedAt: timestamp("completed_at").defaultNow(),
  date: varchar("date").notNull(), // YYYY-MM-DD format
  expGained: integer("exp_gained").default(0),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon").default("fas fa-trophy"),
  category: varchar("category").notNull(), // streak, level, habit, special
  requirement: integer("requirement").notNull(),
  expReward: integer("exp_reward").default(100),
  currencyReward: integer("currency_reward").default(50),
  rarity: varchar("rarity").default("common"), // common, rare, epic, legendary
  isSecret: boolean("is_secret").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  progress: integer("progress").default(0),
});

export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon").default("fas fa-star"),
  category: varchar("category").notNull(), // passive, active, ultimate
  tier: integer("tier").default(1),
  cost: integer("cost").default(100),
  requiredLevel: integer("required_level").default(1),
  effect: text("effect"), // JSON string describing the skill effect
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSkills = pgTable("user_skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  skillId: varchar("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const penalties = pgTable("penalties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  habitId: varchar("habit_id").notNull().references(() => habits.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  destination: varchar("destination").notNull(),
  reason: text("reason"),
  isPaid: boolean("is_paid").default(false),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  paidAt: timestamp("paid_at"),
});

export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason"),
  isClaimed: boolean("is_claimed").default(false),
  stripeTransferId: varchar("stripe_transfer_id"),
  createdAt: timestamp("created_at").defaultNow(),
  claimedAt: timestamp("claimed_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  habits: many(habits),
  habitCompletions: many(habitCompletions),
  userAchievements: many(userAchievements),
  userSkills: many(userSkills),
  penalties: many(penalties),
  rewards: many(rewards),
}));

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  completions: many(habitCompletions),
  penalties: many(penalties),
}));

export const habitCompletionsRelations = relations(habitCompletions, ({ one }) => ({
  habit: one(habits, {
    fields: [habitCompletions.habitId],
    references: [habits.id],
  }),
  user: one(users, {
    fields: [habitCompletions.userId],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const skillsRelations = relations(skills, ({ many }) => ({
  userSkills: many(userSkills),
}));

export const userSkillsRelations = relations(userSkills, ({ one }) => ({
  user: one(users, {
    fields: [userSkills.userId],
    references: [users.id],
  }),
  skill: one(skills, {
    fields: [userSkills.skillId],
    references: [skills.id],
  }),
}));

export const penaltiesRelations = relations(penalties, ({ one }) => ({
  user: one(users, {
    fields: [penalties.userId],
    references: [users.id],
  }),
  habit: one(habits, {
    fields: [penalties.habitId],
    references: [habits.id],
  }),
}));

export const rewardsRelations = relations(rewards, ({ one }) => ({
  user: one(users, {
    fields: [rewards.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Special schema for Replit Auth that includes ID
export const replitAuthUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHabitCompletionSchema = createInsertSchema(habitCompletions).omit({
  id: true,
  completedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertPenaltySchema = createInsertSchema(penalties).omit({
  id: true,
  createdAt: true,
  paidAt: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true,
  claimedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;
export type InsertHabitCompletion = z.infer<typeof insertHabitCompletionSchema>;
export type HabitCompletion = typeof habitCompletions.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type UserSkill = typeof userSkills.$inferSelect;
export type Penalty = typeof penalties.$inferSelect;
export type Reward = typeof rewards.$inferSelect;
