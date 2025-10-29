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

  const currentDate = new Date().toLocaleDateString("nl-NL", {
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
        title: "Scanner Niet Gevonden",
        description: `Scanner ${barcode} is niet geregistreerd in het systeem.`,
        variant: "destructive",
      });
      return;
    }

    if (scanner.status === "assigned" || scanner.status === "overdue") {
      toast({
        title: "Al Toegewezen",
        description: `Scanner ${barcode} is al toegewezen aan ${scanner.driver}.`,
        variant: "destructive",
      });
      return;
    }

    setScannedId(barcode);
    setViewMode("assign-driver");
  };

  const handleAssignDriver = (driverName: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("nl-NL", {
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
      title: "Toewijzing Succesvol",
      description: `Scanner ${scannedId} toegewezen aan ${driverName}`,
    });

    setScannedId("");
    setViewMode("dashboard");
  };

  const validateScannerForReturn = (barcode: string) => {
    const scanner = scanners.find((s) => s.id === barcode);
    if (!scanner) {
      return {
        valid: false,
        message: "Scanner niet gevonden in systeem",
      };
    }

    if (scanner.status !== "assigned" && scanner.status !== "overdue") {
      return {
        valid: false,
        message: "Niet momenteel toegewezen",
      };
    }

    return {
      valid: true,
      message: "Scanner gemarkeerd voor inlevering",
    };
  };

  const handleBatchReturn = (scannerIds: string[]) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("nl-NL", {
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
      title: "Inlevering Succesvol",
      description: `${scannerIds.length} scanner(s) gemarkeerd als ingeleverd`,
    });

    setViewMode("dashboard");
  };

  const handleRegisterScanner = (barcode: string) => {
    if (scanners.find((s) => s.id === barcode)) {
      toast({
        title: "Al Geregistreerd",
        description: `Scanner ${barcode} is al in het systeem.`,
        variant: "destructive",
      });
      return;
    }

    setScanners((prev) => [...prev, { id: barcode, status: "available" }]);

    toast({
      title: "Scanner Geregistreerd",
      description: `Scanner ${barcode} toegevoegd aan inventaris`,
    });
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Dagelijks Scanner Rapport", 14, 20);

    doc.setFontSize(11);
    doc.text(currentDate, 14, 28);

    doc.setFontSize(12);
    doc.text(`Totaal Toegewezen: ${assignedCount + returnedCount}`, 14, 38);
    doc.text(`Totaal Ingeleverd: ${returnedCount}`, 14, 45);
    doc.text(`Wachtend op Inlevering: ${pendingCount}`, 14, 52);

    const assignedScanners = scanners.filter(
      (s) => s.status === "assigned" || s.status === "returned" || s.status === "overdue"
    );

    const tableData = assignedScanners.map((s) => [
      s.id,
      s.driver || "-",
      s.assignedTime || "-",
      s.returnTime || "-",
      s.status === "returned" ? "Ingeleverd" : "Wachtend",
    ]);

    autoTable(doc, {
      startY: 60,
      head: [["Scanner ID", "Chauffeur", "Toegewezen", "Ingeleverd", "Status"]],
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

    doc.save(`scanner-rapport-${new Date().toISOString().split("T")[0]}.pdf`);

    toast({
      title: "Rapport Gegenereerd",
      description: "PDF rapport is gedownload",
    });
  };

  const renderView = () => {
    switch (viewMode) {
      case "scan-assign":
        return (
          <BarcodeScanner
            title="Scan Scanner om Toe te Wijzen"
            description="Scan met Zebra scanner of gebruik camera"
            onScan={handleScanForAssignment}
            onCancel={() => setViewMode("dashboard")}
          />
        );

      case "assign-driver":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Toewijzen aan Chauffeur</h2>
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
            title="Nieuwe Scanner Registreren"
            description="Scan met Zebra scanner of gebruik camera om toe te voegen aan inventaris"
            onScan={handleRegisterScanner}
            onCancel={() => setViewMode("dashboard")}
          />
        );

      case "report":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Dagelijks Rapport</h2>
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
              Terug naar Dashboard
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
                  title: "Chauffeur Toegevoegd",
                  description: `${name} is toegevoegd aan de chauffeurlijst`,
                });
              }}
              onRemoveDriver={(name) => {
                setDrivers(drivers.filter((d) => d !== name));
                toast({
                  title: "Chauffeur Verwijderd",
                  description: `${name} is verwijderd van de chauffeurlijst`,
                });
              }}
            />

            <Button
              variant="outline"
              onClick={() => setViewMode("dashboard")}
              className="w-full"
              data-testid="button-back-from-drivers"
            >
              Terug naar Dashboard
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
              <h2 className="text-lg font-medium">Alle Scanners</h2>
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
            title: "Uitgelogd",
            description: "Sessie succesvol beëindigd",
          });
        }}
      />

      <main className="container max-w-4xl mx-auto p-4 md:p-6 pb-20">{renderView()}</main>
    </div>
  );
}
