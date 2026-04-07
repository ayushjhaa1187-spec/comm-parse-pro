import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Upload, FileText, BarChart3, Settings, Zap, Bell, LogOut, User, Search, Menu, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { signOut } from "@/lib/supabase-helpers";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Upload, label: "Upload", path: "/dashboard/upload" },
  { icon: FileText, label: "BRDs", path: "/dashboard/brds" },
  { icon: MessageSquare, label: "AI Chat", path: "/dashboard/chat" },
  { icon: BarChart3, label: "Metrics", path: "/dashboard/metrics" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const notifications = [
  { id: 1, text: "New BRD generated: Enron Email Analysis", time: "2 min ago" },
  { id: 2, text: "Pipeline completed with 93% accuracy", time: "1 hour ago" },
  { id: 3, text: "3 new transcripts uploaded", time: "3 hours ago" },
];

const SidebarNav = ({ location, onNavigate }: { location: ReturnType<typeof useLocation>; onNavigate?: () => void }) => (
  <nav className="flex-1 px-3 space-y-1">
    {navItems.map((item) => {
      const active = item.path === "/dashboard"
        ? location.pathname === "/dashboard"
        : location.pathname.startsWith(item.path);
      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            active
              ? "bg-sidebar-accent text-sidebar-primary"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          }`}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </Link>
      );
    })}
  </nav>
);

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = user?.email?.slice(0, 2).toUpperCase() || "U";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email;
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 bg-sidebar text-sidebar-foreground flex-col border-r border-sidebar-border fixed inset-y-0 left-0 z-40">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-bold text-sidebar-foreground">CommParse Pro</span>
        </div>
        <SidebarNav location={location} />
        <div className="px-5 py-4 text-xs text-sidebar-foreground/40">
          CommParse Pro v1.0
        </div>
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-60 p-0 bg-sidebar text-sidebar-foreground">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex items-center gap-2 px-5 py-5">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-sidebar-foreground">CommParse Pro</span>
          </div>
          <SidebarNav location={location} onNavigate={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex-1 flex flex-col md:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSheetOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="relative w-80 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 border-b border-border">
                  <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-3 py-3 border-b border-border last:border-0 hover:bg-accent transition-colors">
                      <p className="text-sm text-foreground">{n.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* User menu with avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="w-9 h-9 cursor-pointer">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName || ""} />}
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                  <User className="w-4 h-4 mr-2" /> Profile & Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
