import { type LucideIcon } from "lucide-react";
import { Link } from "react-router";

interface CustomCardProps {
  icon: LucideIcon;
  title: string;
  link: string;
}

const CustomCard = ({ icon: Icon, title, link }: CustomCardProps) => {
  return (
    <Link to={link}>
      <div className="rounded-md border-gray-400 border-2 w-40 h-40 flex flex-col items-center justify-center hover:bg-gray-200 cursor-pointer">
        <Icon className="mb-4" size={32} />
        <span className="mt-4">{title}</span>
      </div>
    </Link>
  );
};

export default CustomCard;
