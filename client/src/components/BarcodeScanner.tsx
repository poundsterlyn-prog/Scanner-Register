import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Camera, Keyboard, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

export default function BarcodeScanner({
  onScan,
  onCancel,
  title,
  description,
}: BarcodeScannerProps) {
  const { t } = useLanguage();
  const [manualInput, setManualInput] = useState("");
  const [showManualInput, setShowManualInput] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  // Always call the latest onScan without restarting the camera on every render
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const defaultTitle = t("scanBarcode");
  const defaultDescription = t("pointCameraOrManual");

  useEffect(() => {
    if (!showCamera) return;

    const scanner = new Html5QrcodeScanner(
      "barcode-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.7777778,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear().catch(() => {});
        onScanRef.current(decodedText.trim());
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

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput("");
    }
  };

  const handleKeyboardInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Read straight from the field: a fast Zebra scan can send Enter
      // before React state has caught up with the last characters
      const value = e.currentTarget.value.trim();
      if (value) {
        onScan(value);
        setManualInput("");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title || defaultTitle}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description || defaultDescription}</p>
        </div>
        {onCancel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            data-testid="button-cancel-scan"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <Card className="p-6">
        {showManualInput && (
          <div className="space-y-4">
            <form onSubmit={handleManualSubmit}>
              <div className="space-y-2">
                <Label htmlFor="manual-barcode">{t("enterScannerId")}</Label>
                <Input
                  id="manual-barcode"
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={handleKeyboardInput}
                  placeholder={t("scannerIdPlaceholder")}
                  autoFocus
                  data-testid="input-manual-barcode"
                />
                <p className="text-xs text-muted-foreground">
                  {t("typeOrUseZebra")}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="submit" className="flex-1" data-testid="button-submit-manual">
                  {t("confirm")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowManualInput(false);
                    setShowCamera(true);
                  }}
                  data-testid="button-show-camera"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {t("useCamera")}
                </Button>
              </div>
            </form>
          </div>
        )}

        {showCamera && (
          <div className="space-y-4">
            <div id="barcode-reader" className="w-full" data-testid="camera-viewfinder"></div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCamera(false);
                  setShowManualInput(true);
                }}
                data-testid="button-manual-input"
              >
                <Keyboard className="w-4 h-4 mr-2" />
                {t("manualInput")}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
