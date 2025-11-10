import Dexie, { type EntityTable } from "dexie";
import type { Scanner, Driver, Assignment } from "@shared/schema";

// Define the database
const db = new Dexie("ScannerTrackerDB") as Dexie & {
  scanners: EntityTable<Scanner, "id">;
  drivers: EntityTable<Driver, "name">;
  assignments: EntityTable<Assignment, "id">;
};

// Define the schema
db.version(1).stores({
  scanners: "id, registeredAt",
  drivers: "name, addedAt",
  assignments: "id, scannerId, driverName, date, status",
});

export { db };

// Storage utilities
export const scannerStorage = {
  async getAll(): Promise<Scanner[]> {
    return await db.scanners.toArray();
  },

  async getById(id: string): Promise<Scanner | undefined> {
    return await db.scanners.get(id);
  },

  async add(scanner: Scanner): Promise<void> {
    await db.scanners.add(scanner);
  },

  async delete(id: string): Promise<void> {
    await db.scanners.delete(id);
  },

  async exists(id: string): Promise<boolean> {
    const scanner = await db.scanners.get(id);
    return scanner !== undefined;
  },
};

export const driverStorage = {
  async getAll(): Promise<Driver[]> {
    return await db.drivers.toArray();
  },

  async add(driver: Driver): Promise<void> {
    await db.drivers.add(driver);
  },

  async delete(name: string): Promise<void> {
    await db.drivers.delete(name);
  },

  async exists(name: string): Promise<boolean> {
    const driver = await db.drivers.get(name);
    return driver !== undefined;
  },
};

export const assignmentStorage = {
  async getAll(): Promise<Assignment[]> {
    return await db.assignments.toArray();
  },

  async getByDate(date: string): Promise<Assignment[]> {
    return await db.assignments.where("date").equals(date).toArray();
  },

  async getByScannerId(scannerId: string): Promise<Assignment | undefined> {
    // Get the most recent assignment for a scanner (by date DESC)
    const assignments = await db.assignments
      .where("scannerId")
      .equals(scannerId)
      .reverse()
      .toArray();
    return assignments[0];
  },

  async add(assignment: Assignment): Promise<void> {
    await db.assignments.add(assignment);
  },

  async update(id: string, updates: Partial<Assignment>): Promise<void> {
    await db.assignments.update(id, updates);
  },

  async delete(id: string): Promise<void> {
    await db.assignments.delete(id);
  },

  async deleteByDate(date: string): Promise<void> {
    await db.assignments.where("date").equals(date).delete();
  },

  async deletePreviousDays(currentDate: string): Promise<void> {
    // Delete all assignments before the current date
    await db.assignments.where("date").below(currentDate).delete();
  },
};

// Utility to get today's date in YYYY-MM-DD format (using local timezone)
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Initialize database and perform daily cleanup
export async function initializeDatabase(): Promise<void> {
  // Clean up old assignments (keep only today's)
  await performDailyCleanup();
}

// Daily cleanup - removes assignments from previous days
export async function performDailyCleanup(): Promise<void> {
  const today = getTodayDate();
  const lastCleanup = localStorage.getItem("lastCleanupDate");

  // If it's a new day, clean up old assignments
  if (lastCleanup !== today) {
    await assignmentStorage.deletePreviousDays(today);
    localStorage.setItem("lastCleanupDate", today);
    console.log(`Daily cleanup performed: removed assignments before ${today}`);
  }
}
