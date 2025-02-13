import { cva } from "class-variance-authority";
import { type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const listItemStyles = cva(
  "h-16 p-4 rounded-[0.875rem] flex items-center text-gray-900 w-full",
  {
    variants: {
      variant: {
        duotone: "bg-gray-50",
        outline: "border border-gray-200",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "duotone",
    },
  }
);
interface ListItemProps
  extends VariantProps<typeof listItemStyles>,
    Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "style"> {
  children?: React.ReactNode;
}

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  ({ children, variant, ...props }, ref) => {
    return (
      <div ref={ref} className={listItemStyles({ variant })} {...props}>
        {children}
      </div>
    );
  }
);

ListItem.displayName = "ListItem";

export default ListItem;
