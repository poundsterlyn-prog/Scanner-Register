import LoginForm from "@/components/LoginForm";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (username: string, password: string) => {
    console.log("Inlogpoging:", username, password);
    
    toast({
      title: "Inloggen Succesvol",
      description: `Welkom terug, ${username}!`,
    });

    setLocation("/dashboard");
  };

  return <LoginForm onLogin={handleLogin} />;
}
