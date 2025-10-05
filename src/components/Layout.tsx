import { Outlet, useNavigate } from "react-router";
import { Menu, Home, ClipboardList, Shield } from "lucide-react";
import { CustomNavigationMenu } from "./CustomNavigationMenu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./custom/theme/ThemeToggle";
import { useState } from "react";

const MobileNavLinks = ({
	navigate,
	onNavigate,
}: {
	navigate: (path: string) => void;
	onNavigate: () => void;
}) => (
	<div className="flex flex-col space-y-4 p-4">
		<span
			onClick={() => {
				onNavigate();
			}}
		>
			<ThemeToggle />
		</span>
		<Button
			variant="ghost"
			className="justify-start"
			onClick={() => {
				navigate("/dashboard");
				onNavigate();
			}}
		>
			<Home className="mr-2 h-4 w-4" />
			Dashboard
		</Button>
		<Button
			variant="ghost"
			className="justify-start"
			onClick={() => {
				navigate("/inventory");
				onNavigate();
			}}
		>
			<ClipboardList className="mr-2 h-4 w-4" />
			Inventory
		</Button>
		<Button
			variant="ghost"
			className="justify-start"
			onClick={() => {
				navigate("/invoice");
				onNavigate();
			}}
		>
			<ClipboardList className="mr-2 h-4 w-4" />
			Invoice
		</Button>
		<Button
			variant="ghost"
			className="justify-start"
			onClick={() => {
				navigate("/admin");
				onNavigate();
			}}
		>
			<Shield className="mr-2 h-4 w-4" />
			Admin
		</Button>
	</div>
);

export default function Layout() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);

	return (
		<div className="flex flex-col h-screen">
			{/* Top Navigation */}
			<div className="w-full flex justify-between items-center px-4 py-2 border-b">
				{/* Mobile Menu Trigger */}
				<div className="md:hidden">
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="p-0 w-64">
							<MobileNavLinks
								navigate={navigate}
								onNavigate={() => setOpen(false)} // close sidebar after click
							/>
						</SheetContent>
					</Sheet>
				</div>

				{/* Desktop Navigation */}
				<div className="hidden md:flex flex-1 justify-center">
					<CustomNavigationMenu />
				</div>
			</div>

			<Separator />

			{/* Main Content */}
			<main className="flex px-4">
				{/* Centered container */}
				<div className="w-full max-w-5xl mx-auto">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
