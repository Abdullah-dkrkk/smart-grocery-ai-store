import { Leaf, Target, Heart } from "lucide-react"
import { AnnouncementBarWrapper } from "@/components/sections/announcement-bar-wrapper"
import { Header } from "@/components/sections/header"
import { Footer } from "@/components/store/footer"

const values = [
  {
    icon: Leaf,
    title: "Fresh & Sustainable",
    description: "We source the freshest produce from local farms and sustainable suppliers, ensuring every item meets our high quality standards.",
  },
  {
    icon: Target,
    title: "AI-Powered Precision",
    description: "Our intelligent system learns your preferences, dietary needs, and shopping habits to deliver personalized recommendations.",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "We believe in giving back. Every purchase supports local farmers and community initiatives focused on food accessibility.",
  },
]

export default function AboutPage() {
  return (
    <>
      <AnnouncementBarWrapper />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <section className="text-center mb-16">
            <span className="inline-block bg-brand-green text-white mb-4 text-xs px-3 py-1 rounded-full">About Us</span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">
              About SmartGrocery
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Revolutionizing the way you shop for groceries with the power of artificial intelligence.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-heading font-semibold mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                SmartGrocery was born from a simple idea: grocery shopping should be smarter, faster, and more personalized.
                Founded in 2023, our team of technologists and food enthusiasts came together to build an AI-powered platform
                that understands your unique preferences, dietary requirements, and lifestyle.
              </p>
              <p>
                What started as a small online store has grown into a comprehensive grocery ecosystem serving thousands of
                customers. We combine cutting-edge machine learning with a passion for quality food to create a shopping
                experience that adapts to you — not the other way around.
              </p>
              <p>
                Today, we partner with over 500 local farmers, organic producers, and artisanal food makers to bring the
                best ingredients directly to your door. Our AI assistant helps with meal planning, nutritional tracking,
                and even generates customized shopping lists based on your health goals.
              </p>
            </div>
          </section>

          <section className="mb-16 bg-brand-green-light dark:bg-brand-green/10 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-heading font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              To make healthy, fresh food accessible to everyone through intelligent technology.
              We believe that eating well shouldn&apos;t be complicated — and that the right tools can transform
              the way people think about grocery shopping and nutrition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-semibold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((v) => {
                const Icon = v.icon
                return (
                  <div key={v.title} className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-green-light dark:bg-brand-green/20 mb-4">
                      <Icon className="h-7 w-7 text-brand-green" />
                    </span>
                    <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.description}</p>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
