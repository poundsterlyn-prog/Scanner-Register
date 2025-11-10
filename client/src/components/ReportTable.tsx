import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReportEntry {
  scannerId: string;
  driver: string;
  assignedTime: string;
  returnTime?: string;
  status: "returned" | "pending";
}

interface ReportTableProps {
  entries: ReportEntry[];
  date: string;
}

export default function ReportTable({ entries, date }: ReportTableProps) {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">{t("dailyReport")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{date}</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("scannerId")}</TableHead>
              <TableHead>{t("driver")}</TableHead>
              <TableHead>{t("assignedTime")}</TableHead>
              <TableHead>{t("returnedTime")}</TableHead>
              <TableHead>{t("status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {t("noAssignmentsToday")}
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow
                  key={entry.scannerId}
                  className={entry.status === "pending" ? "bg-destructive/5" : ""}
                  data-testid={`row-report-${entry.scannerId}`}
                >
                  <TableCell className="font-mono" data-testid={`cell-scanner-${entry.scannerId}`}>
                    {entry.scannerId}
                  </TableCell>
                  <TableCell data-testid={`cell-driver-${entry.scannerId}`}>{entry.driver}</TableCell>
                  <TableCell className="text-muted-foreground" data-testid={`cell-assigned-${entry.scannerId}`}>
                    {entry.assignedTime}
                  </TableCell>
                  <TableCell className="text-muted-foreground" data-testid={`cell-returned-${entry.scannerId}`}>
                    {entry.returnTime || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={entry.status === "returned" ? "outline" : "destructive"}
                      data-testid={`badge-report-status-${entry.scannerId}`}
                    >
                      {entry.status === "returned" ? t("returned") : t("pending")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
