import React, { createContext, useContext, useReducer, useEffect } from "react";
import { InventoryItem } from "@/services/inventoryService";
import { storage } from "@/utils/storage";

interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
}

type InventoryAction =
  | { type: "SET_ITEMS"; payload: InventoryItem[] }
  | { type: "ADD_ITEM"; payload: InventoryItem }
  | { type: "UPDATE_ITEM"; payload: InventoryItem }
  | { type: "DELETE_ITEM"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string };

const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
};

const inventoryReducer = (
  state: InventoryState,
  action: InventoryAction
): InventoryState => {
  let newItems;
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload };
    case "ADD_ITEM":
      newItems = [...state.items, action.payload];
      storage.set("inventory_items", newItems);
      return { ...state, items: newItems };
    case "UPDATE_ITEM":
      newItems = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
      storage.set("inventory_items", newItems);
      return { ...state, items: newItems };
    case "DELETE_ITEM":
      newItems = state.items.filter((item) => item.id !== action.payload);
      storage.set("inventory_items", newItems);
      return { ...state, items: newItems };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const InventoryContext = createContext<
  | {
      state: InventoryState;
      dispatch: React.Dispatch<InventoryAction>;
    }
  | undefined
>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  // Load inventory from localStorage on mount
  useEffect(() => {
    const storedItems = storage.get<InventoryItem[]>("inventory_items");
    if (storedItems) {
      dispatch({ type: "SET_ITEMS", payload: storedItems });
    }
  }, []);

  return (
    <InventoryContext.Provider value={{ state, dispatch }}>
      {children}
    </InventoryContext.Provider>
  );
};
