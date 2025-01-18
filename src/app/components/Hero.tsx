import { FileText, TrendingUp, Shield } from 'lucide-react'

export function Hero() {
  return (
    <section className="text-center mb-8 md:mb-12">
      <div className="inline-flex items-center bg-gradient-to-r from-[#F48087] via-[#F48087] to-[#FFA42C] px-3 py-1 md:px-4 md:py-2 rounded-full shadow-md mb-4 md:mb-6">
        <span className="text-xs md:text-sm font-medium text-white mr-2">Form 16 Visualizer</span>
        <span className="bg-white text-[#F48087] text-xs font-semibold px-2 py-0.5 rounded-full">Beta</span>
      </div>

      <h1 className="text-3xl md:text-7xl font-bold mb-2 md:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#F48087] via-[#F48087] to-[#FFA42C] leading-normal md:leading-snug">
        Simplify Your Taxes 🚀
      </h1>

      <p className="text-base font-bold md:text-xl mb-6 md:mb-8 text-gray-500 max-w-2xl mx-auto">
        Upload your Form 16, and we'll transform it into easy-to-understand visuals in seconds.
      </p>
      <div className="flex justify-center space-x-4 md:space-x-8 mb-8 md:mb-12">
        <FeatureIcon icon={FileText} text="Easy Upload" />
        <FeatureIcon icon={TrendingUp} text="Visual Insights" />
        <FeatureIcon icon={Shield} text="100% Secure" />
      </div>
    </section>
  )
}

function FeatureIcon({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-2 md:p-3 rounded-full shadow-md mb-2">
        <Icon className="w-4 h-4 md:w-6 md:h-6 text-[#FFA42C]" />
      </div>
      <span className="text-xs md:text-sm font-medium text-gray-600">{text}</span>
    </div>
  )
}
