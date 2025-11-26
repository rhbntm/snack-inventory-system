// import { supabase } from "@/lib/supabase";
import { storage } from '@/utils/storage';

export interface InventoryItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  threshold: number;
  cost: number;
  price: number;
  category: string;
}

// Get all inventory items
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    // First try to get from localStorage
    const cachedItems = storage.get<InventoryItem[]>('inventory_items');
    
    if (cachedItems) {
      return cachedItems;
    }

    // If no cached data, use mock data and cache it
    const mockItems = getMockInventoryItems();
    storage.set('inventory_items', mockItems);
    return mockItems;
  } catch (error) {
    console.error("Failed to fetch inventory items:", error);
    return getMockInventoryItems();
  }
};

// Get a single inventory item by ID
export const getInventoryItemById = async (
  id: string,
): Promise<InventoryItem | undefined> => {
  try {
    // Temporarily disabled Supabase connection
    // const { data, error } = await supabase
    //   .from("inventory_items")
    //   .select("*")
    //   .eq("id", id)
    //   .single();

    // if (error) {
    //   console.error(`Error fetching inventory item ${id}:`, error);
    //   throw error;
    // }

    // return data;

    // Using mock data until Supabase is properly configured
    return getMockInventoryItems().find((item) => item.id === id);
  } catch (error) {
    console.error(`Failed to fetch inventory item ${id}:`, error);
    // Return mock item as fallback
    return getMockInventoryItems().find((item) => item.id === id);
  }
};

// Create a new inventory item
export const createInventoryItem = async (
  item: Omit<InventoryItem, "id">,
): Promise<InventoryItem> => {
  try {
    const newItem = {
      ...item,
      id: Date.now().toString(),
    };
    
    // Get current items from storage
    const currentItems = storage.get<InventoryItem[]>('inventory_items') || [];
    
    // Add new item and save to storage
    const updatedItems = [...currentItems, newItem];
    storage.set('inventory_items', updatedItems);
    
    return newItem;
  } catch (error) {
    console.error("Failed to create inventory item:", error);
    throw error;
  }
};

// Update an existing inventory item
export const updateInventoryItem = async (
  item: InventoryItem,
): Promise<InventoryItem> => {
  try {
    // Get current items from storage
    const currentItems = storage.get<InventoryItem[]>('inventory_items') || [];
    
    // Update the item
    const updatedItems = currentItems.map(currentItem =>
      currentItem.id === item.id ? item : currentItem
    );
    
    // Save to storage
    storage.set('inventory_items', updatedItems);
    
    return item;
  } catch (error) {
    console.error(`Failed to update inventory item ${item.id}:`, error);
    throw error;
  }
};

// Delete an inventory item
export const deleteInventoryItem = async (id: string): Promise<boolean> => {
  try {
    // Get current items from storage
    const currentItems = storage.get<InventoryItem[]>('inventory_items') || [];
    
    // Remove the item
    const updatedItems = currentItems.filter(item => item.id !== id);
    
    // Save to storage
    storage.set('inventory_items', updatedItems);
    
    return true;
  } catch (error) {
    console.error(`Failed to delete inventory item ${id}:`, error);
    return false;
  }
};

// Update inventory quantity
export const updateInventoryQuantity = async (
  id: string,
  quantityChange: number,
): Promise<InventoryItem | undefined> => {
  try {
    // Get current items from storage
    const currentItems = storage.get<InventoryItem[]>('inventory_items') || [];
    const item = currentItems.find(item => item.id === id);
    
    if (item) {
      // Update quantity
      const updatedItem = {
        ...item,
        quantity: Math.max(0, item.quantity + quantityChange)
      };
      
      // Update storage
      const updatedItems = currentItems.map(currentItem =>
        currentItem.id === id ? updatedItem : currentItem
      );
      storage.set('inventory_items', updatedItems);
      
      return updatedItem;
    }
    return undefined;
  } catch (error) {
    console.error(`Failed to update inventory quantity for item ${id}:`, error);
    return undefined;
  }
};

// Mock data for fallback when database is not available
const getMockInventoryItems = (): InventoryItem[] => [
  {
    id: "1",
    name: "Hotdogs",
    image:
      "https://images.unsplash.com/photo-1612392062631-94ad38db0284?w=400&q=80",
    quantity: 45,
    threshold: 20,
    cost: 0.75,
    price: 2.5,
    category: "food",
  },
  {
    id: "2",
    name: "Buns",
    image:
      "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400&q=80",
    quantity: 38,
    threshold: 25,
    cost: 0.3,
    price: 0,
    category: "ingredient",
  },
  {
    id: "3",
    name: "Potatoes",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80",
    quantity: 15,
    threshold: 20,
    cost: 0.2,
    price: 0,
    category: "ingredient",
  },
  {
    id: "4",
    name: "Ketchup",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80",
    quantity: 8,
    threshold: 10,
    cost: 1.5,
    price: 0,
    category: "condiment",
  },
  {
    id: "5",
    name: "French Fries",
    image:
      "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80",
    quantity: 30,
    threshold: 15,
    cost: 0.5,
    price: 1.75,
    category: "food",
  },
  {
    id: "6",
    name: "Mustard",
    image:
      "https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&q=80",
    quantity: 12,
    threshold: 10,
    cost: 1.25,
    price: 0,
    category: "condiment",
  },
  {
    id: "7",
    name: "Onions",
    image:
      "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400&q=80",
    quantity: 18,
    threshold: 15,
    cost: 0.15,
    price: 0,
    category: "ingredient",
  },
  {
    id: "8",
    name: "Napkins",
    image:
      "https://images.unsplash.com/photo-1563950708942-db5d9dcca7a7?w=400&q=80",
    quantity: 150,
    threshold: 50,
    cost: 0.02,
    price: 0,
    category: "supply",
  },
];
