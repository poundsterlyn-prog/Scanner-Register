import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "nl" : "en");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      data-testid="button-language-toggle"
      className="gap-2"
    >
      <Languages className="w-4 h-4" />
      {language === "en" ? "NL" : "EN"}
    </Button>
  );
}
