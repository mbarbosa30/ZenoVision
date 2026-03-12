import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Block } from "@/components/block";
import { format } from "date-fns";
import { metricDefinitions } from "./metric-definitions";

export const InfoModal = ({ isOpen, onClose, metric }: { isOpen: boolean; onClose: () => void; metric: string }) => {
  if (!isOpen) return null;
  const def = metricDefinitions[metric];
  if (!def) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative bg-[#1a1a1a] border border-[#2d2d2d] max-w-lg w-full mx-4 z-10 max-h-[85vh] overflow-y-auto" data-testid={`modal-info-${metric}`} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#2d2d2d] px-6 py-4 flex items-start justify-between">
          <h4 className="text-lg font-semibold pr-8">{def.title}</h4>
          <button onClick={onClose} className="text-[#a0aec0] hover:text-white text-lg leading-none flex-shrink-0 mt-0.5" data-testid={`button-close-info-${metric}`}>✕</button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-sm text-[#ccc] leading-relaxed">{def.description}</p>
          </div>
          <div>
            <div className="text-xs text-[#3b82f6] uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
              <span className="w-1 h-1 bg-[#3b82f6] inline-block flex-shrink-0" />
              How It's Calculated
            </div>
            <p className="text-sm text-[#ccc] leading-relaxed">{def.calculation}</p>
          </div>
          <div>
            <div className="text-xs text-[#10b981] uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
              <span className="w-1 h-1 bg-[#10b981] inline-block flex-shrink-0" />
              Benchmarks & Targets
            </div>
            <p className="text-sm text-[#ccc] leading-relaxed">{def.benchmarks}</p>
          </div>
          <div>
            <div className="text-xs text-[#f59e0b] uppercase tracking-wider mb-2 font-semibold flex items-center gap-2">
              <span className="w-1 h-1 bg-[#f59e0b] inline-block flex-shrink-0" />
              Studio Context
            </div>
            <p className="text-sm text-[#ccc] leading-relaxed">{def.context}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const InfoButton = ({ metric }: { metric: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="inline-flex items-center justify-center w-4 h-4 text-[10px] border border-[#444] text-[#888] hover:text-white hover:border-[#888] transition-colors leading-none flex-shrink-0"
        title="Info"
        data-testid={`button-info-${metric}`}
      >
        i
      </button>
      <InfoModal isOpen={open} onClose={() => setOpen(false)} metric={metric} />
    </>
  );
};

export const formatNum = (num: number, prefix = ""): string => {
  if (num >= 1000000) {
    return `${prefix}${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 100000) {
    return `${prefix}${(num / 1000).toFixed(0)}K`;
  }
  if (num >= 10000) {
    return `${prefix}${(num / 1000).toFixed(1)}K`;
  }
  if (num >= 1000) {
    return `${prefix}${(num / 1000).toFixed(2)}K`;
  }
  if (num < 10000 && num !== Math.floor(num)) {
    return `${prefix}${num.toFixed(2)}`;
  }
  return `${prefix}${num.toLocaleString()}`;
};

export function smartTickFormat(ts: number, data: Record<string, number | string>[]): string {
  if (!data || data.length === 0) return '';
  const timestamps = data.map(d => Number(d.timestamp)).filter(Boolean);
  if (timestamps.length < 2) return format(new Date(ts), "MMM d HH:mm");
  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);
  const spanHours = (max - min) / (1000 * 60 * 60);
  
  if (spanHours < 6) {
    return format(new Date(ts), "HH:mm");
  } else if (spanHours < 72) {
    return format(new Date(ts), "M/d HH:mm");
  } else {
    return format(new Date(ts), "MMM d");
  }
}

export const StatCard = ({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color = "blue",
  delay = 0,
  testId
}: { 
  label: string; 
  value: string | number; 
  change?: number; 
  icon: React.ComponentType<{ className?: string }>;
  color?: "blue" | "green" | "yellow" | "purple" | "cyan";
  delay?: number;
  testId?: string;
}) => {
  const colors = {
    blue: "text-[#3b82f6] bg-[#3b82f6]/10",
    green: "text-[#10b981] bg-[#10b981]/10",
    yellow: "text-[#f59e0b] bg-[#f59e0b]/10",
    purple: "text-[#8b5cf6] bg-[#8b5cf6]/10",
    cyan: "text-[#06b6d4] bg-[#06b6d4]/10",
  };

  return (
    <Block delay={delay} className="relative overflow-hidden min-h-[100px] p-4">
      <div className={`absolute top-3 right-3 p-1.5 ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="pr-8">
        <div className="text-[10px] text-[#a0aec0] uppercase tracking-wider mb-1.5 font-medium">{label}</div>
        <div className="text-lg sm:text-xl md:text-2xl font-bold mb-1.5 leading-tight" data-testid={testId}>{value}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-[10px] font-medium ${change >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`} data-testid={testId ? `${testId}-change` : undefined}>
            {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
    </Block>
  );
};
