import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-kivo-200', className)}
      {...props}
    />
  );
}

export { Skeleton };
