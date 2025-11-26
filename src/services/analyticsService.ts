import { storage } from '@/utils/storage';
import { InventoryItem } from './inventoryService';

// Types
export interface SalesData {
  id: string;
  itemId: string;
  quantity: number;
  price: number;
  timestamp: string;
  category: string;
}

export interface AnalyticsData {
  totalSales: number;
  totalRevenue: number;
  profitMargin: number;
  averageOrderValue: number;
  topSellingItems: TopSellingItem[];
  categoryPerformance: CategoryPerformance[];
  dailySales: DailySale[];
  inventoryMetrics: InventoryMetric[];
  peakHours: PeakHour[];
}

interface TopSellingItem {
  itemId: string;
  name: string;
  quantity: number;
  revenue: number;
  profit: number;
}

interface CategoryPerformance {
  category: string;
  sales: number;
  revenue: number;
  profit: number;
}

interface DailySale {
  date: string;
  sales: number;
  revenue: number;
  profit: number;
}

interface InventoryMetric {
  itemId: string;
  name: string;
  turnoverRate: number;
  reorderFrequency: number;
  averageStockLevel: number;
  profitMargin: number;
}

interface PeakHour {
  hour: number;
  sales: number;
  revenue: number;
}

// Utility functions
const calculateProfit = (price: number, cost: number, quantity: number): number => {
  return (price - cost) * quantity;
};

const findInventoryItem = (items: InventoryItem[], itemId: string): InventoryItem | undefined => {
  return items.find(item => item.id === itemId);
};

const getItemCost = (items: InventoryItem[], itemId: string): number => {
  return findInventoryItem(items, itemId)?.cost || 0;
};

// Analytics calculation functions
const calculateBasicMetrics = (salesData: SalesData[], inventoryItems: InventoryItem[]) => {
  const totalSales = salesData.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalRevenue = salesData.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);
  const totalCost = salesData.reduce((sum, sale) => {
    const cost = getItemCost(inventoryItems, sale.itemId);
    return sum + (cost * sale.quantity);
  }, 0);

  return {
    totalSales,
    totalRevenue,
    profitMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
    averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0
  };
};

const calculateTopSellingItems = (salesData: SalesData[], inventoryItems: InventoryItem[]): TopSellingItem[] => {
  const itemSales = salesData.reduce((acc, sale) => {
    const item = findInventoryItem(inventoryItems, sale.itemId);
    if (!acc[sale.itemId]) {
      acc[sale.itemId] = {
        itemId: sale.itemId,
        name: item?.name || 'Unknown',
        quantity: 0,
        revenue: 0,
        profit: 0
      };
    }
    acc[sale.itemId].quantity += sale.quantity;
    acc[sale.itemId].revenue += sale.price * sale.quantity;
    acc[sale.itemId].profit += calculateProfit(sale.price, getItemCost(inventoryItems, sale.itemId), sale.quantity);
    return acc;
  }, {} as Record<string, TopSellingItem>);

  return Object.values(itemSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};

const calculateCategoryPerformance = (salesData: SalesData[], inventoryItems: InventoryItem[]): CategoryPerformance[] => {
  const categoryData = salesData.reduce((acc, sale) => {
    if (!acc[sale.category]) {
      acc[sale.category] = {
        category: sale.category,
        sales: 0,
        revenue: 0,
        profit: 0
      };
    }
    acc[sale.category].sales += sale.quantity;
    acc[sale.category].revenue += sale.price * sale.quantity;
    acc[sale.category].profit += calculateProfit(sale.price, getItemCost(inventoryItems, sale.itemId), sale.quantity);
    return acc;
  }, {} as Record<string, CategoryPerformance>);

  return Object.values(categoryData);
};

const calculateDailySales = (salesData: SalesData[], inventoryItems: InventoryItem[]): DailySale[] => {
  const dailyData = salesData.reduce((acc, sale) => {
    const date = new Date(sale.timestamp).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = {
        date,
        sales: 0,
        revenue: 0,
        profit: 0
      };
    }
    acc[date].sales += sale.quantity;
    acc[date].revenue += sale.price * sale.quantity;
    acc[date].profit += calculateProfit(sale.price, getItemCost(inventoryItems, sale.itemId), sale.quantity);
    return acc;
  }, {} as Record<string, DailySale>);

  return Object.values(dailyData);
};

const calculateInventoryMetrics = (salesData: SalesData[], inventoryItems: InventoryItem[]): InventoryMetric[] => {
  return inventoryItems.map(item => {
    const itemSales = salesData.filter(sale => sale.itemId === item.id);
    const totalSold = itemSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const daysSinceFirstSale = itemSales.length > 0 
      ? (new Date().getTime() - new Date(itemSales[0].timestamp).getTime()) / (1000 * 60 * 60 * 24)
      : 0;
    
    return {
      itemId: item.id,
      name: item.name,
      turnoverRate: daysSinceFirstSale > 0 ? totalSold / daysSinceFirstSale : 0,
      reorderFrequency: item.threshold > 0 ? totalSold / item.threshold : 0,
      averageStockLevel: (item.quantity + item.threshold) / 2,
      profitMargin: item.price > 0 ? ((item.price - item.cost) / item.price) * 100 : 0
    };
  });
};

const calculatePeakHours = (salesData: SalesData[]): PeakHour[] => {
  const hourlyData = salesData.reduce((acc, sale) => {
    const hour = new Date(sale.timestamp).getHours();
    if (!acc[hour]) {
      acc[hour] = {
        hour,
        sales: 0,
        revenue: 0
      };
    }
    acc[hour].sales += sale.quantity;
    acc[hour].revenue += sale.price * sale.quantity;
    return acc;
  }, {} as Record<number, PeakHour>);

  return Object.values(hourlyData).sort((a, b) => a.hour - b.hour);
};

// Main function
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  const salesData = storage.get<SalesData[]>('sales_data') || [];
  const inventoryItems = storage.get<InventoryItem[]>('inventory_items') || [];

  // If no data exists, return empty analytics
  if (salesData.length === 0) {
    return {
      totalSales: 0,
      totalRevenue: 0,
      profitMargin: 0,
      averageOrderValue: 0,
      topSellingItems: [],
      categoryPerformance: [],
      dailySales: [],
      inventoryMetrics: [],
      peakHours: []
    };
  }

  const basicMetrics = calculateBasicMetrics(salesData, inventoryItems);
  
  return {
    ...basicMetrics,
    topSellingItems: calculateTopSellingItems(salesData, inventoryItems),
    categoryPerformance: calculateCategoryPerformance(salesData, inventoryItems),
    dailySales: calculateDailySales(salesData, inventoryItems),
    inventoryMetrics: calculateInventoryMetrics(salesData, inventoryItems),
    peakHours: calculatePeakHours(salesData)
  };
};

// Add this function at the end of the file
export const resetAnalyticsData = () => {
  storage.set('sales_data', []);
  // Dispatch event to notify dashboard of the reset
  window.dispatchEvent(new Event('salesUpdated'));
};
