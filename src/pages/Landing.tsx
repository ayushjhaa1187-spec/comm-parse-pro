import { Link } from "react-router-dom";
import { Zap, Mail, FileText, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Mail, value: "500K+", label: "Emails Processed" },
  { icon: FileText, value: "279", label: "Transcripts" },
  { icon: Target, value: "92%", label: "Accuracy" },
  { icon: Clock, value: "<3s", label: "Latency" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">BRD Agent</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/auth?tab=signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-border bg-card text-sm text-muted-foreground">
          <Zap className="w-4 h-4 text-primary" />
          Powered by AI Multi-Agent Pipeline
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl leading-tight">
          Transform Scattered Communications Into{" "}
          <span className="text-primary">Structured Requirements</span>
        </h1>

        <p className="mt-6 max-w-2xl text-muted-foreground text-lg">
          BRD Agent processes 500K+ Enron emails and meeting transcripts using AI to automatically generate Business Requirements Documents with 92%+ accuracy.
        </p>

        <Link to="/auth" className="mt-10">
          <Button size="lg" className="px-8 text-base">
            Get Started
          </Button>
        </Link>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 w-full max-w-3xl">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2 p-6 rounded-xl border border-border bg-card">
              <s.icon className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold text-foreground">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Landing;
