import { type User, type InsertUser } from "@shared/schema";
import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

// Ensure data directory exists
const dataDir = join(process.cwd(), "data");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(join(dataDir, "healthflow.db"));

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    created_at INTEGER DEFAULT (unixepoch())
  );
  
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT,
    gender TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    emergency_contact TEXT,
    medical_history TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  );
  
  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    total_count INTEGER NOT NULL,
    available_count INTEGER NOT NULL,
    status TEXT DEFAULT 'available',
    location TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  );
  
  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    shift TEXT NOT NULL,
    status TEXT DEFAULT 'available',
    created_at INTEGER DEFAULT (unixepoch())
  );
  
  CREATE TABLE IF NOT EXISTS forecasting_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    patient_count INTEGER NOT NULL,
    predicted_count INTEGER,
    department TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );
  
  CREATE TABLE IF NOT EXISTS emergency_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    affected_resources TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    resolved_at INTEGER
  );
  
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER REFERENCES patients(id),
    doctor_name TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );
  
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
  );
`);

// Insert default resources
sqlite.exec(`
  INSERT OR IGNORE INTO resources (id, name, type, total_count, available_count, status, location) VALUES
  (1, 'Hospital Beds', 'beds', 120, 85, 'available', 'General Ward'),
  (2, 'ICU Units', 'icu', 20, 18, 'critical', 'ICU'),
  (3, 'Doctors', 'staff', 25, 15, 'available', 'Hospital'),
  (4, 'Ambulances', 'vehicles', 8, 3, 'available', 'Parking');
  
  INSERT OR IGNORE INTO staff (id, name, role, department, shift, status) VALUES
  (1, 'Dr. Sarah Johnson', 'Doctor', 'Emergency', 'Morning', 'on-duty'),
  (2, 'Nurse Mike Davis', 'Nurse', 'ICU', 'Night', 'on-duty'),
  (3, 'Dr. Emily Brown', 'Doctor', 'Surgery', 'Evening', 'available'),
  (4, 'Nurse John Smith', 'Nurse', 'General Ward', 'Morning', 'on-duty'),
  (5, 'Dr. Robert Wilson', 'Doctor', 'Cardiology', 'Morning', 'break');
  
  INSERT OR IGNORE INTO forecasting_data (id, date, patient_count, predicted_count, department) VALUES
  (1, '2024-01-08', 65, 62, 'Emergency'),
  (2, '2024-01-09', 72, 70, 'Emergency'),
  (3, '2024-01-10', 68, 68, 'Emergency'),
  (4, '2024-01-11', 85, 78, 'Emergency'),
  (5, '2024-01-12', NULL, 82, 'Emergency'),
  (6, '2024-01-13', NULL, 75, 'Emergency'),
  (7, '2024-01-14', NULL, 70, 'Emergency');
`);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPatient(patient: any): Promise<any>;
  getPatients(): Promise<any[]>;
  getPatient(id: number): Promise<any>;
  updatePatient(id: number, patient: any): Promise<any>;
  deletePatient(id: number): Promise<void>;
  getResources(): Promise<any[]>;
  updateResource(id: number, resource: any): Promise<any>;
  getStaff(): Promise<any[]>;
  createStaff(staff: any): Promise<any>;
  updateStaff(id: number, staff: any): Promise<any>;
  deleteStaff(id: number): Promise<void>;
  getForecastingData(): Promise<any[]>;
  createForecastingData(data: any): Promise<any>;
  getEmergencyEvents(): Promise<any[]>;
  createEmergencyEvent(event: any): Promise<any>;
  updateEmergencyEvent(id: number, event: any): Promise<any>;
  getAppointments(): Promise<any[]>;
  createAppointment(appointment: any): Promise<any>;
  updateAppointment(id: number, appointment: any): Promise<any>;
  deleteAppointment(id: number): Promise<void>;
  getNotifications(): Promise<any[]>;
  createNotification(notification: any): Promise<any>;
  markNotificationRead(id: number): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const stmt = sqlite.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const stmt = sqlite.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const stmt = sqlite.prepare('INSERT INTO users (username, password, email, full_name) VALUES (?, ?, ?, ?)');
    const result = stmt.run(insertUser.username, insertUser.password, insertUser.email, insertUser.fullName);
    const selectStmt = sqlite.prepare('SELECT * FROM users WHERE id = ?');
    return selectStmt.get(result.lastInsertRowid) as User;
  }

  async createPatient(patient: any): Promise<any> {
    const stmt = sqlite.prepare(`
      INSERT INTO patients (first_name, last_name, phone, email, address, medical_history) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      patient.firstName, 
      patient.lastName, 
      patient.phone || null, 
      patient.email || null, 
      patient.address || null, 
      patient.medicalHistory || null
    );
    const selectStmt = sqlite.prepare('SELECT * FROM patients WHERE id = ?');
    return selectStmt.get(result.lastInsertRowid);
  }

  async getPatients(): Promise<any[]> {
    const stmt = sqlite.prepare('SELECT * FROM patients ORDER BY created_at DESC');
    return stmt.all();
  }

  async getPatient(id: number): Promise<any> {
    const stmt = sqlite.prepare('SELECT * FROM patients WHERE id = ?');
    return stmt.get(id);
  }

  async updatePatient(id: number, patient: any): Promise<any> {
    const stmt = sqlite.prepare(`
      UPDATE patients 
      SET first_name = ?, last_name = ?, phone = ?, email = ?, address = ?, medical_history = ?, updated_at = unixepoch()
      WHERE id = ?
    `);
    stmt.run(
      patient.firstName, 
      patient.lastName, 
      patient.phone, 
      patient.email, 
      patient.address, 
      patient.medicalHistory, 
      id
    );
    const selectStmt = sqlite.prepare('SELECT * FROM patients WHERE id = ?');
    return selectStmt.get(id);
  }

  async deletePatient(id: number): Promise<void> {
    const stmt = sqlite.prepare('DELETE FROM patients WHERE id = ?');
    stmt.run(id);
  }

  async getResources(): Promise<any[]> {
    const stmt = sqlite.prepare('SELECT * FROM resources ORDER BY id');
    return stmt.all();
  }

  async updateResource(id: number, resource: any): Promise<any> {
    // Get current resource to preserve existing values
    const currentStmt = sqlite.prepare('SELECT * FROM resources WHERE id = ?');
    const current = currentStmt.get(id) as any;
    
    const stmt = sqlite.prepare(`
      UPDATE resources 
      SET total_count = ?, available_count = ?, status = ?, updated_at = unixepoch()
      WHERE id = ?
    `);
    stmt.run(
      resource.total_count !== undefined ? resource.total_count : current.total_count,
      resource.available_count !== undefined ? resource.available_count : current.available_count,
      resource.status || current.status || 'available',
      id
    );
    const selectStmt = sqlite.prepare('SELECT * FROM resources WHERE id = ?');
    return selectStmt.get(id);
  }

  async getStaff(): Promise<any[]> {
    const stmt = sqlite.prepare('SELECT * FROM staff ORDER BY name');
    return stmt.all();
  }

  async createStaff(staff: any): Promise<any> {
    try {
      const stmt = sqlite.prepare(`
        INSERT INTO staff (name, role, department, shift, status) 
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        staff.name || '', 
        staff.role || '', 
        staff.department || '', 
        staff.shift || '', 
        staff.status || 'available'
      );
      
      // Get the inserted record
      const selectStmt = sqlite.prepare('SELECT * FROM staff WHERE id = ?');
      return selectStmt.get(result.lastInsertRowid);
    } catch (error) {
      console.error('Database error creating staff:', error);
      throw error;
    }
  }

  async updateStaff(id: number, staff: any): Promise<any> {
    const stmt = sqlite.prepare(`
      UPDATE staff 
      SET name = ?, role = ?, department = ?, shift = ?, status = ?
      WHERE id = ?
    `);
    stmt.run(staff.name, staff.role, staff.department, staff.shift, staff.status, id);
    const selectStmt = sqlite.prepare('SELECT * FROM staff WHERE id = ?');
    return selectStmt.get(id);
  }

  async deleteStaff(id: number): Promise<void> {
    const stmt = sqlite.prepare('DELETE FROM staff WHERE id = ?');
    stmt.run(id);
  }

  async getForecastingData(): Promise<any[]> {
    const stmt = sqlite.prepare('SELECT * FROM forecasting_data ORDER BY date');
    return stmt.all();
  }

  async createForecastingData(data: any): Promise<any> {
    const stmt = sqlite.prepare(`
      INSERT INTO forecasting_data (date, patient_count, predicted_count, department) 
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(data.date, data.patient_count, data.predicted_count, data.department);
    const selectStmt = sqlite.prepare('SELECT * FROM forecasting_data WHERE id = ?');
    return selectStmt.get(result.lastInsertRowid);
  }

  async getEmergencyEvents(): Promise<any[]> {
    const stmt = sqlite.prepare('SELECT * FROM emergency_events WHERE status = "active" ORDER BY created_at DESC');
    return stmt.all();
  }

  async createEmergencyEvent(event: any): Promise<any> {
    const stmt = sqlite.prepare(`
      INSERT INTO emergency_events (title, description, severity, affected_resources) 
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(event.title, event.description, event.severity, event.affected_resources);
    const selectStmt = sqlite.prepare('SELECT * FROM emergency_events WHERE id = ?');
    return selectStmt.get(result.lastInsertRowid);
  }

  async updateEmergencyEvent(id: number, event: any): Promise<any> {
    const stmt = sqlite.prepare(`
      UPDATE emergency_events 
      SET status = ?, resolved_at = unixepoch()
      WHERE id = ?
    `);
    stmt.run(event.status, id);
    const selectStmt = sqlite.prepare('SELECT * FROM emergency_events WHERE id = ?');
    return selectStmt.get(id);
  }

  async getAppointments(): Promise<any[]> {
    const stmt = sqlite.prepare(`
      SELECT a.*, p.first_name, p.last_name 
      FROM appointments a 
      LEFT JOIN patients p ON a.patient_id = p.id 
      ORDER BY a.appointment_date, a.appointment_time
    `);
    return stmt.all();
  }

  async createAppointment(appointment: any): Promise<any> {
    const stmt = sqlite.prepare(`
      INSERT INTO appointments (patient_id, doctor_name, appointment_date, appointment_time, notes) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      appointment.patient_id, 
      appointment.doctor_name, 
      appointment.appointment_date, 
      appointment.appointment_time, 
      appointment.notes || null
    );
    const selectStmt = sqlite.prepare('SELECT * FROM appointments WHERE id = ?');
    return selectStmt.get(result.lastInsertRowid);
  }

  async updateAppointment(id: number, appointment: any): Promise<any> {
    const stmt = sqlite.prepare(`
      UPDATE appointments 
      SET status = ?, notes = ?
      WHERE id = ?
    `);
    stmt.run(appointment.status, appointment.notes, id);
    const selectStmt = sqlite.prepare('SELECT * FROM appointments WHERE id = ?');
    return selectStmt.get(id);
  }

  async deleteAppointment(id: number): Promise<void> {
    const stmt = sqlite.prepare('DELETE FROM appointments WHERE id = ?');
    stmt.run(id);
  }

  async getNotifications(): Promise<any[]> {
    const stmt = sqlite.prepare('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20');
    return stmt.all();
  }

  async createNotification(notification: any): Promise<any> {
    const stmt = sqlite.prepare(`
      INSERT INTO notifications (title, message, type) 
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(notification.title, notification.message, notification.type || 'info');
    const selectStmt = sqlite.prepare('SELECT * FROM notifications WHERE id = ?');
    return selectStmt.get(result.lastInsertRowid);
  }

  async markNotificationRead(id: number): Promise<any> {
    const stmt = sqlite.prepare(`
      UPDATE notifications 
      SET is_read = 1
      WHERE id = ?
    `);
    stmt.run(id);
    const selectStmt = sqlite.prepare('SELECT * FROM notifications WHERE id = ?');
    return selectStmt.get(id);
  }
}

export const storage = new DatabaseStorage();
