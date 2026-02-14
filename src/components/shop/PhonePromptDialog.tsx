import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhonePromptDialogProps {
  open: boolean;
  userId: string;
  onSaved: (phone: string) => void;
  onCancel: () => void;
}

const PhonePromptDialog = ({ open, userId, onSaved, onCancel }: PhonePromptDialogProps) => {
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const cleaned = phone.trim();
    if (!cleaned || cleaned.length < 8) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ phone: cleaned })
        .eq("user_id", userId);
      if (error) throw error;
      toast.success("Mobile number saved!");
      onSaved(cleaned);
    } catch {
      toast.error("Failed to save mobile number");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" /> Mobile Number Required
          </DialogTitle>
          <DialogDescription>
            We need your mobile number to contact you about your order or booking. Please enter your Australian mobile number.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label htmlFor="phone">Mobile Number</Label>
            <Input
              id="phone"
              placeholder="+61 4XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onCancel} className="border-primary/30">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gold-gradient text-background font-semibold">
              {saving ? "Saving…" : "Save & Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhonePromptDialog;
