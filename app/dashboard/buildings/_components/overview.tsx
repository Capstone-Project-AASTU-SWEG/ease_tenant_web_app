"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  LineChart as LineChartIcon,
} from "lucide-react";

const data = [
  {
    name: "Jan",
    occupancy: 89,
    applications: 12,
    target: 90,
  },
  {
    name: "Feb",
    occupancy: 92,
    applications: 18,
    target: 90,
  },
  {
    name: "Mar",
    occupancy: 87,
    applications: 14,
    target: 90,
  },
  {
    name: "Apr",
    occupancy: 85,
    applications: 22,
    target: 90,
  },
  {
    name: "May",
    occupancy: 88,
    applications: 16,
    target: 90,
  },
  {
    name: "Jun",
    occupancy: 90,
    applications: 19,
    target: 90,
  },
  {
    name: "Jul",
    occupancy: 93,
    applications: 21,
    target: 90,
  },
  {
    name: "Aug",
    occupancy: 91,
    applications: 17,
    target: 90,
  },
  {
    name: "Sep",
    occupancy: 89,
    applications: 15,
    target: 90,
  },
  {
    name: "Oct",
    occupancy: 94,
    applications: 23,
    target: 90,
  },
  {
    name: "Nov",
    occupancy: 92,
    applications: 20,
    target: 90,
  },
  {
    name: "Dec",
    occupancy: 95,
    applications: 25,
    target: 90,
  },
];

// Define types for CustomTooltip props
type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    value: number;
    name: string;
    color: string;
    payload: any;
  }[];
  label?: string;
};

// Custom tooltip component with proper typing
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-neutral-200/50 bg-background/90 p-3 shadow-lg backdrop-blur-md">
        <p className="mb-1 text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <div
            key={`item-${index}`}
            className="flex items-center gap-2 text-sm"
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">
              {entry.name === "Occupancy" || entry.name === "Target"
                ? `${entry.value}%`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export function Overview() {
  const [timeRange, setTimeRange] = useState("6m");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [showTarget, setShowTarget] = useState(true);

  // Filter data based on selected time range
  const getFilteredData = () => {
    switch (timeRange) {
      case "3m":
        return data.slice(0, 3);
      case "6m":
        return data.slice(0, 6);
      case "ytd":
        return data.slice(0, new Date().getMonth() + 1);
      case "1y":
        return data;
      default:
        return data.slice(0, 6);
    }
  };

  const filteredData = getFilteredData();

  // Calculate statistics
  const currentOccupancy = filteredData[filteredData.length - 1].occupancy;
  const previousOccupancy =
    filteredData[filteredData.length - 2]?.occupancy || 0;
  const occupancyChange = currentOccupancy - previousOccupancy;
  const totalApplications = filteredData.reduce(
    (sum, item) => sum + item.applications,
    0,
  );

  // Determine if occupancy is trending up or down
  const isOccupancyUp = occupancyChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Tabs
              defaultValue={timeRange}
              onValueChange={setTimeRange}
              className="w-full sm:w-auto"
            >
              <TabsList className="bg-background/50 backdrop-blur-sm">
                <TabsTrigger
                  value="3m"
                  className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  3 Months
                </TabsTrigger>
                <TabsTrigger
                  value="6m"
                  className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  6 Months
                </TabsTrigger>
                <TabsTrigger
                  value="ytd"
                  className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  YTD
                </TabsTrigger>
                <TabsTrigger
                  value="1y"
                  className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  1 Year
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Select
              defaultValue={chartType}
              onValueChange={(value) => {
                setChartType(value as any);
              }}
            >
              <SelectTrigger className="h-8 w-[130px] border-neutral-200/50 bg-background/60 text-xs backdrop-blur-sm">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">
                  <div className="flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Bar Chart</span>
                  </div>
                </SelectItem>
                <SelectItem value="line">
                  <div className="flex items-center">
                    <LineChartIcon className="mr-2 h-4 w-4" />
                    <span>Line Chart</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-lg border border-neutral-200/30 bg-background/60 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Current Occupancy
                </p>
                <div
                  className={`flex items-center ${isOccupancyUp ? "text-green-500" : "text-red-500"}`}
                >
                  {isOccupancyUp ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-end">
                <h3 className="text-2xl font-bold">{currentOccupancy}%</h3>
                <span
                  className={`ml-2 text-sm ${isOccupancyUp ? "text-green-500" : "text-red-500"}`}
                >
                  {isOccupancyUp ? "+" : ""}
                  {occupancyChange}%
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                vs previous period
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="rounded-lg border border-neutral-200/30 bg-background/60 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Total Applications
                </p>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2">
                <h3 className="text-2xl font-bold">{totalApplications}</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {timeRange === "3m"
                  ? "Last 3 months"
                  : timeRange === "6m"
                    ? "Last 6 months"
                    : timeRange === "ytd"
                      ? "Year to date"
                      : "Last 12 months"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="rounded-lg border border-primary/20 bg-primary/10 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-primary/80">Target Occupancy</p>
                <div className="flex items-center gap-2">
                  <button
                    className={`h-4 w-8 rounded-full ${showTarget ? "bg-primary" : "bg-muted"} relative transition-colors`}
                    onClick={() => setShowTarget(!showTarget)}
                  >
                    <span
                      className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${showTarget ? "left-4" : "left-1"}`}
                    />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-2xl font-bold text-primary">90%</h3>
              </div>
              <p className="mt-1 text-xs text-primary/70">Annual target</p>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${timeRange}-${chartType}-${showTarget}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

              <ResponsiveContainer width="100%" height={350}>
                {chartType === "bar" ? (
                  <BarChart
                    data={filteredData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="occupancyGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#004347"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#004347"
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                      <linearGradient
                        id="applicationsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0ea5e9"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0ea5e9"
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      padding={{ left: 10, right: 10 }}
                    />

                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        `${value}${value <= 100 ? "%" : ""}`
                      }
                      domain={[0, "dataMax + 10"]}
                    />

                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 15 }}
                      formatter={(value) => (
                        <span className="text-sm font-medium">{value}</span>
                      )}
                    />

                    {showTarget && (
                      <ReferenceLine
                        y={90}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                        label={{
                          value: "Target",
                          position: "insideTopRight",
                          fill: "#ef4444",
                          fontSize: 12,
                        }}
                      />
                    )}

                    <Bar
                      dataKey="occupancy"
                      name="Occupancy"
                      fill="url(#occupancyGradient)"
                      stroke="#004347"
                      strokeWidth={1}
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />

                    <Bar
                      dataKey="applications"
                      name="Applications"
                      fill="url(#applicationsGradient)"
                      stroke="#0ea5e9"
                      strokeWidth={1}
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      animationBegin={300}
                    />
                  </BarChart>
                ) : (
                  <LineChart
                    data={filteredData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="occupancyGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#004347"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#004347"
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                      <linearGradient
                        id="applicationsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0ea5e9"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0ea5e9"
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      padding={{ left: 10, right: 10 }}
                    />

                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        `${value}${value <= 100 ? "%" : ""}`
                      }
                      domain={[0, "dataMax + 10"]}
                    />

                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 15 }}
                      formatter={(value) => (
                        <span className="text-sm font-medium">{value}</span>
                      )}
                    />

                    {showTarget && (
                      <ReferenceLine
                        y={90}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                        label={{
                          value: "Target",
                          position: "insideTopRight",
                          fill: "#ef4444",
                          fontSize: 12,
                        }}
                      />
                    )}

                    <Line
                      type="monotone"
                      dataKey="occupancy"
                      name="Occupancy"
                      stroke="#004347"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />

                    <Line
                      type="monotone"
                      dataKey="applications"
                      name="Applications"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      animationBegin={300}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
