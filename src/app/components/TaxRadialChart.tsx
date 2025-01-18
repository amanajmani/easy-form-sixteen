"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart, Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip
} from "@/components/ui/chart"

interface ComponentProps {
  hra: number;
  deductions: number;
  standardDeductions: number;
  lta: number;
  totalSalary: number;
  taxableIncome: number;
}

const chartConfig = {
  Travel: {
    label: "Travel",  // For chart display
    tooltipLabel: "Travel Savings ✈️", // For hover tooltip
    color: "hsl(var(--chart-6))",
  },
  hra: {
    label: "HRA",
    tooltipLabel: "Rent Relief 🏠",
    color: "hsl(var(--chart-3))",
  },
  deductions: {
    label: "Deductions",
    tooltipLabel: "Tax-Free Essentials 📈",
    color: "hsl(var(--chart-1))",
  },
  investments: {
    label: "Investments",
    tooltipLabel: "Smart Investments 💡",
    color: "hsl(var(--chart-5))",
  }
}

export function TaxRadialChart({
  hra,
  deductions,
  standardDeductions,
  lta,
  totalSalary,
  taxableIncome
}: ComponentProps) {

  const chartData = [
    {
      displayLabel: chartConfig.Travel.label,
      tooltipLabel: chartConfig.Travel.tooltipLabel,
      visitors: lta,
      fill: "var(--color-Travel)"
    },
    {
      displayLabel: chartConfig.hra.label,
      tooltipLabel: chartConfig.hra.tooltipLabel,
      visitors: hra,
      fill: "var(--color-hra)"
    },
    {
      displayLabel: chartConfig.deductions.label,
      tooltipLabel: chartConfig.deductions.tooltipLabel,
      visitors: standardDeductions,
      fill: "var(--color-deductions)"
    },
    {
      displayLabel: chartConfig.investments.label,
      tooltipLabel: chartConfig.investments.tooltipLabel,
      visitors: deductions,
      fill: "var(--color-investments)"
    }
  ]

  return (
    <Card className="h-[440px]flex flex-col overflow-hidden shadow-sm border-none rounded-3xl">
      <CardHeader className="items-center pb-0">
        <CardTitle>Your Tax Savings Breakdown 💸</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-3 md:p-4 overflow-hidden">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-full w-full"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={40}
            outerRadius={134}
            className="h-full w-full"
          >
            <ChartTooltip
              cursor={false}
              content={({ payload }) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-3xl bg-background p-2 shadow-md border">
                      <div className="text-sm font-medium">{data.tooltipLabel}</div>
                      <div className="text-sm">₹{data.visitors.toLocaleString()}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <RadialBar dataKey="visitors" background>
              <LabelList
                position="insideStart"
                dataKey="displayLabel"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          You've saved ₹{totalSalary - taxableIncome} in taxes! <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          April 1st - March 31st
        </div>
      </CardFooter>
    </Card>
  )
}
