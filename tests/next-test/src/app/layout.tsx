import React from 'react'
import { Metadata } from 'next'
 
import * as aaa from 'archivelayer'

export const metadata: Metadata = {
  title: '...',
  description: '...',
  icons: `$/favicon.ico`,
  authors: {
    name: "Mona04",
    url: "moksha1905@gmail.com",
  },
  other: {
    
  }
}

export default function RootLayout({children,}: {children: React.ReactNode}) {
  return (
    <html lang="en" >        
      <body >
        {children}
        <p>{aaa.config.AAA}</p>
      </body>   
    </html>
  )
}