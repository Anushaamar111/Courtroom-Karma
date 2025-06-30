import React, { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  className?: string;
}

export default function Tooltip({ children, content, className = '' }: TooltipProps) {
  return (
    <span 
      className={`relative inline-block ${className}`}
      title={content}
    >
      {children}
    </span>
  );
}
