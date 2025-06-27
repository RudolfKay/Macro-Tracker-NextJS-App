import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
    <CardHeader>
      <Icon className="h-10 w-10 text-emerald-500" aria-hidden="true" />
      <CardTitle className="mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
); 