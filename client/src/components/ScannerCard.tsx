import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ScannerCardProps {
  scannerId: string;
  driver?: string;
  assignedTime?: string;
  returnTime?: string;
  status: "available" | "assigned" | "returned" | "overdue";
  onClick?: () => void;
}

export default function ScannerCard({
  scannerId,
  driver,
  assignedTime,
  returnTime,
  status,
  onClick,
}: ScannerCardProps) {
  const { t } = useLanguage();

  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "secondary";
      case "assigned":
        return "default";
      case "returned":
        return "outline";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "available":
        return t("available");
      case "assigned":
        return t("assigned");
      case "returned":
        return t("returned");
      case "overdue":
        return t("overdue");
      default:
        return status;
    }
  };

  const borderClass = status === "overdue" ? "border-l-4 border-l-destructive" : "";

  return (
    <Card
      className={`p-4 ${borderClass} ${onClick ? "cursor-pointer hover-elevate" : ""}`}
      onClick={onClick}
      data-testid={`card-scanner-${scannerId}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-base font-medium" data-testid={`text-scanner-id-${scannerId}`}>
              {scannerId}
            </span>
          </div>

          {driver && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground" data-testid={`text-driver-${scannerId}`}>{driver}</span>
            </div>
          )}

          {assignedTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span data-testid={`text-assigned-time-${scannerId}`}>{assignedTime}</span>
            </div>
          )}

          {returnTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span data-testid={`text-return-time-${scannerId}`}>{t("returnedPrefix")}: {returnTime}</span>
            </div>
          )}
        </div>

        <Badge variant={getStatusColor()} className="text-xs" data-testid={`badge-status-${scannerId}`}>
          {getStatusText()}
        </Badge>
      </div>
    </Card>
  );
}
