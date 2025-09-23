import { Link } from "react-router";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
						<Link to="/dashboard">Dashboard</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>List</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[300px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<Link to="#">
										<div className="font-medium">
											Components
										</div>
										<div className="text-muted-foreground">
											Browse all components in the
											library.
										</div>
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link to="#">
										<div className="font-medium">
											Documentation
										</div>
										<div className="text-muted-foreground">
											Learn how to use the library.
										</div>
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link to="#">
										<div className="font-medium">Blog</div>
										<div className="text-muted-foreground">
											Read our latest blog posts.
										</div>
									</Link>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Simple</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<Link to="#">Components</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link to="#">Documentation</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link to="#">Blocks</Link>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<Link
										to="#"
										className="flex-row items-center gap-2"
									>
										<CircleHelpIcon />
										Backlog
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										to="#"
										className="flex-row items-center gap-2"
									>
										<CircleIcon />
										To Do
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link
										to="#"
										className="flex-row items-center gap-2"
									>
										<CircleCheckIcon />
										Done
									</Link>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
