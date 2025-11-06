import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "@shared/schema";

// --- Mock User/Auth Setup for Sandbox Environment ---

// Passport serialization/deserialization
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Mock Local Strategy (Always succeeds with a default user for testing)
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Check for default user, create if not exists
      let user: User | null = await storage.getUser("test-user-id");
      if (!user) {
        user = await storage.createUser({
          id: "test-user-id",
          username: "testuser",
          email: "test@svu-ai-studio.com",
          name: "Test User",
          createdAt: new Date(),
        });
      }

      // Simulate successful login
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  // Using MemoryStore for session in sandbox, as connecting to a persistent DB is complex
  const MemoryStore = session.MemoryStore;
  const sessionStore = new MemoryStore();
  
  return session({
    secret: process.env.SESSION_SECRET || "default_secret", // Use default if not set
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  // Install passport-local for the new strategy
  // This should be done via npm install but we'll assume it's available or handle the install
  // For now, we'll assume it's available or handle the install outside this file

  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Mock Login Route
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login error" });
        }
        res.json({ message: "Login successful", user });
      });
    })(req, res, next);
  });
  
  // Logout Route
  app.post("/api/auth/logout", (req, res) => {
    req.logOut((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout error" });
      }
      res.json({ message: "Logout successful" });
    });
  });
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    // Mock req.user structure to match the original Replit Oauth claims
    req.user = { claims: { sub: req.user.id } };
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

