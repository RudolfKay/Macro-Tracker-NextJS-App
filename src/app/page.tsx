import Link from "next/link"
import Image from "next/image"
import { ChevronRight, BarChart3, PieChart, Utensils, Activity, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FeatureCard } from "@/components/landing/FeatureCard"
import { HowItWorksStep } from "@/components/landing/HowItWorksStep"
import { TestimonialCard } from "@/components/landing/TestimonialCard"
import { PricingCard } from "@/components/landing/PricingCard"
import { SignupRedirectButton } from "@/components/landing/SignupRedirectButton"

const features = [
  {
    icon: PieChart,
    title: "Set Macro Goals",
    description: "Define your daily protein, carbs, and fat targets based on your fitness goals and dietary needs.",
  },
  {
    icon: Utensils,
    title: "Track Your Food",
    description: "Log your meals and snacks with accurate macro values to stay on track with your daily goals.",
  },
  {
    icon: Activity,
    title: "Monitor Progress",
    description: "View your daily macro intake and see how close you are to hitting your personalized targets.",
  },
]

const howItWorksSteps = [
  {
    stepNumber: 1,
    title: "Set Your Macro Goals",
    description: "Enter your daily protein, carbs, and fat targets based on your fitness goals.",
  },
  {
    stepNumber: 2,
    title: "Log Your Meals",
    description: "Add foods to your daily log with their macro values to track your intake.",
  },
  {
    stepNumber: 3,
    title: "Stay On Track",
    description: "Monitor your progress throughout the day and adjust your meals as needed.",
  },
]

const testimonials = [
  {
    image: "/testimonials/sarah.jpg",
    name: "Sarah K.",
    role: "Fitness Coach",
    testimonial:
      '"MacroTrack has transformed how I manage my clients\' nutrition plans. The detailed insights and easy tracking make my job so much easier."',
  },
  {
    image: "/testimonials/michael.jpg",
    name: "Michael T.",
    role: "Marathon Runner",
    testimonial:
      '"I\'ve tried many nutrition apps, but MacroTrack is by far the most intuitive. It\'s helped me optimize my training diet for peak performance."',
  },
  {
    image: "/testimonials/jamie.jpg",
    name: "Jamie L.",
    role: "Weight Loss Journey",
    testimonial:
      '"MacroTrack made understanding nutrition simple. I\'ve lost 30 pounds by following my personalized macro targets!"',
  },
]

const pricingPlans = [
  {
    title: "Basic",
    price: "Free",
    description: "Perfect for beginners",
    features: [
      "Basic macro tracking",
      "Food database access",
      "Weekly reports",
    ],
    buttonLabel: "Get Started",
    buttonHref: "/signup",
    highlight: false,
  },
  {
    title: "Pro",
    price: "$9.99",
    description: "For serious fitness enthusiasts",
    features: [
      "Everything in Basic",
      "Advanced analytics",
      "Meal planning tools",
      "Barcode scanner",
    ],
    buttonLabel: "Start 7-Day Trial",
    buttonHref: "/signup",
    highlight: true,
    highlightLabel: "Popular",
  },
  {
    title: "Premium",
    price: "$19.99",
    description: "For coaches and professionals",
    features: [
      "Everything in Pro",
      "Client management",
      "Custom meal templates",
      "Priority support",
    ],
    buttonLabel: "Contact Sales",
    buttonHref: "/signup",
    highlight: false,
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-16 lg:py-20 xl:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center items-center text-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none drop-shadow-lg">
                    Track Your Macros, Achieve Your Goals
                  </h1>
                  <p className="text-muted-foreground md:text-xl">
                    The smart way to monitor your nutrition. <br />Personalized macro tracking that adapts to your lifestyle
                    and fitness goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <SignupRedirectButton icon={<ChevronRight className="h-4 w-4" />}>
                    Get Started
                  </SignupRedirectButton>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="/food-hero.jpg"
                width={550}
                height={550}
                alt="Landing Page Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-black/40 absolute inset-0 z-10" />
            <Image src="/bg-features.jpg" alt="Delicious Food" fill priority className="object-cover w-full h-full" />
          </div>
          <div className="container px-4 md:px-6 relative z-20">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white drop-shadow-lg">
                  Everything You Need to Track Your Nutrition
                </h2>
                <p className="max-w-[900px] md:text-xl text-gray-100 drop-shadow">
                  Simple tools to set your macro goals and track your daily food intake with precision.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <FeatureCard key={idx} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl drop-shadow-lg">Simple Steps to Nutritional Success</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Getting started with MacroTrack is easy. Follow these simple steps to begin your journey.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3">
              {howItWorksSteps.map((step, idx) => (
                <HowItWorksStep key={idx} {...step} />
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-black/40 absolute inset-0 z-10" />
            <Image src="/bg-testimonials.jpg" alt="Wellness Lake Background" fill priority className="object-cover w-full h-full" />
          </div>
          <div className="container px-4 md:px-6 relative z-20">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white drop-shadow-lg">
                  Loved by Fitness Enthusiasts
                </h2>
                <p className="max-w-[900px] md:text-xl text-gray-100 drop-shadow">
                  See what our users have to say about their experience with MacroTrack.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, idx) => (
                <TestimonialCard key={idx} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl drop-shadow-lg">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Choose the plan that fits your needs. All plans include core tracking features.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              {pricingPlans.map((plan, idx) => (
                <PricingCard
                  key={idx}
                  {...plan}
                  {...(plan.buttonHref === "/signup"
                    ? { customButton: (
                        <SignupRedirectButton size="lg">
                          {plan.buttonLabel}
                        </SignupRedirectButton>
                      ) }
                    : { customButton: (
                        <Button className="w-full" asChild={true} variant={plan.highlight ? undefined : "outline"}>
                          <Link href={plan.buttonHref}>{plan.buttonLabel}</Link>
                        </Button>
                      ) }
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50 dark:bg-emerald-900/30">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight drop-shadow-lg">
                Ready to transform your nutrition?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of users who have already improved their health and fitness with MacroTrack.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <SignupRedirectButton icon={<ArrowRight className="h-4 w-4" />}>
                Get Started
              </SignupRedirectButton>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl drop-shadow-lg">Stay Updated</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Subscribe to our newsletter for tips, updates, and exclusive offers.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1 bg-white text-gray-900" />
                  <Button type="submit">Subscribe</Button>
                </form>
                <p className="text-xs text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-500" />
            <p className="text-sm font-medium">© {new Date().getFullYear()} MacroTrack. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
