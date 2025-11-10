import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, UserPlus, PackageCheck, FileText, Settings, ScanBarcode } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuickActionsProps {
  onScanForAssignment: () => void;
  onScanForReturn: () => void;
  onRegisterScanner: () => void;
  onViewReport: () => void;
  onManageDrivers: () => void;
  onManageScanners: () => void;
}

export default function QuickActions({
  onScanForAssignment,
  onScanForReturn,
  onRegisterScanner,
  onViewReport,
  onManageDrivers,
  onManageScanners,
}: QuickActionsProps) {
  const { t } = useLanguage();

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">{t("quickActions")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={onScanForAssignment}
          className="h-auto py-4 justify-start"
          data-testid="button-scan-assignment"
        >
          <Camera className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">{t("assignScanner")}</div>
            <div className="text-xs opacity-90">{t("scanToAssign")}</div>
          </div>
        </Button>

        <Button
          onClick={onScanForReturn}
          variant="outline"
          className="h-auto py-4 justify-start"
          data-testid="button-scan-return"
        >
          <PackageCheck className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">{t("returnScanner")}</div>
            <div className="text-xs opacity-90">{t("scanToReturn")}</div>
          </div>
        </Button>

        <Button
          onClick={onRegisterScanner}
          variant="outline"
          className="h-auto py-4 justify-start"
          data-testid="button-register-scanner"
        >
          <UserPlus className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">{t("registerScanner")}</div>
            <div className="text-xs opacity-90">{t("addNewScanner")}</div>
          </div>
        </Button>

        <Button
          onClick={onViewReport}
          variant="outline"
          className="h-auto py-4 justify-start"
          data-testid="button-view-report"
        >
          <FileText className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">{t("viewReport")}</div>
            <div className="text-xs opacity-90">{t("dailySummary")}</div>
          </div>
        </Button>

        <Button
          onClick={onManageDrivers}
          variant="secondary"
          className="h-auto py-4 justify-start"
          data-testid="button-manage-drivers"
        >
          <Settings className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">{t("manageDrivers")}</div>
            <div className="text-xs opacity-90">{t("addOrRemoveDrivers")}</div>
          </div>
        </Button>

        <Button
          onClick={onManageScanners}
          variant="secondary"
          className="h-auto py-4 justify-start"
          data-testid="button-manage-scanners"
        >
          <ScanBarcode className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">{t("manageScannersButton")}</div>
            <div className="text-xs opacity-90">{t("deleteOrAddNotes")}</div>
          </div>
        </Button>
      </div>
    </Card>
  );
}
