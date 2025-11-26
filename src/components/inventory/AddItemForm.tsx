import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface AddItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: any) => void;
  itemToEdit?: {
    id: string | number;
    name: string;
    image: string;
    quantity: number;
    threshold: number;
    cost: number;
    price: number;
    category: string;
  };
  isEditing?: boolean;
}

const AddItemForm = ({
  isOpen,
  onClose,
  onAddItem,
  itemToEdit,
  isEditing = false,
}: AddItemFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80", // Default food image
    quantity: 0,
    threshold: 0,
    cost: 0,
    price: 0,
    category: "food",
  });

  // Initialize form with item data if editing
  React.useEffect(() => {
    if (itemToEdit && isEditing) {
      setFormData({
        name: itemToEdit.name,
        image: itemToEdit.image,
        quantity: itemToEdit.quantity,
        threshold: itemToEdit.threshold,
        cost: itemToEdit.cost,
        price: itemToEdit.price,
        category: itemToEdit.category,
      });
    }
  }, [itemToEdit, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "quantity" ||
        name === "threshold" ||
        name === "cost" ||
        name === "price"
          ? parseFloat(value) || 0
          : value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && itemToEdit) {
      // Update existing item
      const updatedItem = {
        ...formData,
        id: itemToEdit.id,
      };
      onAddItem(updatedItem);
    } else {
      // Create a new item with a unique ID
      const newItem = {
        ...formData,
        id: Date.now().toString(), // Use timestamp as a simple unique ID
      };
      onAddItem(newItem);
    }

    onClose();

    // Reset form
    setFormData({
      name: "",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
      quantity: 0,
      threshold: 0,
      cost: 0,
      price: 0,
      category: "food",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Inventory Item" : "Add New Inventory Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="threshold" className="text-right">
                Reorder At
              </Label>
              <Input
                id="threshold"
                name="threshold"
                type="number"
                min="0"
                value={formData.threshold}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
                Unit Cost (₱)
              </Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Sale Price (₱)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="ingredient">Ingredient</SelectItem>
                  <SelectItem value="condiment">Condiment</SelectItem>
                  <SelectItem value="supply">Supply</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemForm;
