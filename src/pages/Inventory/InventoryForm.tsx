import { useEffect, useState } from "react"
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
import { _get, _post, _put } from "@/utils/apiClient"
import Loader from "@/components/custom/Loader"
import type { InventoryItem } from "./Inventory"

const formSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  price: z.coerce.number().min(0.01, "Price must be positive"),
})

type FormData = z.infer<typeof formSchema>

interface FormInput {
  name: string
  quantity: string
  price: string
}

interface InventoryFormProps { 
  fetchItems: () => Promise<void>;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  itemId?: number | null;
}

const InventoryForm = ({ fetchItems, isModalOpen, setIsModalOpen, itemId }: InventoryFormProps) => {
  const [loading, setLoading] = useState(false)
  const {
  register,
  handleSubmit,
  setValue,
  watch,
  reset,
  formState: { errors },
} = useForm<FormInput>({
  resolver: zodResolver(formSchema as any), // TypeScript workaround
  defaultValues: { name: "", quantity: "", price: "" },
})
  // Fetch item data when editing
  useEffect(() => {
    if (itemId != null) {
      setLoading(true)
      _get<InventoryItem>(`/items/${itemId}`).then((data) => {
        reset({
          name: data.name,
          quantity: String(data.quantity),
          price: String(data.price),
        })
        setLoading(false)
      })
    } else {
      reset({ name: "", quantity: undefined, price: undefined })
    }
  }, [itemId, reset])

  useEffect(() => {
    if (isModalOpen && itemId == null) {
      reset({ name: "", quantity: undefined, price: undefined })
    }
  }, [isModalOpen, itemId, reset])

  const onSubmit = async (data: FormInput) => {
    setLoading(true)
    try {
      const payload: FormData = {
        name: data.name,
        quantity: Number(data.quantity),
        price: Number(data.price),
      }

      if (itemId != null) {
        await _put(`/items/${itemId}`, payload)
      } else {
        await _post("/items", payload)
      }

      await fetchItems()
      setIsModalOpen(false)
      reset({ name: "", quantity: undefined, price: undefined })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{itemId != null ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50">
              <Loader fullscreen />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Quantity */}
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Select
                value={watch("quantity") ? String(watch("quantity")) : ""}
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
              {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
            </div>

            {/* Price */}
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}


export default InventoryForm
