import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SupplierProvider } from "./ContextApi/SupplierDataApi";
import { ShopProvider } from "./ContextApi/shopkeepersDataApi";
import { InventoryProvider } from "./ContextApi/inventoryDataApi";
import { BillsProvider } from "./ContextApi/billsDataApi";
import { AuthProvider } from "./ContextApi/AuthContextApi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "M.Amir Traders / Sugar Dealers",
  description: "M.Amir Traders / Sugar Dealers Wholesale and Retail",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <BillsProvider>
            <ShopProvider>
              <SupplierProvider>
                <InventoryProvider>
                  {children}
                </InventoryProvider>
              </SupplierProvider>
            </ShopProvider>
          </BillsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
