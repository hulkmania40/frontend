import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { _get, _post } from "@/utils/apiClient"
import Loader from "@/components/custom/Loader"

export interface InventoryItem {
  id: number
  name: string
  quantity: number
  price: number
}

// --- Zod Schema ---
const invoiceSchema = z.object({
  items: z
    .array(
      z.object({
        inventoryId: z.number(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one item is required"),
})

// --- Component ---
const InvoiceForm = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: { items: [] },
  })

  const { control, handleSubmit, watch, reset } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const watchItems = watch("items")

  const fetchItems = async (query: string = "") => {
      setLoading(true);
      if (query === "") {
        const data: InventoryItem[] = await _get("items/");
        setInventory(data);
      } else {
        const data: InventoryItem[] = await _get(`items/?query=${query}`);
        setInventory(data);
      }
      setLoading(false);
    };

  // Fetch inventory on mount
  useEffect(() => {
    fetchItems()
  }, [])

  // Handle Submit
  const onSubmit = async (values: z.infer<typeof invoiceSchema>) => {
    console.log(values)
    await _post("/invoices", values)
    reset({ items: [] })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        {
          loading && <Loader fullscreen />
        }
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => {
              const selectedItem = inventory.find(
                (inv) => inv.id === watchItems[index]?.inventoryId
              )
              const maxQty = selectedItem?.quantity ?? 0
              const unitPrice = selectedItem?.price ?? 0
              const total = (watchItems[index]?.quantity || 0) * unitPrice

              return (
                <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                  {/* Inventory Select */}
                  <FormField
                    control={control}
                    name={`items.${index}.inventoryId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) =>
                              field.onChange(parseInt(val))
                            }
                            value={
                              field.value ? String(field.value) : undefined
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {inventory.map((inv) => (
                                <SelectItem
                                  key={inv.id}
                                  value={String(inv.id)}
                                >
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

                  {/* Quantity */}
                  <FormField
                    control={control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Quantity{" "}
                          {maxQty > 0 && (
                            <span className="text-xs text-muted-foreground">
                              (max {maxQty})
                            </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={maxQty}
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const val = Number(e.target.value)
                              if (val <= maxQty) field.onChange(val)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Auto Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Unit Price:</span>
                    <span>₹{unitPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total:</span>
                    <span>₹{total}</span>
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
              Submit Invoice
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default InvoiceForm
