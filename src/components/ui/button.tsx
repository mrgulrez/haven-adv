import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-stone-950 text-white shadow-sm hover:bg-stone-800 active:bg-stone-900",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline:
                    "border border-stone-200 bg-white shadow-sm hover:bg-stone-50 hover:border-stone-300",
                secondary:
                    "bg-stone-100 text-stone-850 shadow-sm hover:bg-stone-200",
                ghost: "hover:bg-stone-100 hover:text-stone-950",
                link: "text-primary underline-offset-4 hover:underline",
                white: "bg-white text-stone-800 shadow-md hover:bg-stone-50",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-10 rounded-xl px-4 text-sm",
                lg: "h-14 rounded-xl px-10 text-lg",
                icon: "h-10 w-10",
            },
            animation: {
                none: "",
                pulse: "animate-pulse-slow",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            animation: "none",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, animation, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
