import React from "react";
import { Meteors } from "../components/ui/meteors";
import { Settings, ShieldCheck, DollarSign, Clock } from "lucide-react"; // Import icons from react-feather

const cardData = [
  {
    title: "Create an account",
    description: "Create a free account as a new user",
    icon: <Settings size={28} className="text-blue-500" />,
  },
  {
    title: "Request for a certificate",
    description: "Fill in your details easily",
    icon: <ShieldCheck size={28} className="text-green-500" />,
  },
  {
    title: "Make Payment",
    description: "Make a payment after filling your information.",
    icon: <DollarSign size={28} className=" text-yellow-500" />,
  },
  {
    title: "Wait for approval",
    description: "Once we approve your order download your certificate",
    icon: <Clock size={28} className="text-red-500" />,
  },
];

export function MeteorsDemo() {
  return (
    <div className="flex flex-wrap justify-center  gap-4">
      {cardData.map((card, index) => (
        <div key={index} className="w-full relative max-w-xs">
          <div
            className={`absolute inset-0 h-full w-full bg-gradient-to-r  transform scale-[0.80] rounded-full blur-3xl`}
          />
          <div className="relative shadow-xl bg-white-900 border border-gray-500-800 px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
            <div className="h-5 w-5 rounded-full border flex items-center justify-center mb-4 border-gray-500">
              {card.icon}
            </div>
            <h1 className="font-bold text-xl text-slate-500  mb-4 relative z-50">
              {card.title}
            </h1>
            <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
              {card.description}
            </p>
            {/* <button className="border px-4 py-1 rounded-lg border-gray-500 text-gray-300">
              Explore
            </button> */}
            {/* Meaty part - Meteor effect */}
            <Meteors number={20} />
          </div>
        </div>
      ))}
    </div>
  );
}
