import "./globals.css";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const RootLayout = ({ children }) => {
  // TODO: How can we pass this down to all components instead of having to check in multiple levels?
  // TODO: Use Context or custom React hooks like Aubrie did with her "global context" stuff?
  const { isEnabled } = draftMode();

  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between p-12 md:p-24">
          <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex flex-col">
            <Providers draftModeEnabled={isEnabled}>{children}</Providers>
          </div>
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
