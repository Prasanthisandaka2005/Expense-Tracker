"use client"

import Image from 'next/image'
import React from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '../../components/ui/button'

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className='p-5 flex justify-between items-center border shadow-sm'>
      <Image
        src={'./logo.svg'}
        alt='logo'
        width={70}
        height={100}
      />
      {isSignedIn ? <UserButton /> : <Link href={'/sign-in'}><Button>Get Started</Button></Link>}
    </div>
  )
}

export default Header