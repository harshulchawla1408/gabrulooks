import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBarber } from "@/hooks/useBarbers";
import { toast } from "@/hooks/use-toast";
import { Save, User } from "lucide-react";
import type { DbBarber } from "@/types/booking";

interface BarberProfileProps {
  barber: DbBarber;
}

const BarberProfile = ({ barber }: BarberProfileProps) => {
  const updateBarber = useUpdateBarber();
  const [form, setForm] = useState({
    display_name: "",
    specialty: "",
    bio: "",
    experience: "",
    photo_url: "",
  });

  useEffect(() => {
    setForm({
      display_name: barber.display_name || "",
      specialty: barber.specialty || "",
      bio: (barber as any).bio || "",
      experience: (barber as any).experience || "",
      photo_url: (barber as any).photo_url || "",
    });
  }, [barber]);

  const handleSave = async () => {
    try {
      await updateBarber.mutateAsync({
        id: barber.id,
        display_name: form.display_name,
        specialty: form.specialty || null,
        bio: form.bio || null,
        experience: form.experience || null,
        photo_url: form.photo_url || null,
      } as any);
      toast({ title: "Profile updated!" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">Update your professional profile visible to customers.</p>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/30">
          {form.photo_url ? (
            <img src={form.photo_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <Input
            placeholder="Photo URL (optional)"
            value={form.photo_url}
            onChange={e => setForm({ ...form, photo_url: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Display Name</label>
          <Input value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Specialty</label>
          <Input placeholder="e.g. Fades, Beard Styling" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} />
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Experience</label>
        <Input placeholder="e.g. 5 years" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
        <Textarea
          placeholder="Tell customers about yourself..."
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
          rows={4}
        />
      </div>

      <Button onClick={handleSave} disabled={updateBarber.isPending} className="gold-gradient text-background font-semibold">
        <Save className="w-4 h-4 mr-1" /> Save Profile
      </Button>
    </div>
  );
};

export default BarberProfile;
