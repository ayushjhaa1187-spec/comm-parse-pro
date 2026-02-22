import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Zap, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signUp, resetPassword } from "@/lib/supabase-helpers";
import { toast } from "@/hooks/use-toast";

type View = "signin" | "signup" | "forgot";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "signin";
  const [view, setView] = useState<View>(initialTab as View);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (view === "forgot") {
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email", description: "Password reset link has been sent." });
        setView("signin");
      }
      return;
    }

    const action = view === "signin" ? signIn : signUp;
    const { error } = await action(email, password);
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (view === "signup") {
      toast({ title: "Success", description: "Check your email to confirm your account." });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
          <Zap className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">BRD Agent</h1>
        <p className="text-muted-foreground mt-1">Transform communications into structured requirements</p>
      </div>

      <div className="w-full max-w-md bg-card rounded-2xl border border-border p-6 shadow-sm">
        {view !== "forgot" && (
          <div className="flex mb-6 rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView("signin")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${view === "signin" ? "bg-card text-foreground shadow-sm" : "bg-muted text-muted-foreground"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setView("signup")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${view === "signup" ? "bg-card text-foreground shadow-sm" : "bg-muted text-muted-foreground"}`}
            >
              Sign Up
            </button>
          </div>
        )}

        {view === "forgot" && (
          <h2 className="text-lg font-semibold text-foreground mb-4">Reset Password</h2>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>

          {view !== "forgot" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : view === "signin" ? "Sign In" : view === "signup" ? "Sign Up" : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          {view === "signin" && (
            <button onClick={() => setView("forgot")} className="text-sm text-primary hover:underline">
              Forgot password?
            </button>
          )}
          {view === "forgot" && (
            <button onClick={() => setView("signin")} className="text-sm text-primary hover:underline">
              Back to Sign In
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-8 mt-10 text-sm text-muted-foreground">
        <span>500K+ Emails</span>
        <span>279 Transcripts</span>
        <span>92% Accuracy</span>
        <span>&lt;3s Latency</span>
      </div>
    </div>
  );
};

export default Auth;
