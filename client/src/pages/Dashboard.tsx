import { useState } from "react";
import TopBar from "@/components/TopBar";
import QuickActions from "@/components/QuickActions";
import SummaryCards from "@/components/SummaryCards";
import ScannerCard from "@/components/ScannerCard";
import BarcodeScanner from "@/components/BarcodeScanner";
import DriverSelector from "@/components/DriverSelector";
import ReportTable from "@/components/ReportTable";
import DriverManagement from "@/components/DriverManagement";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
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
        title: "Scanner Not Found",
        description: `Scanner ${barcode} is not registered in the system.`,
        variant: "destructive",
      });
      return;
    }

    if (scanner.status === "assigned" || scanner.status === "overdue") {
      toast({
        title: "Already Assigned",
        description: `Scanner ${barcode} is already assigned to ${scanner.driver}.`,
        variant: "destructive",
      });
      return;
    }

    setScannedId(barcode);
    setViewMode("assign-driver");
  };

  const handleAssignDriver = (driverName: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
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
      title: "Assignment Successful",
      description: `Scanner ${scannedId} assigned to ${driverName}`,
    });

    setScannedId("");
    setViewMode("dashboard");
  };

  const handleScanForReturn = (barcode: string) => {
    const scanner = scanners.find((s) => s.id === barcode);
    if (!scanner) {
      toast({
        title: "Scanner Not Found",
        description: `Scanner ${barcode} is not registered in the system.`,
        variant: "destructive",
      });
      return;
    }

    if (scanner.status !== "assigned" && scanner.status !== "overdue") {
      toast({
        title: "Not Assigned",
        description: `Scanner ${barcode} is not currently assigned.`,
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setScanners((prev) =>
      prev.map((s) =>
        s.id === barcode ? { ...s, returnTime: timeString, status: "returned" as const } : s
      )
    );

    toast({
      title: "Return Successful",
      description: `Scanner ${barcode} marked as returned`,
    });

    setViewMode("dashboard");
  };

  const handleRegisterScanner = (barcode: string) => {
    if (scanners.find((s) => s.id === barcode)) {
      toast({
        title: "Already Registered",
        description: `Scanner ${barcode} is already in the system.`,
        variant: "destructive",
      });
      return;
    }

    setScanners((prev) => [...prev, { id: barcode, status: "available" }]);

    toast({
      title: "Scanner Registered",
      description: `Scanner ${barcode} added to inventory`,
    });
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Daily Scanner Report", 14, 20);

    doc.setFontSize(11);
    doc.text(currentDate, 14, 28);

    doc.setFontSize(12);
    doc.text(`Total Assigned: ${assignedCount + returnedCount}`, 14, 38);
    doc.text(`Total Returned: ${returnedCount}`, 14, 45);
    doc.text(`Pending Returns: ${pendingCount}`, 14, 52);

    const assignedScanners = scanners.filter(
      (s) => s.status === "assigned" || s.status === "returned" || s.status === "overdue"
    );

    const tableData = assignedScanners.map((s) => [
      s.id,
      s.driver || "-",
      s.assignedTime || "-",
      s.returnTime || "-",
      s.status === "returned" ? "Returned" : "Pending",
    ]);

    autoTable(doc, {
      startY: 60,
      head: [["Scanner ID", "Driver", "Assigned", "Returned", "Status"]],
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

    doc.save(`scanner-report-${new Date().toISOString().split("T")[0]}.pdf`);

    toast({
      title: "Report Generated",
      description: "PDF report has been downloaded",
    });
  };

  const renderView = () => {
    switch (viewMode) {
      case "scan-assign":
        return (
          <BarcodeScanner
            title="Scan Scanner to Assign"
            description="Point camera at scanner barcode or enter manually"
            onScan={handleScanForAssignment}
            onCancel={() => setViewMode("dashboard")}
          />
        );

      case "assign-driver":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Assign to Driver</h2>
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
          <BarcodeScanner
            title="Scan Scanner to Return"
            description="Point camera at scanner barcode to mark as returned"
            onScan={handleScanForReturn}
            onCancel={() => setViewMode("dashboard")}
          />
        );

      case "register":
        return (
          <BarcodeScanner
            title="Register New Scanner"
            description="Scan barcode of new scanner to add to inventory"
            onScan={handleRegisterScanner}
            onCancel={() => setViewMode("dashboard")}
          />
        );

      case "report":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Daily Report</h2>
              <Button onClick={handleGeneratePDF} data-testid="button-download-pdf">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
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
              Back to Dashboard
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
                  title: "Driver Added",
                  description: `${name} has been added to the driver list`,
                });
              }}
              onRemoveDriver={(name) => {
                setDrivers(drivers.filter((d) => d !== name));
                toast({
                  title: "Driver Removed",
                  description: `${name} has been removed from the driver list`,
                });
              }}
            />

            <Button
              variant="outline"
              onClick={() => setViewMode("dashboard")}
              className="w-full"
              data-testid="button-back-from-drivers"
            >
              Back to Dashboard
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
              <h2 className="text-lg font-medium">All Scanners</h2>
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
            title: "Logged Out",
            description: "Session ended successfully",
          });
        }}
      />

      <main className="container max-w-4xl mx-auto p-4 md:p-6 pb-20">{renderView()}</main>
    </div>
  );
}
