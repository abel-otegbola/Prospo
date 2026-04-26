'use client'
import { Moon, Sun, Tablet } from "@solar-icons/react";
import { type ReactElement, useContext } from "react";
import Button from "../button/Button";
import { ThemeContext } from "../../contexts/ThemeContextValue";

interface Theme {
    id: string | number, img: ReactElement, title: string
}

type Themes = Array<Theme>


function ThemeSelector({ props }: { props?: React.HTMLAttributes<HTMLDivElement> }) {
    const { theme, setTheme } = useContext(ThemeContext)

    const themes: Themes = [
        { id: 0, img: <Tablet />, title: "auto" },
        { id: 1, img: <Sun />, title: "light" },
        { id: 2, img: <Moon />, title: "dark" },
    ]

    return (
        <div className="flex gap-2" {...props}>
            {
                themes.map(item => {
                    return (
                        <Button 
                            key={item.id} 
                            variant={item.title === theme ? "primary" : "secondary"}
                            aria-label={"Theme setting changed to "+ theme} 
                            onClick={() => setTheme(item.title)} 
                            className="shadow-none capitalize"
                        >
                            {item.img}
                            {item.title}
                        </Button>
                    )
                })
            }
        </div>
    )
}

export default ThemeSelector;