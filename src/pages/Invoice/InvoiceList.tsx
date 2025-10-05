import React, { useEffect, useState, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pen, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
// @ts-ignore
import { debounce } from "lodash";
import { _get, _delete } from "@/utils/apiClient";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export interface Invoice {
  id: number;
  customer_name: string;
  total_amount: number;
  invoice_date: string;
}

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>("");
  const navigate = useNavigate();

  const fetchInvoices = async (query: string = "") => {
    setLoading(true);
    try {
      const data: Invoice[] = await _get(
        query ? `invoices/?query=${query}` : "invoices/"
      );
      setInvoices(data);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: number) => {
    try {
      await _delete(`invoices/${id}`);
      toast.success("Invoice deleted successfully");
      fetchInvoices();
    } catch (error: any) {
      toast.error("Failed to delete invoice");
    }
  };

  useEffect(() => {
    const debouncedFetch = debounce((q: string) => {
      fetchInvoices(q);
    }, 600);

    debouncedFetch(searchInput);
    return () => debouncedFetch.cancel();
  }, [searchInput]);

  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
      <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
      <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8 rounded-md ml-auto" />
      </TableCell>
    </TableRow>
  );

  return (
    <Fragment>
      <Card className="rounded-none border-none">
        <CardHeader className="flex justify-between">
          <CardTitle>Invoices</CardTitle>
          <Button onClick={() => navigate("/invoice/new")}>Add Invoice</Button>
        </CardHeader>

        <Separator />

        <div className="flex gap-4 px-2 py-2">
          <Input
            placeholder="Search by customer name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button variant="outline" onClick={() => setSearchInput("")}>
            Clear
          </Button>
        </div>

        <CardContent className="px-2">
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <SkeletonRow key={idx} />
                ))}
              </TableBody>
            </Table>
          ) : invoices.length === 0 ? (
            <p className="text-muted-foreground">No invoices found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.customer_name}</TableCell>
                    <TableCell>₹{inv.total_amount}</TableCell>
                    <TableCell>
                      {new Date(inv.invoice_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => navigate(`/invoice/${inv.id}`)}
                      >
                        <Pen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteInvoice(inv.id)}
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
      </Card>
    </Fragment>
  );
};

export default InvoiceList;