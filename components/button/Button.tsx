import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export interface buttonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "tertiary";
    className?: string;
    href?: string;
    size?: "small" | "medium" | "large" | "xs";
    disabled?: boolean,
    onClick?: () => void,
    children?: ReactNode
}

export default function Button({ variant, className, href, size, disabled, onClick, children, ...props }: buttonProps) {
    const variants = {
        primary: "hover:bg-primary/[0.8] bg-primary text-white border border-gray/[0.3] shadow-md",
        secondary: "bg-transparent border border-gray/[0.4] hover:border-gray text-text/[0.8] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
        tertiary: "rounded-[4px]"
    }

    const sizeClasses: Record<NonNullable<buttonProps["size"]>, string> = {
        xs: "rounded-[2px] text-[8px] py-[2px] md:px-[8px] px-[4px]",
        small: "rounded text-[12px] py-[4px] md:px-[12px] px-[8px]",
        medium: "rounded-[8px] text-[14px] py-[8px] md:px-[18px] px-[16px]",
        large: "rounded-[12px] md:py-[16px] py-[10px] md:px-[32px] px-[28px]"
    }

    const selectedSize = size || "medium"

    return (
       <>
            { 
            href ? 
                <Link role="button" href={href} className={`rounded-[6px] flex items-center justify-center md:gap-2 gap-1 w-fit  font-medium text-nowrap
                    ${variants[variant || "primary"]} 
                    ${disabled ? "opacity-[0.25]" : ""} 
                    ${sizeClasses[selectedSize]} 
                    ${className} 
                     `}> 
                    { children }
                </Link>

                : <button className={` duration-500 flex items-center justify-center md:gap-2 gap-1 w-fit cursor-pointer font-medium text-nowrap
                    ${variants[variant || "primary"]} 
                    ${disabled ? "opacity-[0.25]" : ""} 
                    ${sizeClasses[selectedSize]} 
                    ${className} 
                `}
                {...props}
                name="Button"
                role="button"
                disabled={disabled}
                onClick={onClick}
                >
                { children }
                </button>
        }
    </>
    )
}