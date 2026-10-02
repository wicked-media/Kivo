import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Inbox,
  Banknote,
  FileText,
  Calendar,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof twMerge>) {
  return twMerge(clsx(inputs));
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const links = [
    { href: '/dashboard', label: 'Life Inbox', icon: Inbox },
    { href: '/dashboard/bills', label: 'Bills', icon: Zap },
    { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: Banknote },
    { href: '/dashboard/documents', label: 'Documents', icon: FileText },
    { href: '/dashboard/reminders', label: 'Reminders', icon: Calendar },
    { href: '/dashboard/ask', label: 'Ask Kivo', icon: AlertTriangle },
  ];

  return (
    <div className="flex min-h-screen bg-kivo-50">
      {/* Mobile sidebar drawer */}
      <DrawerOverlay onClick={() => setSidebarOpen(false)} />
      <Drawer sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} links={links} />

      {/* Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-kivo-200 lg:bg-white lg:pt-16',
          sidebarOpen && 'lg:hidden lg:translate-x-0'
        )}
      >            <div className="flex lg:hidden lg:flex lg:flex-row lg:items-center lg:justify-between lg:border-b lg:border-kivo-200 lg:p-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <LogoMark />
            <span className="text-lg font-bold text-kivo-900">Kivo</span>
          </Link>
          <div />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(link => {
            const isActive = location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-kivo-100 text-kivo-900'
                    : 'text-kivo-600 hover:bg-kivo-50 hover:text-kivo-900'
                )}
              >
                <link.icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-kivo-600' : 'text-kivo-400'
                  )}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-kivo-200 p-3">
          <Link
            to="/dashboard/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-kivo-600 hover:bg-kivo-50 hover:text-kivo-900',
              location.pathname === '/dashboard/settings' &&
                'bg-kivo-100 text-kivo-900'
            )}
          >
            <Settings className="h-4 w-4 shrink-0 text-kivo-400" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-kivo-200 bg-white/80 backdrop-blur px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative gap-2 h-9">
                <Avatar className="h-7 w-7">
                  <AvatarImage />
                  <AvatarFallback>K</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium text-kivo-700">
                  You
                </span>
                <X className="ml-auto h-4 w-4 text-kivo-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Your account</p>
                  <p className="text-xs">you@domain.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function DrawerOverlay({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-40 bg-kivo-950/30 backdrop-blur-sm transition-opacity lg:hidden',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
      )}
      onClick={onClick}
    />
  );
}

function Drawer({
  sidebarOpen,
  setSidebarOpen,
  links,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  links: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}) {
  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-50 h-screen w-64 border-r border-kivo-200 bg-white shadow-xl transition-transform lg:hidden',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-kivo-200 px-4">
        <LogoMark />
        <span className="text-lg font-bold text-kivo-900">Kivo</span>
        <div className="ml-auto">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <nav className="px-3 py-4 space-y-1">
        {links.map(link => {
          const isActive = `/${link.href.slice(1)}` === window.location.pathname.replace(/\/+$/, '');
          return (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-kivo-100 text-kivo-900'
                  : 'text-kivo-600 hover:bg-kivo-50 hover:text-kivo-900'
              )}
            >
              <link.icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  isActive ? 'text-kivo-600' : 'text-kivo-400'
                )}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-kivo-900">
      <Zap className="h-4 w-4 text-white" strokeWidth={2.2} />
    </div>
  );
}
