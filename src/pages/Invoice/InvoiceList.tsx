import React, { Fragment, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pen } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

// @ts-ignore
import { debounce } from "lodash";
import { _delete, _get } from "@/utils/apiClient"
import { useNavigate } from "react-router"

export interface InventoryItem {
  id: number
  name: string
  quantity: number
  price: number
}

const InvoiceList: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchInput, setSearchInput] = useState<string>("")

  const navigate = useNavigate();

  const fetchItems = async (query: string = "") => {
    setLoading(true)
    if (query === "") {
      const data: InventoryItem[] = await _get("items/")
      setItems(data)
    } else {
      const data: InventoryItem[] = await _get(`items/?query=${query}`)
      setItems(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    const debouncedFetch = debounce((q: string) => {
      fetchItems(q)
    }, 700)

    if (searchInput.length > 0) {
      debouncedFetch(searchInput)
    } else {
      debouncedFetch("")
    }

    return () => {
      debouncedFetch.cancel()
    }
  }, [searchInput])

  // const deleteItem = async (id: number) => {
  //   const data = await _delete(`/items/${id}`)
  //   console.log(data)
  //   await fetchItems()
  // }

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

  return (
    <Fragment>
      <div className="w-full mx-auto">
        <Card className="rounded-none border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Invoice List</CardTitle>
            <Button
              onClick={() => {
                navigate("/invoice/new")
              }}
            >
              Add Invoice
            </Button>

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
              {items.length === 0 ? (
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
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="w-1/4 font-medium">{item.name}</TableCell>
                        <TableCell className="w-1/4">{item.quantity}</TableCell>
                        <TableCell className="w-1/4">{item.price}</TableCell>
                        <TableCell className="w-1/4 text-right">
                          <Button
                            className="mr-2"
                            variant="secondary"
                            size="icon"
                            onClick={() => {}}
                          >
                            <Pen className="h-4 w-4" />
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

export default InvoiceList
