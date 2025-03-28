"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  {
    name: "Jan",
    occupancy: 89,
    applications: 12,
  },
  {
    name: "Feb",
    occupancy: 92,
    applications: 18,
  },
  {
    name: "Mar",
    occupancy: 87,
    applications: 14,
  },
  {
    name: "Apr",
    occupancy: 85,
    applications: 22,
  },
  {
    name: "May",
    occupancy: 88,
    applications: 16,
  },
  {
    name: "Jun",
    occupancy: 90,
    applications: 19,
  },
  {
    name: "Jan",
    occupancy: 89,
    applications: 12,
  },
  {
    name: "Feb",
    occupancy: 92,
    applications: 18,
  },
  {
    name: "Mar",
    occupancy: 87,
    applications: 14,
  },
  {
    name: "Apr",
    occupancy: 85,
    applications: 22,
  },
  {
    name: "Jan",
    occupancy: 89,
    applications: 12,
  },
  {
    name: "Feb",
    occupancy: 92,
    applications: 18,
  },
];

export function Overview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>
          View occupancy rates and tenant applications over the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip />
            <Bar dataKey="occupancy" fill="#004347" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="applications"
              fill="#00434755"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
