import React from "react";
import { Home, Bell, Bookmark, User, Plus, Map, Search } from "lucide-react";
import Link from "next/link";

export default function NavBarMobile() {
    return (
        <nav className="fixed bottom-0 px-8 left-0 right-0 z-50 gap-24 flex flex-1 items-center justify-between bg-white border-t border-gray-200 h-16 w-auto md:hidden">
            <span className="flex flex-1 justify-between items-center gap-4">
                <Link href="/" className="flex flex-col items-center text-primary">
                    <Home size={32} />
                </Link>
                <Link href="/search" className="flex flex-col items-center text-primary">
                    <Search size={32} />
                </Link>
            </span>


            {/* Central floating button */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-10">
                <Link href="/create" className="bg-white border-2 border-green-200 shadow-lg rounded-full flex items-center justify-center hover:bg-green-50">
                    <Plus size={48} className="text-green-700" />
                </Link>
            </div>

            <span className="flex flex-1 justify-between items-center">
                <Link href="/map" className="flex flex-col items-center text-primary">
                    <Map size={32} />
                </Link>
                <Link href="/profile" className="flex flex-col items-center text-primary">
                    <User size={32} />
                </Link>
            </span>
        </nav>
    );
};
