'use client';

import type { Metadata } from "next";



import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

import { Toaster } from "react-hot-toast";



import React, { useEffect } from "react";
import Script from "next/script";





//import { Inter } from "next/font/google";

//const inter = Inter({ subsets: ["latin"] });


import localFont from "next/font/local";

const pretendard = localFont({
  src: "../static/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});



/*
export const metadata: Metadata = {
  title: "WEB3 Starter",
  description:
    "Starter for  WEB3 Wallet.",
};
*/





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  /*
  useEffect(() => {
  
    window.googleTranslateElementInit = () => {
     new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
    };
  
   }, []);
   */

   /*
       <html lang="kr" className={`${pretendard.variable}`}>
      <body className={pretendard.className}>
      */


  return (
    <html lang="kr" className={`${pretendard.variable}`}>



      <head>
        
        {/* Google Translate */}
        {/*}
        <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        ></Script>
        */}

   

        {/* Google Translate CSS */}
        {/*
        <link
        rel="stylesheet"
        type="text/css"
        href="https://www.gstatic.com/_/translate_http/_/ss/k=translate_http.tr.26tY-h6gH9w.L.W.O/am=CAM/d=0/rs=AN8SPfpIXxhebB2A47D9J-MACsXmFF6Vew/m=el_main_css"
        />
        */}


        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>똑똑한코인</title>
        <meta name="description" content="눈덩이처럼 불어나는 나의 자산" />
        <link rel="icon" href="/favicon.ico" />




        <link rel="apple-touch-icon" href="/logo-kcbc-114x114.png" />
        <link rel="shortcut icon" href="/logo-kcbc-72x72.png" />


      </head>


      {/*
      <body className={inter.className}>
      */}
      
      <body className={pretendard.className}>




        <ThirdwebProvider>

          <Toaster />
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
