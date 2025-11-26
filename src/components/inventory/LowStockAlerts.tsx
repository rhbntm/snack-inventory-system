import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InventoryContext } from "@/contexts/InventoryContext";

interface LowStockItem {
  id: string;
  name: string;
  currentQuantity: number;
  reorderThreshold: number;
  image?: string;
}

interface LowStockAlertsProps {
  onReorder?: (itemId: string, quantity: number) => void;
}

const LowStockAlerts = ({ onReorder = () => {} }: LowStockAlertsProps) => {
  const { state } = React.useContext(InventoryContext);
  const { items } = state;

  const lowStockItems: LowStockItem[] = items
    .filter((item) => item.quantity <= item.threshold)
    .map((item) => ({
      id: item.id,
      name: item.name,
      currentQuantity: item.quantity,
      reorderThreshold: item.threshold,
      image: item.image,
    }));

  const [isOpen, setIsOpen] = useState(true);

  const handleReorderClick = (itemId: string, suggestedQuantity: number) => {
    onReorder(itemId, suggestedQuantity);
  };

  if (lowStockItems.length === 0) {
    return null; // Don't render if no low stock items
  }

  return (
    <Card className="w-full bg-white shadow-md">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg font-semibold">
                Low Stock Alerts
              </CardTitle>
              <Badge variant="destructive" className="ml-2">
                {lowStockItems.length}
              </Badge>
            </div>
            {isOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <ScrollArea className="h-[320px]">
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-2 bg-red-50 rounded-md border border-red-100"
                  >
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-red-600">
                          {item.currentQuantity} / {item.reorderThreshold} units
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-1 text-xs whitespace-nowrap"
                        onClick={() =>
                          handleReorderClick(
                            item.id,
                            Math.max(
                              1,
                              item.reorderThreshold - item.currentQuantity
                            )
                          )
                        }
                      >
                        <ShoppingCart className="h-3 w-3" />
                        <span>Order Stock</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default LowStockAlerts;
