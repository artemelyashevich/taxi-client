import {Header} from "@/components/Header";

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="container mx-auto px-4">
            <Header/>
            {children}
        </div>
    );
}