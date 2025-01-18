import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, LabelList } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface ComponentProps {
  hra: number;
  deductions: number;
  standardDeductions: number;
  lta: number;
}

const chartConfig: ChartConfig = {
  hra: {
    label: "HRA",
    color: "hsl(var(--chart-1))",
  },
  standard: {
    label: "Standard",
    color: "hsl(var(--chart-2))",
  },
  deductions: {
    label: "Deductions",
    color: "hsl(var(--chart-3))",
  },
  lta: {
    label: "LTA",
    color: "hsl(var(--chart-4))",
  }
};

export default function Component({
  hra,
  deductions,
  standardDeductions,
  lta,
}: ComponentProps) {
  const chartData = [
    { label: "hra", visitors: Number(hra), fill: "var(--color-hra)" },
    { label: "standard", visitors: Number(standardDeductions), fill: "var(--color-standard)" },
    { label: "deductions", visitors: Number(deductions), fill: "var(--color-deductions)" },
    { label: "lta", visitors: Number(lta), fill: "var(--color-lta)" },
  ]

  const maxValueIndex = chartData.reduce((maxIndex, current, index, array) => {
    return current.visitors > array[maxIndex].visitors ? index : maxIndex
  }, 0)

  // Get the highest value
  const highestValue = chartData[maxValueIndex].visitors
  const highestLabel = chartConfig[chartData[maxValueIndex].label]?.label

  return (
    <Card className="flex flex-col overflow-hidden shadow-sm border-none rounded-3xl">
      <CardHeader>
        <CardTitle>Which deductions has the highest savings?</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <Bar
              dataKey="visitors"
              strokeWidth={2}
              radius={8}
              activeIndex={maxValueIndex}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                )
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          You saved the highest amount with {highestLabel}: ₹{highestValue.toLocaleString()}
        </div>
        <div className="leading-none text-muted-foreground">
          April 1st - March 31st
        </div>
      </CardFooter>
    </Card>
  )
}
