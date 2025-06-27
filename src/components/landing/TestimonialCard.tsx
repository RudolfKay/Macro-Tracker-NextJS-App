import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

type TestimonialCardProps = {
  image: string;
  name: string;
  role: string;
  testimonial: string;
};

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ image, name, role, testimonial }) => (
  <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10 p-4 sm:p-6">
    <CardHeader>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-gray-200">
          <Image src={image} alt={name} width={40} height={40} className="object-cover object-center w-9 h-9 sm:w-10 sm:h-10 rounded-full" />
        </div>
        <div>
          <CardTitle className="text-sm sm:text-base">{name}</CardTitle>
          <CardDescription className="text-xs sm:text-sm">{role}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm sm:text-base text-muted-foreground text-center">{testimonial}</p>
    </CardContent>
  </Card>
); 