import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Mail, Building2, Link2, Calendar, User, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function Admin() {
  const { data, isLoading, error } = useQuery<{ success: boolean; inquiries: Inquiry[] }>({
    queryKey: ["/api/inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/inquiries");
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      return res.json();
    },
  });

  const inquiries = data?.inquiries || [];

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
            <h1 className="text-3xl font-bold font-heading" data-testid="text-admin-title">Inquiry Submissions</h1>
            <p className="text-muted-foreground">Manage interest form submissions</p>
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive" data-testid="text-error">Failed to load inquiries. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && inquiries.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground" data-testid="text-empty">No inquiries yet. Submissions will appear here.</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && inquiries.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4" data-testid="text-count">
              {inquiries.length} submission{inquiries.length !== 1 ? "s" : ""}
            </p>
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="hover:border-primary/50 transition-colors" data-testid={`card-inquiry-${inquiry.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg font-heading" data-testid={`text-name-${inquiry.id}`}>{inquiry.name}</CardTitle>
                      <Badge variant={getRoleBadgeVariant(inquiry.role)} data-testid={`badge-role-${inquiry.id}`}>{inquiry.role}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span data-testid={`text-date-${inquiry.id}`}>{format(new Date(inquiry.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline" data-testid={`link-email-${inquiry.id}`}>{inquiry.email}</a>
                  </div>
                  
                  {inquiry.organization && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span data-testid={`text-org-${inquiry.id}`}>{inquiry.organization}</span>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground" data-testid={`text-exploring-${inquiry.id}`}>{inquiry.exploring}</p>
                  </div>
                  
                  {inquiry.links && (
                    <div className="flex items-center gap-2 text-sm">
                      <Link2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground break-all" data-testid={`text-links-${inquiry.id}`}>{inquiry.links}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
