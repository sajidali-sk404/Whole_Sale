import Link from "next/link";
import { FaUsers, FaUsersCog, FaMoneyCheck, FaChartLine } from "react-icons/fa";
import { MdEmojiTransportation, MdOutlineInventory2, MdOutlinePeopleAlt } from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";
import Navbar from "./components/Navbar";
import { TypeAnimation } from 'react-type-animation';
import Home from "./pages/dashboard/page";
import SignInPage from "./pages/login/page";

export default function page() {
  return (
    <>
      <SignInPage />
    </>
  );
}