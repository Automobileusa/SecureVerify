import { users, accounts, transactions, payees, billPayments, chequeOrders, type User, type InsertUser, type Account, type Transaction, type Payee, type BillPayment, type ChequeOrder } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserAccounts(userId: number): Promise<Account[]>;
  getAccountTransactions(accountId: number, limit?: number): Promise<Transaction[]>;
  getUserPayees(userId: number): Promise<Payee[]>;
  createPayee(payee: { userId: number; payeeName: string; accountNumber?: string }): Promise<Payee>;
  createBillPayment(billPayment: Omit<BillPayment, 'id' | 'createdAt' | 'referenceNumber' | 'status'>): Promise<BillPayment>;
  createChequeOrder(chequeOrder: Omit<ChequeOrder, 'id' | 'createdAt' | 'cost' | 'status'>): Promise<ChequeOrder>;
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    
    // Create default accounts for new user
    await this.createDefaultAccounts(user.id);
    
    return user;
  }

  private async createDefaultAccounts(userId: number): Promise<void> {
    // Create chequing account
    await db.insert(accounts).values({
      userId,
      accountNumber: `1234${userId.toString().padStart(4, '0')}`,
      accountType: 'chequing',
      accountName: 'Chequing Account',
      balance: '5247.82',
    });

    // Create savings account
    await db.insert(accounts).values({
      userId,
      accountNumber: `5678${userId.toString().padStart(4, '0')}`,
      accountType: 'savings',
      accountName: 'Savings Account',
      balance: '12854.67',
    });

    // Create credit card
    await db.insert(accounts).values({
      userId,
      accountNumber: `9012${userId.toString().padStart(4, '0')}`,
      accountType: 'credit',
      accountName: 'Credit Card',
      balance: '-1245.32',
    });
  }

  async getUserAccounts(userId: number): Promise<Account[]> {
    return await db.select().from(accounts).where(eq(accounts.userId, userId));
  }

  async getAccountTransactions(accountId: number, limit = 10): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.accountId, accountId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  async getUserPayees(userId: number): Promise<Payee[]> {
    return await db
      .select()
      .from(payees)
      .where(and(eq(payees.userId, userId), eq(payees.isActive, true)));
  }

  async createPayee(payee: { userId: number; payeeName: string; accountNumber?: string }): Promise<Payee> {
    const [newPayee] = await db
      .insert(payees)
      .values(payee)
      .returning();
    return newPayee;
  }

  async createBillPayment(billPayment: Omit<BillPayment, 'id' | 'createdAt' | 'referenceNumber' | 'status'>): Promise<BillPayment> {
    const referenceNumber = `BP${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const [payment] = await db
      .insert(billPayments)
      .values({
        ...billPayment,
        referenceNumber,
        status: 'pending',
      })
      .returning();
    
    return payment;
  }

  async createChequeOrder(chequeOrder: Omit<ChequeOrder, 'id' | 'createdAt' | 'cost' | 'status'>): Promise<ChequeOrder> {
    const cost = chequeOrder.chequeStyle === 'business' ? '34.95' : '29.95';
    
    const [order] = await db
      .insert(chequeOrders)
      .values({
        ...chequeOrder,
        cost,
        status: 'ordered',
      })
      .returning();
    
    return order;
  }
}

export const storage = new DatabaseStorage();
