import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import React from "react";

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonLabel: string;
  buttonHref: string;
  highlight?: boolean;
  highlightLabel?: string;
  customButton?: React.ReactNode;
};

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  buttonLabel,
  buttonHref,
  highlight = false,
  highlightLabel,
  customButton,
}) => (
  <Card
    className={
      (highlight
        ? "border-2 border-emerald-500 dark:border-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40 shadow-lg shadow-emerald-900/10 -translate-y-2 ring-2 ring-emerald-300 dark:ring-emerald-700"
        : "border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10") +
      " p-4 sm:p-6"
    }
  >
    <CardHeader>
      {highlight && highlightLabel && (
        <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-xs sm:text-sm text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
          {highlightLabel}
        </div>
      )}
      <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
      <div className="text-2xl sm:text-3xl font-bold">{price}</div>
      <CardDescription className="text-sm sm:text-base">{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="grid gap-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm sm:text-base">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      {customButton ? (
        customButton
      ) : (
        <Button className="w-full" asChild={true} variant={highlight ? undefined : "outline"}>
          <Link href={buttonHref}>{buttonLabel}</Link>
        </Button>
      )}
    </CardFooter>
  </Card>
); 