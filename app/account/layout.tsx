"use client";
import Sidebar from "../../components/sidebar/sidebar";
import { Formik } from "formik";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContextValue";
import SearchBar from "../../components/search/searchBar";
import { Bell } from "@solar-icons/react";
import { AuthCTA } from "../../components/authCTA/AuthCTA";
import Link from "next/link";

function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
    const { user } = useContext(AuthContext);
    
    // If not authenticated, redirect to login
    // if (!user) {
    //     return <Navigate to="/login" replace />;
    // }
  
    return (
        <div className="min-h-[400px] flex justify-between bg-background bg-cover">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <div className="flex py-3 md:px-6 px-4 pl-14 sm:pr-4 items-center justify-end bg-background dark:bg-dark-bg border-b border-gray/[0.1] sticky top-0 z-[2]">
                    
                    <div className="flex md:gap-6 gap-4 items-center">
                        <Formik
                            initialValues={{ search: "" }}
                            onSubmit={(values, { setSubmitting }) => {
                                console.log(values)
                                setSubmitting(false);
                            }}
                        >
                            {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="bg-bg-gray-100 dark:bg-dark-bg-secondary rounded-[10px]">
                                <SearchBar />
                            </form>
                            )
                        }
                        </Formik>
                        <Link href={"/account/notifications"} className="relative opacity-50 duration-300">
                            <Bell size={22} color="currentColor"/>
                        </Link>
                        <AuthCTA user={user} />
                    </div>
                </div>
                {
                    children
                }
            </div>
        </div>
    )
}

export default AccountLayout
