import { Link } from "react-router";

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "./custom/theme/ThemeToggle";

export function CustomNavigationMenu() {
	return (
		<NavigationMenu viewport={false}>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={navigationMenuTriggerStyle()}
					>
						<Link to="/dashboard">Home</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={navigationMenuTriggerStyle()}
					>
						<Link to="/inventory">Inventory</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={navigationMenuTriggerStyle()}
					>
						<Link to="/invoice">Invoice</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
			<ThemeToggle />
		</NavigationMenu>
	);
}
