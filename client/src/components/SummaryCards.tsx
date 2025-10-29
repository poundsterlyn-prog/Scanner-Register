import { Card } from "@/components/ui/card";
import { Package, CheckCircle, AlertCircle } from "lucide-react";

interface SummaryCardsProps {
  totalAssigned: number;
  totalReturned: number;
  pending: number;
}

export default function SummaryCards({
  totalAssigned,
  totalReturned,
  pending,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Assigned</p>
            <p className="text-2xl font-semibold" data-testid="text-total-assigned">
              {totalAssigned}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-chart-2/10">
            <CheckCircle className="w-6 h-6 text-chart-2" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Returned</p>
            <p className="text-2xl font-semibold" data-testid="text-total-returned">
              {totalReturned}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-destructive/10">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending Returns</p>
            <p className="text-2xl font-semibold" data-testid="text-pending-returns">
              {pending}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
