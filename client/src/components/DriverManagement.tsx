import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface DriverManagementProps {
  drivers: string[];
  onAddDriver: (name: string) => void;
  onRemoveDriver: (name: string) => void;
}

export default function DriverManagement({
  drivers,
  onAddDriver,
  onRemoveDriver,
}: DriverManagementProps) {
  const [newDriver, setNewDriver] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDriver.trim() && !drivers.includes(newDriver.trim())) {
      onAddDriver(newDriver.trim());
      setNewDriver("");
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Chauffeurs Beheren</h2>

      <form onSubmit={handleAdd} className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="new-driver">Chauffeur Toevoegen</Label>
          <div className="flex gap-2">
            <Input
              id="new-driver"
              type="text"
              value={newDriver}
              onChange={(e) => setNewDriver(e.target.value)}
              placeholder="Voer naam chauffeur in"
              data-testid="input-new-driver"
            />
            <Button type="submit" disabled={!newDriver.trim()} data-testid="button-add-driver">
              <Plus className="w-4 h-4 mr-2" />
              Toevoegen
            </Button>
          </div>
        </div>
      </form>

      <div className="space-y-2">
        <Label>Huidige Chauffeurs ({drivers.length})</Label>
        {drivers.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Nog geen chauffeurs toegevoegd
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {drivers.map((driver) => (
              <Badge
                key={driver}
                variant="secondary"
                className="text-sm py-2 px-3"
                data-testid={`badge-driver-${driver}`}
              >
                {driver}
                <button
                  onClick={() => onRemoveDriver(driver)}
                  className="ml-2 hover:text-destructive"
                  data-testid={`button-remove-driver-${driver}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
