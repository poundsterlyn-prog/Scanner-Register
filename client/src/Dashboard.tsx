import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import QuickActions from "@/components/QuickActions";
import SummaryCards from "@/components/SummaryCards";
import ScannerCard from "@/components/ScannerCard";
import BarcodeScanner from "@/components/BarcodeScanner";
import BatchReturnScanner from "@/components/BatchReturnScanner";
import DriverSelector from "@/components/DriverSelector";
import ReportTable from "@/components/ReportTable";
import DriverManagement from "@/components/DriverManagement";
import ScannerManagement from "@/components/ScannerManagement";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  db,
  scannerStorage,
  driverStorage,
  assignmentStorage,
  getTodayDate,
  getLast7DaysOptions,
  initializeDatabase,
  normalizeScannerId,
} from "@/lib/db";
import type { Scanner, Driver, Assignment, ScannerStatus } from "@shared/schema";
import { useLiveQuery } from "dexie-react-hooks";

// Combined view for display
interface ScannerView {
  id: string;
  driver?: string;
  assignedTime?: string;
  returnTime?: string;
  status: ScannerStatus;
}

type ViewMode =
  | "dashboard"
  | "scan-assign"
  | "scan-return"
  | "register"
  | "report"
  | "manage-drivers"
  | "manage-scanners"
  | "assign-driver";

export default function Dashboard() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [scannedId, setScannedId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedReportDate, setSelectedReportDate] = useState<string>(getTodayDate());

  const today = getTodayDate();

  // Live queries from IndexedDB
  const scanners = useLiveQuery(() => scannerStorage.getAll(), []) ?? [];
  const drivers = useLiveQuery(() => driverStorage.getAll(), []) ?? [];
  const assignments = useLiveQuery(() => assignmentStorage.getByDate(today), [today]) ?? [];
  const reportAssignments = useLiveQuery(() => assignmentStorage.getByDate(selectedReportDate), [selectedReportDate]) ?? [];
  // Open (not yet returned) assignments from any day
  const openAssignments = useLiveQuery(() => assignmentStorage.getOpen(), []) ?? [];

  // The current open assignment for a scanner (most recent), regardless of date
  const findOpenAssignment = (scannerId: string): Assignment | undefined => {
    const matches = openAssignments
      .filter((a) => a.scannerId === scannerId)
      .sort((a, b) => a.id.localeCompare(b.id));
    return matches[matches.length - 1];
  };

  // The most recent assignment for a scanner within a list (e.g. one day)
  const findLatestAssignment = (list: Assignment[], scannerId: string): Assignment | undefined => {
    const matches = list
      .filter((a) => a.scannerId === scannerId)
      .sort((a, b) => a.id.localeCompare(b.id));
    return matches[matches.length - 1];
  };

  // Initialize database on mount
  useEffect(() => {
    initializeDatabase().then(() => {
      setIsInitialized(true);
    });
  }, []);

  const currentDate = new Date().toLocaleDateString(language === "nl" ? "nl-NL" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Combine scanners with their assignments for display (dashboard)
  const scannerViews: ScannerView[] = scanners.map((scanner) => {
    const open = findOpenAssignment(scanner.id);
    if (open) {
      return {
        id: scanner.id,
        driver: open.driverName,
        assignedTime: open.assignedTime,
        // Still out from a previous day -> show as overdue
        status: open.date < today ? ("overdue" as const) : ("assigned" as const),
      };
    }
    const assignment = findLatestAssignment(assignments, scanner.id);
    if (assignment) {
      return {
        id: scanner.id,
        driver: assignment.driverName,
        assignedTime: assignment.assignedTime,
        returnTime: assignment.returnTime,
        status: assignment.status,
      };
    }
    return {
      id: scanner.id,
      status: "available" as const,
    };
  });

  // Combine scanners with report assignments for the selected date
  const reportScannerViews: ScannerView[] = scanners.map((scanner) => {
    const assignment = findLatestAssignment(reportAssignments, scanner.id);
    if (assignment) {
      return {
        id: scanner.id,
        driver: assignment.driverName,
        assignedTime: assignment.assignedTime,
        returnTime: assignment.returnTime,
        status: assignment.status,
      };
    }
    return {
      id: scanner.id,
      status: "available" as const,
    };
  });

  const assignedCount = scannerViews.filter((s) => s.status === "assigned").length;
  const returnedCount = scannerViews.filter((s) => s.status === "returned").length;
  const pendingCount = scannerViews.filter(
    (s) => s.status === "assigned" || s.status === "overdue"
  ).length;

  const reportAssignedCount = reportScannerViews.filter((s) => s.status === "assigned").length;
  const reportReturnedCount = reportScannerViews.filter((s) => s.status === "returned").length;
  const reportPendingCount = reportScannerViews.filter(
    (s) => s.status === "assigned" || s.status === "overdue"
  ).length;

  const handleScanForAssignment = async (rawBarcode: string) => {
    const barcode = normalizeScannerId(rawBarcode);
    if (!barcode) return;
    const scanner = await scannerStorage.getById(barcode);
    if (!scanner) {
      toast({
        title: t("scannerNotFound"),
        description: `${t("scannerId")} ${barcode} ${t("scannerNotRegistered")}.`,
        variant: "destructive",
      });
      return;
    }

    // Check if this scanner is still out (on any day)
    const existingAssignment = findOpenAssignment(barcode);
    if (existingAssignment) {
      toast({
        title: t("alreadyAssigned"),
        description: `${t("scannerId")} ${barcode} ${t("alreadyAssignedTo")} ${existingAssignment.driverName}.`,
        variant: "destructive",
      });
      return;
    }

    setScannedId(barcode);
    setViewMode("assign-driver");
  };

  const handleAssignDriver = async (driverName: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString(language === "nl" ? "nl-NL" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const assignment: Assignment = {
      id: `${scannedId}-${Date.now()}`,
      scannerId: scannedId,
      driverName: driverName,
      assignedTime: timeString,
      status: "assigned",
      date: today,
    };

    await assignmentStorage.add(assignment);

    toast({
      title: t("assignmentSuccessful"),
      description: `${t("scannerId")} ${scannedId} ${t("assignedTo")} ${driverName}`,
    });

    setScannedId("");
    setViewMode("dashboard");
  };

  const validateScannerForReturn = (rawBarcode: string) => {
    const barcode = normalizeScannerId(rawBarcode);
    const assignment = findOpenAssignment(barcode);
    if (!assignment) {
      const isRegistered = scanners.some((s) => s.id === barcode);
      return {
        valid: false,
        message: isRegistered ? t("notCurrentlyAssigned") : t("scannerNotFoundInSystem"),
      };
    }

    return {
      valid: true,
      message: t("scannerMarkedForReturn"),
    };
  };

  const handleBatchReturn = async (scannerIds: string[]) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString(language === "nl" ? "nl-NL" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Update each assignment
    for (const rawId of scannerIds) {
      const assignment = findOpenAssignment(normalizeScannerId(rawId));
      if (assignment) {
        await assignmentStorage.update(assignment.id, {
          returnTime: timeString,
          status: "returned",
        });
      }
    }

    toast({
      title: t("returnSuccessful"),
      description: `${scannerIds.length} ${t("scannersMarkedReturned")}`,
    });

    setViewMode("dashboard");
  };

  const handleRegisterScanner = async (rawBarcode: string) => {
    const barcode = normalizeScannerId(rawBarcode);
    if (!barcode) return;
    const exists = await scannerStorage.exists(barcode);
    if (exists) {
      toast({
        title: t("alreadyRegistered"),
        description: `${t("scannerId")} ${barcode} ${t("alreadyInSystem")}.`,
        variant: "destructive",
      });
      return;
    }

    const scanner: Scanner = {
      id: barcode,
      registeredAt: new Date().toISOString(),
    };

    await scannerStorage.add(scanner);

    toast({
      title: t("scannerRegistered"),
      description: `${t("scannerId")} ${barcode} ${t("addedToInventory")}`,
    });
  };

  const handleAddDriver = async (name: string) => {
    const exists = await driverStorage.exists(name);
    if (exists) {
      toast({
        title: t("alreadyRegistered"),
        description: `${name} ${t("alreadyInSystem")}.`,
        variant: "destructive",
      });
      return;
    }

    const driver: Driver = {
      name: name,
      addedAt: new Date().toISOString(),
    };

    await driverStorage.add(driver);

    toast({
      title: t("driverAdded"),
      description: `${name} ${t("addedToDriverList")}`,
    });
  };

  const handleRemoveDriver = async (name: string) => {
    await driverStorage.delete(name);

    toast({
      title: t("driverRemoved"),
      description: `${name} ${t("removedFromDriverList")}`,
    });
  };

  const handleDeleteScanner = async (id: string) => {
    // Delete the scanner
    await scannerStorage.delete(id);

    // Also delete all assignments for this scanner (past and present)
    // to allow re-registration with the same ID
    const allAssignments = await assignmentStorage.getAll();
    const scannerAssignments = allAssignments.filter((a) => a.scannerId === id);
    for (const assignment of scannerAssignments) {
      await assignmentStorage.delete(assignment.id);
    }

    toast({
      title: t("scannerDeleted"),
      description: `${t("scannerId")} ${id} ${t("scannerRemovedFromSystem")}`,
    });
  };

  const handleUpdateScannerNotes = async (id: string, notes: string) => {
    await scannerStorage.update(id, { notes });

    toast({
      title: t("notesUpdated"),
      description: t("scannerNotesUpdated"),
    });
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    // Parse date in local time to avoid timezone issues
    const [year, month, day] = selectedReportDate.split('-').map(Number);
    const reportDate = new Date(year, month - 1, day);
    const reportDateFormatted = reportDate.toLocaleDateString(language === "nl" ? "nl-NL" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    doc.setFontSize(18);
    doc.text(t("dailyScannerReport"), 14, 20);

    doc.setFontSize(11);
    doc.text(reportDateFormatted, 14, 28);

    doc.setFontSize(12);
    doc.text(`${t("totalAssigned")}: ${reportAssignedCount + reportReturnedCount}`, 14, 38);
    doc.text(`${t("totalReturned")}: ${reportReturnedCount}`, 14, 45);
    doc.text(`${t("pendingReturns")}: ${reportPendingCount}`, 14, 52);

    const assignedScanners = reportScannerViews.filter(
      (s) => s.status === "assigned" || s.status === "returned" || s.status === "overdue"
    );

    const tableData = assignedScanners.map((s) => {
      const scanner = scanners.find((sc) => sc.id === s.id);
      return [
        s.id,
        s.driver || "-",
        s.assignedTime || "-",
        s.returnTime || "-",
        s.status === "returned" ? t("returned") : t("pending"),
        scanner?.notes || "-",
      ];
    });

    autoTable(doc, {
      startY: 60,
      head: [[t("scannerId"), t("driver"), t("assignedTime"), t("returnedTime"), t("status"), t("notes")]],
      body: tableData,
      didParseCell: (data) => {
        if (data.row.index >= 0 && data.section === "body") {
          const scanner = assignedScanners[data.row.index];
          if (scanner.status === "assigned" || scanner.status === "overdue") {
            data.cell.styles.fillColor = [254, 226, 226];
          }
        }
      },
    });

    const filename = language === "nl" ? "scanner-rapport" : "scanner-report";
    doc.save(`${filename}-${selectedReportDate}.pdf`);

    toast({
      title: t("reportGenerated"),
      description: t("pdfDownloaded"),
    });
  };

  const renderView = () => {
    switch (viewMode) {
      case "scan-assign":
        return (
          <BarcodeScanner
            title={t("scanScannerToAssign")}
            description={t("scanWithZebraOrCamera")}
            onScan={handleScanForAssignment}
            onCancel={() => setViewMode("dashboard")}
          />
        );

      case "assign-driver":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">{t("assignToDriver")}</h2>
            <DriverSelector
              scannerId={scannedId}
              drivers={drivers.map((d) => d.name)}
              onAssign={handleAssignDriver}
              onCancel={() => {
                setScannedId("");
                setViewMode("dashboard");
              }}
            />
          </Card>
        );

      case "scan-return":
        return (
          <BatchReturnScanner
            onComplete={handleBatchReturn}
            onCancel={() => setViewMode("dashboard")}
            validateScanner={validateScannerForReturn}
          />
        );

      case "register":
        return (
          <BarcodeScanner
            title={t("registerNewScanner")}
            description={t("scanToAddToInventory")}
            onScan={handleRegisterScanner}
            onCancel={() => setViewMode("dashboard")}
          />
        );

      case "report":
        // Parse date in local time to avoid timezone issues
        const [year, month, day] = selectedReportDate.split('-').map(Number);
        const reportDate = new Date(year, month - 1, day);
        const reportDateFormatted = reportDate.toLocaleDateString(language === "nl" ? "nl-NL" : "en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-2xl font-semibold">{t("dailyReport")}</h2>
              <div className="flex items-center gap-3">
                <Select
                  value={selectedReportDate}
                  onValueChange={setSelectedReportDate}
                >
                  <SelectTrigger className="w-[200px]" data-testid="select-report-date">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getLast7DaysOptions(language).map((option) => (
                      <SelectItem key={option.value} value={option.value} data-testid={`option-date-${option.value}`}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleGeneratePDF} data-testid="button-download-pdf">
                  <Download className="w-4 h-4 mr-2" />
                  {t("downloadPdf")}
                </Button>
              </div>
            </div>

            <SummaryCards
              totalAssigned={reportAssignedCount + reportReturnedCount}
              totalReturned={reportReturnedCount}
              pending={reportPendingCount}
            />

            <ReportTable
              date={reportDateFormatted}
              entries={reportScannerViews
                .filter(
                  (s) =>
                    s.status === "assigned" ||
                    s.status === "returned" ||
                    s.status === "overdue"
                )
                .map((s) => {
                  const scanner = scanners.find((sc) => sc.id === s.id);
                  return {
                    scannerId: s.id,
                    driver: s.driver || "",
                    assignedTime: s.assignedTime || "",
                    returnTime: s.returnTime,
                    status: s.status === "returned" ? "returned" : "pending",
                    notes: scanner?.notes,
                  };
                })}
            />

            <Button
              variant="outline"
              onClick={() => setViewMode("dashboard")}
              className="w-full"
              data-testid="button-back-to-dashboard"
            >
              {t("backToDashboard")}
            </Button>
          </div>
        );

      case "manage-drivers":
        return (
          <div className="space-y-4">
            <DriverManagement
              drivers={drivers.map((d) => d.name)}
              onAddDriver={handleAddDriver}
              onRemoveDriver={handleRemoveDriver}
            />

            <Button
              variant="outline"
              onClick={() => setViewMode("dashboard")}
              className="w-full"
              data-testid="button-back-from-drivers"
            >
              {t("backToDashboard")}
            </Button>
          </div>
        );

      case "manage-scanners":
        return (
          <div className="space-y-4">
            <ScannerManagement
              scanners={scanners}
              onDeleteScanner={handleDeleteScanner}
              onUpdateNotes={handleUpdateScannerNotes}
            />

            <Button
              variant="outline"
              onClick={() => setViewMode("dashboard")}
              className="w-full"
              data-testid="button-back-from-scanners"
            >
              {t("backToDashboard")}
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <SummaryCards
              totalAssigned={assignedCount + returnedCount}
              totalReturned={returnedCount}
              pending={pendingCount}
            />

            <QuickActions
              onScanForAssignment={() => setViewMode("scan-assign")}
              onScanForReturn={() => setViewMode("scan-return")}
              onRegisterScanner={() => setViewMode("register")}
              onViewReport={() => setViewMode("report")}
              onManageDrivers={() => setViewMode("manage-drivers")}
              onManageScanners={() => setViewMode("manage-scanners")}
            />

            <div className="space-y-4">
              <h2 className="text-lg font-medium">{t("allScanners")}</h2>
              <div className="grid gap-3">
                {scannerViews.map((scanner) => (
                  <ScannerCard key={scanner.id} {...scanner} scannerId={scanner.id} />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("loading")}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        currentDate={currentDate}
        onLogout={() => {
          toast({
            title: t("loggedOut"),
            description: t("sessionEndedSuccessfully"),
          });
        }}
      />

      <main className="container max-w-4xl mx-auto p-4 md:p-6 pb-20">{renderView()}</main>
    </div>
  );
}
