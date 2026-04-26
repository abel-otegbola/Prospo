import { type SVGProps } from "react";

const EyeIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
        <path d="M2.46 12.3C3.9 8.86 7.3 6.5 12 6.5c4.7 0 8.1 2.36 9.54 5.8-1.44 3.44-4.84 5.8-9.54 5.8-4.7 0-8.1-2.36-9.54-5.8z" stroke="var(--color-text)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" stroke="var(--color-text)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)
    
export default EyeIcon;