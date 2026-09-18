import Link from 'next/link'
import { ToolMetadata } from '../data/tools'
import {
  Percent,
  Award,
  School,
  Search,
  CheckSquare,
  Clock,
  TrendingUp,
  FileText,
  GraduationCap,
  UserCheck,
  Target,
  BarChart2,
  Calendar,
  DollarSign,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Gift,
  CreditCard,
  Receipt,
  PiggyBank,
  Repeat,
  Smile,
  Activity,
  Calculator,
  RefreshCw,
  Tag,
  Minimize2,
  Divide,
  BookOpen,
  Briefcase,
  IndianRupee,
  ArrowRight,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Percent,
  Award,
  School,
  Search,
  CheckSquare,
  Clock,
  TrendingUp,
  FileText,
  GraduationCap,
  UserCheck,
  Target,
  BarChart2,
  Calendar,
  DollarSign,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Gift,
  CreditCard,
  Receipt,
  PiggyBank,
  Repeat,
  Smile,
  Activity,
  Calculator,
  RefreshCw,
  Tag,
  Minimize2,
  Divide,
  BookOpen,
  Briefcase,
  IndianRupee,
}

export function ToolCard({ tool }: { tool: ToolMetadata }) {
  const IconComponent = iconMap[tool.icon] || Calculator

  const categoryColorMap: Record<string, { badge: string; iconBg: string }> = {
    jee: { badge: 'bg-orange-50 text-orange-700 border-orange-200', iconBg: 'bg-orange-100 text-orange-600' },
    student: { badge: 'bg-blue-50 text-blue-700 border-blue-200', iconBg: 'bg-blue-100 text-blue-600' },
    career: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', iconBg: 'bg-emerald-100 text-emerald-600' },
    finance: { badge: 'bg-purple-50 text-purple-700 border-purple-200', iconBg: 'bg-purple-100 text-purple-600' },
    calculators: { badge: 'bg-slate-100 text-slate-700 border-slate-200', iconBg: 'bg-slate-100 text-slate-700' },
  }

  const colors = categoryColorMap[tool.category] || categoryColorMap.calculators

  return (
    <Link
      href={tool.route}
      className="group relative flex flex-col justify-between p-5 bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all duration-150"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.iconBg}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${colors.badge}`}>
            {tool.categoryName}
          </span>
        </div>
        <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors text-base line-clamp-1 mb-1.5">
          {tool.title}
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-sky-600 group-hover:text-sky-700">
        <span>Open Calculator</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  )
}
