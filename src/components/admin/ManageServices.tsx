import { useState } from "react";
import { useServices, useCreateService, useUpdateService, formatPrice } from "@/hooks/useServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ManageServices = () => {
  const { data: services, isLoading } = useServices(false);
  const createService = useCreateService();
  const updateService = useUpdateService();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "men" as "men" | "women", cash_price: "", card_price: "" });

  const handleAdd = async () => {
    if (!form.name || !form.cash_price || !form.card_price) return;
    try {
      await createService.mutateAsync({
        name: form.name,
        category: form.category,
        cash_price: Math.round(parseFloat(form.cash_price) * 100),
        card_price: Math.round(parseFloat(form.card_price) * 100),
        duration_minutes: 60,
        is_active: true,
      });
      toast({ title: "Service added" });
      setForm({ name: "", category: "men", cash_price: "", card_price: "" });
      setShowAdd(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await updateService.mutateAsync({ id, is_active: !current });
      toast({ title: current ? "Service deactivated" : "Service activated" });
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
        <h3 className="font-heading text-xl text-foreground">Services ({services?.length ?? 0})</h3>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)} className="gold-gradient text-background">
          <Plus className="w-4 h-4 mr-1" /> Add Service
        </Button>
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <Input placeholder="Service name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div className="flex gap-2">
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value as "men" | "women" })}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
            <Input placeholder="Cash $" type="number" value={form.cash_price} onChange={e => setForm({ ...form, cash_price: e.target.value })} />
            <Input placeholder="Card $" type="number" value={form.card_price} onChange={e => setForm({ ...form, card_price: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={createService.isPending}>
              <Check className="w-4 h-4 mr-1" /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {["men", "women"].map(cat => {
          const catServices = services?.filter(s => s.category === cat) ?? [];
          if (!catServices.length) return null;
          return (
            <div key={cat}>
              <h4 className="font-heading text-sm text-primary uppercase tracking-wider mb-2 mt-4">
                {cat === "men" ? "Men's" : "Women's"} Services
              </h4>
              {catServices.map(s => (
                <div
                  key={s.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    s.is_active ? "border-border bg-card" : "border-border/50 bg-card/50 opacity-60"
                  }`}
                >
                  <div>
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                    <span className="text-xs text-muted-foreground ml-3">
                      Cash: {formatPrice(s.cash_price)} | Card: {formatPrice(s.card_price)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={s.is_active ? "outline" : "default"}
                    onClick={() => toggleActive(s.id, s.is_active)}
                    className="text-xs h-7"
                  >
                    {s.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageServices;
