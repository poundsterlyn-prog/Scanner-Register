import { useState } from "react";
import TopBar from "@/components/TopBar";
import QuickActions from "@/components/QuickActions";
import SummaryCards from "@/components/SummaryCards";
import ScannerCard from "@/components/ScannerCard";
import BarcodeScanner from "@/components/BarcodeScanner";
import BatchReturnScanner from "@/components/BatchReturnScanner";
import DriverSelector from "@/components/DriverSelector";
import ReportTable from "@/components/ReportTable";
import DriverManagement from "@/components/DriverManagement";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ScannerStatus = "available" | "assigned" | "returned" | "overdue";

interface Scanner {
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
  | "assign-driver";

export default function Dashboard() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [scannedId, setScannedId] = useState<string>("");

  const [scanners, setScanners] = useState<Scanner[]>([
    { id: "SC-001234", status: "available" },
    {
      id: "SC-002345",
      driver: "John Smith",
      assignedTime: "08:30 AM",
      status: "assigned",
    },
    {
      id: "SC-003456",
      driver: "Sarah Johnson",
      assignedTime: "09:15 AM",
      returnTime: "04:45 PM",
      status: "returned",
    },
  ]);

  const [drivers, setDrivers] = useState<string[]>([
    "John Smith",
    "Sarah Johnson",
    "Mike Davis",
    "Emma Wilson",
  ]);

  const currentDate = new Date().toLocaleDateString(language === "nl" ? "nl-NL" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const assignedCount = scanners.filter((s) => s.status === "assigned").length;
  const returnedCount = scanners.filter((s) => s.status === "returned").length;
  const pendingCount = scanners.filter(
    (s) => s.status === "assigned" || s.status === "overdue"
  ).length;

  const handleScanForAssignment = (barcode: string) => {
    const scanner = scanners.find((s) => s.id === barcode);
    if (!scanner) {
      toast({
        title: t("scannerNotFound"),
        description: `${t("scannerId")} ${barcode} ${t("scannerNotRegistered")}.`,
        variant: "destructive",
      });
      return;
    }

    if (scanner.status === "assigned" || scanner.status === "overdue") {
      toast({
        title: t("alreadyAssigned"),
        description: `${t("scannerId")} ${barcode} ${t("alreadyAssignedTo")} ${scanner.driver}.`,
        variant: "destructive",
      });
      return;
    }

    setScannedId(barcode);
    setViewMode("assign-driver");
  };

  const handleAssignDriver = (driverName: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString(language === "nl" ? "nl-NL" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setScanners((prev) =>
      prev.map((s) =>
        s.id === scannedId
          ? { ...s, driver: driverName, assignedTime: timeString, status: "assigned" as const }
          : s
      )
    );

    toast({
      title: t("assignmentSuccessful"),
      description: `${t("scannerId")} ${scannedId} ${t("assignedTo")} ${driverName}`,
    });

    setScannedId("");
    setViewMode("dashboard");
  };

  const validateScannerForReturn = (barcode: string) => {
    const scanner = scanners.find((s) => s.id === barcode);
    if (!scanner) {
      return {
        valid: false,
        message: t("scannerNotFoundInSystem"),
      };
    }

    if (scanner.status !== "assigned" && scanner.status !== "overdue") {
      return {
        valid: false,
        message: t("notCurrentlyAssigned"),
      };
    }

    return {
      valid: true,
      message: t("scannerMarkedForReturn"),
    };
  };

  const handleBatchReturn = (scannerIds: string[]) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString(language === "nl" ? "nl-NL" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setScanners((prev) =>
      prev.map((s) =>
        scannerIds.includes(s.id)
          ? { ...s, returnTime: timeString, status: "returned" as const }
          : s
      )
    );

    toast({
      title: t("returnSuccessful"),
      description: `${scannerIds.length} ${t("scannersMarkedReturned")}`,
    });

    setViewMode("dashboard");
  };

  const handleRegisterScanner = (barcode: string) => {
    if (scanners.find((s) => s.id === barcode)) {
      toast({
        title: t("alreadyRegistered"),
        description: `${t("scannerId")} ${barcode} ${t("alreadyInSystem")}.`,
        variant: "destructive",
      });
      return;
    }

    setScanners((prev) => [...prev, { id: barcode, status: "available" }]);

    toast({
      title: t("scannerRegistered"),
      description: `${t("scannerId")} ${barcode} ${t("addedToInventory")}`,
    });
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(t("dailyScannerReport"), 14, 20);

    doc.setFontSize(11);
    doc.text(currentDate, 14, 28);

    doc.setFontSize(12);
    doc.text(`${t("totalAssigned")}: ${assignedCount + returnedCount}`, 14, 38);
    doc.text(`${t("totalReturned")}: ${returnedCount}`, 14, 45);
    doc.text(`${t("pendingReturns")}: ${pendingCount}`, 14, 52);

    const assignedScanners = scanners.filter(
      (s) => s.status === "assigned" || s.status === "returned" || s.status === "overdue"
    );

    const tableData = assignedScanners.map((s) => [
      s.id,
      s.driver || "-",
      s.assignedTime || "-",
      s.returnTime || "-",
      s.status === "returned" ? t("returned") : t("pending"),
    ]);

    autoTable(doc, {
      startY: 60,
      head: [[t("scannerId"), t("driver"), t("assignedTime"), t("returnedTime"), t("status")]],
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
    doc.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);

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
              drivers={drivers}
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
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{t("dailyReport")}</h2>
              <Button onClick={handleGeneratePDF} data-testid="button-download-pdf">
                <Download className="w-4 h-4 mr-2" />
                {t("downloadPdf")}
              </Button>
            </div>

            <SummaryCards
              totalAssigned={assignedCount + returnedCount}
              totalReturned={returnedCount}
              pending={pendingCount}
            />

            <ReportTable
              date={currentDate}
              entries={scanners
                .filter(
                  (s) =>
                    s.status === "assigned" ||
                    s.status === "returned" ||
                    s.status === "overdue"
                )
                .map((s) => ({
                  scannerId: s.id,
                  driver: s.driver || "",
                  assignedTime: s.assignedTime || "",
                  returnTime: s.returnTime,
                  status: s.status === "returned" ? "returned" : "pending",
                }))}
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
              drivers={drivers}
              onAddDriver={(name) => {
                setDrivers([...drivers, name]);
                toast({
                  title: t("driverAdded"),
                  description: `${name} ${t("addedToDriverList")}`,
                });
              }}
              onRemoveDriver={(name) => {
                setDrivers(drivers.filter((d) => d !== name));
                toast({
                  title: t("driverRemoved"),
                  description: `${name} ${t("removedFromDriverList")}`,
                });
              }}
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
            />

            <div className="space-y-4">
              <h2 className="text-lg font-medium">{t("allScanners")}</h2>
              <div className="grid gap-3">
                {scanners.map((scanner) => (
                  <ScannerCard key={scanner.id} {...scanner} scannerId={scanner.id} />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

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
