import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function PageHero({ eyebrow, title, description, children, className }: PageHeroProps) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-stone-200/70 px-4 pb-20 pt-10 sm:px-6 md:pb-24 md:pt-14", className)}>
      <div className="ambient-grid absolute inset-0 -z-20 opacity-70" />
      <div className="absolute -right-28 -top-24 -z-10 h-96 w-96 rounded-full bg-orange-300/20 blur-[100px]" />
      <div className="absolute left-[15%] top-0 -z-10 h-64 w-64 rounded-full bg-white/70 blur-[90px]" />
      <div className="mx-auto grid w-full max-w-6xl items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
        <SectionHeading level={1} eyebrow={eyebrow} title={title} description={description} />
        {children && <div className="flex flex-wrap gap-3 lg:justify-end">{children}</div>}
      </div>
    </section>
  );
}
