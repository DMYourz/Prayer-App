import { ArrowLeft, CheckCircle, Clock, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useLocation, useParams } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_TITLE, IS_DEMO_MODE } from "@/const";
import { trpc } from "@/lib/trpc";

export default function ChurchMembers() {
  const { id } = useParams<{ id: string }>();
  const churchId = parseInt(id);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "member" as "member" | "admin" | "pastor" });

  const { data: church } = trpc.churches.getById.useQuery({ id: churchId });
  const { data: members, isLoading } = trpc.churchMembers.list.useQuery({ churchId });

  const verifyMutation = trpc.churchMembers.verify.useMutation({
    onSuccess: () => {
      toast.success("Member verified successfully");
      utils.churchMembers.list.invalidate({ churchId });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const demoAddMutation = trpc.churchMembers.demoAdd.useMutation({
    onSuccess: () => {
      toast.success("Demo member added");
      setNewMember({ name: "", email: "", role: "member" });
      utils.churchMembers.list.invalidate({ churchId });
      if (newMember.email) {
        toast.info(`Preview invite email queued for ${newMember.email}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleVerify = (memberId: number) => {
    verifyMutation.mutate({ memberId, churchId });
  };

  const handleAddMember = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMember.name.trim()) {
      toast.error("Name is required");
      return;
    }

    demoAddMutation.mutate({
      churchId,
      name: newMember.name,
      email: newMember.email || undefined,
      role: newMember.role,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-xl font-semibold text-foreground cursor-pointer">{APP_TITLE}</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/churches">
              <Button variant="ghost">Churches</Button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline">Admin</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation(`/churches/${churchId}/prayers`)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Church
            </Button>
            
            {church && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="h-10 w-10 text-primary" />
                  <div>
                    <h1 className="text-4xl font-bold">Members</h1>
                    <p className="text-lg text-muted-foreground">{church.name}</p>
                  </div>
                </div>
                {IS_DEMO_MODE && (
                  <p className="text-sm text-muted-foreground">
                    Preview mode: use this page to simulate inviting, verifying, and managing church members.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Members List */}
      <section className="py-8 flex-1">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-6">
            {IS_DEMO_MODE && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Add a member (demo)</CardTitle>
                  <CardDescription>
                    Creates a pending member using the in-memory preview dataset.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-3 md:grid-cols-3" onSubmit={handleAddMember}>
                    <Input
                      className="col-span-1"
                      placeholder="Name"
                      value={newMember.name}
                      onChange={(event) => setNewMember((prev) => ({ ...prev, name: event.target.value }))}
                      required
                    />
                    <Input
                      className="col-span-1"
                      placeholder="Email (optional)"
                      value={newMember.email}
                      onChange={(event) => setNewMember((prev) => ({ ...prev, email: event.target.value }))}
                      type="email"
                    />
                    <div className="flex items-center gap-2">
                      <select
                        className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
                        value={newMember.role}
                        onChange={(event) => setNewMember((prev) => ({ ...prev, role: event.target.value as typeof prev.role }))}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        <option value="pastor">Pastor</option>
                      </select>
                      <Button type="submit" size="sm" disabled={demoAddMutation.isPending}>
                        Add
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Loading members...</p>
                </CardContent>
              </Card>
            ) : members && members.length > 0 ? (
              <div className="grid gap-4">
                {members.map((member) => (
                  <Card key={member.id} className="border-border/50">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">Member #{member.userId}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-2">
                            <Badge variant={member.role === "admin" || member.role === "pastor" ? "default" : "secondary"}>
                              {member.role}
                            </Badge>
                            <Badge variant={
                              member.status === "verified" ? "default" :
                              member.status === "pending" ? "secondary" :
                              "destructive"
                            }>
                              {member.status === "verified" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {member.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                              {member.status}
                            </Badge>
                          </CardDescription>
                        </div>
                        
                        {member.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleVerify(member.id)}
                            disabled={verifyMutation.isPending}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No members yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
