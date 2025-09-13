import React, { Fragment, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { _get } from "@/utils/apiClient";
import { Skeleton } from "@/components/ui/skeleton";
import InventoryForm from "./InventoryForm";

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const data: any = await _get("items/");
    setItems(data);
    setLoading(false);
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

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
  );

  return (
    <Fragment>
      <div className="w-full mx-auto">
        <Card className="rounded-none border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Inventory List</CardTitle>
            <InventoryForm />
          </CardHeader>
          <Separator />
          {loading ? (
            <CardContent className="px-2">
              <div className="flex gap-4 mb-4">
                <Skeleton className="flex flex-1 h-10 w-64" />
                <Skeleton className="h-10 w-28" />
              </div>
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
            <>
              <div className="flex gap-4 px-2">
                <Input
                  placeholder="Search for an item"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchInput("");
                  }}
                >
                  Clear Filter
                </Button>
              </div>
              <CardContent className="px-2">
                {items.length === 0 ? (
                  <p className="text-muted-foreground">No items available.</p>
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
            </>
          )}
        </Card>
      </div>
    </Fragment>
  );
};

export default Inventory;