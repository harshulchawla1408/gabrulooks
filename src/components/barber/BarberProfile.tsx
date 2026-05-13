import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBarber } from "@/hooks/useBarbers";
import { toast } from "@/hooks/use-toast";
import { Save, User, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import type { DbBarber } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";

interface BarberProfileProps {
  barber: DbBarber;
}

const BarberProfile = ({ barber }: BarberProfileProps) => {
  const updateBarber = useUpdateBarber();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${barber.id}-${Math.random()}.${fileExt}`;
      const filePath = `barbers/${fileName}`;

      // Upload to Supabase Storage 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setForm({ ...form, photo_url: data.publicUrl });
      toast({ title: "Photo uploaded successfully! Don't forget to save." });
    } catch (error: any) {
      toast({ title: "Error uploading photo", description: error.message || "Please make sure 'avatars' storage bucket is created and public.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

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
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/30 relative group">
          {form.photo_url ? (
            <img src={form.photo_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-primary" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-xs text-muted-foreground block">Profile Photo</label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-2"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Choose Photo
            </Button>
            {form.photo_url && (
              <Button 
                type="button" 
                variant="ghost" 
                className="text-destructive hover:text-destructive/80"
                onClick={() => setForm({ ...form, photo_url: "" })}
              >
                Remove
              </Button>
            )}
          </div>
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
