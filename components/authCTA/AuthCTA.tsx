import Link from "next/link";
import Button from "../button/Button";
import Image from "next/image";

export const AuthCTA = ({ user }: { user: { email?: string } | null }) => {
    if (user) {
        return (
            <Link href={"/account"} className="w-9 h-9 rounded-full bg-gray text-white aspect-square border border-gray/[0.2] flex items-center justify-center font-semibold">
                <Image alt="Profile" src="/profile.jpg" width={36} height={36} className="rounded-full aspect-square" />
            </Link>
        );
    }

    return (
        <>
            <Button href="/login" variant="secondary" className="md:w-fit w-full">Login</Button>
            <Button href="/signup" className="md:w-fit w-full">Sign up</Button>
        </>
    );
}