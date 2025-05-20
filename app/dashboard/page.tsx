"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Title } from "@/components/custom/title";
import { Card } from "@/components/ui/card";
import { CalendarRange, BarChart3, ArrowUpRight } from "lucide-react";
import { RecentApplications } from "./buildings/_components/recent-applications";
import { BuildingSummary } from "./buildings/_components/building-summary";
import { Overview } from "./buildings/_components/overview";
import PageWrapper from "@/components/custom/page-wrapper";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <PageWrapper className="">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Title size="h2" className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </Title>
          <p className="mt-1 flex items-center text-muted-foreground">
            <CalendarRange className="mr-1.5 h-4 w-4" />
            <span>Data from April 1 - April 10, 2025</span>
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-1.5 text-sm text-muted-foreground dark:bg-slate-800/50">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span>
            Last updated: <span className="font-medium">Today at 12:44 PM</span>
          </span>
        </div>
      </div>

      {/* Modern tabs with animation */}
      <Card className="overflow-hidden border-none shadow-none">
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex items-center justify-between pb-3 pt-6 dark:border-slate-800">
            <TabsList className="flex gap-2">
              <TabsTrigger
                value="overview"
                className="relative rounded-full px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="buildings"
                className="relative rounded-full px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Buildings
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="relative rounded-full px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Applications
              </TabsTrigger>
            </TabsList>

            <a
              href="#"
              className="flex items-center text-sm text-primary hover:underline md:flex"
            >
              <span>View detailed reports</span>
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </a>
          </div>

          <div className="p-0">
            <TabsContent value="overview" className="mt-0 space-y-6">
              <Overview />
            </TabsContent>
            <TabsContent value="buildings" className="mt-0 space-y-6">
              <BuildingSummary />
            </TabsContent>
            <TabsContent value="applications" className="mt-0 space-y-6">
              <RecentApplications />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </PageWrapper>
  );
}
