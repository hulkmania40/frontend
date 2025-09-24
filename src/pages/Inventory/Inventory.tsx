import React, { Fragment, useEffect, useState } from "react";
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
import InventoryForm from "./InventoryForm";
import { _delete, _get } from "@/utils/apiClient";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Loader from "@/components/custom/Loader";

// @ts-ignore
import { debounce } from "lodash";

export interface InventoryItem {
	id: number;
	name: string;
	quantity: number;
	price: number;
}

const Inventory: React.FC = () => {
	const [items, setItems] = useState<InventoryItem[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchInput, setSearchInput] = useState<string>("");
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [itemId, setItemId] = useState<number | null>(null);
	const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
	const [openDialogId, setOpenDialogId] = useState<number | null>(null);

	const fetchItems = async (query: string = "") => {
		setLoading(true);
		if (query === "") {
			const data: InventoryItem[] = await _get("items/");
			setItems(data);
		} else {
			const data: InventoryItem[] = await _get(`items/?query=${query}`);
			setItems(data);
		}
		setLoading(false);
		setDeleteLoading(false);
	};

	useEffect(() => {
		const debouncedFetch = debounce((q: string) => {
			fetchItems(q);
		}, 700);

		if (searchInput.length > 0) {
			debouncedFetch(searchInput);
		} else {
			debouncedFetch("");
		}

		return () => {
			debouncedFetch.cancel();
		};
	}, [searchInput]);

	const deleteItem = async (id: number) => {
		const data = await _delete(`/items/${id}`);
		console.log(data);
		await fetchItems();
	};

	const AlertBoxComponent = (itemId: number, itemName: string) => {
		return (
			<AlertDialog
				open={openDialogId === itemId}
				onOpenChange={(isOpen) =>
					setOpenDialogId(isOpen ? itemId : null)
				}
			>
				<AlertDialogTrigger asChild>
					<Button variant="destructive" size="icon">
						<Trash2 className="h-4 w-4" />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					{deleteLoading && openDialogId === itemId && (
						<Loader fullscreen />
					)}
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete {itemName}?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => setOpenDialogId(null)}
						>
							Cancel
						</AlertDialogCancel>
						<Button
							variant="destructive"
							onClick={async () => {
								setDeleteLoading(true);
								try {
									await deleteItem(itemId);
									setOpenDialogId(null); // ✅ close only after success
								} catch (err) {
									console.error("Delete failed:", err);
									setDeleteLoading(false)
									// Optionally show a toast/error message here
								}
							}}
						>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	};

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
	);

	return (
		<Fragment>
			<div className="w-full mx-auto">
				<Card className="rounded-none border-none">
					<CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<CardTitle className="text-lg sm:text-xl">
							Inventory List
						</CardTitle>
						<Button
							onClick={() => {
								setItemId(null); // clear itemId for Add
								setIsModalOpen(true);
							}}
							className="w-full sm:w-auto"
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

					{/* Search bar responsive */}
					<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 px-2 py-2">
						<Input
							placeholder="Search for an item"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							className="flex-1 w-full sm:w-1/2"
						/>
						<Button
							variant="outline"
							onClick={() => setSearchInput("")}
							className="w-full sm:w-auto"
						>
							Clear Filter
						</Button>
					</div>

					{/* Desktop Table */}
					<div className="hidden md:block">
						{loading ? (
							<CardContent className="px-2">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-1/4">
												Item
											</TableHead>
											<TableHead className="w-1/4">
												Quantity
											</TableHead>
											<TableHead className="w-1/4">
												Price
											</TableHead>
											<TableHead className="w-1/4 text-right">
												Actions
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{Array.from({ length: 5 }).map(
											(_, idx) => (
												<SkeletonRow key={idx} />
											)
										)}
									</TableBody>
								</Table>
							</CardContent>
						) : (
							<CardContent className="px-2">
								{items.length === 0 ? (
									<p className="text-muted-foreground">
										No items found.
									</p>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="w-1/4">
													Item
												</TableHead>
												<TableHead className="w-1/4">
													Quantity
												</TableHead>
												<TableHead className="w-1/4">
													Price
												</TableHead>
												<TableHead className="w-1/4 text-right">
													Actions
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{items.map((item) => (
												<TableRow key={item.id}>
													<TableCell className="w-1/4 font-medium">
														{item.name}
													</TableCell>
													<TableCell className="w-1/4">
														{item.quantity}
													</TableCell>
													<TableCell className="w-1/4">
														{item.price}
													</TableCell>
													<TableCell className="w-1/4 text-right">
														<div className="flex justify-end gap-2">
															<Button
																variant="secondary"
																size="icon"
																onClick={() => {
																	setItemId(
																		item.id
																	); // set itemId for Edit
																	setIsModalOpen(
																		true
																	);
																}}
															>
																<Pen className="h-4 w-4" />
															</Button>
															{AlertBoxComponent(
																item.id,
																item.name
															)}
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</CardContent>
						)}
					</div>

					{/* Mobile Card Layout */}
					<div className="block md:hidden">
						<CardContent className="px-2 space-y-4">
							{loading ? (
								Array.from({ length: 3 }).map((_, idx) => (
									<Skeleton
										key={idx}
										className="h-20 w-full rounded-md"
									/>
								))
							) : items.length === 0 ? (
								<p className="text-muted-foreground">
									No items found.
								</p>
							) : (
								items.map((item) => (
									<Card
										key={item.id}
										className="p-4 space-y-2"
									>
										<div className="flex justify-between items-center">
											<p className="font-medium">
												{item.name}
											</p>
											<div className="flex gap-2">
												<Button
													variant="secondary"
													size="icon"
													onClick={() => {
														setItemId(item.id);
														setIsModalOpen(true);
													}}
												>
													<Pen className="h-4 w-4" />
												</Button>
												{AlertBoxComponent(
													item.id,
													item.name
												)}
											</div>
										</div>
										<div className="flex justify-between text-sm text-muted-foreground">
											<span>Qty: {item.quantity}</span>
											<span>₹{item.price}</span>
										</div>
									</Card>
								))
							)}
						</CardContent>
					</div>
				</Card>
			</div>
		</Fragment>
	);
};

export default Inventory;
