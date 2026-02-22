import { metricsData } from "@/lib/mockData";
import { Target, Crosshair, RotateCcw, Activity } from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const metricCards = [
  { label: "Accuracy", value: metricsData.accuracy, icon: Target, color: "text-primary" },
  { label: "Precision", value: metricsData.precision, icon: Crosshair, color: "text-success" },
  { label: "Recall", value: metricsData.recall, icon: RotateCcw, color: "text-warning" },
  { label: "F1 Score", value: metricsData.f1Score, icon: Activity, color: "text-info" },
];

const COLORS = ["hsl(215, 90%, 52%)", "hsl(210, 20%, 85%)"];

const MetricsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Performance</h1>
        <p className="text-sm text-muted-foreground">Validation & accuracy metrics across all BRD generations</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card text-center"
          >
            <card.icon className={`mx-auto h-5 w-5 ${card.color}`} />
            <p className="mt-2 text-3xl font-bold">{card.value}%</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Accuracy Over Time */}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Accuracy Over Time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metricsData.accuracyOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="hsl(215, 90%, 52%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Noise Removal */}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Noise Removal Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={metricsData.noiseRemoval} dataKey="count" nameKey="category" outerRadius={80} label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}>
                {metricsData.noiseRemoval.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Latency Distribution */}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Latency Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metricsData.latencyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(215, 90%, 52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-BRD Comparison */}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Per-BRD Accuracy</h2>
          <div className="space-y-3">
            {metricsData.perBrdComparison.map((brd) => (
              <div key={brd.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="truncate font-medium">{brd.name}</span>
                  <span className="text-muted-foreground">{brd.accuracy}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${brd.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPage;
