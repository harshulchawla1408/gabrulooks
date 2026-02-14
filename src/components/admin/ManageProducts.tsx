import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const empty = { name: "", description: "", price_cents: 0, category: "", image_url: "", is_active: true, stock: 0 };

const ManageProducts = () => {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(empty);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || "", price_cents: p.price_cents, category: p.category, image_url: p.image_url || "", is_active: p.is_active, stock: p.stock });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.category || form.price_cents <= 0) {
      toast.error("Name, category and price are required");
      return;
    }
    try {
      if (editing) {
        await updateProduct.mutateAsync({ id: editing.id, ...form, description: form.description || null, image_url: form.image_url || null });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync({ ...form, description: form.description || null, image_url: form.image_url || null });
        toast.success("Product created");
      }
      setOpen(false);
    } catch { toast.error("Failed to save product"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch { toast.error("Failed to delete"); }
  };

  if (isLoading) return <p className="text-muted-foreground">Loading products…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl text-foreground">Products</h2>
        <Button size="sm" className="gold-gradient text-background" onClick={openNew}>
          <Plus className="w-4 h-4 mr-1" /> Add Product
        </Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>${(p.price_cents / 100).toFixed(2)}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>{p.is_active ? "✓" : "✗"}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!products?.length && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No products yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? "Edit Product" : "New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Styling, Beard Care" /></div>
            <div><Label>Price ($)</Label><Input type="number" step="0.01" value={(form.price_cents / 100).toFixed(2)} onChange={e => setForm(f => ({ ...f, price_cents: Math.round(parseFloat(e.target.value || "0") * 100) }))} /></div>
            <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value || "0") }))} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." /></div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
              <Label>Active</Label>
            </div>
            <Button className="w-full gold-gradient text-background font-semibold" onClick={handleSave}>
              {editing ? "Update" : "Create"} Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProducts;
