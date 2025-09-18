"use client"

import * as React from "react"

interface ProgressCircleProps extends React.SVGProps<SVGSVGElement> {
  value?: number
}

export function ProgressCircle({
  value = 0,
  ...props
}: ProgressCircleProps) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  
  let colorClass = "text-primary";
  if (value < 50) {
    colorClass = "text-destructive";
  } else if (value < 80) {
    colorClass = "text-yellow-500";
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-32 h-32" {...props}>
        <circle
          className="text-muted"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="64"
          cy="64"
        />
        <circle
          className={`transform -rotate-90 origin-center transition-all duration-500 ${colorClass}`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="64"
          cy="64"
        />
      </svg>
      <span className="absolute text-2xl font-bold text-foreground">
        {value}%
      </span>
    </div>
  )
}
