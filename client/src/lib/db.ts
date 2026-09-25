import Dexie, { type EntityTable } from "dexie";
import type { Scanner, Driver, Assignment } from "@shared/schema";

// Define the database
const db = new Dexie("ScannerTrackerDB") as Dexie & {
  scanners: EntityTable<Scanner, "id">;
  drivers: EntityTable<Driver, "name">;
  assignments: EntityTable<Assignment, "id">;
};

/**
 * Normalize a scanned/typed scanner ID so the same physical scanner always
 * produces the same key. Barcode readers (Zebra keyboard wedge, camera) can
 * add invisible control characters (e.g. \r, \t, GS) or send lowercase when
 * Caps Lock is on, which made exact lookups fail.
 */
export function normalizeScannerId(raw: string): string {
  return String(raw ?? "")
    .replace(/[\u0000-\u001F\u007F\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .toUpperCase();
}

/** Compare two scanner IDs, ignoring case and invisible characters */
export function sameScannerId(a: string, b: string): boolean {
  return normalizeScannerId(a) === normalizeScannerId(b);
}

// Shown at the bottom of the app so you can see which version is running
export const APP_VERSION = "fix-3";

// Define the schema
db.version(2).stores({
  scanners: "id, registeredAt, notes",
  drivers: "name, addedAt",
  assignments: "id, scannerId, driverName, date, status",
});

// Version 3: same schema, but normalize all IDs that were stored before
db.version(3)
  .stores({
    scanners: "id, registeredAt, notes",
    drivers: "name, addedAt",
    assignments: "id, scannerId, driverName, date, status",
  })
  .upgrade(async (tx) => {
    const scannersTable = tx.table("scanners");
    const allScanners: Scanner[] = await scannersTable.toArray();
    for (const scanner of allScanners) {
      const normalized = normalizeScannerId(scanner.id);
      if (normalized !== scanner.id) {
        await scannersTable.delete(scanner.id);
        const existing = await scannersTable.get(normalized);
        if (!existing) {
          await scannersTable.add({ ...scanner, id: normalized });
        }
      }
    }
    await tx
      .table("assignments")
      .toCollection()
      .modify((a: Assignment) => {
        a.scannerId = normalizeScannerId(a.scannerId);
      });
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

  // Find a scanner regardless of upper/lower case in the stored ID
  async findMatching(id: string): Promise<Scanner | undefined> {
    return await db.scanners.filter((s) => sameScannerId(s.id, id)).first();
  },

  async add(scanner: Scanner): Promise<void> {
    await db.scanners.add(scanner);
  },

  async update(id: string, updates: Partial<Scanner>): Promise<void> {
    await db.scanners.update(id, updates);
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

  // All assignments that have not been returned yet, from ANY day
  async getOpen(): Promise<Assignment[]> {
    return await db.assignments.where("status").equals("assigned").toArray();
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

export function getDateDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLast7DaysOptions(language: string): { value: string; label: string }[] {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const dateStr = getDateDaysAgo(i);
    // Parse date in local time by constructing from components
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const label = date.toLocaleDateString(language === "nl" ? "nl-NL" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const todayLabel = language === "nl" ? "Vandaag" : "Today";
    dates.push({ 
      value: dateStr, 
      label: i === 0 ? `${todayLabel} (${label})` : label 
    });
  }
  return dates;
}

// Initialize database and perform daily cleanup
export async function initializeDatabase(): Promise<void> {
  // Clean up old assignments (keep last 7 days for historical reports)
  await performDailyCleanup();
}

// Daily cleanup - removes assignments older than 7 days
export async function performDailyCleanup(): Promise<void> {
  const today = getTodayDate();
  const lastCleanup = localStorage.getItem("lastCleanupDate");

  // If it's a new day, clean up assignments older than 7 days
  if (lastCleanup !== today) {
    const sevenDaysAgo = getDateDaysAgo(7);
    await db.assignments.where("date").below(sevenDaysAgo).delete();
    localStorage.setItem("lastCleanupDate", today);
    console.log(`Daily cleanup performed: removed assignments before ${sevenDaysAgo}`);
  }
}
