"use client";

import Link from "next/link";
import Navbar from "../Navbar";
import { useQuery } from "react-query";
import { get } from "../app_packages/http-client";
import { FaPencilAlt } from "react-icons/fa";

export default function Product() {
  const { data: items } = useQuery(["Item"], () => get("/Item"));
  console.log(items, "ite");

  return (
    <div className="w-full h-screen">
      <Navbar passed={false} />
      <div className="w-full h-screen pt-[60px] bg-gray-50">
        <div className="w-full h-full">
          <div className="w-full flex justify-end items-end p-2">
            <Link href={"/product/create"}>
              <button className="text-red-700 border-b border-black font-bold">
                New
              </button>
            </Link>
          </div>
          <div className="p-3 flex flex-col gap-3 pb-2">
            {items?.map((item: any) => (
              <div className="w-full h-[100px] flex flex-col justify-center p-2 items-start bg-white rounded-md shadow-md text-gray-700 pb-2 border border-gray-300">
                <div className="w-full h-full flex justify-start flex-col ">
                  <p className="text-start text-xs">{item.itemGroup}</p>
                  <div className="flex flex-row justify-start items-center gap-2">
                    <p className="text-sm">#{item.itemCode}.</p>
                    <p className="text-lg">{item.itemName}</p>
                    <p className="text-lg">{item.secondName}</p>
                  </div>

                  <div className="w-full h-full flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-5">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm">Sales</p>:
                        <p className="text-sm">{item.salesRate}</p>
                      </div>
                      -
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm">Tax</p>:
                        <p className="text-sm">{item.tax}</p>
                      </div>
                    </div>
                    <div className="justify-center items-center">
                      <Link href={`product/edit/${item.id}`}>
                        <FaPencilAlt className="mr-2" size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
