"use client";

import { useQuery } from "react-query";
import Navbar from "../Navbar";
import { API_BASE_URL, get } from "../app_packages/http-client";
import { BsPrinter } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useEffect, useState } from "react";
import { getUserContext } from "../app_packages/tocken";

export default function Report() {
  const { data: reports, isLoading } = useQuery(["report"], () =>
    get("/Report/RouteSale")
  );

  const router = useRouter();
  const [url, seturl] = useState("");
  useEffect(() => {
    const userContext = getUserContext();
    const branchId = userContext?.branchId;
    const tocken = userContext?.token;
    const financialYear = userContext?.financialYear;
    const companyId = userContext?.companyId;
    seturl(
      "&url=" +
        API_BASE_URL +
        "&token=" +
        tocken +
        "&branchId=" +
        branchId +
        "&fyId=" +
        financialYear.id +
        "&companyId=" +
        companyId
    );
  }, [url]);

  const GotoPrintView = (id: any) => {
    const queryString = new URLSearchParams(id).toString();
    // const printPage = `/print?id=${id}`;
    const printPage = `/thermal?id=${id}`;
    router.push(printPage);
  };
  return (
    <div className="w-full h-screen">
      <Navbar passed={false} />
      {isLoading && <Loader />}
      <div className="w-full h-screen pt-[60px]">
        <div className="w-full h-full">
          <div className="p-3 flex flex-col gap-3 pb-2">
            {reports ? (
              reports?.map((report: any) => (
                <div
                  key={report.id}
                  className="w-full h-[100px] flex flex-col justify-center p-2 items-start bg-green-200 rounded-md text-gray-700 pb-3 border border-black"
                >
                  <div className="w-full h-full flex flex-row justify-between items-center">
                    <p className="p-1 text-center">{report.customer}</p>
                    <div className="flex flex-row gap-5">
                      <MdOutlineRemoveRedEye
                        onClick={() => GotoPrintView(report.id)}
                        size={30}
                        className="fill-black"
                      />
                      <a href={`hisabuk://print?id=` + report.id + url}>
                        <BsPrinter size={30} className="fill-black" />
                      </a>
                    </div>
                  </div>
                  <div className="w-full h-full flex justify-between items-center border-t">
                    <p className="text-sm text-center">
                      Amount : {report.billAmount}
                    </p>
                    <p className="text-sm text-center">#{report.invoiceNo}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="flex justify-center items-center text-red-600">
                There is No invoices....!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
