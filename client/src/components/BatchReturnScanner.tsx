import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle, AlertCircle, X } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLanguage } from "@/contexts/LanguageContext";

interface ScannedItem {
  scannerId: string;
  status: "success" | "error";
  message: string;
  timestamp: string;
}

interface BatchReturnScannerProps {
  onComplete: (scannedIds: string[]) => void;
  onCancel?: () => void;
  validateScanner?: (scannerId: string) => { valid: boolean; message: string };
}

export default function BatchReturnScanner({
  onComplete,
  onCancel,
  validateScanner,
}: BatchReturnScannerProps) {
  const { t } = useLanguage();
  const [manualInput, setManualInput] = useState("");
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (inputRef.current && !showCamera) {
      inputRef.current.focus();
    }
  }, [scannedItems, showCamera]);

  useEffect(() => {
    if (!showCamera) return;

    const scanner = new Html5QrcodeScanner(
      "batch-barcode-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.7777778,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        handleScan(decodedText);
      },
      (error) => {
        console.log(error);
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => console.error(err));
      }
    };
  }, [showCamera]);

  const handleScan = (scannerId: string) => {
    const trimmedId = scannerId.trim();
    
    if (scannedItems.some((item) => item.scannerId === trimmedId)) {
      setScannedItems((prev) => [
        {
          scannerId: trimmedId,
          status: "error",
          message: t("alreadyScanned"),
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
      return;
    }

    let result = { valid: true, message: t("scannerMarkedForReturn") };
    if (validateScanner) {
      result = validateScanner(trimmedId);
    }

    setScannedItems((prev) => [
      {
        scannerId: trimmedId,
        status: result.valid ? "success" : "error",
        message: result.message,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    // Auto-return immediately after successful scan
    if (result.valid) {
      onComplete([trimmedId]);
    }

    setManualInput("");
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleScan(manualInput);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && manualInput.trim()) {
      e.preventDefault();
      handleScan(manualInput);
    }
  };

  const handleComplete = () => {
    const successfulScans = scannedItems
      .filter((item) => item.status === "success")
      .map((item) => item.scannerId);
    onComplete(successfulScans);
  };

  const handleRemove = (scannerId: string) => {
    setScannedItems((prev) => prev.filter((item) => item.scannerId !== scannerId));
  };

  const successCount = scannedItems.filter((item) => item.status === "success").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t("returnMultipleScanners")}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("scanMultipleToReturn")}
          </p>
        </div>
        {onCancel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            data-testid="button-cancel-batch"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <Card className="p-6">
        {!showCamera ? (
          <div className="space-y-4">
            <form onSubmit={handleManualSubmit}>
              <div className="space-y-2">
                <Label htmlFor="batch-scanner-input">{t("scanScannerIds")}</Label>
                <Input
                  ref={inputRef}
                  id="batch-scanner-input"
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("scanWithZebraOrType")}
                  data-testid="input-batch-scanner"
                />
                <p className="text-xs text-muted-foreground">
                  {t("pressEnterToAdd")}
                </p>
              </div>
            </form>

            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCamera(true)}
                data-testid="button-use-camera-batch"
              >
                <Camera className="w-4 h-4 mr-2" />
                {t("useCamera")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div id="batch-barcode-reader" className="w-full" data-testid="batch-camera-viewfinder"></div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowCamera(false)}
                data-testid="button-use-keyboard-batch"
              >
                {t("manualInput")}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {scannedItems.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              {t("scannedItems")} ({successCount} {t("successful")})
            </h3>
            <Badge variant="secondary" data-testid="text-scanned-count">
              {scannedItems.length} {t("total")}
            </Badge>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {scannedItems.map((item, index) => (
              <div
                key={`${item.scannerId}-${index}`}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  item.status === "success" ? "bg-chart-2/5" : "bg-destructive/5"
                }`}
                data-testid={`scanned-item-${item.scannerId}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {item.status === "success" ? (
                    <CheckCircle className="w-5 h-5 text-chart-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  )}
                  <div className="flex-1">
                    <p className="font-mono font-medium" data-testid={`text-scanned-id-${item.scannerId}`}>
                      {item.scannerId}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(item.scannerId)}
                  data-testid={`button-remove-${item.scannerId}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} className="flex-1" data-testid="button-cancel-batch-bottom">
            {t("cancel")}
          </Button>
        )}
      </div>
    </div>
  );
}
