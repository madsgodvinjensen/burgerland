import { Link as RouterLink } from "react-router-dom";

type LinkProps = {
  children?: React.ReactNode;
  href?: string;
};

export const Link = ({ children, href }: LinkProps) => {
  return (
    <RouterLink className="underline hover:bg-stone-200" to={href ?? ""}>
      {children}
    </RouterLink>
  );
};
