
import { Product } from './types.ts';

export const SAMPLE_INVENTORY: Product[] = [
  {id: 1, name: "Wireless Mouse M185", sku: "WM-185-BLK", barcode: "4902778918856", stock: 15, location: "A-12-3", threshold: 20},
  {id: 2, name: "USB-C Cable 2m", sku: "UC-200-WHT", barcode: "8901234567890", stock: 78, location: "B-05-1", threshold: 30},
  {id: 3, name: "Laptop Stand Aluminum", sku: "LS-ALU-001", barcode: "5012345678900", stock: 5, location: "C-08-2", threshold: 15},
  {id: 4, name: "Bluetooth Keyboard", sku: "KB-BT-500", barcode: "6923456789012", stock: 42, location: "A-15-4", threshold: 25},
  {id: 5, name: "HDMI Cable 3m", sku: "HD-300-BLK", barcode: "7834567890123", stock: 8, location: "B-11-5", threshold: 20},
  {id: 6, name: "Desk Lamp LED", sku: "DL-LED-W", barcode: "8745678901234", stock: 65, location: "D-03-1", threshold: 15}
];

export const STORAGE_KEYS = {
  SETTINGS: 'inventory_app_settings',
  HISTORY: 'inventory_app_history'
};
