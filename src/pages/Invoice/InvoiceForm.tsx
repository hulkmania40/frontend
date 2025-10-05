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
        inventoryId: z.number({})
          .min(1, "Item is required"),
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
    defaultValues: { customer_name: "", items: [{ "inventoryId": 0, "quantity": 0 }] },
  })
  const { control, handleSubmit, watch, reset } = form
  const { fields, append, remove } = useFieldArray({ control, name: "items" })
  const watchItems = watch("items")

  // Dynamically calculate total
  const totalAmount = watchItems.reduce((acc, curr) => {
    const matchedItem = inventory.find((inv) => inv.id === curr.inventoryId)
    const price = matchedItem?.price ?? 0
    const qty = curr.quantity ?? 0
    return acc + price * qty
  }, 0)

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
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <Card className="rounded-none border-t-0">
          <CardHeader>
            <CardTitle>{id ? "Edit Invoice" : "Create Invoice"}</CardTitle>
          </CardHeader>
          <CardContent className="pb-32 sm:pb-24">
            {loading && <Loader fullscreen />}

            {/* Customer name field */}
            <div className="mb-2">
              <FormField
                control={control}
                name="customer_name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter customer name"
                        {...field}
                        className={fieldState.error ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Items fields */}
            {fields.map((field, index) => {
              const selected = inventory.find(
                (inv) => inv.id === watchItems[index]?.inventoryId
              )
              const stockQty = selected?.quantity ?? 0
              const previousQty = originalInvoiceItems.find(
                (it) => it.item_id === watchItems[index]?.inventoryId
              )?.quantity ?? 0
              const maxQty = stockQty + previousQty
              const unitPrice = selected?.price ?? 0
              const total = (watchItems[index]?.quantity || 0) * unitPrice

              return (
                <div key={field.id} className="space-y-4 border p-4 rounded-lg mb-4">
                  <FormField
                    control={control}
                    name={`items.${index}.inventoryId`}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <Select
                          value={field.value ? String(field.value) : ""}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <FormControl>
                            <SelectTrigger
                              ref={field.ref}
                              className={fieldState.error ? "border-destructive focus:ring-destructive" : ""}
                            >
                              <SelectValue placeholder="Select Item" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {inventory
                              .filter(
                                (inv) =>
                                  !watchItems.some(
                                    (it, i) => i !== index && it.inventoryId === inv.id
                                  )
                              )
                              .map((inv) => (
                                <SelectItem key={inv.id} value={String(inv.id)} >
                                  {inv.name} (₹{inv.price})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`items.${index}.quantity`}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          Quantity{" "}
                          {maxQty > 0 && (
                            <span className="text-xs text-muted-foreground">(Max: {maxQty})</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            max={maxQty}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className={fieldState.error ? "border-destructive focus-visible:ring-destructive" : ""}
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
          </CardContent>
        </Card>

        {/* ✅ Move sticky footer inside form */}
        <div className="fixed bottom-0 left-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t shadow-md p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between z-50">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              append({ inventoryId: 0, quantity: 1 })
              setTimeout(() => {
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }, 200)
            }}
            className="w-full sm:w-auto"
          >
            Add Item
          </Button>
          <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-3 sm:gap-6">
            <span className="text-lg font-medium text-center sm:text-left">
              Total: ₹{totalAmount}
            </span>
            <Button type="submit" className="w-full sm:w-auto">
              {id ? "Update Invoice" : "Submit Invoice"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default InvoiceForm