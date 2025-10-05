// Represents a single item inside an invoice
export interface InvoiceItem {
  id?: number                // ID of the invoice_items table row
  item_id: number            // FK to items.id
  item_name?: string         // optional, for display
  quantity: number
  price: number
}

export interface Invoice {
  id: number
  customer_name: string
  total_amount: number
  invoice_date: string
  created_at?: string
  updated_at?: string
  items?: InvoiceItem[]      // optional for list view; populated for detailed view
}