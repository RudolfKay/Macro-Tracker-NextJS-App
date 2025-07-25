import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10 p-4 sm:p-6">
    <CardHeader className="flex flex-col items-center">
      <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-500 mb-2" aria-hidden="true" />
      <CardTitle className="mt-2 text-lg sm:text-xl text-center">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-sm sm:text-base text-center">{description}</CardDescription>
    </CardContent>
  </Card>
); 