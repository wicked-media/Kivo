import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:border group-[.toaster]:border-kivo-200 group-[.toaster]:text-kivo-900 group-[.toaster]:shadow-lg group-[.toaster]:animate-in group-[.toaster]:slide-in-from-top-2 group-[.toaster]:duration-300',
          description: 'group-[.toast]:text-kivo-600',
          actionButton:
            'group-[.toast]:bg-kivo-700 group-[.toast]:text-white group-[.toast]:hover:bg-kivo-800',
          cancelButton:
            'group-[.toast]:bg-kivo-100 group-[.toast]:text-kivo-700 group-[.toast]:hover:bg-kivo-200',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
