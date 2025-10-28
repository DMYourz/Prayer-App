import { ArrowLeft,CheckCircle, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation,useParams } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";

export default function ChurchMembers() {
  const { id } = useParams<{ id: string }>();
  const churchId = parseInt(id);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const utils = trpc.useUtils();

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

  const handleVerify = (memberId: number) => {
    verifyMutation.mutate({ memberId, churchId });
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
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Members List */}
      <section className="py-8 flex-1">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-4">
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

