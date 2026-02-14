import { useState } from "react";
import { useBarbers, useCreateBarber, useUpdateBarber, useBarberServices, useAssignBarberServices } from "@/hooks/useBarbers";
import { useAllProfiles, useAllUserRoles } from "@/hooks/useProfiles";
import { useServices } from "@/hooks/useServices";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Check, X, Settings, User, UserPlus, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ManageBarbers = () => {
  const { data: barbers, isLoading } = useBarbers(false);
  const { data: services } = useServices();
  const { data: profiles } = useAllProfiles();
  const { data: roles, refetch: refetchRoles } = useAllUserRoles();
  const createBarber = useCreateBarber();
  const updateBarber = useUpdateBarber();
  const assignServices = useAssignBarberServices();
  const [showAdd, setShowAdd] = useState(false);
  const [managingId, setManagingId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [specialty, setSpecialty] = useState("");

  // Filter profiles to show only users with 'user' role (not already barber/admin)
  const barberUserIds = new Set(barbers?.map(b => b.user_id) ?? []);
  const eligibleUsers = profiles?.filter(p => {
    if (barberUserIds.has(p.user_id)) return false;
    const userRole = roles?.find(r => r.user_id === p.user_id);
    return !userRole || userRole.role === "user";
  }) ?? [];

  const handlePromote = async () => {
    if (!selectedUserId) return;
    const profile = profiles?.find(p => p.user_id === selectedUserId);
    if (!profile) return;

    try {
      // Remove existing role and insert barber role
      await supabase.from("user_roles").delete().eq("user_id", selectedUserId);
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: selectedUserId, role: "barber" });
      if (roleError) throw roleError;

      // Create barber record
      await createBarber.mutateAsync({
        user_id: selectedUserId,
        display_name: profile.full_name || profile.email || "New Barber",
        specialty: specialty || undefined,
      });

      toast({ title: "User promoted to barber!", description: `${profile.full_name} now has barber access.` });
      setSelectedUserId("");
      setSpecialty("");
      setShowAdd(false);
      refetchRoles();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await updateBarber.mutateAsync({ id, is_active: !current });
      toast({ title: current ? "Barber deactivated" : "Barber activated" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl text-foreground">Barbers ({barbers?.length ?? 0})</h3>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)} className="gold-gradient text-background">
          <UserPlus className="w-4 h-4 mr-1" /> Add Barber
        </Button>
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary" /> Promote a user to barber
          </p>

          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a user to promote..." />
            </SelectTrigger>
            <SelectContent>
              {eligibleUsers.length === 0 ? (
                <SelectItem value="__none" disabled>No eligible users found</SelectItem>
              ) : (
                eligibleUsers.map(p => (
                  <SelectItem key={p.user_id} value={p.user_id}>
                    {p.full_name || "Unnamed"} — {p.email || p.phone || "No contact"}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Input placeholder="Specialty (optional)" value={specialty} onChange={e => setSpecialty(e.target.value)} />

          <div className="flex gap-2">
            <Button size="sm" onClick={handlePromote} disabled={!selectedUserId || createBarber.isPending}>
              <Check className="w-4 h-4 mr-1" /> Promote to Barber
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {barbers?.map(b => (
          <div key={b.id}>
            <div className={`flex items-center justify-between p-4 rounded-xl border ${
              b.is_active ? "border-border bg-card" : "border-border/50 bg-card/50 opacity-60"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {(b as any).photo_url ? (
                    <img src={(b as any).photo_url} alt={b.display_name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">{b.display_name}</h4>
                  {b.specialty && <p className="text-xs text-muted-foreground">{b.specialty}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setManagingId(managingId === b.id ? null : b.id)} className="text-xs h-7">
                  <Settings className="w-3 h-3 mr-1" /> Services
                </Button>
                <Button
                  size="sm"
                  variant={b.is_active ? "outline" : "default"}
                  onClick={() => toggleActive(b.id, b.is_active)}
                  className="text-xs h-7"
                >
                  {b.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
            {managingId === b.id && <BarberServiceManager barberId={b.id} services={services ?? []} />}
          </div>
        ))}
      </div>
    </div>
  );
};

const BarberServiceManager = ({ barberId, services }: { barberId: string; services: any[] }) => {
  const { data: assigned, isLoading } = useBarberServices(barberId);
  const assignServices = useAssignBarberServices();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  if (isLoading) return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;

  if (!initialized && assigned) {
    const ids = new Set(assigned.map(a => a.service_id));
    if (ids.size > 0 || assigned.length === 0) {
      setTimeout(() => { setSelected(ids); setInitialized(true); }, 0);
    }
  }

  const toggle = (serviceId: string) => {
    const next = new Set(selected);
    if (next.has(serviceId)) next.delete(serviceId);
    else next.add(serviceId);
    setSelected(next);
  };

  const save = async () => {
    try {
      await assignServices.mutateAsync({ barberId, serviceIds: Array.from(selected) });
      toast({ title: "Services updated" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="mt-2 p-4 bg-card/50 border border-border rounded-xl space-y-3">
      <p className="text-xs text-muted-foreground font-medium">Assign services this barber can perform:</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {services.map(s => (
          <button
            key={s.id}
            onClick={() => toggle(s.id)}
            className={`text-left text-xs p-2 rounded-lg border transition-all ${
              selected.has(s.id)
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>
      <Button size="sm" onClick={save} disabled={assignServices.isPending}>
        <Check className="w-4 h-4 mr-1" /> Save Assignments
      </Button>
    </div>
  );
};

export default ManageBarbers;
