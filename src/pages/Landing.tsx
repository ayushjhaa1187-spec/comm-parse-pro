import { Link } from "react-router-dom";
import { Zap, Mail, FileText, Target, Clock, MessageSquare, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const stats = [
  { icon: Mail, value: "500K+", label: "Emails Processed" },
  { icon: FileText, value: "279", label: "Transcripts" },
  { icon: Target, value: "92%", label: "Accuracy" },
  { icon: Clock, value: "<3s", label: "Latency" },
];

const features = [
  { icon: Mail, title: "Email Parsing", description: "Extract structured data from email threads and communication chains" },
  { icon: MessageSquare, title: "Chat Analysis", description: "Analyze chat logs and messaging data for key insights" },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Track accuracy, precision, recall, and processing metrics" },
  { icon: Shield, title: "Secure & Private", description: "Row-level security ensures your data stays private" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">CommParse Pro</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/auth">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/auth?tab=signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-border bg-card text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-primary" />
            AI-Powered Communication Analysis
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl leading-tight">
            Parse & Analyze{" "}
            <span className="text-primary">Communications</span>{" "}
            with AI
          </h1>

          <p className="mt-6 max-w-2xl text-muted-foreground text-lg">
            CommParse Pro processes emails, meeting transcripts, and chat logs using AI to automatically extract insights, identify stakeholders, and generate structured analysis.
          </p>

          <div className="flex gap-3 mt-10">
            <Link to="/auth">
              <Button size="lg" className="px-8 text-base">
                Get Started
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="px-8 text-base">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 w-full max-w-3xl">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2 p-6 rounded-xl border border-border bg-card">
                <s.icon className="w-6 h-6 text-primary" />
                <span className="text-2xl font-bold text-foreground">{s.value}</span>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">What You Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
