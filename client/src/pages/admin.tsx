import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { ArrowLeft, Mail, Building2, Link2, Calendar, MessageSquare, Plus, Pencil, Trash2, ExternalLink, GripVertical, X, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface Inquiry {
  id: string;
  role: string;
  name: string;
  email: string;
  organization: string | null;
  exploring: string;
  links: string | null;
  consent: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  highlight: string;
  url: string;
  sortOrder: number;
}

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
      });
      
      if (res.ok) {
        sessionStorage.setItem("adminAuth", "true");
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

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("adminAuth") === "true");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", highlight: "", url: "", sortOrder: 0 });

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  const { data: inquiriesData, isLoading: inquiriesLoading } = useQuery<{ success: boolean; inquiries: Inquiry[] }>({
    queryKey: ["/api/inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/inquiries");
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      return res.json();
    },
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery<{ success: boolean; projects: Project[] }>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (project: Omit<Project, "id">) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsAddDialogOpen(false);
      setNewProject({ name: "", description: "", highlight: "", url: "", sortOrder: 0 });
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
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
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

        <Tabs defaultValue="inquiries" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inquiries" data-testid="tab-inquiries">Inquiries ({inquiries.length})</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">Projects ({projects.length})</TabsTrigger>
          </TabsList>

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
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => setEditingProject(null)} data-testid="button-cancel-edit"><X className="w-4 h-4" /></Button>
                            <Button size="sm" onClick={() => updateProjectMutation.mutate(editingProject)} disabled={updateProjectMutation.isPending} data-testid="button-save-edit">Save</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
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
