import { useState, useEffect, ReactNode } from "react";
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

interface PasswordGateProps {
  children: ReactNode;
  storageKey: string;
  title?: string;
}

export function PasswordGate({ children, storageKey, title = "Protected Page" }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then(res => {
        setIsAuthenticated(res.ok);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

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
        setIsAuthenticated(true);
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Failed to verify password");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-[#a0aec0]">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 bg-[#1a1a1a] border-[#2d2d2d]">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-[#3b82f6]/10 w-fit mb-4">
            <Lock className="w-6 h-6 text-[#3b82f6]" />
          </div>
          <CardTitle className="text-2xl font-semibold text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#a0aec0]">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-[#0f0f0f] border-[#2d2d2d] text-white"
                data-testid="input-gate-password"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button 
              type="submit" 
              className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/80 text-white" 
              disabled={loading} 
              data-testid="button-gate-submit"
            >
              {loading ? "Verifying..." : "View Page"}
            </Button>
            <Link href="/" className="block text-center text-sm text-[#a0aec0] hover:text-[#3b82f6] transition-colors">
              Back to home
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
