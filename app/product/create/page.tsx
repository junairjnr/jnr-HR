"use client";

import { useMutation, useQuery } from "react-query";
import Navbar from "../../Navbar";
import { get, post } from "../../app_packages/http-client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductForm } from "../../Types";
import { Debug } from "../../debugg";
import toast from "react-hot-toast";
import { IoArrowBackOutline } from "react-icons/io5";
import Link from "next/link";

export default function CreateProduct() {
  const { data: code } = useQuery(["LedgerCode"], () =>
    get("/Ledger/NextCode")
  );
  const { data: itemGroup } = useQuery(["ItemGroup"], () => get("/ItemGroup"));
  const { data: tax } = useQuery(["TaxSchedule"], () => get("/TaxSchedule"));

  const itemCode = code?.nextItemCode;
  const [nextCode, setNextCode] = useState("0");
  const [groupId, setGroupId] = useState(0);
  const [taxId, setTaxId] = useState(0);

  useEffect(() => {
    setNextCode(itemCode);
  }, [code,itemCode]);

  const router = useRouter();

  const formik = useFormik<ProductForm>({
    initialValues: {
      itemCode: nextCode,
      itemGroupId: groupId,
      itemName: "",
      secondName: "",
      purchaseRate: 0,
      salesRate: 0,
      taxScheduleId: taxId,
      barcode: "",
      bulkUnits: [],
      costRate: 0,
      hsnCode: "",
      images: "",
      maintainStock: true,
      mrp: 0,
      notes: "",
      reOrderLevel: 0,
      taxMode: 0,
      warehouseId: 0,
      wholesaleRate: 0,
    },
    onSubmit: (values) => {
      createCustomerMutation.mutate(values);
    },
    enableReinitialize: true,
  });

  const createCustomerMutation = useMutation(
    (values: ProductForm) => {
      const v = { ...values };
      v.itemCode = values?.itemCode;
      v.itemGroupId = values.itemGroupId;
      v.taxScheduleId = values.taxScheduleId;
      v.itemName = values.itemName;
      v.secondName = values.secondName;
      v.purchaseRate = values.purchaseRate;
      v.salesRate = values.salesRate;
      return post("/Item", v);
    },
    {
      onSuccess() {
        toast.success("Item Created Successfully...");
        router.push("/product");
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
          <div className="w-full h-full bg-gradient-to-b from-gray-100 to-green-100 flex justify-start items-center flex-col p-2 rounded-md">
            <form onSubmit={handleSubmit}>
              <div className="w-full h-full flex justify-start items-center flex-col p-2 rounded-md border border-slate-500">
              <div className="flex flex-row justify-center items-center gap-3">
                  <Link href={"/product"}>
                    <IoArrowBackOutline size={20} />
                  </Link>
                  <p className="text-2xl p-2 font-bold text-gray-600 ">
                    Create Item
                  </p>
                </div>
                <div className="h-[50px] w-full flex flex-row justify- items-center gap-3 p-2">
                  <p className="w-[160px] font-semibold text-gray-600 h-full text-center flex justify- items-center">
                    Code
                  </p>
                  :
                  <input
                    value={values.itemCode}
                    type="text"
                    name="itemCode"
                    className="outline-none pl-3 rounded-md w-full h-full"
                    onChange={handleChange}
                  />
                </div>
                <div className="h-[50px] w-full flex flex-row justify- items-center gap-3 p-2">
                  <p className="w-[160px] font-semibold text-gray-600 h-full text-center flex justify- items-center">
                    Item Group
                  </p>
                  :
                  <select
                    name="itemGroupId"
                    value={values.itemGroupId}
                    onChange={handleChange}
                    className="outline-none pl-3 text-sm rounded-md w-full h-full"
                    required
                  >
                    <option>select group</option>
                    {itemGroup?.map((x: any, index: number) => (
                      <option key={index} value={x.id}>
                        {x.itemGroupName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="h-[50px] w-full flex flex-row justify- items-center gap-3 p-2">
                  <p className="w-[160px] font-semibold text-gray-600 h-full text-center flex justify- items-center">
                    Tax
                  </p>
                  :
                  <select
                    name="taxScheduleId"
                    value={values.taxScheduleId}
                    onChange={handleChange}
                    className="outline-none pl-3 text-sm rounded-md w-full h-full"
                    required
                  >
                    <option>select tax</option>
                    {tax?.map((x: any, index: number) => (
                      <option key={index} value={x.id}>
                        {x.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="h-[50px] w-full flex flex-row justify- items-center gap-3 p-2">
                  <p className="w-[160px] font-semibold text-gray-600 h-full text-center flex justify- items-center">
                    Name
                  </p>
                  :
                  <input
                    value={values.itemName}
                    type="text"
                    name="itemName"
                    className="outline-none pl-3 rounded-md w-full h-full"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="h-[50px] w-full flex flex-row justify- items-center gap-3 p-2">
                  <p className="w-[160px] font-semibold text-gray-600 h-full text-center flex justify- items-center">
                    SecondName
                  </p>
                  :
                  <input
                    value={values.secondName}
                    type="text"
                    name="secondName"
                    className="outline-none pl-3 rounded-md w-full h-full"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="h-[50px] w-full flex flex-row justify- items-center gap-3 p-2">
                  <p className="w-[160px] font-semibold text-gray-600 h-full text-center flex justify- items-center">
                    PurchaseRate
                  </p>
                  :
                  <input
                    value={values.purchaseRate}
                    type="text"
                    name="purchaseRate"
                    className="outline-none pl-3 rounded-md w-full h-full"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="h-[50px] w-full flex flex-row justify- items-center gap-3 p-2">
                  <p className="w-[160px] font-semibold text-gray-600 h-full text-center flex justify- items-center">
                    SalesRate
                  </p>
                  :
                  <input
                    value={values.salesRate}
                    type="text"
                    name="salesRate"
                    className="outline-none pl-3 rounded-md w-full h-full"
                    onChange={handleChange}
                    required
                  />
                </div>
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
