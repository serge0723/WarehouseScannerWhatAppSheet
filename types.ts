
export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  stock: number;
  location: string;
  threshold: number;
}

export interface ScanRecord {
  id: string;
  productId: number;
  productName: string;
  sku: string;
  timestamp: string;
  stockAtScan: number;
}

export interface AppSettings {
  managerPhone: string;
  workerName: string;
}

export type AppView = 'DASHBOARD' | 'SCANNER' | 'SETTINGS' | 'PRODUCT_DETAIL';

export enum StockStatus {
  HEALTHY = 'HEALTHY',
  MONITOR = 'MONITOR',
  LOW = 'LOW'
}
