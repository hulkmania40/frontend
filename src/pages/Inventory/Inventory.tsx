import React, { Fragment, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pen, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import InventoryForm from "./InventoryForm"
import { _delete, _get } from "@/utils/apiClient"

export interface InventoryItem {
  id: number
  name: string
  quantity: number
  price: number
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchInput, setSearchInput] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [itemId, setItemId] = useState<number | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const data: InventoryItem[] = await _get("items/")
    setItems(data)
    setLoading(false)
  }

  const deleteItem = async (id: number) => {
    const data = await _delete(`/items/${id}`)
    console.log(data)
    await fetchItems()
  }

  // Skeleton row for loading
  const SkeletonRow = () => (
    <TableRow>
      <TableCell className="w-1/4">
        <Skeleton className="h-4 w-3/4" />
      </TableCell>
      <TableCell className="w-1/4">
        <Skeleton className="h-4 w-1/2" />
      </TableCell>
      <TableCell className="w-1/4">
        <Skeleton className="h-4 w-1/2" />
      </TableCell>
      <TableCell className="w-1/4 text-right">
        <Skeleton className="h-8 w-8 rounded-md ml-auto" />
      </TableCell>
    </TableRow>
  )

  // Filtered items based on search
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchInput.toLowerCase())
  )

  return (
    <Fragment>
      <div className="w-full mx-auto">
        <Card className="rounded-none border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Inventory List</CardTitle>
            <Button
              onClick={() => {
                setItemId(null) // clear itemId for Add
                setIsModalOpen(true)
              }}
            >
              Add Item
            </Button>

            {/* Add/Edit Form */}
            <InventoryForm
              fetchItems={fetchItems}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              itemId={itemId}
            />
          </CardHeader>

          <Separator />

          <div className="flex gap-4 px-2 py-2">
            <Input
              placeholder="Search for an item"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => setSearchInput("")}
            >
              Clear Filter
            </Button>
          </div>

          {loading ? (
            <CardContent className="px-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Item</TableHead>
                    <TableHead className="w-1/4">Quantity</TableHead>
                    <TableHead className="w-1/4">Price</TableHead>
                    <TableHead className="w-1/4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <SkeletonRow key={idx} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          ) : (
            <CardContent className="px-2">
              {filteredItems.length === 0 ? (
                <p className="text-muted-foreground">No items found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Item</TableHead>
                      <TableHead className="w-1/4">Quantity</TableHead>
                      <TableHead className="w-1/4">Price</TableHead>
                      <TableHead className="w-1/4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="w-1/4 font-medium">{item.name}</TableCell>
                        <TableCell className="w-1/4">{item.quantity}</TableCell>
                        <TableCell className="w-1/4">{item.price}</TableCell>
                        <TableCell className="w-1/4 text-right">
                          <Button
                            className="mr-2"
                            variant="secondary"
                            size="icon"
                            onClick={() => {
                              setItemId(item.id) // set itemId for Edit
                              setIsModalOpen(true)
                            }}
                          >
                            <Pen className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </Fragment>
  )
}

export default Inventory
