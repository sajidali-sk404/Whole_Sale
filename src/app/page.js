import Link from "next/link";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaPeopleRoof } from "react-icons/fa6";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { MdEmojiTransportation } from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";
import Navbar from "./components/Navbar";



export default function Home() {

  return (
    <>
    <Navbar />

      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 m-10 gap-8">
        <div className="hover:scale-105 transition-all duration-300 border-2 font-semibold  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/suppliers">
            <div className="text-5xl mb-4 hover:scale- flex justify-center  text-blue-700 "><FaPeopleGroup /></div>
            <h1>Suppliers management</h1>
          </Link>
        </div>

        <div className="hover:scale-105 transition-all duration-300 border-2 font-semibold bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/shops">
            <div className="text-5xl mb-4 hover:scale- text-blue-700 flex justify-center"><FaPeopleRoof /></div>
            <h1>Shopkeeper management</h1>
          </Link>
        </div>

        <div className="hover:scale-105 transition-all duration-300 border-2 font-semibold  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/products">
            <div className="text-5xl mb-4 hover:scale- flex justify-center  text-blue-700 "><FaPeopleRoof /></div>
            <h1>Inventory and stock</h1>
          </Link>
        </div>

        <div className="hover:scale-105 transition-all duration-300 border-2 font-semibold  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/transactions">
            <div className="text-5xl mb-4 hover:scale- flex justify-center  text-blue-700 "><FaMoneyCheckAlt /></div>
            <h1> Transaction and Ledger</h1>
          </Link>
        </div>

        <div className="hover:scale-105 transition-all duration-300 border-2 font-semibold  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/reports">
            <div className="text-5xl mb-4 hover:scale- flex justify-center  text-blue-700 "><BiSolidReport /></div>
            <h1> Analytics and Reports</h1>
          </Link>
        </div>

        <div className="hover:scale-105 transition-all duration-300 border-2 font-semibold  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/transports">
            <div className="text-5xl mb-4 hover:scale- flex justify-center  text-blue-700 "><MdEmojiTransportation /></div>
            <h1> Transportation</h1>
          </Link>
        </div>

        <div className="hover:scale-105 transition-all duration-300 border-2 font-semibold  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/customer">
            <div className="text-5xl mb-4 hover:scale- flex justify-center  text-blue-700 "><MdEmojiTransportation /></div>
            <h1> Customer Management</h1>
          </Link>
        </div>
        
      </div>
    </>
  );
}
