"use client";

import Link from "next/link";
import Navbar from "../Navbar";
import { useQuery } from "react-query";
import { get } from "../app_packages/http-client";
import { getLoginDate } from "../app_packages/tocken";
import { TbLoaderQuarter, TbReportMoney } from "react-icons/tb";
import Loader from "../Loader";

export default function Dashboard() {
  const getDate = getLoginDate();
  const date = new Date().toISOString().substring(0, 10);
  const { data: dashboard, isLoading } = useQuery(["Dashboard"], () =>
    get("/RouteDashboard?date=" + date)
  );

  const roundSale = Math.round(dashboard?.sales * 100) / 100;
  const roundCash = Math.round(dashboard?.cashCollection * 100) / 100;
  const roundBank = Math.round(dashboard?.bankCollection * 100) / 100;

  return (
    <div className="w-full h-screen">
      {isLoading && <Loader />}
      <Navbar passed={true} />
      <div className="w-full h-screen pt-[50px]">
        <div className="w-full h-full  grid grid-rows-4 p-2 mt-2 gap-5 ">
          <Link href={"invoice"}>
            <div className="w-full h-full bg-lime-200 flex flex-col justify-center rounded-md shadow-lg ring-lime-200 ring-1 text-gray-600">
              <div className="flex justify-between items-center p-5">
                <p className="text-center font-semibold text-2xl">Invoice</p>
                <p className="text-center font-semibold text-4xl">
                  {dashboard?.invoices}
                </p>
              </div>
              {/* <div className="flex justify-between items-center p-5">
                <p className="text-center font-semibold text-xl">Invoice</p>
                <p className="text-center font-semibold text-xl">Invoice</p>
              </div> */}
            </div>
          </Link>
          <Link href={"/customers"}>
            <div className="w-full h-full bg-red-200 flex flex-col justify-center rounded-md shadow-lg ring-red-200 ring-1 text-gray-600">
              <div className="flex justify-between items-center p-5">
                <p className="text-center font-semibold text-2xl">Customer</p>
                <p className="text-center font-semibold text-4xl">
                  {dashboard?.customers}
                </p>
              </div>
              {/* <div className="flex justify-between items-center p-5">
                <p className="text-center font-semibold text-2xl">Invoice</p>
                <p className="text-center font-semibold text-2xl">Invoice</p>
              </div> */}
            </div>
          </Link>
          <Link href={"/product"}>
            <div className="w-full h-full bg-cyan-200 flex flex-col justify-center rounded-md shadow-lg ring-cyan-200 ring-1 text-gray-600">
              <div className="flex justify-between items-center p-5">
                <p className="text-center font-semibold text-2xl">Products</p>
                <p className="text-center font-semibold text-4xl">
                  {dashboard?.items}
                </p>
              </div>
              {/* <div className="flex justify-between items-center p-5">
                <p className="text-center font-semibold text-2xl">Invoice</p>
                <p className="text-center font-semibold text-2xl">Invoice</p>
              </div> */}
            </div>
          </Link>
          <Link href={"/report"}>
            <div className="w-full h-full bg-orange-200 flex flex-row justify-between  rounded-md shadow-lg ring-orange-200 ring-1 text-gray-600">
              <div className="flex justify-center items-center p-5">
                <TbReportMoney size={80} />
                {/* <p className="text-center font-semibold text-lg">120</p> */}
              </div>
              <div className="flex justify-between items-center p-5 flex-col">
                <div className="w-full h-full flex justify-between items-center">
                  <p className="text-center font-semibold text-xl pr-2">
                    sales
                  </p>
                  -
                  <p className="text-center font-semibold text-2xl pl-2">
                    {roundSale}
                  </p>
                </div>
                <div className="w-full h-full flex justify-between items-center">
                  <p className="text-center font-semibold text-xl">cash</p>-
                  <p className="text-center font-semibold text-2xl">
                    {roundCash}
                  </p>
                </div>
                <div className="w-full h-full flex justify-between items-center">
                  <p className="text-center font-semibold text-xl">bank</p>-
                  <p className="text-center font-semibold text-2xl ">
                    {roundBank}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
