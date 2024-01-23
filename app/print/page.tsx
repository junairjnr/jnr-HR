"use client";

import { useQuery } from "react-query";
import { get } from "../app_packages/http-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../Loader";

export default function BillPrint() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // const {data} = router.query;
  // const passed = data? JSON.parse(data):null;
  const [loading, setLoading] = useState(true);

  const [print, setprint] = useState<any>(null);
  const { data: billprint } = useQuery(["PrintInvoice"], () =>
    get("/Sale/PrintInvoice/" + id).then((s) => {
      setprint(s);
      setLoading(false);
    })
  );

  const roundVat = Math.round(print?.vat * 100) / 100;

  // useEffect(() => {
  //*******this for print
  //   // print && window.print();
  // }, [print]);

  const totalAmount = Math.round(print?.total * 100) / 100;

  return (
    <div id="print_frame" className="w-full h-auto bg-white text-[12px]">
      {loading && <Loader />}
      <div className="w-full h-full flex flex-col font-sans text-center justify-start items-center">
        <div className="w-full h-auto flex flex-col justify-center items-center border-b border-black">
          <p className="text-xl font-semibold">{print?.company?.companyName}</p>
          <p className="text-xs">
            {print?.company?.address}Datastone Solutions LLP Room #KM IV 828,829
            - 2nd Floor Smart Trade City,, Kottakkal, Malappuram, Kerala 676503
          </p>
          <p className="">Mob : {print?.company?.mobile}</p>
          <p className="">GSTIN : {print?.company?.vaTorGST_No}</p>
          <p className="text-lg font-sans font-semibold mt-1">Tax Invoice</p>
        </div>
        <div className="w-full h-auto flex justify-center items- flex-col ">
          <div className="w-full h-full flex justify-between items-center ">
            <p className="">Inv No : {print?.invoiceNo}</p>
            <p className="">Date : {print?.date}</p>
          </div>
          <div className="flex justify-start items-center flex-row text-center">
            <p className="pr-1">Billed To </p> :
            <p className="pl-1 text-base ">{print?.ledger?.name}</p>
          </div>
        </div>
        <div className="w-full h-auto">
          <table className="w-full h-auto ">
            <thead className="border text-[12px]">
              <tr className="">
                <th className="">Sn</th>
                <th className="">ItemName</th>
                <th className="">Qty</th>
                {/* <th className="">Price</th> */}
                <th className="">Rate</th>
                <th className="">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm border text-[12px]">
              {print?.itemList?.map((item: any, index: number) => (
                <tr key={item.itemDetailsId} className=" text-center">
                  <td className="">{index + 1}</td>
                  <td className="text-start">{item?.item?.itemName}</td>
                  <td className="">{item.qty}</td>
                  {/* <td className="">{item?.mrp}</td> */}
                  <td className="text-end">{item?.amount}</td>
                  <td className="text-end ">{item?.amount * item?.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full h-[30px] flex flex-row justify-between items-center border-b border-black">
          <div className="flex justify-center items-center pl-2">
            <p className="pr-1">VAT</p>:<p className="pl-1">{roundVat}</p>
          </div>
          <div className="flex justify-center items-center pr-2">
            <p className=" font-semibold pr-1">TOTAL</p>:
            <p className=" font-semibold pl-1">{totalAmount}</p>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col justify-center items-center border-b border-black ">
          <p className=" font-semibold">{print?.amountInWords}</p>
          <p className=" font-bold">Total : {totalAmount}</p>
        </div>
        <div className="w-full h-auto flex justify-center items-center border-b border-black ">
          <p className="">***Thank You For Shopping With Us, Visit Again***</p>
        </div>
        <div className="w-full h-auto flex flex-col justify-center items-center">
          <p className=" text-">
            Please check your bill befor leaving the shop.
          </p>
          <p className=" text-sm">Keep bill for Exchange/Return.</p>
          <p className=" text-sm">No exchange for Phisically damaged items</p>
        </div>
      </div>
    </div>
  );
}
