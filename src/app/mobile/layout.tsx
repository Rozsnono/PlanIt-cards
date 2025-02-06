
export default function MobileLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <html lang="en">
            <body style={{padding: "0px"}}>
                {children}
            </body>
        </html>
    );
}
