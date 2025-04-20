import Link, { LinkProps } from 'next/link';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const linkVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface MyLinkProps extends LinkProps, VariantProps<typeof linkVariants> {
  className?: string;
  children: React.ReactNode;
}

export const MyLink = ({
  variant,
  size,
  children, className, ...props
}: MyLinkProps) => {
  return (
    <Link className={cn(linkVariants({ variant, size, className }))} {...props}>{children}</Link>
  );
};