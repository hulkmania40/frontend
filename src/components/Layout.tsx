import { Outlet, useNavigate } from "react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, ClipboardList, Shield } from "lucide-react"
import { CustomNavigationMenu } from "./CustomNavigationMenu"
import { Separator } from "@/components/ui/separator"

export default function Layout() {

  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-[1fr_2fr_6fr_2fr_1fr] h-screen">
      {/* Left Sidebar */}
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem
                onClick={()=>{
                  navigate("/dashboard")
                }}
              >
                <SidebarMenuButton
                  className="cursor-pointer"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem
                onClick={()=>{
                  navigate("/inventory")
                }}
              >
                <SidebarMenuButton
                  className="cursor-pointer"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Inventory
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem
                onClick={()=>{
                  navigate("/admin")
                }}
              >
                <SidebarMenuButton
                  className="cursor-pointer"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Empty spacer column (left balance) */}
      <div />
      
      {/* Center content (nav + page) */}
      <div className="flex flex-col items-center justify-start border-x">
        {/* Top Navigation */}
        <div className="w-full flex justify-between items-center my-2 p-4">
          <CustomNavigationMenu />
        </div>
        <Separator />
        {/* Main routed content */}
        <main className="flex w-full overflow-y-auto">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Empty spacer column (right balance) */}
      <div />
      
      {/* Right column (empty for now) */}
      <div />
    </div>
  )
}
