import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface DriverSelectorProps {
  drivers: string[];
  onAssign: (driverName: string) => void;
  onCancel?: () => void;
  scannerId?: string;
}

export default function DriverSelector({
  drivers,
  onAssign,
  onCancel,
  scannerId,
}: DriverSelectorProps) {
  const { t } = useLanguage();
  const [selectedDriver, setSelectedDriver] = useState("");
  const [customDriver, setCustomDriver] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const handleAssign = () => {
    const driverName = useCustom ? customDriver.trim() : selectedDriver;
    if (driverName) {
      onAssign(driverName);
      setSelectedDriver("");
      setCustomDriver("");
      setUseCustom(false);
    }
  };

  return (
    <div className="space-y-4">
      {scannerId && (
        <div className="p-4 bg-accent/50 rounded-lg">
          <p className="text-sm text-muted-foreground">{t("scannerId")}</p>
          <p className="text-lg font-mono font-semibold" data-testid="text-selected-scanner">
            {scannerId}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="driver-select">{t("assignToDriver")}</Label>
        {!useCustom ? (
          <div className="space-y-2">
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger id="driver-select" data-testid="select-driver">
                <SelectValue placeholder={t("selectDriver")} />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver} value={driver} data-testid={`option-driver-${driver}`}>
                    {driver}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseCustom(true)}
              className="w-full"
              data-testid="button-add-custom-driver"
            >
              {t("addNewDriver")}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              id="custom-driver"
              type="text"
              value={customDriver}
              onChange={(e) => setCustomDriver(e.target.value)}
              placeholder={t("enterDriverName")}
              autoFocus
              data-testid="input-custom-driver"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUseCustom(false);
                setCustomDriver("");
              }}
              className="w-full"
              data-testid="button-use-list"
            >
              {t("chooseFromList")}
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleAssign}
          disabled={useCustom ? !customDriver.trim() : !selectedDriver}
          className="flex-1"
          data-testid="button-confirm-assignment"
        >
          {t("confirmAssignment")}
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel} data-testid="button-cancel-assignment">
            {t("cancel")}
          </Button>
        )}
      </div>
    </div>
  );
}
