import localFont from "next/font/local";
import "./globals.css";
import { UserPointsProvider } from './context/context';

export const metadata = {
  title: "Gotta befriend em' all! - MunichMeet",
  description: "Find Events in Munich and make new friends while getting rewarded for it!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        <UserPointsProvider>
        {children}
        </UserPointsProvider>
      </body>
    </html>
  );
}
