import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, FileText, BarChart3, Settings, Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/upload", label: "Upload", icon: Upload },
  { to: "/dashboard/brds", label: "BRDs", icon: FileText },
  { to: "/dashboard/metrics", label: "Metrics", icon: BarChart3 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Hexagon className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-base font-bold tracking-tight text-sidebar-primary-foreground">
          BRD Agent
        </span>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.to === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-5 py-4 text-xs text-sidebar-foreground/40">
        InsightWeaver v1.0
      </div>
    </aside>
  );
};

export default AppSidebar;
