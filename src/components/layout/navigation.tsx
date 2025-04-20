import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings, Home } from "lucide-react";

export function Navigation() {
  return (
    <nav className="border-b py-2 sm:py-3 px-3 sm:px-4 sticky top-0 bg-white z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-lg sm:text-xl">每日随记与反拖延</Link>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9">
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
