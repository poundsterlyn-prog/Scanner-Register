import LoginForm from "@/components/LoginForm";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogin = (username: string, password: string) => {
    console.log("Login attempt:", username, password);
    
    toast({
      title: t("loginSuccessful"),
      description: `${t("welcomeBack")}, ${username}!`,
    });

    setLocation("/dashboard");
  };

  return <LoginForm onLogin={handleLogin} />;
}
