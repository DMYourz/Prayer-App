import { ArrowLeft,Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useLocation,useParams } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";

export default function PrayerGroups() {
  const { id } = useParams<{ id: string }>();
  const churchId = parseInt(id);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const { data: church } = trpc.churches.getById.useQuery({ id: churchId });
  const { data: groups, isLoading } = trpc.prayerGroups.list.useQuery({ churchId });

  const createMutation = trpc.prayerGroups.create.useMutation({
    onSuccess: () => {
      toast.success("Prayer group created successfully");
      utils.prayerGroups.list.invalidate({ churchId });
      setIsCreateOpen(false);
      setGroupName("");
      setGroupDescription("");
      setIsPublic(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const joinMutation = trpc.prayerGroups.join.useMutation({
    onSuccess: () => {
      toast.success("Joined prayer group successfully");
      utils.prayerGroups.myGroups.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreate = () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    createMutation.mutate({
      churchId,
      name: groupName,
      description: groupDescription || undefined,
      isPublic,
    });
  };

  const handleJoin = (groupId: number) => {
    joinMutation.mutate({ groupId });
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
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-10 w-10 text-primary" />
                    <div>
                      <h1 className="text-4xl font-bold">Prayer Groups</h1>
                      <p className="text-lg text-muted-foreground">{church.name}</p>
                    </div>
                  </div>
                </div>

                {isAuthenticated && (
                  <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Group
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Prayer Group</DialogTitle>
                        <DialogDescription>
                          Create a new prayer group for your church community
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Group Name</Label>
                          <Input
                            id="name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="e.g., Youth Group, Women's Ministry"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description (Optional)</Label>
                          <Textarea
                            id="description"
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            placeholder="Describe the purpose of this prayer group..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsCreateOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreate}
                          disabled={createMutation.isPending}
                        >
                          Create Group
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Groups List */}
      <section className="py-8 flex-1">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Loading prayer groups...</p>
                </CardContent>
              </Card>
            ) : groups && groups.length > 0 ? (
              <div className="grid gap-4">
                {groups.map((group) => (
                  <Card key={group.id} className="border-border/50">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <CardTitle>{group.name}</CardTitle>
                            {group.isPublic === 1 && (
                              <Badge variant="secondary">Public</Badge>
                            )}
                          </div>
                          {group.description && (
                            <CardDescription>{group.description}</CardDescription>
                          )}
                        </div>
                        
                        {isAuthenticated && (
                          <Button
                            size="sm"
                            onClick={() => handleJoin(group.id)}
                            disabled={joinMutation.isPending}
                          >
                            Join Group
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
                  <p className="text-muted-foreground mb-4">
                    No prayer groups yet. Create one to get started!
                  </p>
                  {isAuthenticated && (
                    <Button onClick={() => setIsCreateOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Group
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

