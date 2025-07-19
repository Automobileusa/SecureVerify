import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { billPaymentSchema, chequeOrderSchema, securityQuestionSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Security question verification
  app.post("/api/verify-security", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { answer } = securityQuestionSchema.parse(req.body);
      
      if (answer === "2013") {
        // Mark user as fully authenticated
        if (req.session) {
          req.session.securityVerified = true;
        }
        res.json({ success: true });
      } else {
        res.status(400).json({ message: "Incorrect answer. Please try again." });
      }
    } catch (error) {
      console.error("Security verification error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user accounts
  app.get("/api/accounts", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const accounts = await storage.getUserAccounts(req.user!.id);
      res.json(accounts);
    } catch (error) {
      console.error("Get accounts error:", error);
      res.status(500).json({ message: "Failed to fetch accounts" });
    }
  });

  // Get account transactions
  app.get("/api/accounts/:accountId/transactions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const accountId = parseInt(req.params.accountId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const transactions = await storage.getAccountTransactions(accountId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Get user payees
  app.get("/api/payees", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const payees = await storage.getUserPayees(req.user!.id);
      res.json(payees);
    } catch (error) {
      console.error("Get payees error:", error);
      res.status(500).json({ message: "Failed to fetch payees" });
    }
  });

  // Create payee
  app.post("/api/payees", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { payeeName, accountNumber } = req.body;
      const payee = await storage.createPayee({
        userId: req.user!.id,
        payeeName,
        accountNumber,
      });
      
      res.status(201).json(payee);
    } catch (error) {
      console.error("Create payee error:", error);
      res.status(500).json({ message: "Failed to create payee" });
    }
  });

  // Create bill payment
  app.post("/api/bill-payments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const billPaymentData = billPaymentSchema.parse(req.body);
      const billPayment = await storage.createBillPayment({
        userId: req.user!.id,
        ...billPaymentData,
      });
      
      res.status(201).json(billPayment);
    } catch (error) {
      console.error("Create bill payment error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid bill payment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create bill payment" });
      }
    }
  });

  // Create cheque order
  app.post("/api/cheque-orders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const chequeOrderData = chequeOrderSchema.parse(req.body);
      const chequeOrder = await storage.createChequeOrder({
        userId: req.user!.id,
        ...chequeOrderData,
      });
      
      res.status(201).json(chequeOrder);
    } catch (error) {
      console.error("Create cheque order error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid cheque order data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create cheque order" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
