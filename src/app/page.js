import Link from "next/link";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaPeopleRoof } from "react-icons/fa6";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { MdEmojiTransportation } from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";


export default function Home() {

  return (
    <>

      <div className="grid grid-cols-3 m-10 gap-8">
        <div className=" border-2 font-semibold  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/suppliers">
            <div className="text-5xl mb-4 hover:scale- pl-12  text-blue-700 "><FaPeopleGroup /></div>
            <h1>Suppliers management</h1>
          </Link>
        </div>

        <div className=" border-2 font-semibold  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/shopkeepers">
            <div className="text-5xl mb-4 hover:scale- pl-12  text-blue-700 "><FaPeopleRoof /></div>
            <h1>Shopkeeper management</h1>
          </Link>
        </div>

        <div className=" border-2 font-semibold  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/products">
            <div className="text-5xl mb-4 hover:scale- pl-12  text-blue-700 "><FaPeopleRoof /></div>
            <h1>Inventory and stock</h1>
          </Link>
        </div>

        <div className=" border-2 font-semibold  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/transactions">
            <div className="text-5xl mb-4 hover:scale- pl-12  text-blue-700 "><FaMoneyCheckAlt /></div>
            <h1> Transaction and Ledger</h1>
          </Link>
        </div>

        <div className=" border-2 font-semibold  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/reports">
            <div className="text-5xl mb-4 hover:scale- pl-12  text-blue-700 "><BiSolidReport /></div>
            <h1> Analytics and Reports</h1>
          </Link>
        </div>

        <div className=" border-2 font-semibold  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full ">
          <Link href="/pages/transports">
            <div className="text-5xl mb-4 hover:scale- pl-12  text-blue-700 "><MdEmojiTransportation /></div>
            <h1> Transportation</h1>
          </Link>
        </div>
        
      </div>
    </>
  );
}
