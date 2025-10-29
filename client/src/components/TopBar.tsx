import { Button } from "@/components/ui/button";
import { LogOut, Package } from "lucide-react";

interface TopBarProps {
  currentDate: string;
  onLogout?: () => void;
}

export default function TopBar({ currentDate, onLogout }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Scanner Tracker</h1>
            <p className="text-xs text-muted-foreground">{currentDate}</p>
          </div>
        </div>

        {onLogout && (
          <Button variant="outline" onClick={onLogout} data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}
