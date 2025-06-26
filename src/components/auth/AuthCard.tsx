import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import React from "react";

type AuthCardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export const AuthCard: React.FC<AuthCardProps> = ({ title, description, children }) => (
  <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10 w-full max-w-md mx-auto">
    <CardHeader className={title || description ? "space-y-1" : undefined}>
      {title && <CardTitle className="text-2xl text-center">{title}</CardTitle>}
      {description && <CardDescription className="text-center">{description}</CardDescription>}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
); 