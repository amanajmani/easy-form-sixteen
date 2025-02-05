'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TaxRadialChart } from "./TaxRadialChart"
import CustomBarChart from "./CustomBarChart"
import { useSearchParams } from 'next/navigation';
import TotalEarningsVsTax from '../components/TotalEarningsVsTax';
import TaxableVsNon from '../components/TaxableVsNon';
import Image from 'next/image';

const sections = [
  { id: 'summary', emoji: '💼', title: 'Summary' },
  { id: 'nittyGritties', emoji: '🔍', title: 'Nitty Gritties' },
]

type TaxData = {
  totalSalary: number;
  hra: number;
  totalExemptions: number;
  deductions: number;
  standardDeductions: number;
  taxableIncome: number;
  totalTax: number;
  lta: number;
};

interface AnimatedSectionProps {
  activeSection: string;
  taxData: TaxData;
}

export default function ResultsDisplay() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsPage />
    </Suspense>
  );
}

function ResultsPage() {
  const [activeSection, setActiveSection] = useState('summary')
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true)

  function parseNumberOrDefault(value: string | null, defaultValue: number = 0): number {
    const parsedValue = parseFloat(value ?? "");
    return isNaN(parsedValue) ? defaultValue : parsedValue;
  }

  const taxData: TaxData = {
    totalSalary: parseNumberOrDefault(searchParams.get('totalSalary'), 0),
    hra: parseNumberOrDefault(searchParams.get('hra'), 0),
    totalExemptions: parseNumberOrDefault(searchParams.get('totalExemptions'), 0),
    deductions: parseNumberOrDefault(searchParams.get('deductions'), 0),
    standardDeductions: parseNumberOrDefault(searchParams.get('standardDeductions'), 0),
    taxableIncome: parseNumberOrDefault(searchParams.get('taxableIncome'), 0),
    totalTax: parseNumberOrDefault(searchParams.get('totalTax'), 0),
    lta: parseNumberOrDefault(searchParams.get('lta'), 0),
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2200)

    return () => clearTimeout(timer)
  }, [])


  return (
    <div className="w-full">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-6xl lg:text-8xl font-extrabold text-[#F48087]">Preparing your tax dashboard...</div>
        </div>
      ) : (
        <>
          <div className="flex items-center w-full space-x-6 justify-between mb-6 p-1 flex-col md:flex-row">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Image
                src="/logo.png"
                alt="Logo"
                width={65}
                height={65}
                className="object-contain"
              />
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl md:text-4xl">
                  <span className="font-extrabold text-black">Easy</span>
                  <span className="font-light text-gray-500">Sixteen</span>
                </h1>
                <p className="text-xs sm:text-sm md:text-xs font-serif text-gray-500 tracking-wide leading-relaxed mt-1">
                  A visual journey of your Form 16
                </p>
              </div>
            </div>

            <div className="border-l border-gray-300 h-auto hidden md:block"></div>

            <div className="flex flex-row space-x-4 sm:space-x-5 md:space-x-6 flex-wrap justify-center md:justify-start">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "secondary" : "ghost"}
                  className={`flex-1 justify-center md:flex-none group rounded-lg p-3 ${activeSection === section.id
                      ? "bg-[#F78589] text-[#F5F8FB] hover:text-[#F78589] hover:bg-white"
                      : "bg-white text-black hover:text-[#F78589] hover:bg-white"
                    } rounded-3xl p-6`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className="mr-2 text-2xl">{section.emoji}</span>
                  {section.title}
                </Button>
              ))}
            </div>
          </div>

          <div className="">
            <AnimatedSection activeSection={activeSection} taxData={taxData} />
          </div>
        </>
      )}
    </div>
  )
}

function AnimatedSection({ activeSection, taxData }: AnimatedSectionProps) {
  return (
    <motion.div
      key={activeSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {activeSection === 'summary' && <SummarySection {...taxData} />}
      {activeSection === 'nittyGritties' && <NittyGrittiesSection {...taxData} />}
    </motion.div>
  )
}

const formatIndianCurrency = (number: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(number);
}

function calculateSavedMoneyPercentage(totalIncome: number, nonTaxableIncome: number): string {
  const percentage = (nonTaxableIncome / totalIncome) * 100;
  return percentage.toFixed(2); // returns percentage rounded to 2 decimal places
}

function SummarySection({
  totalSalary,
  taxableIncome,
  totalTax
}: { totalSalary: number, taxableIncome: number, totalTax: number }) {
  const taxPercentage = ((totalTax / totalSalary) * 100).toFixed(2);
  const savedMoneyPercentage = calculateSavedMoneyPercentage(totalSalary, totalSalary - taxableIncome);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard
          emoji="💰"
          title="Your Hard-Earned Salary"
          value={formatIndianCurrency(totalSalary)}
          description="This is the cash you bring home after all the work you put in!"
        />
        <StatCard
          emoji="📊"
          title="Taxable Income"
          value={formatIndianCurrency(taxableIncome)}
          description="What's on the Taxman's Radar"
        />
        <StatCard
          emoji="💸"
          title="Your Tax Bill"
          value={formatIndianCurrency(totalTax)}
          description="The final amount you owe to the government after all the deductions."
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3">
          <TotalEarningsVsTax
            totalSalary={totalSalary}
            totalTax={totalTax}
            taxPercentage={taxPercentage}
          />
        </div>

        <div className="lg:col-span-2">
          <TaxableVsNon
            totalSalary={totalSalary}
            taxableIncome={taxableIncome}
            savedMoneyPercentage={savedMoneyPercentage}
          />
        </div>
      </div>

    </div>
  )
}

function NittyGrittiesSection({
  lta,
  hra,
  totalExemptions,
  standardDeductions,
  deductions,
  totalSalary,
  taxableIncome
}: {
  totalSalary: number,
  taxableIncome: number,
  lta: number,
  hra: number,
  totalExemptions: number,
  standardDeductions: number,
  deductions: number
}) {
  return (

    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatCard
          emoji="📉"
          title="The Tax Ninja Move"
          description="A simple trick that lowers your taxable income without breaking a sweat."
          value={formatIndianCurrency(standardDeductions)}
        />

        <StatCard
          emoji="💰"
          title="Tax Saving Hacks"
          description="The magic deductions that lower your tax burden."
          value={formatIndianCurrency(deductions)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard
          emoji="💸"
          title="LTA"
          description="LTA"
          value={formatIndianCurrency(lta)}
        />

        <StatCard
          emoji="🏠"
          title="Home Sweet Home Allowance"
          description="The money you get for your rent – a little help from your employer."
          value={formatIndianCurrency(hra)}
        />

        <StatCard
          emoji="🛡️"
          title="Your Tax-Free Stash"
          description="Exemptions you’ve claimed to save some money from taxes."
          value={formatIndianCurrency(totalExemptions)}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaxRadialChart
          hra={hra}
          deductions={deductions}
          standardDeductions={standardDeductions}
          lta={lta}
          totalSalary={totalSalary}
          taxableIncome={taxableIncome}
        />
        <CustomBarChart
          hra={hra}
          deductions={deductions}
          standardDeductions={standardDeductions}
          lta={lta}
        />
      </div>


    </div>
  )
}

function StatCard({ emoji, title, value, description }: { emoji: string; title: string; value: string, description: string }) {
  return (
    <Card className="py-3 shadow-sm px-1 rounded-3xl border-none">
      <CardContent className="p-4">
        <div className="flex justify-between mb-3">
          <div className="flex flex-col items-start">
            <h3 className="text-xs md:text-sm font-semibold">{title}</h3>
            <p className="text-2xl md:text-4xl font-semibold text-gray-800">{value}</p>
          </div>
          <div className="text-2xl md:text-4xl mr-2">{emoji}</div>
        </div>
        <p className="text-xs md:text-xs text-gray-500">{description}</p>
      </CardContent>
    </Card>
  )
}
