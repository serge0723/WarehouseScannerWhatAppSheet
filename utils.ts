
import { StockStatus, Product, AppSettings, ScanRecord } from './types';

// The endpoint for your Google Apps Script Web App
export const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwM3CCw7_MsOVi2W-fj_o2tdxYb9Bc-8bvmnQRczOLUYP0nRfe9ZR9292f8LKUA5Q_g/exec';

export const getStockStatus = (stock: number): StockStatus => {
  if (stock > 50) return StockStatus.HEALTHY;
  if (stock >= 20) return StockStatus.MONITOR;
  return StockStatus.LOW;
};

export const getStatusColor = (status: StockStatus): string => {
  switch (status) {
    case StockStatus.HEALTHY: return 'text-green-500';
    case StockStatus.MONITOR: return 'text-yellow-500';
    case StockStatus.LOW: return 'text-red-500';
  }
};

export const getStatusBg = (status: StockStatus): string => {
  switch (status) {
    case StockStatus.HEALTHY: return 'bg-green-500';
    case StockStatus.MONITOR: return 'bg-yellow-500';
    case StockStatus.LOW: return 'bg-red-500';
  }
};

export const generateWhatsAppLink = (product: Product, settings: AppSettings): string => {
  const status = product.stock < product.threshold ? 'CRITICAL' : 'LOW STOCK';
  const date = new Date().toLocaleString();
  
  const message = `⚠️ INVENTORY ALERT
   
Product: ${product.name}
SKU: ${product.sku}
Current Stock: ${product.stock} units
Status: ${status}
Location: ${product.location}
Reorder Threshold: ${product.threshold} units

📋 Recommendation: Order ${product.threshold * 2} units

Reported by: ${settings.workerName || 'Staff Member'}
Date: ${date}`;

  return `https://wa.me/${settings.managerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
};

/**
 * Sends data to Google Sheets via Webhook
 */
export const syncToGoogleSheet = async (
  product: Product, 
  settings: AppSettings,
  actionType: 'MANUAL_UPDATE' | 'CONNECTION_TEST'
): Promise<boolean> => {
  const payload = {
    "Sheet Name": "Form Webhook Data",
    "Worker Name": settings.workerName || 'Anonymous',
    "Item Name": product.name,
    "SKU": product.sku,
    "Barcode": product.barcode,
    "Warehouse Bin": product.location,
    "Stock Level": product.stock,
    "Stock Status": getStockStatus(product.stock),
    "Timestamp": new Date().toLocaleString(),
    "Action Type": actionType
  };

  try {
    console.log(`[SYNC] Sending ${actionType}:`, payload);
    
    // mode: 'no-cors' is required for Google Apps Script Web App redirects
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
    });
    
    return true;
  } catch (error) {
    console.error(`[SYNC] ${actionType} failed:`, error);
    return false;
  }
};

/**
 * Sends a dummy test record to the webhook
 */
export const testWebhookConnection = async (settings: AppSettings): Promise<boolean> => {
  const dummyProduct: Product = {
    id: 0,
    name: 'TEST PRODUCT',
    sku: 'DEBUG-999',
    barcode: '0000000000',
    stock: 100,
    location: 'SYSTEM-TEST',
    threshold: 10
  };

  return await syncToGoogleSheet(dummyProduct, settings, 'CONNECTION_TEST');
};
