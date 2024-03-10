import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

const FOCUS =
  "focus:outline focus:outline-2 focus:outline-black focus:ring-0 focus:outline-offset-1";

type LinkButtonProps = {
  children?: React.ReactNode;
  href: string;
};
export const LinkButton = ({ children, href }: LinkButtonProps) => {
  return (
    <Link
      className={cn(
        "font-bold text-center px-4 py-2 ",
        "border-2 border-transparent bg-transparent rounded-md",
        "hover:border-stone-800",
        FOCUS
      )}
      to={href}
    >
      {children}
    </Link>
  );
};
