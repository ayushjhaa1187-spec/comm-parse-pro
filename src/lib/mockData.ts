export const dashboardStats = {
  totalBrds: 24,
  activePipelines: 3,
  avgAccuracy: 92.4,
  docsProcessed: "150K",
};

export const recentBrds = [
  { id: "1", name: "Enron Email Analysis", accuracy: 93, status: "Complete" as const, latency: "2.1s", updated: "2 hours ago" },
  { id: "2", name: "AMI Meeting Transcript", accuracy: 91, status: "Complete" as const, latency: "1.8s", updated: "5 hours ago" },
  { id: "3", name: "Stakeholder Comms Q4", accuracy: 89, status: "Complete" as const, latency: "3.2s", updated: "1 day ago" },
  { id: "4", name: "Meeting Transcripts Batch", accuracy: 0, status: "Running" as const, latency: "--", updated: "Just now" },
];

export const pipelineSteps = [
  { name: "Ingest", status: "complete" as const },
  { name: "Filter", status: "complete" as const },
  { name: "Extract", status: "active" as const },
  { name: "Generate", status: "pending" as const },
  { name: "Validate", status: "pending" as const },
];

export const noiseFilterStats = {
  inputEmails: 500000,
  outputRelevant: 100000,
  percentRemoved: 80,
};

export const metricsData = {
  accuracy: 92.4,
  precision: 94.1,
  recall: 90.8,
  f1Score: 92.4,
  accuracyOverTime: [
    { date: "Week 1", accuracy: 85 },
    { date: "Week 2", accuracy: 88 },
    { date: "Week 3", accuracy: 90 },
    { date: "Week 4", accuracy: 91.5 },
    { date: "Week 5", accuracy: 92 },
    { date: "Week 6", accuracy: 92.4 },
  ],
  noiseRemoval: [
    { category: "Relevant", count: 100000 },
    { category: "Noise Removed", count: 400000 },
  ],
  latencyDistribution: [
    { range: "0-1s", count: 5 },
    { range: "1-2s", count: 12 },
    { range: "2-3s", count: 18 },
    { range: "3-4s", count: 8 },
    { range: "4-5s", count: 3 },
  ],
  perBrdComparison: [
    { name: "Enron Email Analysis", accuracy: 93.1, groundTruth: "Enron Match", latency: "2.1s", requirements: 45 },
    { name: "AMI Meeting Transcript", accuracy: 91.2, groundTruth: "AMI Match", latency: "1.8s", requirements: 38 },
    { name: "Stakeholder Comms Q4", accuracy: 89.5, groundTruth: "Manual Review", latency: "3.2s", requirements: 52 },
    { name: "Meeting Transcripts Batch", accuracy: 94.0, groundTruth: "AMI Match", latency: "1.5s", requirements: 29 },
  ],
};

export const sampleBrdSections = [
  {
    title: "1. Project Overview",
    content: `**Project Name:** Enron Communication Analysis\n**Objective:** Extract and structure business requirements from 500K+ email communications and meeting transcripts from the Enron dataset, identifying key stakeholders, decisions, and functional requirements.\n**Scope:** Analysis covers emails from 2000-2002, cross-referenced with AMI meeting corpus transcripts.`,
  },
  {
    title: "2. Stakeholders",
    content: `| Name | Role | Extracted From |\n|------|------|----------------|\n| Kenneth Lay | CEO | Email #45210 |\n| Jeff Skilling | President | Email #32891 |\n| Andrew Fastow | CFO | Meeting #12 |\n| Sherron Watkins | VP | Email #18923 |`,
  },
  {
    title: "3. Functional Requirements",
    content: `**FR-001:** Real-time energy trading platform with SSO authentication\n**FR-002:** Automated risk assessment scoring for trading positions\n**FR-003:** Regulatory compliance reporting dashboard\n**FR-004:** Inter-department communication audit trail`,
  },
  {
    title: "4. Non-Functional Requirements",
    content: `**NFR-001:** System latency < 200ms for trading operations\n**NFR-002:** 99.9% uptime SLA\n**NFR-003:** SOX compliance data retention (7 years)\n**NFR-004:** Support 10,000 concurrent users`,
  },
  {
    title: "5. Success Metrics",
    content: `- Requirements extraction accuracy: 92.4%\n- Stakeholder identification precision: 94.1%\n- Processing latency: < 3 seconds per document batch\n- Noise filtering effectiveness: 80% irrelevant content removed`,
  },
];

export const datasets = [
  {
    id: "enron",
    name: "Enron Email Dataset",
    description: "500K+ emails from Enron Corporation (2000-2002)",
    source: "Kaggle",
    url: "https://www.kaggle.com/datasets/wcukierski/enron-email-dataset",
    size: "1.7GB",
    records: "517,431 emails",
    type: "email" as const,
  },
  {
    id: "ami",
    name: "AMI Meeting Corpus",
    description: "279 meeting transcripts with summaries and annotations",
    source: "HuggingFace",
    url: "https://huggingface.co/datasets/knkarthick/AMI",
    size: "450MB",
    records: "279 transcripts",
    type: "transcript" as const,
    license: "CC BY 4.0",
  },
  {
    id: "meeting",
    name: "Meeting Transcripts Dataset",
    description: "Community-uploaded meeting transcripts for NLP tasks",
    source: "Kaggle",
    url: "https://www.kaggle.com/datasets/abhishekunnam/meeting-transcripts",
    size: "120MB",
    records: "~500 transcripts",
    type: "transcript" as const,
  },
];
