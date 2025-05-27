"use client";

import { Sidebar } from "@/components/sidebar/sidebar";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full overflow-hidden bg-background relative">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen( !sidebarOpen )}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Theme toggle in top right */}
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${ sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar onCloseSidebar={() => setSidebarOpen( false )} />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden md:ml-64">
        {children}
      </div>


      {/* Overlay to close sidebar on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen( false )}
        />
      )}
    </div>
  );
}