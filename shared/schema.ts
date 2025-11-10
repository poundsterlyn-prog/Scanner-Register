import { z } from "zod";

// Scanner status enum
export const scannerStatusEnum = z.enum(["available", "assigned", "returned", "overdue"]);
export type ScannerStatus = z.infer<typeof scannerStatusEnum>;

// Scanner schema - permanent data
export const scannerSchema = z.object({
  id: z.string(),
  registeredAt: z.string(),
  notes: z.string().optional(),
});

export type Scanner = z.infer<typeof scannerSchema>;

// Driver schema - permanent data
export const driverSchema = z.object({
  name: z.string(),
  addedAt: z.string(),
});

export type Driver = z.infer<typeof driverSchema>;

// Assignment schema - daily data (resets each day)
export const assignmentSchema = z.object({
  id: z.string(), // unique assignment ID
  scannerId: z.string(),
  driverName: z.string(),
  assignedTime: z.string(),
  returnTime: z.string().optional(),
  status: scannerStatusEnum,
  date: z.string(), // YYYY-MM-DD format for daily grouping
});

export type Assignment = z.infer<typeof assignmentSchema>;

// Insert schemas (for creating new records)
export const insertScannerSchema = scannerSchema.omit({ registeredAt: true });
export const insertDriverSchema = driverSchema.omit({ addedAt: true });
export const insertAssignmentSchema = assignmentSchema.omit({ id: true, status: true });

export type InsertScanner = z.infer<typeof insertScannerSchema>;
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
