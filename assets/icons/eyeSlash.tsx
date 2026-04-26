import { type SVGProps } from "react";

const EyeSlashIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
        <path d="M3 3l18 18" stroke="var(--color-text)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.58 10.58A3 3 0 0 0 13.42 13.42" stroke="var(--color-text)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.45 12.3C3.9 8.86 7.3 6.5 12 6.5c1.3 0 2.55.18 3.72.51" stroke="var(--color-text)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21.54 11.7c-1.45 3.44-4.85 5.8-9.54 5.8-1.3 0-2.55-.18-3.72-.51" stroke="var(--color-text)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)
    
export default EyeSlashIcon;