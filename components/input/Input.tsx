'use client';
import { type IconProps } from "@solar-icons/react";
import { useState, type InputHTMLAttributes, type ReactElement } from "react";
import EyeSlashIcon from "../../assets/icons/eyeSlash";
import EyeIcon from "../../assets/icons/eye";

interface inputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string | undefined;
    variant?: 'default' | 'secondary';
    ref?: React.RefObject<HTMLInputElement | null>
    lefticon?: ReactElement<IconProps>
}

export default function Input({ onChange, error, type, ...props }: inputProps) {
    const [focus, setFocus] = useState(false)
    const [show, setShow] = useState(false)

    const variants = {
        default: 'border',
        secondary: 'border border-transparent border-b-[#DBDBDB]'
    }
    
    return (
        <div className="flex flex-col w-full gap-[2px]">

          { props.label ? <label htmlFor={props.name} className={`xl:text-[14px] text-[13px] font-semibold
            ${focus ? "text-[--color-primary]" : ""}
            ${error && !focus ? "text-red-500" : ""}
          `}>{props.label}</label> : "" }

            <div className={`flex items-center px-[12px] py-[10px] gap-2 relative w-full duration-500 rounded-[6px] bg-background
                ${error && !focus ? "border border-red-500 text-red-500 " : ""}
                ${focus ? "border border-primary" : "border-gray-500/[0.3]"}
                ${props.className}
                ${variants[props.variant || 'default']}
            `}>
            { props.lefticon ? <span className={`${focus ? "text-primary" : props.value !== "" ? "text-primary" : "text-gray/[0.8]"}`}>{props.lefticon}</span>: "" }
                <input 
                    { ...props }
                    className={`w-full outline-none bg-transparent text-[14px] leading-[24px]
                        ${props.className} 
                        ${props.disabled ? "opacity-[0.25]" : ""}
                    `}
                    id={props.name}
                    value={props.value && props.value}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onChange={onChange}
                    type={type === "password" && show ? "text" : type}
                />

                { type === "password" ? 
                    <button 
                        type="button"
                        className="absolute right-2 top-[4px] px-2 p-2 cursor-pointer" 
                        title="toggle show password" 
                        onClick={(e) => {setShow(!show); e.preventDefault()}}
                    >
                        { show ? <EyeIcon width={16} /> : <EyeSlashIcon width={16} /> }
                    </button>
                : "" }
            </div>
            { error && !focus ? <p className="text-[11px] text-red-500">{error}</p> : "" }
        </div>
    )
}