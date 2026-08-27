import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  level?: 1 | 2;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
  level = 2,
}: SectionHeadingProps) {
  const centered = align === "center";
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <header className={cn("max-w-3xl", centered && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("eyebrow mb-5", tone === "dark" && "text-orange-300")}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {eyebrow}
        </p>
      )}
      <Heading className={cn(
        "font-heading text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl",
        tone === "dark" ? "text-white" : "text-stone-950",
      )}>
        {title}
      </Heading>
      {description && (
        <p className={cn(
          "mt-5 max-w-2xl text-base leading-7 sm:text-lg",
          centered && "mx-auto",
          tone === "dark" ? "text-stone-400" : "text-stone-600",
        )}>
          {description}
        </p>
      )}
    </header>
  );
}
