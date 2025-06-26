import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

type ProfileCardProps = {
  name: string;
  email: string;
  children: React.ReactNode;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, email, children }) => (
  <Card className="w-full max-w-md mx-auto p-6 flex flex-col items-center gap-6 border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
    <CardHeader className="flex flex-col items-center gap-2">
      <CardTitle className="mt-4 text-2xl">{name}</CardTitle>
      <p className="text-muted-foreground">{email}</p>
    </CardHeader>
    <CardContent className="w-full flex flex-col items-center gap-4">
      {children}
    </CardContent>
  </Card>
); 