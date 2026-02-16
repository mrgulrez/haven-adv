import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    "bg-stone-900 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-amber-500 before:to-orange-500 before:w-0 before:transition-all before:duration-300 hover:before:w-full before:-z-10 z-10",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline:
                    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-stone-200 text-stone-800 shadow-sm hover:bg-stone-300",
                ghost: "hover:bg-amber-50 hover:text-amber-700",
                link: "text-primary underline-offset-4 hover:underline",
                white: "bg-white text-stone-800 shadow-md hover:bg-stone-50",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-10 rounded-xl px-4 text-sm",
                lg: "h-14 rounded-3xl px-10 text-lg",
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
