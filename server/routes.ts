import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, authenticateUser } from "./auth";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({ username, password: hashedPassword });
      
      req.session.userId = user.id;
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      const user = await authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      req.session.userId = user.id;
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    
    res.json({ user: { id: user.id, username: user.username } });
  });

  // Patient routes
  app.post("/api/patients", async (req, res) => {
    try {
      console.log("Creating patient with data:", req.body);
      const patient = await storage.createPatient(req.body);
      console.log("Patient created:", patient);
      res.json(patient);
    } catch (error) {
      console.error("Failed to create patient:", error);
      res.status(400).json({ error: "Failed to create patient", details: error.message });
    }
  });

  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patients" });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.getPatient(parseInt(req.params.id));
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patient" });
    }
  });

  app.put("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.updatePatient(parseInt(req.params.id), req.body);
      res.json(patient);
    } catch (error) {
      res.status(400).json({ error: "Failed to update patient" });
    }
  });

  app.delete("/api/patients/:id", async (req, res) => {
    try {
      await storage.deletePatient(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete patient" });
    }
  });

  // Resource routes
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  app.put("/api/resources/:id", async (req, res) => {
    try {
      const resource = await storage.updateResource(parseInt(req.params.id), req.body);
      res.json(resource);
    } catch (error) {
      res.status(400).json({ error: "Failed to update resource" });
    }
  });

  // Staff routes
  app.get("/api/staff", async (req, res) => {
    try {
      const staff = await storage.getStaff();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      console.log("Creating staff with data:", req.body);
      const staff = await storage.createStaff(req.body);
      console.log("Staff created:", staff);
      res.json(staff);
    } catch (error) {
      console.error("Failed to create staff:", error);
      res.status(400).json({ error: "Failed to create staff", details: error.message });
    }
  });

  app.put("/api/staff/:id", async (req, res) => {
    try {
      const staff = await storage.updateStaff(parseInt(req.params.id), req.body);
      res.json(staff);
    } catch (error) {
      res.status(400).json({ error: "Failed to update staff" });
    }
  });

  app.delete("/api/staff/:id", async (req, res) => {
    try {
      await storage.deleteStaff(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete staff" });
    }
  });

  // Forecasting routes
  app.get("/api/forecasting", async (req, res) => {
    try {
      const data = await storage.getForecastingData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forecasting data" });
    }
  });

  app.post("/api/forecasting", async (req, res) => {
    try {
      const data = await storage.createForecastingData(req.body);
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: "Failed to create forecasting data" });
    }
  });

  // Emergency events routes
  app.get("/api/emergency-events", async (req, res) => {
    try {
      const events = await storage.getEmergencyEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emergency events" });
    }
  });

  app.post("/api/emergency-events", async (req, res) => {
    try {
      const event = await storage.createEmergencyEvent(req.body);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Failed to create emergency event" });
    }
  });

  app.put("/api/emergency-events/:id", async (req, res) => {
    try {
      const event = await storage.updateEmergencyEvent(parseInt(req.params.id), req.body);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Failed to update emergency event" });
    }
  });

  // Appointments routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      console.log("Creating appointment with data:", req.body);
      const appointment = await storage.createAppointment(req.body);
      console.log("Appointment created:", appointment);
      // Create notification
      await storage.createNotification({
        title: "New Appointment Scheduled",
        message: `Appointment with ${req.body.doctor_name} on ${req.body.appointment_date}`,
        type: "success"
      });
      res.json(appointment);
    } catch (error) {
      console.error("Failed to create appointment:", error);
      res.status(400).json({ error: "Failed to create appointment", details: error.message });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.updateAppointment(parseInt(req.params.id), req.body);
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ error: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      await storage.deleteAppointment(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete appointment" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await storage.getNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      const notification = await storage.markNotificationRead(parseInt(req.params.id));
      res.json(notification);
    } catch (error) {
      res.status(400).json({ error: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
