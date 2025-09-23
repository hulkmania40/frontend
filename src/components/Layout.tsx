import { Outlet, useNavigate } from "react-router"
import { Menu, Home, ClipboardList, Shield } from "lucide-react"
import { CustomNavigationMenu } from "./CustomNavigationMenu"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const MobileNavLinks = ({ navigate }: { navigate: (path: string) => void }) => (
  <div className="flex flex-col space-y-4 p-4">
    <Button
      variant="ghost"
      className="justify-start"
      onClick={() => navigate("/dashboard")}
    >
      <Home className="mr-2 h-4 w-4" />
      Dashboard
    </Button>
    <Button
      variant="ghost"
      className="justify-start"
      onClick={() => navigate("/inventory")}
    >
      <ClipboardList className="mr-2 h-4 w-4" />
      Inventory
    </Button>
    <Button
      variant="ghost"
      className="justify-start"
      onClick={() => navigate("/admin")}
    >
      <Shield className="mr-2 h-4 w-4" />
      Admin
    </Button>
  </div>
)

export default function Layout() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation */}
      <div className="w-full flex justify-between items-center px-4 py-2 border-b">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <MobileNavLinks navigate={navigate} />
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
      <main className="flex-1 overflow-y-auto px-4">
        {/* Centered container */}
        <div className="w-full max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
