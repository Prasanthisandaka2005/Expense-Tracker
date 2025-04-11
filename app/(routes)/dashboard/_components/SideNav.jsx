"use client";
import { UserButton } from '@clerk/nextjs';
import { Ham, HamIcon, LayoutGrid, Menu, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

function SideNav() {
    const menuList = [
        {
            id: 1,
            name: 'Dashboard',
            icon: LayoutGrid,
            path: '/dashboard'
        },
        {
            id: 2,
            name: 'Budgets',
            icon: PiggyBank,
            path: '/dashboard/budgets'
        },
        {
            id: 3,
            name: 'Expenses',
            icon: ReceiptText,
            path: '/dashboard/expense'
        },
    ];

    const path = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`bg-blue-50 md:bg-white h-screen p-5 border shadow-sm flex flex-col md:flex-row`}>
            <div className='md:hidden flex justify-between items-center mb-4 z-10 '>
                <Menu className="h-6 w-6 cursor-pointer " onClick={() => setIsOpen(!isOpen)} />
            </div>
            <div className={`flex flex-col ${isOpen ? 'block' : 'hidden'} md:block flex-grow`}>
                <Image
                    src='/logo.svg'
                    alt='logo'
                    width={70}
                    height={100}
                />
                <div className='mt-5'>
                    {menuList.map((menu) => (
                        <Link key={menu.id} href={menu.path}>
                            <h2 className={`flex gap-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md mb-2
                                hover:text-primary hover:bg-blue-100 ${path === menu.path ? 'text-primary bg-blue-100' : ''}`}>
                                <menu.icon />
                                {menu.name}
                            </h2>
                        </Link>
                    ))}
                </div>
            </div>
            <div className='fixed bottom-10 flex gap-2 items-center p-5'>
                <UserButton />
                <span className='hidden md:block'>Profile</span>
            </div>
        </div>
    );
}

export default SideNav;
