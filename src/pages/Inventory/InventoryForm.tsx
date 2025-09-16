"use client"

import { useState } from "react"
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
  DialogTrigger,
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
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { _post } from "@/utils/apiClient"

const formSchema = z.object({
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
}

const InventoryForm = (prop: InventoryFormProp) => {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: "",
      price: "",
    },
  })

  const { fetchItems } = prop;

  const onSubmit = async (data: FormData) => {
    try {
      const res = await _post("/items", data)
      console.log("✅ Form Submitted:", res)
      await fetchItems()
      reset()
      setOpen(false)   // ✅ close dialog after success
    } catch (err) {
      console.error("❌ Error submitting form:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => {
      if (!o) reset()
      setOpen(o)
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-1" /> Add Item
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>
        <Separator className="mb-2" />
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
