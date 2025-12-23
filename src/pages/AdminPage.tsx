import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Users,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminPage() {
  const { users, currentUser, isLeader, updateCredits, globalThreshold } = useApp();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  // Redirect non-leaders
  if (!isLeader) {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredUsers = users.filter(u => {
    if (u.role === "leader") return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && 
        !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Stats
  const totalMembers = users.filter(u => u.role === "member").length;
  const activeMembers = users.filter(u => u.role === "member" && u.status === "active").length;
  const atRiskMembers = users.filter(u => u.credits < globalThreshold && u.credits >= 0).length;
  const disabledMembers = users.filter(u => u.status === "disabled").length;

  const handleAdjustCredits = () => {
    if (!selectedUser || !adjustAmount || !adjustReason) return;
    
    const amount = parseInt(adjustAmount);
    if (isNaN(amount)) {
      toast.error("Invalid amount");
      return;
    }

    updateCredits(selectedUser, amount, adjustReason);
    toast.success(`Credits ${amount > 0 ? "added" : "deducted"} successfully`);
    
    setAdjustDialogOpen(false);
    setSelectedUser(null);
    setAdjustAmount("");
    setAdjustReason("");
  };

  const openAdjustDialog = (userId: string) => {
    setSelectedUser(userId);
    setAdjustDialogOpen(true);
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Credits", "Status", "Position", "Join Date"];
    const rows = filteredUsers.map(u => [
      u.name,
      u.email,
      u.credits.toString(),
      u.status,
      u.position,
      u.joinDate,
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members-export.csv";
    a.click();
    toast.success("CSV exported successfully");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">Manage members and credits</p>
        </div>
        <Button onClick={exportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-3xl font-bold">{totalMembers}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-3xl font-bold text-success">{activeMembers}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">At Risk</p>
                  <p className="text-3xl font-bold text-warning">{atRiskMembers}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disabled</p>
                  <p className="text-3xl font-bold text-destructive">{disabledMembers}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Watchlist */}
      {atRiskMembers > 0 && (
        <Card className="glass-card border-warning/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Watchlist - At Risk Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {users
                .filter(u => u.credits < globalThreshold && u.credits >= 0)
                .map(u => (
                  <div 
                    key={u.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-warning/10 border border-warning/20"
                  >
                    <img
                      src={u.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${u.email}`}
                      alt={u.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-warning">{u.credits} credits</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Table */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle>Members</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="soft-disabled">Soft Disabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.position}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "font-bold font-display",
                        user.credits >= globalThreshold ? "text-success" :
                        user.credits >= 0 ? "text-warning" : "text-destructive"
                      )}>
                        {user.credits}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        user.status === "active" && "status-active",
                        user.status === "soft-disabled" && "status-soft-disabled",
                        user.status === "disabled" && "status-disabled"
                      )}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openAdjustDialog(user.id)}
                      >
                        Adjust Credits
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Adjust Credits Dialog */}
      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const current = parseInt(adjustAmount) || 0;
                    setAdjustAmount((current - 1).toString());
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="Enter amount (+/-)"
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const current = parseInt(adjustAmount) || 0;
                    setAdjustAmount((current + 1).toString());
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g., Event attendance, penalty, bonus..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdjustCredits}>
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
