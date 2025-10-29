import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Camera, Keyboard, X } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

export default function BarcodeScanner({
  onScan,
  onCancel,
  title = "Scan Barcode",
  description = "Richt camera op barcode of voer handmatig in",
}: BarcodeScannerProps) {
  const [manualInput, setManualInput] = useState("");
  const [showManualInput, setShowManualInput] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

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
        scanner.clear();
        onScan(decodedText);
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
  }, [showCamera, onScan]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput("");
    }
  };

  const handleKeyboardInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && manualInput.trim()) {
      e.preventDefault();
      onScan(manualInput.trim());
      setManualInput("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
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
                <Label htmlFor="manual-barcode">Voer Scanner ID in</Label>
                <Input
                  id="manual-barcode"
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={handleKeyboardInput}
                  placeholder="SC-001234 of scan met Zebra scanner"
                  autoFocus
                  data-testid="input-manual-barcode"
                />
                <p className="text-xs text-muted-foreground">
                  Typ of gebruik uw Zebra DS3678 scanner
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="submit" className="flex-1" data-testid="button-submit-manual">
                  Bevestigen
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
                  Gebruik Camera
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
                Handmatig Invoeren
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
