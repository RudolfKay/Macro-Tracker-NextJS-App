import React from "react";

type HowItWorksStepProps = {
  stepNumber: number;
  title: string;
  description: string;
};

export const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ stepNumber, title, description }) => (
  <div className="flex flex-col items-center space-y-2 border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10 rounded-lg p-4 sm:p-6 text-center">
    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white text-lg sm:text-xl font-bold">
      {stepNumber}
    </div>
    <h3 className="text-base sm:text-xl font-bold drop-shadow-lg">{title}</h3>
    <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
  </div>
); 