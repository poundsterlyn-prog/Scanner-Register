import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, UserPlus, PackageCheck, FileText, Settings } from "lucide-react";

interface QuickActionsProps {
  onScanForAssignment: () => void;
  onScanForReturn: () => void;
  onRegisterScanner: () => void;
  onViewReport: () => void;
  onManageDrivers: () => void;
}

export default function QuickActions({
  onScanForAssignment,
  onScanForReturn,
  onRegisterScanner,
  onViewReport,
  onManageDrivers,
}: QuickActionsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Snelle Acties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={onScanForAssignment}
          className="h-auto py-4 justify-start"
          data-testid="button-scan-assignment"
        >
          <Camera className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">Scanner Toewijzen</div>
            <div className="text-xs opacity-90">Scan om chauffeur toe te wijzen</div>
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
            <div className="font-medium">Scanner Inleveren</div>
            <div className="text-xs opacity-90">Scan om als ingeleverd te markeren</div>
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
            <div className="font-medium">Scanner Registreren</div>
            <div className="text-xs opacity-90">Nieuwe scanner toevoegen</div>
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
            <div className="font-medium">Rapport Bekijken</div>
            <div className="text-xs opacity-90">Dagelijkse samenvatting</div>
          </div>
        </Button>

        <Button
          onClick={onManageDrivers}
          variant="secondary"
          className="h-auto py-4 justify-start sm:col-span-2"
          data-testid="button-manage-drivers"
        >
          <Settings className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">Chauffeurs Beheren</div>
            <div className="text-xs opacity-90">Chauffeurs toevoegen of verwijderen</div>
          </div>
        </Button>
      </div>
    </Card>
  );
}
