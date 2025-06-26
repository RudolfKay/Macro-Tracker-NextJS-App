import Link from "next/link"
import Image from "next/image"
import { ChevronRight, BarChart3, PieChart, Utensils, Activity, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-16 lg:py-20 xl:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center items-center text-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Track Your Macros, Achieve Your Goals
                  </h1>
                  <p className="text-muted-foreground md:text-xl">
                    The smart way to monitor your nutrition. <br></br>Personalized macro tracking that adapts to your lifestyle
                    and fitness goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/signup">
                      Get Started <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
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
              <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
                <CardHeader>
                  <PieChart className="h-10 w-10 text-emerald-500" />
                  <CardTitle className="mt-4">Set Macro Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Define your daily protein, carbs, and fat targets based on your fitness goals and dietary needs.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
                <CardHeader>
                  <Utensils className="h-10 w-10 text-emerald-500" />
                  <CardTitle className="mt-4">Track Your Food</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Log your meals and snacks with accurate macro values to stay on track with your daily goals.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
                <CardHeader>
                  <Activity className="h-10 w-10 text-emerald-500" />
                  <CardTitle className="mt-4">Monitor Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    View your daily macro intake and see how close you are to hitting your personalized targets.
                  </CardDescription>
                </CardContent>
              </Card>
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
              <div className="flex flex-col items-center space-y-2 border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10 rounded-lg p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white">
                  1
                </div>
                <h3 className="text-xl font-bold">Set Your Macro Goals</h3>
                <p className="text-muted-foreground">
                  Enter your daily protein, carbs, and fat targets based on your fitness goals.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10 rounded-lg p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white">
                  2
                </div>
                <h3 className="text-xl font-bold">Log Your Meals</h3>
                <p className="text-muted-foreground">
                  Add foods to your daily log with their macro values to track your intake.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10 rounded-lg p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white">
                  3
                </div>
                <h3 className="text-xl font-bold">Stay On Track</h3>
                <p className="text-muted-foreground">
                  Monitor your progress throughout the day and adjust your meals as needed.
                </p>
              </div>
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
              <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                      <Image src="/testimonials/sarah.jpg" alt="Sarah K." width={40} height={40} className="object-cover object-center w-10 h-10 rounded-full" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Sarah K.</CardTitle>
                      <CardDescription>Fitness Coach</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "MacroTrack has transformed how I manage my clients' nutrition plans. The detailed insights and easy
                    tracking make my job so much easier."
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                      <Image src="/testimonials/michael.jpg" alt="Michael T." width={40} height={40} className="object-cover object-center w-10 h-10 rounded-full" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Michael T.</CardTitle>
                      <CardDescription>Marathon Runner</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "I've tried many nutrition apps, but MacroTrack is by far the most intuitive. It's helped me
                    optimize my training diet for peak performance."
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                      <Image src="/testimonials/jamie.jpg" alt="Jamie L." width={40} height={40} className="object-cover object-center w-10 h-10 rounded-full" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Jamie L.</CardTitle>
                      <CardDescription>Weight Loss Journey</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "MacroTrack made understanding nutrition simple. I've lost 30 pounds by following my personalized
                    macro targets!"
                  </p>
                </CardContent>
              </Card>
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
              <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <div className="text-3xl font-bold">Free</div>
                  <CardDescription>Perfect for beginners</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Basic macro tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Food database access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Weekly reports</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-2 border-emerald-500 dark:border-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40 shadow-lg shadow-emerald-900/10 -translate-y-2 ring-2 ring-emerald-300 dark:ring-emerald-700">
                <CardHeader>
                  <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    Popular
                  </div>
                  <CardTitle>Pro</CardTitle>
                  <div className="text-3xl font-bold">
                    $9.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>For serious fitness enthusiasts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Everything in Basic</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Meal planning tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Barcode scanner</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/signup">Start 7-Day Trial</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                  <div className="text-3xl font-bold">
                    $19.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>For coaches and professionals</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Client management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Custom meal templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/signup">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>
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
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
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
