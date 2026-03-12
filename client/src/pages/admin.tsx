import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Building2, Link2, Calendar, MessageSquare, Plus, Pencil, Trash2, ExternalLink, GripVertical, X, Lock, RefreshCw, Activity, Users, DollarSign, Zap, TrendingUp, Database, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

import type { Inquiry, Project, Metrics, MetricsSnapshot } from "@/lib/types";

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      
      if (res.ok) {
        onSuccess();
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Failed to verify password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-heading">Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                data-testid="input-admin-password"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading} data-testid="button-admin-login">
              {loading ? "Verifying..." : "Access Admin"}
            </Button>
            <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors">
              Back to home
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricsDashboard({ projects, toast }: { projects: Project[]; toast: ReturnType<typeof useToast>["toast"] }) {
  const [fetching, setFetching] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: latestMetrics, isLoading: metricsLoading } = useQuery<{ success: boolean; snapshots: MetricsSnapshot[] }>({
    queryKey: ["/api/metrics/latest"],
    queryFn: async () => {
      const res = await fetch("/api/metrics/latest");
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return res.json();
    },
  });

  const { data: projectMetrics } = useQuery<{ success: boolean; snapshots: MetricsSnapshot[] }>({
    queryKey: ["/api/projects", selectedProject, "metrics"],
    queryFn: async () => {
      if (!selectedProject) return { success: true, snapshots: [] };
      const res = await fetch(`/api/projects/${selectedProject}/metrics?limit=30`);
      if (!res.ok) throw new Error("Failed to fetch project metrics");
      return res.json();
    },
    enabled: !!selectedProject,
  });

  const fetchAllMetrics = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/metrics/fetch-all", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        const successCount = data.results.filter((r: any) => r.success).length;
        toast({ title: "Metrics fetched", description: `Successfully fetched ${successCount} of ${data.results.length} projects` });
        queryClient.invalidateQueries({ queryKey: ["/api/metrics/latest"] });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch metrics", variant: "destructive" });
    } finally {
      setFetching(false);
    }
  };

  const resetMetrics = async () => {
    if (!confirm("Are you sure you want to delete all metrics data? This cannot be undone.")) return;
    setResetting(true);
    try {
      const res = await fetch("/api/metrics", { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Metrics reset", description: `Deleted ${data.deleted} snapshots` });
        queryClient.invalidateQueries({ queryKey: ["/api/metrics/latest"] });
        setSelectedProject(null);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to reset metrics", variant: "destructive" });
    } finally {
      setResetting(false);
    }
  };

  const snapshots = latestMetrics?.snapshots || [];
  const projectsWithMetrics = projects.filter(p => p.metricsEndpoint);
  
  const chartData = (projectMetrics?.snapshots || [])
    .slice()
    .reverse()
    .map(s => ({
      date: format(new Date(s.timestamp), "MMM d"),
      DAU: s.metrics.users.daily_active,
      WAU: s.metrics.users.weekly_active,
      MAU: s.metrics.users.monthly_active,
      Transfers: s.metrics.onchain.transactions,
      Revenue: s.metrics.revenue.net_income,
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Portfolio Metrics</h2>
          <p className="text-sm text-muted-foreground">{projectsWithMetrics.length} project{projectsWithMetrics.length !== 1 ? "s" : ""} with metrics configured</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAllMetrics} disabled={fetching || resetting} data-testid="button-fetch-all-metrics">
            <RefreshCw className={`w-4 h-4 mr-2 ${fetching ? "animate-spin" : ""}`} />
            {fetching ? "Fetching..." : "Fetch All Metrics"}
          </Button>
          <Button variant="destructive" onClick={resetMetrics} disabled={fetching || resetting} data-testid="button-reset-metrics">
            <Trash2 className="w-4 h-4 mr-2" />
            {resetting ? "Resetting..." : "Reset All"}
          </Button>
        </div>
      </div>

      {metricsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Card key={i}><CardContent className="pt-6"><Skeleton className="h-24 w-full" /></CardContent></Card>)}
        </div>
      ) : snapshots.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No metrics data yet. Configure metrics endpoints on your projects and click "Fetch All Metrics".</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {snapshots.map(snapshot => {
              const project = projects.find(p => p.id === snapshot.projectId);
              if (!project) return null;
              const m = snapshot.metrics;
              return (
                <Card 
                  key={snapshot.id} 
                  className={`cursor-pointer transition-colors ${selectedProject === snapshot.projectId ? "border-primary" : "hover:border-primary/50"}`}
                  onClick={() => setSelectedProject(snapshot.projectId)}
                  data-testid={`metrics-card-${snapshot.projectId}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">{format(new Date(snapshot.timestamp), "MMM d, h:mm a")}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="font-medium">{m.users.total.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Total Users</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <div>
                          <div className="font-medium">{m.users.daily_active.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">DAU</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <div>
                          <div className="font-medium">{m.onchain.transactions.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Transfers</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <div>
                          <div className="font-medium">${m.revenue.net_income.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedProject && chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {projects.find(p => p.id === selectedProject)?.name} - Historical Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis yAxisId="left" stroke="#666" />
                      <YAxis yAxisId="right" orientation="right" stroke="#666" />
                      <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="DAU" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line yAxisId="left" type="monotone" dataKey="WAU" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                      <Line yAxisId="left" type="monotone" dataKey="MAU" stroke="#06b6d4" strokeWidth={2} dot={false} />
                      <Line yAxisId="left" type="monotone" dataKey="Transfers" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metrics API Template</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Use this prompt on your other apps to create a compatible metrics endpoint:</p>
          <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">
{`Create a /api/metrics endpoint that returns:
{
  "app": "App Name",
  "timestamp": "ISO 8601 timestamp",
  "users": {
    "total": number,
    "daily_active": number,
    "weekly_active": number,
    "monthly_active": number,
    "paying": number
  },
  "engagement": {
    "key_actions": number,
    "sessions_today": number
  },
  "revenue": {
    "total_payments": number,
    "net_income": number,
    "currency": "USD"
  },
  "onchain": {
    "transactions": number,
    "volume": number
  }
}

Secure it with an API key via Authorization header.
Store the key as METRICS_API_KEY secret.`}
          </pre>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Metric Definitions Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">Use these standardized definitions so all apps report metrics consistently:</p>
          
          <div className="space-y-4">
            <div className="border-l-2 border-blue-500 pl-4">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" /> Users
              </h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>total</strong> — All users who completed at least one key action (excluding visitors or users who only connected their wallet without further engagement)</p>
                <p><strong>daily_active (DAU)</strong> — Unique users who performed any meaningful action in the last 24 hours (not just page views)</p>
                <p><strong>weekly_active (WAU)</strong> — Unique users active in the last 7 days</p>
                <p><strong>monthly_active (MAU)</strong> — Unique users active in the last 30 days</p>
                <p><strong>paying</strong> — Users with at least one completed payment or active subscription</p>
              </div>
            </div>

            <div className="border-l-2 border-green-500 pl-4">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4" /> Engagement <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5">DAILY</span>
              </h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>sessions_today</strong> — Distinct user visits in the last 24h. A session starts when the user opens the app and ends after 30 minutes of inactivity or explicit logout. One user can have multiple sessions. <em>(Resets daily)</em></p>
                <p><strong>key_actions</strong> — Core value-generating interactions in the last 24h. Define based on your app's purpose: <em>(Resets daily)</em></p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><em>Trading app:</em> Trades executed</li>
                  <li><em>AI tool:</em> Prompts/queries submitted</li>
                  <li><em>Content app:</em> Posts created, articles read to completion</li>
                  <li><em>Social app:</em> Messages sent, connections made</li>
                  <li><em>Game:</em> Levels completed, matches played</li>
                </ul>
              </div>
            </div>

            <div className="border-l-2 border-yellow-500 pl-4">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4" /> Revenue <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5">CUMULATIVE</span>
              </h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>total_payments</strong> — Cumulative count of user-initiated purchases (lifetime). A payment is when a user pays for something in your app (purchases, subscriptions, tips).</p>
                <p><strong>net_income</strong> — Cumulative revenue after platform fees and refunds (lifetime, in USD). This is the actual money received.</p>
                <p><strong>currency</strong> — Always report as "USD". Convert other currencies at time of transfer.</p>
                <p className="italic mt-2">The dashboard calculates Daily Payments from the difference between snapshots.</p>
              </div>
            </div>

            <div className="border-l-2 border-purple-500 pl-4">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" /> On-chain (Web3 apps only) <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5">CUMULATIVE</span>
              </h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>transfers</strong> — Cumulative count of ALL blockchain transfers through the app (lifetime). Includes user actions, system operations, swaps, transfers — everything on-chain.</p>
                <p><strong>volume</strong> — Cumulative USD value of on-chain transfers (lifetime). Use price at time of transfer.</p>
                <p className="italic mt-2">Unlike payments (user purchases only), transfers include all on-chain activity. Set both to 0 if your app doesn't have blockchain functionality.</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg mt-4">
            <h4 className="font-medium text-sm mb-2">Important Notes</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Cumulative metrics</strong> (total, payments, transfers, volume, net_income) should always increase over time</li>
              <li>• <strong>Active metrics</strong> (DAU, WAU, MAU, sessions, key_actions) are rolling windows and can fluctuate</li>
              <li>• <strong>Timestamp</strong> should be the exact time the metrics were computed (ISO 8601 format)</li>
              <li>• Report real data only — the dashboard calculates growth rates from changes over time</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SnapshotManager({ projects, toast }: { projects: Project[]; toast: ReturnType<typeof useToast>["toast"] }) {
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const { data: historyData, isLoading } = useQuery<{ success: boolean; snapshots: MetricsSnapshot[] }>({
    queryKey: ["/api/metrics/history"],
    queryFn: async () => {
      const res = await fetch("/api/metrics/history?limit=200", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch snapshots");
      return res.json();
    },
  });

  const deleteSnapshot = async (id: string) => {
    if (!confirm("Delete this snapshot? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/metrics/snapshot/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        toast({ title: "Snapshot deleted", description: "The snapshot has been removed" });
        queryClient.invalidateQueries({ queryKey: ["/api/metrics/history"] });
        queryClient.invalidateQueries({ queryKey: ["/api/metrics/latest"] });
      } else {
        toast({ title: "Error", description: "Failed to delete snapshot", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete snapshot", variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const allSnapshots = historyData?.snapshots || [];
  const filteredSnapshots = selectedProject === "all" 
    ? allSnapshots 
    : allSnapshots.filter(s => s.projectId === selectedProject);

  const detectSuspiciousValues = (metrics: Metrics) => {
    const issues: string[] = [];
    if (metrics.users.total < 0) issues.push("Negative total users");
    if (metrics.users.daily_active < 0) issues.push("Negative DAU");
    if (metrics.revenue.net_income < 0) issues.push("Negative revenue");
    if (metrics.onchain.transactions < 0) issues.push("Negative transfers");
    if (metrics.users.daily_active > metrics.users.total) issues.push("DAU > total users");
    if (metrics.users.weekly_active > metrics.users.total) issues.push("WAU > total users");
    if (metrics.users.monthly_active > metrics.users.total) issues.push("MAU > total users");
    return issues;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="w-5 h-5" />
            Snapshot Manager
          </h2>
          <p className="text-sm text-muted-foreground">Browse and delete individual metric snapshots</p>
        </div>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-background border rounded px-3 py-2 text-sm"
          data-testid="select-snapshot-project"
        >
          <option value="all">All Projects ({allSnapshots.length})</option>
          {projects.filter(p => p.metricsEndpoint).map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({allSnapshots.filter(s => s.projectId === p.id).length})
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Loading snapshots...</p>
          </CardContent>
        </Card>
      ) : filteredSnapshots.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No snapshots found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredSnapshots.map(snapshot => {
            const project = projects.find(p => p.id === snapshot.projectId);
            const m = snapshot.metrics;
            const issues = detectSuspiciousValues(m);
            const hasSuspiciousData = issues.length > 0;

            return (
              <Card key={snapshot.id} className={`${hasSuspiciousData ? "border-yellow-500/50 bg-yellow-500/5" : ""}`} data-testid={`snapshot-${snapshot.id}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{project?.name || "Unknown"}</span>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {format(new Date(snapshot.timestamp), "MMM d, h:mm a")}
                        </Badge>
                        {hasSuspiciousData && (
                          <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/30 shrink-0">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Suspicious
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Users: {m.users.total.toLocaleString()}</span>
                        <span>DAU: {m.users.daily_active.toLocaleString()}</span>
                        <span>Transfers: {m.onchain.transactions.toLocaleString()}</span>
                        <span>Revenue: ${m.revenue.net_income.toLocaleString()}</span>
                      </div>
                      {hasSuspiciousData && (
                        <div className="text-xs text-yellow-500 mt-1">
                          Issues: {issues.join(", ")}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSnapshot(snapshot.id)}
                      disabled={deleting === snapshot.id}
                      className="shrink-0"
                      data-testid={`button-delete-snapshot-${snapshot.id}`}
                    >
                      <Trash2 className={`w-4 h-4 text-destructive ${deleting === snapshot.id ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    document.title = "Admin — Zeno Vision";
    fetch("/api/admin/session", { credentials: "include" })
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", highlight: "", url: "", sortOrder: 0, metricsEndpoint: "", metricsApiKey: "", showUsersMetrics: true, showEngagementMetrics: true, showRevenueMetrics: true, showOnchainMetrics: true, showOnLandingPage: true, chartColor: "" });
  const [fetchingMetrics, setFetchingMetrics] = useState<string | null>(null);
  const [selectedProjectForMetrics, setSelectedProjectForMetrics] = useState<string | null>(null);

  const { data: inquiriesData, isLoading: inquiriesLoading } = useQuery<{ success: boolean; inquiries: Inquiry[] }>({
    queryKey: ["/api/inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/inquiries", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      return res.json();
    },
    enabled: isAuthenticated === true,
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    enabled: isAuthenticated === true,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (project: Omit<Project, "id">) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsAddDialogOpen(false);
      setNewProject({ name: "", description: "", highlight: "", url: "", sortOrder: 0, metricsEndpoint: "", metricsApiKey: "", showUsersMetrics: true, showEngagementMetrics: true, showRevenueMetrics: true, showOnchainMetrics: true, showOnLandingPage: true, chartColor: "" });
      toast({ title: "Project added", description: "The project has been added successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add project.", variant: "destructive" });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...project }: Project) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setEditingProject(null);
      toast({ title: "Project updated", description: "The project has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update project.", variant: "destructive" });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted", description: "The project has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete project.", variant: "destructive" });
    },
  });

  const inquiries = inquiriesData?.inquiries || [];
  const projects = projectsData?.projects || [];

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Investor": return "default";
      case "Partner": return "secondary";
      case "Collaborator": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 rounded-lg hover:bg-muted transition-colors" data-testid="link-back-home">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading" data-testid="text-admin-title">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage inquiries and portfolio projects</p>
          </div>
        </div>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="metrics" data-testid="tab-metrics"><Activity className="w-4 h-4 mr-2" />Metrics</TabsTrigger>
            <TabsTrigger value="snapshots" data-testid="tab-snapshots"><Database className="w-4 h-4 mr-2" />Snapshots</TabsTrigger>
            <TabsTrigger value="inquiries" data-testid="tab-inquiries">Inquiries ({inquiries.length})</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">Projects ({projects.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <MetricsDashboard projects={projects} toast={toast} />
          </TabsContent>

          <TabsContent value="snapshots" className="space-y-6">
            <SnapshotManager projects={projects} toast={toast} />
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-4">
            {inquiriesLoading && (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
                    <CardContent><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-3/4" /></CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!inquiriesLoading && inquiries.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground" data-testid="text-empty">No inquiries yet. Submissions will appear here.</p>
                </CardContent>
              </Card>
            )}

            {!inquiriesLoading && inquiries.length > 0 && (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <Card key={inquiry.id} className="hover:border-primary/50 transition-colors" data-testid={`card-inquiry-${inquiry.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg font-heading">{inquiry.name}</CardTitle>
                          <Badge variant={getRoleBadgeVariant(inquiry.role)}>{inquiry.role}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{format(new Date(inquiry.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">{inquiry.email}</a>
                      </div>
                      {inquiry.organization && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span>{inquiry.organization}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2 text-sm">
                        <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <p className="text-muted-foreground">{inquiry.exploring}</p>
                      </div>
                      {inquiry.links && (
                        <div className="flex items-center gap-2 text-sm">
                          <Link2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground break-all">{inquiry.links}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-project"><Plus className="w-4 h-4 mr-2" />Add Project</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add New Project</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="Project.name" data-testid="input-project-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Short description" data-testid="input-project-description" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="highlight">Highlight/Traction</Label>
                      <Input id="highlight" value={newProject.highlight} onChange={(e) => setNewProject({ ...newProject, highlight: e.target.value })} placeholder="100K users / 1 week" data-testid="input-project-highlight" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url">URL</Label>
                      <Input id="url" value={newProject.url} onChange={(e) => setNewProject({ ...newProject, url: e.target.value })} placeholder="https://project.com" data-testid="input-project-url" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sortOrder">Sort Order</Label>
                      <Input id="sortOrder" type="number" value={newProject.sortOrder} onChange={(e) => setNewProject({ ...newProject, sortOrder: parseInt(e.target.value) || 0 })} data-testid="input-project-order" />
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm text-muted-foreground mb-3">Metrics API (optional)</p>
                      <div className="space-y-2">
                        <Label htmlFor="metricsEndpoint">Metrics Endpoint</Label>
                        <Input id="metricsEndpoint" value={newProject.metricsEndpoint} onChange={(e) => setNewProject({ ...newProject, metricsEndpoint: e.target.value })} placeholder="https://app.com/api/metrics" data-testid="input-project-metrics-endpoint" />
                      </div>
                      <div className="space-y-2 mt-2">
                        <Label htmlFor="metricsApiKey">API Key</Label>
                        <Input id="metricsApiKey" type="password" value={newProject.metricsApiKey} onChange={(e) => setNewProject({ ...newProject, metricsApiKey: e.target.value })} placeholder="Bearer token" data-testid="input-project-metrics-key" />
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center justify-between mb-4">
                          <Label htmlFor="showOnLanding" className="text-sm font-medium">Show on Landing Page</Label>
                          <Switch id="showOnLanding" checked={newProject.showOnLandingPage} onCheckedChange={(checked) => setNewProject({ ...newProject, showOnLandingPage: checked })} data-testid="switch-show-landing" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Dashboard Visibility (choose which metrics to show)</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="showUsers" className="text-sm">Users</Label>
                            <Switch id="showUsers" checked={newProject.showUsersMetrics} onCheckedChange={(checked) => setNewProject({ ...newProject, showUsersMetrics: checked })} data-testid="switch-show-users" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="showEngagement" className="text-sm">Engagement</Label>
                            <Switch id="showEngagement" checked={newProject.showEngagementMetrics} onCheckedChange={(checked) => setNewProject({ ...newProject, showEngagementMetrics: checked })} data-testid="switch-show-engagement" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="showRevenue" className="text-sm">Revenue</Label>
                            <Switch id="showRevenue" checked={newProject.showRevenueMetrics} onCheckedChange={(checked) => setNewProject({ ...newProject, showRevenueMetrics: checked })} data-testid="switch-show-revenue" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="showOnchain" className="text-sm">On-chain</Label>
                            <Switch id="showOnchain" checked={newProject.showOnchainMetrics} onCheckedChange={(checked) => setNewProject({ ...newProject, showOnchainMetrics: checked })} data-testid="switch-show-onchain" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Chart Color</Label>
                        <div className="flex items-center gap-2 mt-2">
                          {['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#ec4899', '#f97316', '#14b8a6', '#a855f7'].map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`w-7 h-7 border-2 ${newProject.chartColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                              style={{ backgroundColor: color }}
                              onClick={() => setNewProject({ ...newProject, chartColor: color })}
                              data-testid={`color-swatch-${color.slice(1)}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => createProjectMutation.mutate(newProject)} disabled={createProjectMutation.isPending} data-testid="button-save-project">
                      {createProjectMutation.isPending ? "Adding..." : "Add Project"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {projectsLoading && (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}><CardContent className="pt-6"><Skeleton className="h-6 w-48" /></CardContent></Card>
                ))}
              </div>
            )}

            {!projectsLoading && projects.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No projects yet. Add your first project above.</p>
                </CardContent>
              </Card>
            )}

            {!projectsLoading && projects.length > 0 && (
              <div className="space-y-3">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:border-primary/50 transition-colors" data-testid={`card-project-${project.id}`}>
                    <CardContent className="pt-4 pb-4">
                      {editingProject?.id === project.id ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input value={editingProject.name} onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })} placeholder="Name" data-testid="input-edit-name" />
                            <Input value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} placeholder="Description" data-testid="input-edit-description" />
                          </div>
                          <div className="flex gap-2">
                            <Input value={editingProject.highlight} onChange={(e) => setEditingProject({ ...editingProject, highlight: e.target.value })} placeholder="Highlight" data-testid="input-edit-highlight" />
                            <Input value={editingProject.url} onChange={(e) => setEditingProject({ ...editingProject, url: e.target.value })} placeholder="URL" data-testid="input-edit-url" />
                            <Input type="number" value={editingProject.sortOrder} onChange={(e) => setEditingProject({ ...editingProject, sortOrder: parseInt(e.target.value) || 0 })} placeholder="Order" className="w-20" data-testid="input-edit-order" />
                          </div>
                          <div className="flex gap-2">
                            <Input value={editingProject.metricsEndpoint || ""} onChange={(e) => setEditingProject({ ...editingProject, metricsEndpoint: e.target.value })} placeholder="Metrics Endpoint" data-testid="input-edit-metrics-endpoint" />
                            <Input type="password" value={editingProject.metricsApiKey || ""} onChange={(e) => setEditingProject({ ...editingProject, metricsApiKey: e.target.value })} placeholder="API Key" data-testid="input-edit-metrics-key" />
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Switch id="editShowLanding" checked={editingProject.showOnLandingPage} onCheckedChange={(checked) => setEditingProject({ ...editingProject, showOnLandingPage: checked })} data-testid="switch-edit-show-landing" />
                            <Label htmlFor="editShowLanding" className="text-xs font-medium">Show on Landing Page</Label>
                          </div>
                          <div className="flex gap-4 flex-wrap text-sm">
                            <div className="flex items-center gap-2">
                              <Switch id="editShowUsers" checked={editingProject.showUsersMetrics} onCheckedChange={(checked) => setEditingProject({ ...editingProject, showUsersMetrics: checked })} data-testid="switch-edit-show-users" />
                              <Label htmlFor="editShowUsers" className="text-xs">Users</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch id="editShowEngagement" checked={editingProject.showEngagementMetrics} onCheckedChange={(checked) => setEditingProject({ ...editingProject, showEngagementMetrics: checked })} data-testid="switch-edit-show-engagement" />
                              <Label htmlFor="editShowEngagement" className="text-xs">Engagement</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch id="editShowRevenue" checked={editingProject.showRevenueMetrics} onCheckedChange={(checked) => setEditingProject({ ...editingProject, showRevenueMetrics: checked })} data-testid="switch-edit-show-revenue" />
                              <Label htmlFor="editShowRevenue" className="text-xs">Revenue</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch id="editShowOnchain" checked={editingProject.showOnchainMetrics} onCheckedChange={(checked) => setEditingProject({ ...editingProject, showOnchainMetrics: checked })} data-testid="switch-edit-show-onchain" />
                              <Label htmlFor="editShowOnchain" className="text-xs">On-chain</Label>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs font-medium mb-1 block">Chart Color</Label>
                            <div className="flex items-center gap-1.5">
                              {['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#ec4899', '#f97316', '#14b8a6', '#a855f7'].map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  className={`w-5 h-5 border-2 ${editingProject.chartColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setEditingProject({ ...editingProject, chartColor: color })}
                                  data-testid={`edit-color-swatch-${color.slice(1)}`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => setEditingProject(null)} data-testid="button-cancel-edit"><X className="w-4 h-4" /></Button>
                            <Button size="sm" onClick={() => updateProjectMutation.mutate(editingProject)} disabled={updateProjectMutation.isPending} data-testid="button-save-edit">Save</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            {project.chartColor && <div className="w-3 h-3 shrink-0" style={{ backgroundColor: project.chartColor }} />}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium font-heading">{project.name}</span>
                                <Badge variant="outline" className="text-xs">{project.highlight}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-muted rounded-lg transition-colors" data-testid={`link-project-${project.id}`}>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <Button variant="ghost" size="icon" onClick={() => setEditingProject(project)} data-testid={`button-edit-${project.id}`}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteProjectMutation.mutate(project.id)} disabled={deleteProjectMutation.isPending} data-testid={`button-delete-${project.id}`}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
