"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, User, Menu } from "lucide-react"
import { useCartContext } from "@/lib/providers/cart-provider"

export function Navbar() {
  const { openDrawer, itemCount: cartCount } = useCartContext()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">SmartGrocery</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  <li>
                    <Link href="/products/fruits" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Fruits & Vegetables</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Fresh produce delivered to your door</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/dairy" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Dairy & Eggs</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Fresh dairy products and eggs</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/bakery" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Bakery</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Fresh baked goods daily</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/pantry" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Pantry Staples</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Essential pantry items</p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  <li><Link href="/categories/organic" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"><div className="text-sm font-medium">Organic</div></Link></li>
                  <li><Link href="/categories/gluten-free" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"><div className="text-sm font-medium">Gluten-Free</div></Link></li>
                  <li><Link href="/categories/vegan" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"><div className="text-sm font-medium">Vegan</div></Link></li>
                  <li><Link href="/categories/snacks" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"><div className="text-sm font-medium">Snacks</div></Link></li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">About</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">Contact</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-sm mx-8">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-8" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={openDrawer} className="relative cursor-pointer">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">{cartCount}</Badge>
            )}
          </Button>
          <Link href="/login" className="p-2 hover:bg-accent rounded-md transition-colors">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/get-started">
            <Button className="hidden md:inline-flex">Get Started</Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
