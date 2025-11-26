import React, { useState, useEffect } from "react";
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
import { InventoryItem } from "@/services/inventoryService";
import { formatCurrency } from "@/utils/formatters";

interface QuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  item: InventoryItem | null;
  action: "sell" | "buy";
}

const QuantityModal: React.FC<QuantityModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  action,
}) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Reset quantity when item or action changes or modal opens
    setQuantity(1);
  }, [item, action, isOpen]);

  const handleConfirm = () => {
    if (item && quantity > 0) {
      onConfirm(quantity);
      onClose();
    }
  };

  const title = action === "sell" ? "Record Sale" : "Buy Stock";
  const buttonText = action === "sell" ? "Sell" : "Add Stock";
  const labelText = `Quantity to ${action}:`;

  const calculatedAmount = item
    ? action === "sell"
      ? item.price * quantity
      : item.cost * quantity
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {title} - {item?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="quantity" className="text-right">
              {labelText}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              className="col-span-3"
              required
            />
          </div>
          {item && (
            <div className="flex justify-between text-sm text-gray-700">
              <span>
                {action === "sell" ? "Estimated Revenue:" : "Estimated Cost:"}
              </span>
              <span>{formatCurrency(calculatedAmount)}</span>
            </div>
          )}
          {action === "sell" && item && quantity > item.quantity && (
            <p className="text-red-500 text-sm">
              Error: Not enough stock. Available: {item.quantity}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={action === "sell" && item && quantity > item.quantity}
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuantityModal;
