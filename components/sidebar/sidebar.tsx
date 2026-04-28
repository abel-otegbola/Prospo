'use client';
import { useContext, useEffect, useState, type ReactElement } from "react";
import { Bell, Home, Logout, Settings, type IconProps, CloseCircle, SidebarMinimalistic, Bookmark, User, File } from "@solar-icons/react";
import { useOutsideClick } from "../../customHooks/useOutsideClick";
import { AuthContext } from "../../contexts/AuthContextValue";
import { AuthCTA } from "../authCTA/AuthCTA";
import LogoIcon from "../../assets/icons/logo";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export interface Link {
    id: number; label: string; icon: ReactElement<IconProps>, link: string, subtext?: string
}

function Sidebar() {
    const [open, setOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const pathname = usePathname();
    const { user, logOut } = useContext(AuthContext);
    const navigate = useRouter();

    const isActiveLink = (link: string) => {
        if (link === "/account") return pathname === "/account";

        return pathname.startsWith(link);
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");

        const handleMediaChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        mediaQuery.addEventListener("change", handleMediaChange);

        return () => {
            mediaQuery.removeEventListener("change", handleMediaChange);
        };
    }, []);

    const generalLinks: Link[] = [
        { id: 0, label: "Dashboard", icon: <Home size={18} />, link: "/account" },
        { id: 1, label: "Leads", icon: <Bookmark size={18} />, link: "/account/leads" },
        { id: 2, label: "Case Studies", icon: <File size={18} />, link: "/account/case-studies" },
        { id: 3, label: "Profile", icon: <User size={18} />, link: "/account/profile" },
        { id: 4, label: "Billing", icon: <Bell size={18} />, link: "/account/billing" },
        { id: 5, label: "Settings", icon: <Settings size={18} />, link: "/account/settings" },
        { id: 6, label: "Logout", icon: <Logout size={18} />, link: "#" },
    ]
    
    const modalRef = useOutsideClick(setOpen, false, isMobile && open)

    return (
        <>
        
        <div className={`relative md:sticky top-0 left-0 h-screen w-0 duration-500 md:z-[20] border-r border-gray/[0.2] ${open ? "md:w-[74px]": "md:w-[300px]"}`}>
            <button className={`fixed md:absolute top-5 flex flex-col justify-center items-center md:bg-gray/[0.03] bg-background backdrop-blur-md gap-1 w-5 h-6 z-[1200] md:z-[30] p-[2px] px-[13px] rounded-full duration-700 ${open ? "left-[280px] max-[500px]:left-[230px] md:left-16" : "md:left-[260px] left-4"}`} onClick={() => setOpen(!open)}>
                { open ?
                <CloseCircle size={28} color="currentColor" />
                :
                <SidebarMinimalistic size={20} color="currentColor" />
                }
            </button>

            <div  className={`fixed top-0 left-0 md:hidden bg-[#000]/[0.5] ${open ? "w-full h-full" : "w-0 h-full"}`}></div>
            <div ref={modalRef} className={`flex flex-col justify-between md:h-full md:bg-gray/[0.05] bg-background h-[100vh] md:sticky fixed md:shadow-none shadow-lg md:top-0 top-0 py-4 px-4 left-0 overflow-y-auto overflow-x-hidden z-[5] transition-all duration-700 ${open ? "md:w-[74px] w-[320px] max-[500px]:w-[270px] translate-x-[0px]": "md:w-full translate-x-[-400px] md:translate-x-[0px]"}`}>  
                <Link href={"/"} className={`flex items-center mb-2 gap-2 w-full p-1 pt-[2px] pb-5 border-b border-gray/[0.1] ${open ? "w-12 h-12 md:justify-center md:aspect-square" : ""}`}>
                    <div className="relative">
                        <div className="absolute top-[2%] left-[2%] w-[96%] h-[96%] z-[1] btn-bg-logo rounded-full">
                        </div>
                        <LogoIcon width={28} height={28} className="rounded-full z-[2] relative" />
                    </div>
                    <h3 className={`tracking-[2px] font-medium duration-500 ${open ? "md:hidden" : ""}`}>Prospo</h3>
                </Link>

                {/* Navigation Links */}
                <div className="flex-1 flex flex-col gap-1 text-[14px]">
                    <h1 className={`opacity-[0.4] p-3 text-[14px] uppercase ${open ? "opacity-[1] md:opacity-[0]" : ""}`}>General</h1>
                    <div className="flex flex-col gap-[1px]">
                        {
                        generalLinks.map(link => {
                            if (link.label === 'Profile') {
                                return (
                                <div key={link.id}>
                                    <h1 className={`opacity-[0.4] p-3 pt-4 text-[14px] uppercase mt-4 border-t border-gray/[0.2] ${open ? "opacity-[1] md:opacity-[0]" : ""}`}>Others</h1>
                                        <Link key={link.id} onClick={() => !isMobile ? {} : setOpen(false)} href={ link.link} className={`relative flex items-center justify-between px-3 py-3 h-[48px] rounded-[6px] duration-300 ${isActiveLink(link.link) ? "md:bg-background bg-gray/[0.05] font-semibold" : "font-medium opacity-75 hover:bg-gray/[0.09]"}`}>
                                            {isActiveLink(link.link) ? <span className="absolute -left-[2px] w-[3px] h-6 rounded bg-black dark:bg-primary"></span> : ""}
                                        <div className="flex items-center gap-3">
                                                <span className={`w-[18px] ${isActiveLink(link.link) ? "opacity-100" : ""}`}>{link.icon}</span>
                                            <span className={`flex-1 py-1 break-normal duration-500 ${open ? "md:hidden" : ""}`}>{link.label} </span>
                                        </div>
                                        { link.subtext ? <span className="flex items-center justify-center bg-green-400 leading-[100%] text-white text-[10px] rounded-full px-[6px] py-1">{link.subtext}</span> : ""}
                                    </Link>
                                </div>
                                )
                            }
                            if (link.label === 'Logout') {
                                    return (
                                        <button
                                            key={link.id}
                                            onClick={async () => { await logOut(); navigate.push('/login'); }}
                                            className={`relative w-full text-left flex items-center justify-between px-3 py-1 h-[48px] rounded-[6px] duration-300 cursor-pointer ${pathname.includes(link.link) ? "md:bg-background bg-gray/[0.05] font-semibold text-primary" : "font-medium opacity-75 hover:bg-gray/[0.09]"}`}>
                                            <div className="flex items-center gap-3">
                                                <span className={`w-[18px] ${pathname.includes(link.link) ? "text-primary opacity-100" : ""}`}>{link.icon}</span>
                                                <span className={`flex-1 py-1 break-normal duration-500 ${open ? "md:hidden" : ""}`}>{link.label} </span>
                                            </div>
                                        </button>
                                    )
                                }
                                return (
                                <Link key={link.id} onClick={() => !isMobile ? {} : setOpen(false)} href={ link.link} className={`relative flex items-center justify-between px-3 py-3 h-[48px] rounded-[6px] duration-300 ${isActiveLink(link.link) ? "md:bg-background bg-gray/[0.05] font-semibold" : "font-medium opacity-75 hover:bg-gray/[0.09]"}`}>
                                    {isActiveLink(link.link) ? <span className="absolute -left-[2px] w-[3px] h-6 rounded bg-black dark:bg-primary"></span>: ""}
                                    <div className="flex items-center gap-3">
                                        <span className={`w-[18px] ${isActiveLink(link.link) ? "opacity-100" : ""}`}>{link.icon}</span>
                                        <span className={`flex-1 py-1 break-normal duration-500 ${open ? "md:hidden" : ""}`}>{link.label} </span>
                                    </div>
                                    { link.subtext ? <span className="flex items-center justify-center bg-green-400 leading-[100%] text-white text-[10px] rounded-full px-[6px] py-1">{link.subtext}</span> : ""}
                                </Link>
                                )
                        })
                        }
                    </div>
                </div>

                {/* User Info & Theme Toggle */}
                <div className="flex flex-col gap-3 pt-4 mt-4">
                    {/* User Info */}
                    {user && (
                        <div className="relative">
                            <div className={`relative flex items-center gap-3 border border-gray/[0.1] bg-background rounded-lg z-[2] ${open ? "p-0 rounded-full" : "p-2"}`}>
                                
                                <AuthCTA user={user} />
                                
                                {/* User Details */}
                                <div className={`flex-1 min-w-0 ${open ? "md:hidden" : ""}`}>
                                    <p className="font-medium  mb-1">
                                        <span className=" capitalize">{user?.fullname || user?.displayName || user?.email?.split('@')[0]}</span>
                                    </p>
                                    <p className="text-xs opacity-[0.6] dark:text-gray/ truncate">
                                        {user.email || ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}

export default Sidebar
