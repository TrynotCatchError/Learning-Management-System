import Image from "next/image";

import React from 'react'

const Logo = () => {
  return (
    <div>
        <Image 
         src='/karindev-nobg.png'
         width={60}
         height={60}
         alt="logo"
        />

    </div>
  )
}

export default Logo