import LoginForm from "@/components/LoginForm";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (username: string, password: string) => {
    console.log("Login attempt:", username, password);
    
    toast({
      title: "Login Successful",
      description: `Welcome back, ${username}!`,
    });

    setLocation("/dashboard");
  };

  return <LoginForm onLogin={handleLogin} />;
}
