import React, { ReactNode } from "react";
import { Banner } from "../ui/banner";
import { Header } from "./header";
import { Footer } from "./footer";
import { BottomNavigation } from "./bottom-nav";

interface PageLayoutProps {
    children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
    return (
        <div className="relative mx-auto w-full xl:max-w-[120rem] min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--page-bg-color)' }}>
        <Banner />
        <Header />
        
        <main>
         {children}
        </main>

        <Footer />
        <BottomNavigation />
     </div>
    )
}