"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface InitialAvatarProps {
  name: string
  color?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export default function InitialAvatar({ 
  name, 
  color = "bg-emerald-500", 
  size = "md",
  className 
}: InitialAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const sizeClasses = {
    sm: "h-8 w-8 text-xs rounded-xl",
    md: "h-10 w-10 text-sm rounded-xl",
    lg: "h-12 w-12 text-base rounded-2xl",
    xl: "h-14 w-14 text-lg rounded-2xl",
  }

  return (
    <div 
      className={cn(
        "flex items-center justify-center font-black text-white border border-white/20 shadow-inner shadow-white/10 shrink-0",
        color,
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
