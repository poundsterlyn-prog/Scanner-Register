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
      <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={onScanForAssignment}
          className="h-auto py-4 justify-start"
          data-testid="button-scan-assignment"
        >
          <Camera className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">Assign Scanner</div>
            <div className="text-xs opacity-90">Scan to assign driver</div>
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
            <div className="font-medium">Return Scanner</div>
            <div className="text-xs opacity-90">Scan to mark returned</div>
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
            <div className="font-medium">Register Scanner</div>
            <div className="text-xs opacity-90">Add new scanner</div>
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
            <div className="font-medium">View Report</div>
            <div className="text-xs opacity-90">Daily summary</div>
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
            <div className="font-medium">Manage Drivers</div>
            <div className="text-xs opacity-90">Add or remove drivers</div>
          </div>
        </Button>
      </div>
    </Card>
  );
}
