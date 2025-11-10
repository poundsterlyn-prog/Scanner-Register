import { Button } from "@/components/ui/button";
import { Package, LogOut } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

interface TopBarProps {
  currentDate: string;
  onLogout?: () => void;
}

export default function TopBar({ currentDate, onLogout }: TopBarProps) {
  const { t } = useLanguage();

  return (
    <header className="border-b bg-card">
      <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{t("loginTitle")}</h1>
            <p className="text-xs text-muted-foreground">{currentDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          {onLogout && (
            <Button variant="outline" onClick={onLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              {t("logout")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
