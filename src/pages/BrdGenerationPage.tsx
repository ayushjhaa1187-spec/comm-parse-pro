import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Clock, Loader2, Download, Share2, Edit3 } from "lucide-react";
import { sampleBrdSections, pipelineSteps as initialSteps } from "@/lib/mockData";
import { exportBrdAsPdf, exportBrdAsDocx } from "@/lib/exportBrd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

type StepStatus = "complete" | "active" | "pending";

const BrdGenerationPage = () => {
  const [steps, setSteps] = useState(initialSteps.map(s => ({ ...s })));
  const [visibleSections, setVisibleSections] = useState(0);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const [accuracy, setAccuracy] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const stepDelays = [800, 2500, 4500, 7000, 10000];
    stepDelays.forEach((delay, i) => {
      timers.push(
        setTimeout(() => {
          setSteps((prev) =>
            prev.map((s, idx) => ({
              ...s,
              status: (idx <= i ? "complete" : idx === i + 1 ? "active" : "pending") as StepStatus,
            }))
          );
        }, delay)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    sampleBrdSections.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleSections(i + 1);
          if (i === sampleBrdSections.length - 1) {
            setTimeout(() => setIsStreaming(false), 1500);
          }
        }, 2000 + i * 2500)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 4 + 1;
      if (current >= 92.4) {
        current = 92.4;
        clearInterval(interval);
      }
      setAccuracy(Math.round(current * 10) / 10);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleExport = async (format: string) => {
    const visibleData = sampleBrdSections.slice(0, visibleSections);
    if (visibleData.length === 0) {
      toast({ title: "Nothing to export", description: "Wait for BRD sections to generate first.", variant: "destructive" });
      return;
    }
    toast({ title: `Exporting as ${format}...`, description: "Your BRD document is being prepared." });
    try {
      if (format === "PDF") {
        exportBrdAsPdf(visibleData, accuracy);
      } else {
        await exportBrdAsDocx(visibleData, accuracy);
      }
      toast({ title: `${format} exported!`, description: "File downloaded successfully." });
    } catch (e) {
      console.error(e);
      toast({ title: "Export failed", description: String(e), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live BRD Generation</h1>
          <p className="text-sm text-muted-foreground">Enron Email Analysis — Project Alpha</p>
        </div>
        <div className="flex items-center gap-2">
          {isStreaming ? (
            <Badge variant="secondary" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Streaming
            </Badge>
          ) : (
            <Badge className="gap-1">
              <CheckCircle2 className="h-3 w-3" /> Complete
            </Badge>
          )}
          <Badge variant="outline">Accuracy: {accuracy}%</Badge>
        </div>
      </div>

      {/* Pipeline Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <div key={step.name} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              step.status === "complete" ? "bg-primary text-primary-foreground" :
              step.status === "active" ? "bg-primary/20 text-primary ring-2 ring-primary" :
              "bg-secondary text-muted-foreground"
            }`}>
              {step.status === "complete" ? "✓" : i + 1}
            </div>
            <span className={`text-sm whitespace-nowrap ${
              step.status === "active" ? "font-semibold text-primary" :
              step.status === "complete" ? "text-foreground" :
              "text-muted-foreground"
            }`}>{step.name}</span>
            {i < steps.length - 1 && (
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* BRD Document */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Generated BRD Document</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleExport("PDF")} className="gap-1">
              <Download className="h-3 w-3" /> PDF
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExport("DOCX")} className="gap-1">
              <Download className="h-3 w-3" /> DOCX
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast({ title: "Share link copied!" })} className="gap-1">
              <Share2 className="h-3 w-3" /> Share
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast({ title: "Edit mode enabled" })} className="gap-1">
              <Edit3 className="h-3 w-3" /> Edit
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {sampleBrdSections.slice(0, visibleSections).map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border p-4"
              >
                <h3 className="mb-2 font-semibold">{section.title}</h3>
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans">{section.content}</pre>
              </motion.div>
            ))}
          </AnimatePresence>

          {isStreaming && visibleSections < sampleBrdSections.length && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating next section...
            </div>
          )}

          {!isStreaming && (
            <div className="rounded-lg bg-primary/10 p-3 text-center text-sm font-medium text-primary">
              BRD Generation Complete — Accuracy: {accuracy}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrdGenerationPage;
