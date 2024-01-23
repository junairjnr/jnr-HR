"use client";

import { useMutation, useQuery } from "react-query";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { get, put } from "@/app/app_packages/http-client";
import { CustomerForm } from "@/app/Types";
import Navbar from "@/app/Navbar";
import { useGetCustomer } from "../../data";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";

export default function Customer() {
  const { id } = useParams<{ id: string }>();

  const data = useGetCustomer(id);
  const customer = data?.data;
  console.log(customer, "edi");
  const router = useRouter();

  const formik = useFormik<CustomerForm>({
    initialValues: {
      id: customer?.id,
      ledgerCode: customer?.ledgerCode,
      ledgerGroupId: customer?.ledgerGroupId,
      openingBal: customer?.openingBal,
      drOrCr: customer?.drOrCr,
      branchId: customer?.branchId,
      name: customer?.name,
      mobile: customer?.mobile,
      gstin: customer?.gstin,
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
      return put(`/Ledger/${id}`, v);
    },
    {
      onSuccess() {
        toast.success("Customer Updated Successfully...");
        router.push("/customers");
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
                    Edit Customer
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
