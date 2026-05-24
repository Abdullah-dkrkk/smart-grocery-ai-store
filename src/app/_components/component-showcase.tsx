import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, Heart, ShoppingCart, Star, Search, User, Mail, Bell } from "lucide-react"

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-heading font-semibold tracking-tight">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  )
}

function PreviewCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border bg-card p-6 ${className}`}>
      {children}
    </div>
  )
}

function CodeSnippet({ code }: { code: string }) {
  return (
    <div className="mt-4 rounded-lg bg-muted p-3">
      <pre className="text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">{code}</pre>
    </div>
  )
}

export function ComponentShowcase() {
  return (
    <section className="py-section">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight mb-4">
            Components
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl">
            Live previews of all available UI components. Built with shadcn/ui and @base-ui/react primitives.
          </p>
        </div>

        {/* Buttons */}
        <div className="mb-16">
          <SectionTitle title="Buttons" description="Six variants in four sizes" />
          <div className="space-y-6">
            <PreviewCard>
              <div className="flex flex-wrap items-center gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              <CodeSnippet code={`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`} />
            </PreviewCard>

            <PreviewCard>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">XSmall</Button>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Heart className="h-4 w-4" /></Button>
              </div>
              <CodeSnippet code={`<Button size="xs">XSmall</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Heart /></Button>`} />
            </PreviewCard>

            <PreviewCard>
              <div className="flex flex-wrap items-center gap-3">
                <Button>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button variant="secondary">
                  Learn More
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </div>
              <CodeSnippet code={`<Button><ShoppingCart /> Add to Cart</Button>
<Button variant="secondary">Learn More <ChevronRight /></Button>
<Button variant="outline" size="sm"><User /> Profile</Button>`} />
            </PreviewCard>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-16">
          <SectionTitle title="Badges" />
          <div className="grid md:grid-cols-2 gap-6">
            <PreviewCard>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Sold Out</Badge>
              </div>
              <CodeSnippet code={`<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Sold Out</Badge>`} />
            </PreviewCard>

            <PreviewCard>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-brand-green text-white">Organic</Badge>
                <Badge className="bg-brand-orange text-white">Sale</Badge>
                <Badge className="bg-brand-green-light text-brand-green-dark border border-brand-green/30">Fresh</Badge>
                <div className="relative inline-flex">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">3</Badge>
                </div>
              </div>
              <CodeSnippet code={`<Badge className="bg-brand-green">Organic</Badge>
<Badge className="bg-brand-orange text-white">Sale</Badge>
<div className="relative">
  <Button variant="ghost" size="icon"><Bell /></Button>
  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0">3</Badge>
</div>`} />
            </PreviewCard>
          </div>
        </div>

        {/* Cards */}
        <div className="mb-16">
          <SectionTitle title="Cards" description="Flexible card with header, content, and footer" />
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Card</CardTitle>
                <CardDescription>Fresh organic avocados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
                <p className="text-2xl font-bold">$4.99</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button size="sm" variant="outline">Details</Button>
                <Button size="sm"><ShoppingCart className="h-4 w-4 mr-1" />Add</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Badge className="w-fit bg-brand-orange text-white">Trending</Badge>
                <CardTitle>Featured Item</CardTitle>
                <CardDescription>Customer favorite this week</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fresh strawberries picked at peak ripeness. Rich in vitamin C and antioxidants.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Shop Now</Button>
              </CardFooter>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>Compact Card</CardTitle>
                <CardDescription>Small variant for tight spaces</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Perfect for grids and sidebars.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">Action</Button>
              </CardFooter>
            </Card>
          </div>
          <div className="mt-4">
            <CodeSnippet code={`<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>`} />
          </div>
        </div>

        {/* Inputs */}
        <div className="mb-16">
          <SectionTitle title="Inputs" />
          <div className="grid md:grid-cols-2 gap-6">
            <PreviewCard>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Default</label>
                  <Input placeholder="Enter your email" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">With Icon</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search products..." className="pl-9" />
                  </div>
                </div>
              </div>
              <CodeSnippet code={`<Input placeholder="Enter your email" />
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
  <Input placeholder="Search..." className="pl-9" />
</div>`} />
            </PreviewCard>

            <PreviewCard>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">With Button</label>
                  <div className="flex gap-2">
                    <Input placeholder="Enter email" />
                    <Button>Subscribe</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Disabled</label>
                  <Input placeholder="Disabled input" disabled />
                </div>
              </div>
              <CodeSnippet code={`<div className="flex gap-2">
  <Input placeholder="Enter email" />
  <Button>Subscribe</Button>
</div>
<Input placeholder="Disabled input" disabled />`} />
            </PreviewCard>
          </div>
        </div>

        {/* Separator */}
        <div className="mb-16">
          <SectionTitle title="Separator" />
          <PreviewCard>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Horizontal separator between content</p>
              <Separator />
              <p className="text-sm text-muted-foreground">This content is below the separator</p>
            </div>
            <div className="flex items-center gap-6 mt-6">
              <p className="text-sm">Left</p>
              <Separator orientation="vertical" className="h-8" />
              <p className="text-sm">Center</p>
              <Separator orientation="vertical" className="h-8" />
              <p className="text-sm">Right</p>
            </div>
            <CodeSnippet code={`<Separator />
<Separator orientation="vertical" className="h-8" />`} />
          </PreviewCard>
        </div>

        {/* Avatar */}
        <div className="mb-16">
          <SectionTitle title="Avatars" />
          <PreviewCard>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar>
                <div className="flex h-full w-full items-center justify-center bg-brand-green text-white text-sm font-medium">
                  JD
                </div>
              </Avatar>
              <Avatar className="h-10 w-10">
                <div className="flex h-full w-full items-center justify-center bg-brand-orange text-white text-sm font-medium">
                  SK
                </div>
              </Avatar>
              <Avatar className="h-12 w-12">
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-base font-medium">
                  <User className="h-5 w-5" />
                </div>
              </Avatar>
            </div>
            <CodeSnippet code={`<Avatar>
  <div className="flex h-full w-full items-center justify-center bg-brand-green text-white">
    JD
  </div>
</Avatar>`} />
          </PreviewCard>
        </div>

        {/* ScrollArea */}
        <div className="mb-16">
          <SectionTitle title="Scroll Area" />
          <PreviewCard>
            <ScrollArea className="h-32 w-full rounded-md border p-4">
              <div className="space-y-3">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="text-sm">
                    Item {i + 1} — Lorem ipsum dolor sit amet consectetur adipiscing elit.
                  </div>
                ))}
              </div>
            </ScrollArea>
            <CodeSnippet code={`<ScrollArea className="h-32 w-full rounded-md border p-4">
  <div className="space-y-3">...</div>
</ScrollArea>`} />
          </PreviewCard>
        </div>

        {/* Combined Example */}
        <div className="mb-16">
          <SectionTitle title="Composition Example" description="Real-world combination of components" />
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-brand-orange text-white mb-2">New Arrival</Badge>
                  <CardTitle>Organic Fruit Basket</CardTitle>
                  <CardDescription>Curated selection of seasonal fruits</CardDescription>
                </div>
                <Avatar className="h-12 w-12">
                  <div className="flex h-full w-full items-center justify-center bg-brand-green text-white font-medium">
                    SG
                  </div>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium ml-1">4.9</span>
                <span className="text-sm text-muted-foreground">(128 reviews)</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Includes apples, oranges, bananas, and seasonal berries. Perfect for a healthy lifestyle.
              </p>
              <Separator className="mb-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">$24.99</p>
                  <p className="text-xs text-muted-foreground">Free delivery</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
