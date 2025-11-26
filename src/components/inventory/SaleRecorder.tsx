import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MinusCircle, PlusCircle, ShoppingCart, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  image: string;
  price: number;
  ingredients?: {
    id: string;
    name: string;
    quantityUsed: number;
  }[];
}

interface CartItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  affectedIngredients: {
    id: string;
    name: string;
    quantityReduced: number;
  }[];
}

interface SaleRecorderProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaleComplete?: (saleData: CartItem[]) => void;
  inventoryItems?: InventoryItem[];
  item?: InventoryItem;
}

const SaleRecorder = ({
  open = false,
  onOpenChange,
  onSaleComplete,
  item,
  inventoryItems = [],
}: SaleRecorderProps) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(item?.id || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const selectedItem = inventoryItems.find(
    (item) => item.id === selectedItemId
  );

  const affectedIngredients =
    selectedItem?.ingredients?.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      quantityReduced: ingredient.quantityUsed * quantity,
    })) || [];

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (selectedItem?.quantity || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (selectedItemId && quantity > 0 && selectedItem) {
      const newCartItem: CartItem = {
        itemId: selectedItemId,
        name: selectedItem.name,
        quantity,
        price: selectedItem.price,
        affectedIngredients,
      };
      setCart([...cart, newCartItem]);
      setSelectedItemId("");
      setQuantity(1);
    }
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (cart.length > 0) {
      setShowSummary(true);
    }
  };

  const handleConfirmSale = () => {
    if (onSaleComplete && cart.length > 0) {
      onSaleComplete(cart);
    }
    resetForm();
  };

  const resetForm = () => {
    setSelectedItemId("");
    setQuantity(1);
    setShowSummary(false);
    setCart([]);
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const insufficientStock = selectedItem && quantity > selectedItem.quantity;
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Record Sale
          </DialogTitle>
          <DialogDescription>
            Record a sale and automatically update inventory levels.
          </DialogDescription>
        </DialogHeader>

        {!showSummary ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right">
                Product
              </Label>
              <div className="col-span-3">
                <Select
                  value={selectedItemId}
                  onValueChange={setSelectedItemId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.quantity} in stock)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedItem && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                    min={1}
                    max={selectedItem.quantity}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= selectedItem.quantity}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(selectedItem.price * quantity)}
                  </span>
                </div>
              </div>
            )}

            {insufficientStock && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>
                  Not enough stock available. Only {selectedItem.quantity} items
                  in inventory.
                </AlertDescription>
              </Alert>
            )}

            {selectedItem && (
              <div className="col-span-4 flex justify-end">
                <Button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={insufficientStock}
                >
                  Add to Cart
                </Button>
              </div>
            )}

            {cart.length > 0 && (
              <div className="col-span-4 mt-4">
                <h3 className="font-medium mb-2">Current Cart</h3>
                <div className="space-y-2">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted p-2 rounded-md"
                    >
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFromCart(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <h3 className="font-medium">Sale Summary</h3>

            <div className="bg-muted p-4 rounded-md space-y-2">
              {cart.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">
                      x{item.quantity} ={" "}
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground pl-4">
                    {item.affectedIngredients.map((ingredient) => (
                      <div key={ingredient.id} className="flex justify-between">
                        <span>{ingredient.name}:</span>
                        <span>
                          -{ingredient.quantityReduced.toFixed(2)} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-border">
                <span>Total Amount:</span>
                <span className="font-bold">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!showSummary ? (
            <Button
              type="button"
              onClick={handleContinue}
              disabled={cart.length === 0}
            >
              Continue
            </Button>
          ) : (
            <div className="flex gap-2 w-full justify-end">
              <Button variant="outline" onClick={() => setShowSummary(false)}>
                Back
              </Button>
              <Button type="button" onClick={handleConfirmSale}>
                Confirm Sale
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaleRecorder;
