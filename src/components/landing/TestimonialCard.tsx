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
  <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
    <CardHeader>
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
          <Image src={image} alt={name} width={40} height={40} className="object-cover object-center w-10 h-10 rounded-full" />
        </div>
        <div>
          <CardTitle className="text-base">{name}</CardTitle>
          <CardDescription>{role}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{testimonial}</p>
    </CardContent>
  </Card>
); 