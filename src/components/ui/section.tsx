import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionVariants = cva(
    "w-full relative overflow-hidden",
    {
        variants: {
            spacing: {
                default: "py-16 md:py-24",
                sm: "py-12 md:py-16",
                lg: "py-24 md:py-32",
                none: "py-0",
            },
            background: {
                default: "bg-background",
                muted: "bg-muted",
                primary: "bg-primary text-primary-foreground",
                secondary: "bg-secondary text-secondary-foreground",
                gradient: "bg-gradient-to-br from-amber-50 to-orange-50",
            }
        },
        defaultVariants: {
            spacing: "default",
            background: "default",
        },
    }
)

export interface SectionProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
    container?: boolean
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ className, spacing, background, container = true, children, ...props }, ref) => {
        return (
            <section
                className={cn(sectionVariants({ spacing, background, className }))}
                ref={ref}
                {...props}
            >
                {container ? (
                    <div className="container mx-auto px-4 md:px-6">
                        {children}
                    </div>
                ) : (
                    children
                )}
            </section>
        )
    }
)
Section.displayName = "Section"

export { Section, sectionVariants }
