import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "relative isolate inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-[0.72rem] bg-[length:0%_100%] bg-no-repeat text-base font-semibold tracking-[-0.01em] transition-[background-size,color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[length:100%_100%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/35 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:bg-[length:0%_100%]",
    {
        variants: {
            variant: {
                default:
                    "bg-[#0E0D0C] [background-image:linear-gradient(#F2811D,#F2811D)] text-white shadow-sm hover:shadow-md",
                destructive:
                    "bg-red-600 [background-image:linear-gradient(#991B1B,#991B1B)] text-white shadow-sm hover:shadow-md",
                outline:
                    "border border-stone-200 bg-white [background-image:linear-gradient(#0E0D0C,#0E0D0C)] text-[#0E0D0C] shadow-sm hover:border-[#0E0D0C] hover:text-white hover:shadow-md",
                secondary:
                    "bg-stone-100 [background-image:linear-gradient(#F2811D,#F2811D)] text-stone-850 shadow-sm hover:text-white hover:shadow-md",
                ghost: "bg-transparent [background-image:linear-gradient(#F2811D,#F2811D)] text-stone-700 hover:text-white",
                link: "overflow-visible rounded-none bg-none text-primary underline-offset-4 hover:bg-[length:0%_100%] hover:underline",
                white: "bg-white [background-image:linear-gradient(#F2811D,#F2811D)] text-stone-800 shadow-md hover:text-white hover:shadow-lg",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-10 px-4 text-sm",
                lg: "h-14 px-9 text-base",
                icon: "h-10 w-10 rounded-[0.7rem]",
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
