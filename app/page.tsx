import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Building,
  Users,
  BarChartIcon as ChartBar,
  Shield,
  Calendar,
  ArrowRight,
  Star,
} from "lucide-react";
import { IMAGES } from "@/constants/assets";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">easeTenant</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-sm font-medium transition-colors hover:text-primary md:block"
            >
              Log in
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-b from-white to-gray-50 py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Simplify Commercial Building Management
                  </h1>
                  <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                    easeTenant streamlines tenant relationships, maintenance
                    requests, and financial operations for commercial property
                    managers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="px-8">
                    Request a Demo
                  </Button>
                  <Button size="lg" variant="outline" className="px-8">
                    View Plans
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="inline-block h-8 w-8 rounded-full bg-gray-200 ring-2 ring-white"
                      />
                    ))}
                  </div>
                  <div className="text-gray-500">
                    Trusted by 2,000+ property managers worldwide
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl">
                  <Image
                    src={IMAGES.BUILDING_DETAIL_SCREENSHOT}
                    alt="easeTenant dashboard preview"
                    width={1280}
                    height={720}
                    className="object-cover"
                    priority
                    placeholder="blur"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logos Section */}
        <section className="w-full border-y bg-white py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-xl font-medium tracking-tight text-gray-500">
                  Trusted by leading commercial property companies
                </h2>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 grayscale md:gap-12 lg:gap-16">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-center">
                    <Image
                      src={`/placeholder.svg?height=40&width=120&text=LOGO ${i}`}
                      alt={`Client logo ${i}`}
                      width={120}
                      height={40}
                      className="h-8 md:h-10"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full bg-white py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything you need to manage your properties
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  easeTenant provides a comprehensive suite of tools designed
                  specifically for commercial property management.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Building className="h-10 w-10 text-primary" />,
                  title: "Property Management",
                  description:
                    "Centralize all your building information, floor plans, and unit details in one secure location.",
                },
                {
                  icon: <Users className="h-10 w-10 text-primary" />,
                  title: "Tenant Portal",
                  description:
                    "Provide tenants with a dedicated portal for communication, payments, and maintenance requests.",
                },
                {
                  icon: <ChartBar className="h-10 w-10 text-primary" />,
                  title: "Financial Tracking",
                  description:
                    "Streamline rent collection, track expenses, and generate comprehensive financial reports.",
                },
                {
                  icon: <Calendar className="h-10 w-10 text-primary" />,
                  title: "Maintenance Management",
                  description:
                    "Schedule, assign, and track maintenance tasks from request to completion.",
                },
                {
                  icon: <Shield className="h-10 w-10 text-primary" />,
                  title: "Lease Management",
                  description:
                    "Store, track, and manage all lease agreements with automated renewal notifications.",
                },
                {
                  icon: <ChartBar className="h-10 w-10 text-primary" />,
                  title: "Analytics Dashboard",
                  description:
                    "Gain insights into occupancy rates, revenue trends, and maintenance performance.",
                },
              ].map((feature, i) => (
                <Card
                  key={i}
                  className="group relative overflow-hidden transition-all hover:shadow-lg"
                >
                  <CardHeader className="p-6">
                    <div className="mb-3">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Link
                      href="#"
                      className="inline-flex items-center text-sm font-medium text-primary"
                    >
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Simplified property management in three steps
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get up and running with easeTenant quickly and start seeing
                  results immediately.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Set up your properties",
                  description:
                    "Import your building details, units, and tenant information into the platform.",
                },
                {
                  step: "02",
                  title: "Invite your tenants",
                  description:
                    "Send automated invitations to your tenants to join their dedicated portal.",
                },
                {
                  step: "03",
                  title: "Manage with ease",
                  description:
                    "Handle maintenance, collect rent, and communicate all from one dashboard.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-gray-500">{item.description}</p>
                  {i < 2 && (
                    <div className="absolute left-[calc(100%-2rem)] top-8 hidden w-16 border-t-2 border-dashed border-gray-300 lg:block"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="w-full bg-white py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Trusted by property managers worldwide
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our customers have to say about how easeTenant has
                  transformed their property management.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "easeTenant has revolutionized how we manage our commercial properties. The tenant portal alone has reduced our support calls by 40%.",
                  author: "Sarah Johnson",
                  role: "Property Manager, Westfield Commercial",
                },
                {
                  quote:
                    "The financial tracking features have saved us countless hours each month. We now have real-time insights into our cash flow across all properties.",
                  author: "Michael Chen",
                  role: "CFO, Urban Property Group",
                },
                {
                  quote:
                    "Maintenance management has never been easier. We can track every request from submission to completion, keeping our tenants informed every step of the way.",
                  author: "David Rodriguez",
                  role: "Facilities Director, Metro Buildings",
                },
              ].map((testimonial, i) => (
                <Card key={i} className="text-left">
                  <CardHeader className="pb-0">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-5 w-5 fill-primary text-primary"
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="mb-4 italic">
                      {`"`}
                      {testimonial.quote}
                      {`"`}
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="w-full bg-gray-50 py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Simple, transparent pricing
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan {`that's`} right for your property portfolio.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  name: "Starter",
                  price: "$99",
                  description:
                    "Perfect for small property managers with up to 5 buildings.",
                  features: [
                    "Up to 5 properties",
                    "Up to 50 units",
                    "Tenant portal",
                    "Maintenance requests",
                    "Basic reporting",
                    "Email support",
                  ],
                  cta: "Get Started",
                  popular: false,
                },
                {
                  name: "Professional",
                  price: "$249",
                  description:
                    "Ideal for growing property management companies.",
                  features: [
                    "Up to 20 properties",
                    "Up to 200 units",
                    "All Starter features",
                    "Financial tracking",
                    "Document management",
                    "Advanced reporting",
                    "Priority support",
                  ],
                  cta: "Get Started",
                  popular: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  description:
                    "Tailored solutions for large property portfolios.",
                  features: [
                    "Unlimited properties",
                    "Unlimited units",
                    "All Professional features",
                    "API access",
                    "Custom integrations",
                    "Dedicated account manager",
                    "24/7 support",
                  ],
                  cta: "Contact Sales",
                  popular: false,
                },
              ].map((plan, i) => (
                <Card
                  key={i}
                  className={`flex flex-col ${plan.popular ? "relative border-primary shadow-lg" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-0 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                      {plan.price}
                      {plan.price !== "Custom" && (
                        <span className="ml-1 text-xl font-medium text-gray-500">
                          /month
                        </span>
                      )}
                    </div>
                    <CardDescription className="mt-4">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="contact"
          className="w-full bg-primary py-12 text-primary-foreground md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to transform your property management?
                </h2>
                <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl/relaxed">
                  Join thousands of property managers who have simplified their
                  operations with easeTenant.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" className="px-8">
                  Request a Demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-transparent px-8 text-white hover:bg-white hover:text-primary"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 py-6 text-gray-300 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-6 w-6 text-white" />
                <span className="text-xl font-bold text-white">easeTenant</span>
              </div>
              <p className="max-w-[300px] text-gray-400">
                Simplifying commercial building management for property managers
                worldwide.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} easeTenant. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
