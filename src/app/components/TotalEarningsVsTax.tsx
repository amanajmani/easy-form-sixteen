"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { formatIndianCurrency } from "@/lib/utils"

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
  totalSalary: number;
  totalTax: number;
  taxPercentage: string;
}

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

const chartConfig: ChartConfig = {
  salary: {
    label: "Salary 🤑",
    color: "hsl(var(--chart-1))",
  },
  tax: {
    label: "Tax 🧾",
    color: "hsl(var(--chart-2))",
  }
}

export default function Component({
  totalSalary,
  totalTax,
  taxPercentage
}: ComponentProps) {
  const chartData = [
    { browser: "salary", visitors: totalSalary, fill: "var(--color-salary)" },
    { browser: "tax", visitors: totalTax, fill: "var(--color-tax)" }
  ]

  return (
    <Card className="h-[440px] flex flex-col shadow-sm border-none rounded-3xl">
      <CardHeader className="items-center pb-0">
        <CardTitle>Your Total Earnings vs Tax</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          // className="mx-auto h-full w-full"
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart className="mt-10">
            <ChartTooltip
              cursor={false}
              content={({ payload }) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                  const label = chartConfig[data.browser]?.label;
                  const value = data.visitors;
                  return (
                    <div className="rounded-3xl bg-background p-2 shadow-md border">
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-sm">{formatIndianCurrency(value)}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={110}
              outerRadius={125}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-[15px] font-bold"
                        >
                          {formatIndianCurrency(totalSalary)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Salary
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
       <CardFooter className="flex-col gap-2 text-sm">
       <div className="flex items-center gap-2 font-medium leading-none">
        You paid {taxPercentage}% tax of your total salary
        </div>
        <div className="leading-none text-muted-foreground">
        April 1st - March 31st
        </div>
      </CardFooter>
    </Card>
  )
}
