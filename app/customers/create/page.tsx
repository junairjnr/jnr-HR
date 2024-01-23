"use client";

import { useMutation, useQuery } from "react-query";
import Navbar from "../../Navbar";
import { get, post } from "../../app_packages/http-client";
import { useFormik } from "formik";
import { getUserContext } from "../../app_packages/tocken";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CustomerForm } from "../../Types";
import { useEffect, useState } from "react";
import { Debug } from "../../debugg";
import { IoArrowBackOutline } from "react-icons/io5";
import Link from "next/link";

export default function Customer() {
  const { data: code } = useQuery(["LedgerCode"], () =>
    get("/Ledger/NextCode")
  );

  const itemCode = code?.nextItemCode;
  const [nextCode, setNextCode] = useState("0");
  const [ledgerGroupId, setLedgerGroupId] = useState(0);

  useEffect(() => {
    const userContext = getUserContext();
    const ledgerGroupsId = userContext?.sundryDebtor;

    setNextCode(itemCode);

    setLedgerGroupId(ledgerGroupsId);
  }, [code, ledgerGroupId, itemCode]);

  const router = useRouter();

  const formik = useFormik<CustomerForm>({
    initialValues: {
      ledgerCode: nextCode,
      ledgerGroupId: ledgerGroupId,
      openingBal: 0,
      drOrCr: 0,
      branchId: 0,
      name: "",
      mobile: "",
      gstin: "",
    },
    onSubmit: (values) => {
      createCustomerMutation.mutate(values);
    },
    enableReinitialize: true,
  });

  const createCustomerMutation = useMutation(
    (values: CustomerForm) => {
      const v = { ...values };
      v.ledgerCode = values.ledgerCode;
      v.ledgerGroupId = values.ledgerGroupId;
      v.name = values.name;
      v.mobile = values.mobile;
      v.gstin = values.gstin;
      return post("/Ledger", v);
    },
    {
      onSuccess() {
        toast.success("Customer Created Successfully...");
        router.push("/dashboard");
      },
      onError(e) {
        toast.error("Something went wrong");
        console.log(e);
      },
    }
  );

  const { values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full h-screen ">
      <Navbar passed={false} />
      <div className="w-full h-full flex justify-center items-start p-3 pt-[70px]">
        <div className="w-full  flex justify-center items-center flex-col p-5">
          {/* <Debug data={values} /> */}
          <div className="w-full h-full bg-gradient-to-b from-cyan-100 to-blue-100 flex justify-start items-center flex-col p-2 rounded-md">
            <form onSubmit={handleSubmit}>
              <div className="w-full h-full flex justify-center items-center flex-col p-2 rounded-md border border-slate-500">
                <div className="flex flex-row justify-center items-center gap-3">
                  <Link href={"/customers"}>
                    <IoArrowBackOutline size={20} />
                  </Link>
                  <p className="text-2xl p-2 font-bold text-gray-600 ">
                    Create Customer
                  </p>
                </div>
                <div className="h-[50px] w-full flex flex-row justify-center items-center gap-3 p-2">
                  <p className="w-[150px] font-semibold text-gray-600 h-full text-center flex justify-center items-center">
                    Code
                  </p>
                  :
                  <input
                    type="text"
                    name="ledgerCode"
                    className="outline-none pl-3 rounded-md w-full h-full"
                    value={values.ledgerCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="h-[50px] w-full flex flex-row justify-center items-center gap-3 p-2">
                  <p className="w-[150px] font-semibold text-gray-600 h-full text-center flex justify-center items-center">
                    Name
                  </p>
                  :
                  <input
                    value={values.name}
                    type="text"
                    name="name"
                    className="outline-none pl-3 rounded-md w-full h-full"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="h-[50px] w-full flex flex-row justify-center items-center gap-3 p-2">
                  <p className="w-[150px] font-semibold text-gray-600 h-full text-center flex justify-center items-center">
                    Mobile
                  </p>
                  :
                  <input
                    value={values.mobile}
                    type="text"
                    name="mobile"
                    className="outline-none pl-3 rounded-md w-full h-full"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="h-[50px] w-full flex flex-row justify-center items-center gap-3 p-2">
                  <p className="w-[150px] font-semibold text-gray-600 h-full text-center flex justify-center items-center">
                    GSTIN
                  </p>
                  :
                  <input
                    value={values.gstin}
                    type="text"
                    name="gstin"
                    className="outline-none pl-3 rounded-md w-full h-full"
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="h-[50px] w-full flex flex-row justify-center items-center gap-3 p-2">
                <p className="w-[150px] font-semibold text-gray-600 h-full text-center flex justify-center items-center">
                  LedgerCode
                </p>
                :<input
                  type="text"
                  name="code "
                  className="outline-none pl-3 rounded-md w-full h-full"
                />
              </div> */}
                <div className="h-[50px] w-full flex justify-center items-center m-2">
                  <button
                    type="submit"
                    className="w-[100px] h-[50px] rounded-xl font-semibold text-gray-600 bg-cyan-300 text-center flex justify-center items-center"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
