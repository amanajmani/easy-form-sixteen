"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { formatIndianCurrency } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
    tooltipLabel: string;
  };
}

interface TaxableVsNonProps {
  totalSalary: number;
  taxableIncome: number;
  savedMoneyPercentage: string;
}

const chartConfig: ChartConfig = {
  Taxable: {
    label: "Taxable",
    tooltipLabel: "Oh, the tax monster’s got this! 💀💸",
    color: "hsl(var(--chart-4))",
  },
  non: {
    label: "Non - Taxable",
    tooltipLabel: "Lucky you! 🏖️ You saved a lot and loving it! 🎉",
    color: "hsl(var(--chart-3))",
  }
}

export default function TaxableVsNon({
  totalSalary,
  taxableIncome,
  savedMoneyPercentage
}: TaxableVsNonProps) {

  const chartData = [
    {
      displayLabel: chartConfig.Taxable.label, // Custom label for display
      tooltipLabel: chartConfig.Taxable.tooltipLabel,
      actualData: taxableIncome,
      fill: "var(--color-Taxable)"
    },
    {
      displayLabel: chartConfig.non.label, // Custom label for display
      tooltipLabel: chartConfig.non.tooltipLabel,
      actualData: totalSalary - taxableIncome,
      fill: "var(--color-non)"
    }
  ];

  return (
    <Card className="h-full h-[440px] overflow-hidden py-3 shadow-sm px-1 rounded-3xl border-none">

      <CardHeader>
        <CardTitle>Taxable Vs Non-Taxable Income</CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-4 mb-14 mt-7">
        <ChartContainer config={chartConfig}>
          <BarChart
            // accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="displayLabel"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <XAxis dataKey="actualData" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={({ payload }) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-3xl bg-background p-2 shadow-md border">
                      <div className="text-sm font-medium">{data.tooltipLabel}</div>
                      <div className="text-sm">{formatIndianCurrency(data.actualData)}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="actualData" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
        </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          You have saved {savedMoneyPercentage}% of Your Total Income 💰
        </div>
        <div className="leading-none text-muted-foreground">
          April 1st - March 31st
        </div>
      </CardFooter>
    </Card>
  )
}
