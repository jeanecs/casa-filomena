"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Villa } from "../../prisma/data/villas";

export function VillaManager() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [editingVilla, setEditingVilla] = useState<Villa | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const emptyVilla: Omit<Villa, "id"> = {
    name: "",
    description: "",
    image: "",
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    amenities: [],
  };

  const [formData, setFormData] = useState<Omit<Villa, "id">>(emptyVilla);
  const [uploading, setUploading] = useState(false);

  // Fetch villas from DB on load
  useEffect(() => {
    fetch("/admin/api/villas")
      .then((res) => res.json())
      .then(setVillas)
      .catch(() => toast.error("Failed to load villas"));
  }, []);

  const handleEdit = (villa: Villa) => {
    setEditingVilla(villa);
    setFormData(villa);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingVilla) {
        // Update existing villa
        const res = await fetch(`/admin/api/villas/${editingVilla.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const updated = await res.json();
        setVillas(villas.map((v) => (v.id === updated.id ? updated : v)));
        toast.success("Villa updated successfully");
      } else {
        // Add new villa
        const res = await fetch("/admin/api/villas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const newVilla = await res.json();
        setVillas([...villas, newVilla]);
        toast.success("Villa added successfully");
      }

      setEditingVilla(null);
      setIsAddingNew(false);
      setFormData(emptyVilla);
    } catch {
      toast.error("Error saving villa");
    }
  };

  const handleDelete = async (villaId: number) => {
    try {
      await fetch(`/admin/api/villas/${villaId}`, { method: "DELETE" });
      setVillas(villas.filter((v) => v.id !== villaId));
      toast.success("Villa deleted successfully");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete villa");
    }
  };

  const handleCancel = () => {
    setEditingVilla(null);
    setIsAddingNew(false);
    setFormData(emptyVilla);
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()],
      });
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
    });
  };

  const isEditing = editingVilla || isAddingNew;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Villa Management</h3>
          <p className="text-gray-600">Add, edit, and manage your resort villas</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Villa</span>
        </Button>
      </div>

      {/* Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVilla ? "Edit Villa" : "Add New Villa"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Villa Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter villa name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter villa description"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  <div className="flex items-center gap-3">
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="Enter image URL or upload"
                    />
                    <label className="px-3 py-2 border rounded cursor-pointer bg-gray-50 hover:bg-gray-100 text-sm">
                      {uploading ? "Uploading..." : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            setUploading(true);
                            const fd = new FormData();
                            fd.append("file", file);
                            const res = await fetch("/admin/api/upload", { method: "POST", body: fd });
                            if (!res.ok) throw new Error("Upload failed");
                            const data = await res.json();
                            if (data?.url) {
                              setFormData({ ...formData, image: data.url });
                              toast.success("Image uploaded");
                            } else {
                              toast.error("Invalid upload response");
                            }
                          } catch (err) {
                            console.error(err);
                            toast.error("Failed to upload image");
                          } finally {
                            setUploading(false);
                            // reset input so same file can be reselected
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Guests</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amenities</label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Add amenity"
                      onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                    />
                    <Button type="button" onClick={addAmenity} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="flex items-center space-x-1">
                        <span>{amenity}</span>
                        <button onClick={() => removeAmenity(amenity)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {formData.image && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Preview</label>
                    <ImageWithFallback
                      src={formData.image}
                      alt="Villa preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Villa</span>
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Villas list */}
      <div className="grid md:grid-cols-2 gap-6">
        {villas.map((villa) => (
          <Card key={villa.id} className="overflow-hidden">
            <div className="relative h-48">
              <ImageWithFallback src={villa.image} alt={villa.name} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-bold">{villa.name}</h4>
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(villa)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setDeleteConfirm(villa.id)}
                    className="bg-amber-700/20 hover:bg-amber-700/30 text-amber-700 border border-amber-700/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{villa.description}</p>
              <div className="text-sm text-gray-500 mb-2">
                {villa.bedrooms} bed • {villa.bathrooms} bath • {villa.guests} guests
              </div>
              <div className="flex flex-wrap gap-1">
                {villa.amenities.slice(0, 3).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {villa.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{villa.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this villa? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => deleteConfirm !== null && handleDelete(deleteConfirm)}
              className="bg-amber-700 hover:bg-amber-800 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
