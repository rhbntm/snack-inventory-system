import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddItemForm from "./AddItemForm";
import ProductCard from "./ProductCard";
import SaleRecorder from "./SaleRecorder";
import LowStockAlerts from "./LowStockAlerts";
import DeleteConfirmModal from "./DeleteConfirmModal";
import QuantityModal from "./QuantityModal";
import { InventoryContext } from "@/contexts/InventoryContext";
import { InventoryItem } from "@/services/inventoryService";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart } from "lucide-react";
import { storage } from "@/utils/storage";
import { SalesData } from "@/services/analyticsService";

const Inventory = () => {
  const { state, dispatch } = React.useContext(InventoryContext);
  const { items } = state;
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // State for modals
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [isSellItemOpen, setIsSellItemOpen] = useState(false);
  const [itemToSell, setItemToSell] = useState<InventoryItem | null>(null);
  const [isBuyStockOpen, setIsBuyStockOpen] = useState(false);
  const [itemToBuyStock, setItemToBuyStock] = useState<InventoryItem | null>(
    null
  );
  const [isSaleRecorderOpen, setIsSaleRecorderOpen] = useState(false);

  const handleAddItem = (item: InventoryItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    setIsAddItemOpen(false);
  };

  const handleEdit = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setItemToEdit(item);
    setIsEditItemOpen(true);
  };

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    dispatch({ type: "UPDATE_ITEM", payload: updatedItem });
    setIsEditItemOpen(false);
    setItemToEdit(null);
  };

  const handleDelete = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch({ type: "DELETE_ITEM", payload: itemToDelete.id });
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSell = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setItemToSell(item);
    setIsSellItemOpen(true);
  };

  const handleRecordSale = (quantity: number) => {
    if (itemToSell && quantity > 0 && quantity <= itemToSell.quantity) {
      const updatedItem = {
        ...itemToSell,
        quantity: itemToSell.quantity - quantity,
      };
      dispatch({ type: "UPDATE_ITEM", payload: updatedItem });

      // Record the sale details
      const currentSales = storage.get<SalesData[]>("sales_data") || [];
      const newSale: SalesData = {
        id: Date.now().toString(), // Simple unique ID
        itemId: itemToSell.id,
        quantity: quantity,
        price: itemToSell.price, // Use item's price at the time of sale
        timestamp: new Date().toISOString(),
        category: itemToSell.category || "Other", // Include category
      };
      const updatedSales = [...currentSales, newSale];
      storage.set("sales_data", updatedSales);

      // Dispatch custom event for dashboard update
      window.dispatchEvent(new Event("salesUpdated"));
    }
    setIsSellItemOpen(false);
    setItemToSell(null);
  };

  const handleBuyStock = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setItemToBuyStock(item);
    setIsBuyStockOpen(true);
  };

  const handleAddStock = (quantity: number) => {
    if (itemToBuyStock && quantity > 0) {
      const updatedItem = {
        ...itemToBuyStock,
        quantity: itemToBuyStock.quantity + quantity,
      };
      dispatch({ type: "UPDATE_ITEM", payload: updatedItem });
    }
    setIsBuyStockOpen(false);
    setItemToBuyStock(null);
  };

  // Handler specifically for reordering from Low Stock Alerts
  const handleReorderFromAlerts = (itemId: string, quantity: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return; // Should not happen if alerts show items from state
    // Set item and open the Buy Stock modal, pre-filling quantity
    setItemToBuyStock({ ...item, quantity: quantity }); // Set quantity for pre-filling
    setIsBuyStockOpen(true);
  };

  // Handler for multi-item sales from SaleRecorder
  const handleMultiItemSale = (
    cartItems: Array<{
      itemId: string;
      name: string;
      quantity: number;
      price: number;
      affectedIngredients: Array<{
        id: string;
        name: string;
        quantityReduced: number;
      }>;
    }>
  ) => {
    // Update inventory quantities
    cartItems.forEach((cartItem) => {
      const item = items.find((i) => i.id === cartItem.itemId);
      if (item && cartItem.quantity > 0 && cartItem.quantity <= item.quantity) {
        const updatedItem = {
          ...item,
          quantity: item.quantity - cartItem.quantity,
        };
        dispatch({ type: "UPDATE_ITEM", payload: updatedItem });
      }
    });

    // Record sales data
    const currentSales = storage.get<SalesData[]>("sales_data") || [];
    const newSales: SalesData[] = cartItems.map((cartItem) => ({
      id: Date.now().toString() + "-" + cartItem.itemId, // Ensure unique ID
      itemId: cartItem.itemId,
      quantity: cartItem.quantity,
      price: cartItem.price,
      timestamp: new Date().toISOString(),
      category:
        items.find((i) => i.id === cartItem.itemId)?.category || "Other",
    }));
    const updatedSales = [...currentSales, ...newSales];
    storage.set("sales_data", updatedSales);

    // Dispatch custom event for dashboard update
    window.dispatchEvent(new Event("salesUpdated"));

    setIsSaleRecorderOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="sales">Record Sale</TabsTrigger>
          <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Current Inventory</CardTitle>
              <Button
                onClick={() => setIsAddItemOpen(true)}
                size="sm"
                className="h-8 gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Item</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onRecordSale={() => handleSell(item.id)}
                    onEdit={() => handleEdit(item.id)}
                    onDelete={() => handleDelete(item.id)}
                    onBuyStock={() => handleBuyStock(item.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Record Sale</CardTitle>
              <Button
                onClick={() => setIsSaleRecorderOpen(true)}
                size="sm"
                className="h-8 gap-1"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>New Sale</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Click "New Sale" to start recording a transaction
              </div>
              <SaleRecorder
                open={isSaleRecorderOpen}
                onOpenChange={setIsSaleRecorderOpen}
                onSaleComplete={handleMultiItemSale}
                inventoryItems={items}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <LowStockAlerts onReorder={handleReorderFromAlerts} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddItemForm
        isOpen={isAddItemOpen || isEditItemOpen}
        onClose={() => {
          setIsAddItemOpen(false);
          setIsEditItemOpen(false);
          setItemToEdit(null);
        }}
        onAddItem={itemToEdit ? handleUpdateItem : handleAddItem}
        itemToEdit={itemToEdit}
        isEditing={!!itemToEdit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name || ""}
      />

      <QuantityModal
        isOpen={isSellItemOpen}
        onClose={() => {
          setIsSellItemOpen(false);
          setItemToSell(null);
        }}
        onConfirm={handleRecordSale}
        item={itemToSell}
        action="sell"
      />

      <QuantityModal
        isOpen={isBuyStockOpen}
        onClose={() => {
          setIsBuyStockOpen(false);
          setItemToBuyStock(null);
        }}
        onConfirm={handleAddStock}
        item={itemToBuyStock}
        action="buy"
      />
    </div>
  );
};

export default Inventory;
