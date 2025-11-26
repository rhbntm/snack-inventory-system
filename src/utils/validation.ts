import { z } from 'zod';

export const inventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  threshold: z.number().min(0, 'Threshold must be positive'),
  cost: z.number().min(0, 'Cost must be positive'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
});

export const validateInventoryItem = (data: unknown) => {
  return inventoryItemSchema.safeParse(data);
};
