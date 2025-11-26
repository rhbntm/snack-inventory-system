import React, { memo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Minus,
  DollarSign,
  AlertTriangle,
  Edit,
  Trash2,
} from "lucide-react";
import { InventoryItem } from "@/services/inventoryService";
import { formatCurrency } from "@/utils/formatters";

interface ProductCardProps {
  id?: string;
  name?: string;
  image?: string;
  quantity?: number;
  threshold?: number;
  cost?: number;
  price?: number;
  onRecordSale?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBuyStock?: (id: string) => void;
  item?: InventoryItem;
}

const ProductCard = memo(
  ({
    id = "1",
    name = "Hot Dog",
    image = "https://images.unsplash.com/photo-1612392062631-94ad38db0284?w=300&q=80",
    quantity = 24,
    threshold = 10,
    cost = 0.75,
    price = 2.5,
    onRecordSale = () => {},
    onEdit = () => {},
    onDelete = () => {},
    onBuyStock = () => {},
    item,
  }: ProductCardProps) => {
    // If item prop is provided, use its properties instead of individual props
    const itemId = item?.id || id;
    const itemName = item?.name || name;
    const itemImage = item?.image || image;
    const itemQuantity = item?.quantity ?? quantity;
    const itemThreshold = item?.threshold ?? threshold;
    const itemCost = item?.cost ?? cost;
    const itemPrice = item?.price ?? price;
    // Determine stock level status
    const getStockStatus = () => {
      if (itemQuantity <= itemThreshold / 2) return "low";
      if (itemQuantity <= itemThreshold) return "medium";
      return "good";
    };

    const stockStatus = getStockStatus();

    // Map stock status to colors
    const statusColors = {
      low: "bg-red-100 border-red-300 text-red-700",
      medium: "bg-yellow-100 border-yellow-300 text-yellow-700",
      good: "bg-green-100 border-green-300 text-green-700",
    };

    const statusBadgeVariant = {
      low: "destructive",
      medium: "secondary",
      good: "default",
    };

    return (
      <Card className="w-full max-w-[300px] overflow-hidden bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="relative">
          <img
            src={itemImage}
            alt={itemName}
            className="w-full h-32 object-cover"
          />
          {stockStatus === "low" && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Low Stock
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{itemName}</h3>
            <div className="flex items-center text-sm font-medium text-gray-700">
              {formatCurrency(itemPrice)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">In Stock:</span>
              <span
                className={`text-sm font-medium ${
                  stockStatus === "low" ? "text-red-600" : "text-gray-700"
                }`}
              >
                {itemQuantity} units
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Reorder At:</span>
              <span className="text-sm text-gray-700">
                {itemThreshold} units
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Unit Cost:</span>
              <span className="text-sm text-gray-700">
                {formatCurrency(itemCost)}
              </span>
            </div>

            <div
              className={`mt-3 p-2 rounded-md border ${statusColors[stockStatus]}`}
            >
              <div className="text-xs font-medium text-center">
                {stockStatus === "low"
                  ? "Low stock - reorder soon!"
                  : stockStatus === "medium"
                  ? "Stock getting low"
                  : "Stock level good"}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 flex items-center justify-center gap-1"
            onClick={() => onRecordSale(itemId)}
          >
            <Minus className="h-4 w-4" />
            Sell
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 flex items-center justify-center gap-1"
            onClick={() => onBuyStock(itemId)}
          >
            <Plus className="h-4 w-4" />
            Buy Stock
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 flex items-center justify-center gap-1"
            onClick={() => onEdit(itemId)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 flex items-center justify-center gap-1"
            onClick={() => onDelete(itemId)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

export default ProductCard;
