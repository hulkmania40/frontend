import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Button,
} from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Input,
} from "@/components/ui/input"
import {
  Label,
} from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { _get, _post } from "@/utils/apiClient"
import type { InventoryItem } from "./Inventory"

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Item name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),
})

type FormData = z.infer<typeof formSchema>

interface InventoryFormProp {
  fetchItems: () => Promise<void>;
  isModalOpen?: boolean;
  itemId?: number | null;
}

const InventoryForm = ({ fetchItems, isModalOpen = false, itemId, setIsModalOpen }: InventoryFormProp & { setIsModalOpen: (o: boolean) => void }) => {

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { id:-1, name: "", quantity: "", price: "" },
  })

  useEffect(() => {
    if (itemId!=null) fetchItemById(itemId)
  }, [itemId])

  const fetchItemById = async (id: number) => {
    const data: InventoryItem = await _get(`/items/${id}`)
    reset({
      name: data.name,
      quantity: String(data.quantity),
      price: String(data.price),
    })
  }

  const onSubmit = async (data: FormData) => {
    await _post("/items", data)
    await fetchItems()
    reset()
    setIsModalOpen(false) // close modal from parent
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{itemId ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* Item Name */}
          <div className="grid gap-3">
            <Label htmlFor="item-name-1">Item Name</Label>
            <Input id="item-name-1" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Quantity */}
          <div className="grid gap-3">
            <Label htmlFor="quantity-1">Quantity</Label>
            <Select
              onValueChange={(val) => setValue("quantity", val, { shouldValidate: true })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select quantity" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }).map((_, idx) => (
                  <SelectItem key={idx} value={`${idx + 1}`}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="grid gap-3">
            <Label htmlFor="price-1">Price</Label>
            <Input id="price-1" type="number" {...register("price")} />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default InventoryForm
