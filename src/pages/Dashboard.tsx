import CustomCard from "@/components/custom/CustomCard"
import { Separator } from "@/components/ui/separator"
import { ClipboardList, ReceiptIndianRupee, ShieldUser } from "lucide-react"

const Dashboard = () => {
  return (
    <div className="flex flex-col px-2">
      <span className="font-bold text-4xl mb-4">
        Welcome User!!
      </span>
      <Separator className="my-4"/>
      <div className="flex flex-wrap gap-8 w-auto items-center">
        <CustomCard icon={ClipboardList} title="Inventory" link="/inventory" />
        <CustomCard icon={ReceiptIndianRupee} title="Invoice" link="/invoice" />
        <Separator />
        <CustomCard icon={ShieldUser} title="Admin" link="/admin" />
      </div>
    </div>
  )
}

export default Dashboard