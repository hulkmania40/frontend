import { useEffect, useRef, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "react-router"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { _get, _post, _put } from "@/utils/apiClient"
import Loader from "@/components/custom/Loader"
import { toast } from "sonner"
import type { Invoice, InvoiceItem } from "@/utils/models"

export interface InventoryItem {
  id: number
  name: string
  quantity: number
  price: number
}

const invoiceSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  items: z
    .array(
      z.object({
        inventoryId: z.number(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one item is required"),
})

const InvoiceForm = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [originalInvoiceItems, setOriginalInvoiceItems] = useState<InvoiceItem[]>([])

  const navigate = useNavigate()
  const { id } = useParams()

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: { customer_name: "", items: [] },
  })
  const { control, handleSubmit, watch, reset } = form
  const { fields, append, remove } = useFieldArray({ control, name: "items" })
  const watchItems = watch("items")

  // fetch items for dropdown
  const fetchItems = async () => {
    setLoading(true)
    try {
      const data: InventoryItem[] = await _get("items/")
      setInventory(data)
    } catch (err) {
      toast.error("Failed to load items")
    } finally {
      setLoading(false)
    }
  }

  // fetch invoice for editing
  const fetchInvoice = async () => {
    if (!id) return
    setLoading(true)
    try {
      const invoice: Invoice = await _get(`invoices/${id}`)
      setOriginalInvoiceItems(invoice.items || [])

      reset(
        {
          customer_name: invoice.customer_name,
          items: (invoice?.items || []).map((it: InvoiceItem) => ({
            inventoryId: it.item_id,
            quantity: it.quantity,
          })),
        },
        { keepDefaultValues: false }
      )
    } catch (err) {
      toast.error("Failed to load invoice")
    } finally {
      setLoading(false)
    }
  }

  const didFetch = useRef(false)

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true

    const init = async () => {
      await fetchItems()
      if (id) await fetchInvoice()
    }

    init()
  }, [id])

  const onSubmit = async (values: z.infer<typeof invoiceSchema>) => {
    setLoading(true)
    try {
      const payload = {
        customer_name: values.customer_name,
        items: values.items.map((i) => {
          const item = inventory.find((inv) => inv.id === i.inventoryId)!
          return {
            item_id: i.inventoryId,
            quantity: i.quantity,
            price: item.price,
          }
        }),
      }

      if (id) {
        await _put(`invoices/${id}`, payload)
        toast.success("Invoice updated successfully")
      } else {
        await _post("invoices/", payload)
        toast.success("Invoice created successfully")
      }

      navigate("/invoice")
    } catch (err) {
      toast.error("Failed to save invoice")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{id ? "Edit Invoice" : "Create Invoice"}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <Loader fullscreen />}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {fields.map((field, index) => {
              const selected = inventory.find(
                (inv) => inv.id === watchItems[index]?.inventoryId
              )
              const stockQty = selected?.quantity ?? 0

              // find how much quantity this item already had in original invoice (if editing)
              const previousQty = originalInvoiceItems.find(
                (it) => it.item_id === watchItems[index]?.inventoryId
              )?.quantity ?? 0

              // final max = available in stock + what this invoice already reserved
              const maxQty = stockQty + previousQty

              const unitPrice = selected?.price ?? 0
              const total = (watchItems[index]?.quantity || 0) * unitPrice

              return (
                <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                  <FormField
                    control={control}
                    name={`items.${index}.inventoryId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value ? String(field.value) : ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {inventory
                                .filter(
                                  (inv) =>
                                    !watchItems.some(
                                      (it, i) => i !== index && it.inventoryId === inv.id
                                    )
                                )
                                .map((inv) => (
                                  <SelectItem key={inv.id} value={String(inv.id)}>
                                    {inv.name} (₹{inv.price})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>

                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Quantity{" "}
                          {maxQty > 0 && (
                            <span className="text-xs text-muted-foreground">
                              (Max: {maxQty})
                            </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={maxQty}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between text-sm">
                    <span>Unit Price: ₹{unitPrice}</span>
                    <span>Total: ₹{total}</span>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              )
            })}

            <Separator />

            <Button
              type="button"
              onClick={() => append({ inventoryId: 0, quantity: 1 })}
            >
              Add Item
            </Button>

            <Button type="submit" className="w-full">
              {id ? "Update Invoice" : "Submit Invoice"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default InvoiceForm
