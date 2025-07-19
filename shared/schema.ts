import { pgTable, text, serial, integer, boolean, timestamp, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  securityAnswer: text("security_answer").notNull().default("2013"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  accountNumber: text("account_number").notNull().unique(),
  accountType: text("account_type").notNull(), // 'chequing', 'savings', 'credit'
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull().default("0.00"),
  accountName: text("account_name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").references(() => accounts.id).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description").notNull(),
  transactionType: text("transaction_type").notNull(), // 'debit', 'credit'
  category: text("category"),
  referenceNumber: text("reference_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payees = pgTable("payees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  payeeName: text("payee_name").notNull(),
  accountNumber: text("account_number"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const billPayments = pgTable("bill_payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  payeeId: integer("payee_id").references(() => payees.id).notNull(),
  fromAccountId: integer("from_account_id").references(() => accounts.id).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed'
  referenceNumber: text("reference_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chequeOrders = pgTable("cheque_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  accountId: integer("account_id").references(() => accounts.id).notNull(),
  chequeStyle: text("cheque_style").notNull(), // 'personal', 'business'
  quantity: integer("quantity").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  cost: decimal("cost", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("ordered"), // 'ordered', 'processing', 'shipped', 'delivered'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  payees: many(payees),
  billPayments: many(billPayments),
  chequeOrders: many(chequeOrders),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
  billPayments: many(billPayments),
  chequeOrders: many(chequeOrders),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
}));

export const payeesRelations = relations(payees, ({ one, many }) => ({
  user: one(users, {
    fields: [payees.userId],
    references: [users.id],
  }),
  billPayments: many(billPayments),
}));

export const billPaymentsRelations = relations(billPayments, ({ one }) => ({
  user: one(users, {
    fields: [billPayments.userId],
    references: [users.id],
  }),
  payee: one(payees, {
    fields: [billPayments.payeeId],
    references: [payees.id],
  }),
  fromAccount: one(accounts, {
    fields: [billPayments.fromAccountId],
    references: [accounts.id],
  }),
}));

export const chequeOrdersRelations = relations(chequeOrders, ({ one }) => ({
  user: one(users, {
    fields: [chequeOrders.userId],
    references: [users.id],
  }),
  account: one(accounts, {
    fields: [chequeOrders.accountId],
    references: [accounts.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const securityQuestionSchema = z.object({
  answer: z.string().min(1, "Answer is required"),
});

export const billPaymentSchema = createInsertSchema(billPayments).pick({
  payeeId: true,
  fromAccountId: true,
  amount: true,
  paymentDate: true,
});

export const chequeOrderSchema = createInsertSchema(chequeOrders).pick({
  accountId: true,
  chequeStyle: true,
  quantity: true,
  deliveryAddress: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Account = typeof accounts.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Payee = typeof payees.$inferSelect;
export type BillPayment = typeof billPayments.$inferSelect;
export type ChequeOrder = typeof chequeOrders.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type SecurityQuestionData = z.infer<typeof securityQuestionSchema>;
