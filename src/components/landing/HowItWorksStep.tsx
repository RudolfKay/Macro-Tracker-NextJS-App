import React from "react";

type HowItWorksStepProps = {
  stepNumber: number;
  title: string;
  description: string;
};

export const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ stepNumber, title, description }) => (
  <div className="flex flex-col items-center space-y-2 border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10 rounded-lg p-6 text-center" tabIndex={0} aria-label={`Step ${stepNumber}: ${title}`}>
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white">
      {stepNumber}
    </div>
    <h3 className="text-xl font-bold drop-shadow-lg">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
); 