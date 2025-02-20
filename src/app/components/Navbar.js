"use client";
import React from "react";
import { motion } from "framer-motion";

const Card = ({ title, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white cursor-pointer shadow-md p-4 rounded-md flex flex-col items-center w-full"
  >
    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-center">{title}</h3>
    <p className="text-lg sm:text-xl font-bold">{value}</p>
  </motion.div>
);

const Navbar = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-100 shadow-md">
      <Card title="Total Amount of Stock" value="0" />
      <Card title="Daily Profit" value="0" />
      <Card title="Added Company" value="0" />
      <Card title="Added Local Cust." value="0" />
    </div>
  );
};

export default Navbar;
