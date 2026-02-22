import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Plus, FileText } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface BrdRow {
  id: string;
  accuracy: number | null;
  precision_score: number | null;
  recall: number | null;
  f1_score: number | null;
  status: string;
  version: number;
  created_at: string;
  projects: { name: string } | null;
}

export default function BrdList() {
  const [brds, setBrds] = useState<BrdRow[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("brds")
        .select("id, accuracy, precision_score, recall, f1_score, status, version, created_at, projects(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setBrds((data as unknown as BrdRow[]) || []);
    };
    load();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">BRDs</h1>
            <p className="text-sm text-muted-foreground">All generated Business Requirements Documents</p>
          </div>
          <Link to="/dashboard/upload">
            <Button size="sm"><Plus className="w-4 h-4 mr-1.5" /> New BRD</Button>
          </Link>
        </div>

        {brds.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No BRDs yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload data sources to generate your first BRD</p>
            <Link to="/dashboard/upload"><Button size="sm">Upload Data</Button></Link>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Project</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Accuracy</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Precision</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Recall</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">F1</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {brds.map((brd) => (
                  <tr key={brd.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{brd.projects?.name || "Untitled"}</td>
                    <td className="px-4 py-3 text-sm font-mono text-foreground">{brd.accuracy ?? "—"}%</td>
                    <td className="px-4 py-3 text-sm font-mono text-foreground">{brd.precision_score ?? "—"}%</td>
                    <td className="px-4 py-3 text-sm font-mono text-foreground">{brd.recall ?? "—"}%</td>
                    <td className="px-4 py-3 text-sm font-mono text-foreground">{brd.f1_score ?? "—"}%</td>
                    <td className="px-4 py-3">
                      <Badge variant={brd.status === "completed" ? "default" : "secondary"}>{brd.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(brd.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Link to={`/dashboard/brds/${brd.id}`}>
                        <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
