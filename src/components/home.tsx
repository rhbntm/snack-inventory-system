import React, { useState, useEffect } from "react";
import { Search, Plus, Bell, User, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductCard from "./inventory/ProductCard";
import LowStockAlerts from "./inventory/LowStockAlerts";
import SaleRecorder from "./inventory/SaleRecorder";
import AddItemForm from "./inventory/AddItemForm";
import {
  InventoryItem,
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  updateInventoryQuantity,
} from "@/services/inventoryService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "./auth/UserMenu";

const Home = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showSaleRecorder, setShowSaleRecorder] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();

  // Fetch inventory items on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const items = await getInventoryItems();
        setInventoryItems(items);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        toast({
          title: "Error",
          description: "Failed to load inventory items. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [toast]);

  // Filter items based on search term and active category
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get low stock items
  const lowStockItems = inventoryItems
    .filter((item) => item.quantity < item.threshold)
    .map((item) => ({
      id: item.id,
      name: item.name,
      currentQuantity: item.quantity,
      reorderThreshold: item.threshold,
      image: item.image,
    }));

  // Handle adding new inventory
  const handleAddInventory = (itemId: string) => {
    setSelectedItem(inventoryItems.find((item) => item.id === itemId) || null);
    setShowAddItemForm(true);
    setIsEditing(false);
  };

  // Handle recording a sale
  const handleRecordSale = (itemId: string) => {
    setSelectedItem(inventoryItems.find((item) => item.id === itemId) || null);
    setShowSaleRecorder(true);
  };

  // Handle editing an item
  const handleEditItem = (itemId: string) => {
    const itemToEdit = inventoryItems.find((item) => item.id === itemId);
    if (itemToEdit) {
      setSelectedItem(itemToEdit);
      setIsEditing(true);
      setShowAddItemForm(true);
    }
  };

  // Handle deleting an item
  const handleDeleteItem = async (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const success = await deleteInventoryItem(itemId);
        if (success) {
          setInventoryItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId)
          );
          toast({
            title: "Success",
            description: "Item deleted successfully",
          });
        } else {
          throw new Error("Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        toast({
          title: "Error",
          description: "Failed to delete item. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle adding or updating an item
  const handleAddOrUpdateItem = async (item: any) => {
    try {
      if (isEditing) {
        // Update existing item
        const updatedItem = await updateInventoryItem(item);
        setInventoryItems((prevItems) =>
          prevItems.map((prevItem) =>
            prevItem.id === updatedItem.id ? updatedItem : prevItem
          )
        );
        toast({
          title: "Success",
          description: "Item updated successfully",
        });
      } else {
        // Create new item
        const newItem = await createInventoryItem(item);
        setInventoryItems((prevItems) => [...prevItems, newItem]);
        toast({
          title: "Success",
          description: "Item added successfully",
        });
      }
      setShowAddItemForm(false);
      setSelectedItem(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        title: "Error",
        description: "Failed to save item. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle sale completion
  const handleSaleComplete = async (saleData: {
    itemId: string;
    quantity: number;
    affectedIngredients: any[];
  }) => {
    try {
      // Update the inventory quantity (negative value for sales)
      const updatedItem = await updateInventoryQuantity(
        saleData.itemId,
        -saleData.quantity
      );

      if (updatedItem) {
        // Update the local state
        setInventoryItems((prevItems) =>
          prevItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          )
        );

        toast({
          title: "Sale Recorded",
          description: `Sold ${saleData.quantity} ${updatedItem.name}(s)`,
        });
      }

      setShowSaleRecorder(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error recording sale:", error);
      toast({
        title: "Error",
        description: "Failed to record sale. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle reordering low stock items
  const handleReorder = async (itemId: string, quantity: number) => {
    try {
      const updatedItem = await updateInventoryQuantity(itemId, quantity);
      if (updatedItem) {
        setInventoryItems((prevItems) =>
          prevItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          )
        );
        toast({
          title: "Reorder Successful",
          description: `Added ${quantity} ${updatedItem.name}(s) to inventory`,
        });
      }
    } catch (error) {
      console.error("Error reordering item:", error);
      toast({
        title: "Error",
        description: "Failed to reorder item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    // The ProtectedRoute will automatically redirect to login
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Snack Vendor Inventory</h1>
          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Main content area */}
          <div className="flex-1">
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => {
                    setSelectedItem(null);
                    setIsEditing(false);
                    setShowAddItemForm(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>
            </div>

            {/* Category tabs */}
            <Tabs
              defaultValue="all"
              className="mb-6"
              onValueChange={setActiveCategory}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="food">Food</TabsTrigger>
                <TabsTrigger value="ingredient">Ingredients</TabsTrigger>
                <TabsTrigger value="condiment">Condiments</TabsTrigger>
                <TabsTrigger value="supply">Supplies</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <p>Loading inventory items...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredItems.map((item) => (
                      <ProductCard
                        key={item.id}
                        item={item}
                        onRecordSale={handleRecordSale}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Other tab contents will show filtered results */}
              {["food", "ingredient", "condiment", "supply"].map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  {isLoading ? (
                    <div className="flex justify-center p-8">
                      <p>Loading inventory items...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredItems.map((item) => (
                        <ProductCard
                          key={item.id}
                          item={item}
                          onRecordSale={handleRecordSale}
                          onEdit={handleEditItem}
                          onDelete={handleDeleteItem}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            {/* Empty state */}
            {!isLoading && filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">
                  No inventory items found
                </p>
                <Button
                  onClick={() => {
                    setSelectedItem(null);
                    setIsEditing(false);
                    setShowAddItemForm(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add New Item
                </Button>
              </div>
            )}
          </div>

          {/* Low stock alerts sidebar */}
          <div className="w-full md:w-80 shrink-0 bg-white rounded-lg shadow">
            <LowStockAlerts items={lowStockItems} onReorder={handleReorder} />
          </div>
        </div>
      </main>

      {/* Sale recorder modal */}
      <SaleRecorder
        open={showSaleRecorder}
        onOpenChange={setShowSaleRecorder}
        onSaleComplete={handleSaleComplete}
        inventoryItems={selectedItem ? [selectedItem] : []}
      />

      {/* Add/Edit item form modal */}
      <AddItemForm
        isOpen={showAddItemForm}
        onClose={() => {
          setShowAddItemForm(false);
          setSelectedItem(null);
          setIsEditing(false);
        }}
        onAddItem={handleAddOrUpdateItem}
        itemToEdit={selectedItem || undefined}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Home;
