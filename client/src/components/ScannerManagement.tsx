import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Edit2, Save, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Scanner } from "@shared/schema";

interface ScannerManagementProps {
  scanners: Scanner[];
  onDeleteScanner: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export default function ScannerManagement({
  scanners,
  onDeleteScanner,
  onUpdateNotes,
}: ScannerManagementProps) {
  const { t } = useLanguage();
  const [editingScanner, setEditingScanner] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const handleEditNotes = (scanner: Scanner) => {
    setEditingScanner(scanner.id);
    setEditNotes(scanner.notes || "");
  };

  const handleSaveNotes = (scannerId: string) => {
    onUpdateNotes(scannerId, editNotes);
    setEditingScanner(null);
    setEditNotes("");
  };

  const handleCancelEdit = () => {
    setEditingScanner(null);
    setEditNotes("");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{t("manageScanners")}</h2>

      <div className="space-y-2">
        <Label>{t("registeredScanners")} ({scanners.length})</Label>
        {scanners.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {t("noScannersYet")}
          </p>
        ) : (
          <div className="space-y-3">
            {scanners.map((scanner) => (
              <Card key={scanner.id} className="p-4" data-testid={`card-scanner-${scanner.id}`}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-mono font-medium">{scanner.id}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {t("registered")}: {new Date(scanner.registeredAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {editingScanner !== scanner.id && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditNotes(scanner)}
                            data-testid={`button-edit-notes-${scanner.id}`}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteScanner(scanner.id)}
                            data-testid={`button-delete-scanner-${scanner.id}`}
                          >
                            <X className="w-4 h-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {editingScanner === scanner.id ? (
                    <div className="space-y-2">
                      <Label htmlFor={`notes-${scanner.id}`}>{t("scannerNotes")}</Label>
                      <Textarea
                        id={`notes-${scanner.id}`}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder={t("addNotesPlaceholder")}
                        rows={3}
                        data-testid={`textarea-notes-${scanner.id}`}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          data-testid={`button-cancel-edit-${scanner.id}`}
                        >
                          {t("cancel")}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveNotes(scanner.id)}
                          data-testid={`button-save-notes-${scanner.id}`}
                        >
                          <Save className="w-3 h-3 mr-2" />
                          {t("save")}
                        </Button>
                      </div>
                    </div>
                  ) : scanner.notes ? (
                    <div className="text-sm bg-muted p-3 rounded-md">
                      <div className="text-xs text-muted-foreground mb-1">{t("notes")}:</div>
                      <div className="whitespace-pre-wrap">{scanner.notes}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">
                      {t("noNotes")}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
