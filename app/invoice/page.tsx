"use client";

import Navbar from "../Navbar";
import { LuSearch } from "react-icons/lu";
import { CiSquareMinus } from "react-icons/ci";
import { CiSquarePlus } from "react-icons/ci";
import { useEffect, useState } from "react";
import Select from "react-select";
import { API_BASE_URL, get, post } from "../app_packages/http-client";
import { useMutation, useQuery } from "react-query";
import sumBy from "lodash/sumBy";
import { ItemState, SalesForm } from "../Types";
import { getUserContext } from "../app_packages/tocken";
import * as Yup from "yup";
import RequiredError from "../Required";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import { useFormik } from "formik";
import Link from "next/link";
import { BsPrinter } from "react-icons/bs";
import { IoMdClose, IoMdShareAlt } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { Console } from "console";

const validationSchema = Yup.object().shape({
  ledgerId: Yup.number().required("Customer is Required"),
});

export default function Invoice() {
  const [search, setSearch] = useState("");
  const { data: items, isLoading } = useQuery(["Item"], () => get("/Item"));

  const { data: taxShedules } = useQuery(["TaxSchedule"], () =>
    get("/TaxSchedule")
  );
  const router = useRouter();

  const [selectItems, setSelectedItems] = useState<ItemState[]>([]);
  const [vatorgst, setvatOrgst] = useState("");

  const handlePriceChange = (itemId: number, total: number) => {
    const itemFind = selectItems.filter((x: ItemState) => x.id === itemId);
    if (itemFind.length === 0) {
      const current = items.filter((x: any) => x.id === itemId)[0];
      const tax = taxShedules.filter(
        (x: any) => x.id === current.taxScheduleId
      )[0];

      const salesRate =
        tax == null || current?.taxMode === 1
          ? current?.salesRate
          : Inclusive(
              current?.salesRate,
              vatorgst === "V" ? tax.vat : tax.cgst + tax.sgst
            );
      const taxper = vatorgst === "V" ? tax.vat : tax.sgst + tax.cgst;
      const inclusiveRate =
        tax == null || current?.taxMode === 0
          ? current?.salesRate
          : current?.salesRate + (current?.salesRate * taxper) / 100;
      const qty = total / inclusiveRate;

      //const taxValue = qty * taxInclding;
      const newitem = {
        ...current,
        inclusiveRate: inclusiveRate,
        qty: qty,
        amount: salesRate,
        salesRate: salesRate,
        itemId: current?.id,
        wareHouseId: wareId,
        vat: tax == null ? 0 : tax?.vat,
        cgst: tax == null ? 0 : tax?.cgst,
        igst: tax == null ? 0 : tax?.igst,
        sgst: tax == null ? 0 : tax?.sgst,
        total: total,
      } as ItemState;
      const appended = [...selectItems, newitem];
      setSelectedItems(appended);
    } else {
      const modified = selectItems?.map((i: ItemState) => {
        if (i.id === itemId) {
          // const taxper = vatorgst === "V" ? i.vat : i.sgst + i.cgst;
          // const taxInclding =
          //   taxper > 0 ? i.amount + (i.amount * taxper / 100) : i.amount;
          const qty = total / i.inclusiveRate;
          console.log(i);

          console.log(i.inclusiveRate, "else");

          return { ...i, qty: qty, total: total } as ItemState;
        } else {
          return i;
        }
      });
      setSelectedItems(modified);
    }
  };

  const handleQtyChange = (itemId: number, qty: number) => {
    const itemFind = selectItems.filter((x: ItemState) => x.id === itemId);
    if (itemFind.length === 0) {
      const current = items.filter((x: any) => x.id === itemId)[0];
      const tax = taxShedules.filter(
        (x: any) => x.id === current.taxScheduleId
      )[0];

      const salesRate =
        tax == null || current?.taxMode === 1
          ? current?.salesRate
          : Inclusive(
              current?.salesRate,
              vatorgst === "V" ? tax.vat : tax.cgst + tax.sgst
            );
      const taxper = vatorgst === "V" ? tax.vat : tax.sgst + tax.cgst;
      const taxInclding =
        salesRate + (taxper > 0 ? (salesRate * taxper) / 100 : 0);
      const taxValue = qty * taxInclding;
      
      
      const inclusiveRate =
        tax == null || current?.taxMode === 0
          ? current?.salesRate
          : current?.salesRate + (current?.salesRate * taxper) / 100;


      const newitem = {
        ...current,
        qty: qty,
        amount: salesRate,
        salesRate: salesRate,
        itemId: current?.id,
        wareHouseId: wareId,
        vat: tax == null ? 0 : tax?.vat,
        cgst: tax == null ? 0 : tax?.cgst,
        igst: tax == null ? 0 : tax?.igst,
        sgst: tax == null ? 0 : tax?.sgst,
        total: Math.round((qty * salesRate + taxValue) * 100) / 100,
        inclusiveRate : inclusiveRate
      } as ItemState;
      const appended = [...selectItems, newitem];
      setSelectedItems(appended);
    } else {
      const modified = selectItems?.map((i: ItemState) => {
        const taxper = vatorgst === "V" ? i.vat : i.sgst + i.cgst;
        if (i.id === itemId) {
          return {
            ...i,
            qty: qty,
            total: qty * (i.amount + (i.amount * taxper) / 100),
          } as ItemState;
        } else {
          return i;
        }
      });
      setSelectedItems(modified);
    }
  };

  const handleIncrement = (itemId: number) => {
    const itemFind = selectItems.filter((x: ItemState) => x.id === itemId);
    if (itemFind.length === 0) {
      const current = items.filter((x: any) => x.id === itemId)[0];
      const tax = taxShedules.filter(
        (x: any) => x.id === current.taxScheduleId
      )[0];

      const salesRate =
        tax == null || current?.taxMode === 1
          ? current?.salesRate
          : Inclusive(
              current?.salesRate,
              vatorgst === "V" ? tax.vat : tax.cgst + tax.sgst
            );
      const newitem = {
        ...current,
        qty: 1,
        amount: salesRate,
        salesRate: salesRate,
        itemId: current?.id,
        wareHouseId: wareId,
        vat: tax == null ? 0 : tax?.vat,
        cgst: tax == null ? 0 : tax?.cgst,
        igst: tax == null ? 0 : tax?.igst,
        sgst: tax == null ? 0 : tax?.sgst,
      } as ItemState;

      const appended = [...selectItems, newitem];
      setSelectedItems(appended);
    } else {
      const modified = selectItems?.map((i: ItemState) => {
        if (i.id === itemId) {
          return { ...i, qty: i.qty + 1 } as ItemState;
        } else {
          return i;
        }
      });
      setSelectedItems(modified);
    }
  };

  const Inclusive = (p: number, t: number) => {
    const price = (p * 100) / (100 + t);
    return price;
  };

  const handleDecrement = (id: number) => {
    var modified = selectItems?.map((i: ItemState) => {
      if (i.id === id && i.qty > 0) {
        return { ...i, qty: i.qty - 1 } as ItemState;
      } else {
        return i;
      }
    });
    modified = modified.filter((x: ItemState) => {
      return x.qty > 0;
    });
    setSelectedItems(modified);
  };

  const itemList = items?.filter((x: any) => {
    if (!search) {
      return true;
    }
    if (search === ":selected") {
      return (
        selectItems.filter((s) => {
          return s.id === x.id;
        }).length === 1
      );
    }
    return (x.itemName + x.itemCode)
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const [taxState, setTaxState] = useState(0);
  const [billState, setBillState] = useState(0);

  const itemtot = selectItems?.filter((x: ItemState) => x.qty > 0).length;
  const qtytot = sumBy(selectItems, (o) => {
    return o.qty;
  });
  const billTot = sumBy(selectItems, (o) => {
    const tot = o.qty * o.salesRate;
    return tot;
  });

  //  billtot = Math.round(billTot*100)/100;
  const taxTot = sumBy(selectItems, (o) => {
    const taxper = vatorgst === "V" ? o.vat : o.sgst + o.cgst;
    const taxInclding = taxper > 0 ? (o.salesRate * taxper) / 100 : 0;
    const tax = o.qty * taxInclding;
    return tax;
  });
  useEffect(() => {
    setTaxState(Math.round(taxTot * 100) / 100);
    setBillState(Math.round(billTot * 100) / 100);
  }, [taxTot, billTot]);

  const granTotal = Math.round((billTot + taxTot) * 100) / 100;

  const Qty = (itemId: number) => {
    const selected = selectItems.filter((x: ItemState) => x.id === itemId);
    return selected.length === 0 ? 0 : Math.round(selected[0].qty * 100) / 100;
  };

  const { data: customer } = useQuery(["Ledger"], () => get("/Ledger?type=1"));
  const [payments, setPayments] = useState<any>([]);
  const { data: cashandbank } = useQuery(
    ["CashandBank"],
    () => get("/Ledger?type=4").then((res) => res),
    {
      onSuccess: (x) => {
        const value = x.map((y: any) => ({
          id: 0,
          name: y.name,
          ledgerId: y.id,
          amount: 0,
          transactionType: 0,
          reference: "",
        }));
        setPayments(value);
      },
    }
  );
  const HandleChange = (value: number, id: any, labelclick: boolean) => {
    const modified = payments?.map((i: any) => {
      if (i.ledgerId === id) {
        return { ...i, amount: value };
      } else {
        if (labelclick) return { ...i, amount: 0 };
        return i;
      }
    });
    setPayments(modified);
  };

  const customers =
    customer?.map((cust: any) => ({
      ledgerId: cust.id,
      label: cust.name,
    })) ?? [];
  const [custBalance, setCustBalance] = useState(0);
  const [billId, setBillId] = useState(0);
  const [wareId, setWareId] = useState(0);
  const [href, setHref] = useState("");

  useEffect(() => {
    const userContext = getUserContext();
    setvatOrgst(userContext?.vatOrGst);
    const billBookId = userContext?.billBookId;
    const wareHouseId = userContext?.warehouseId;
    const branchId = userContext?.branchId;
    const tocken = userContext?.token;
    const financialYear = userContext?.financialYear;
    const companyId = userContext?.companyId;
    setHref(
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
    billBookId && setBillId(billBookId);
    wareHouseId && setWareId(wareHouseId);
  }, [billId, wareId]);

  const [active, setActive] = useState(false);

  const formik = useFormik({
    initialValues: {
      itemList: [],
      billBookId: 0,
      date: new Date().toISOString().substring(0, 10),
      dueDate: new Date().toISOString().substring(0, 10),
      invoiceNo: 0,
      ledgerId: "",
      billAmount: 0,
      discount: 0,
      roundOff: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      vat: 0,
      cess: 0,
      payments: [],
    },
    onSubmit: (values: any) => {
      salesMutation.mutate(values);
    },
    validationSchema,
  });

  const salesMutation = useMutation(
    (values: SalesForm) => {
      const v = { ...values };
      v.itemList = selectItems;
      v.payments = payments;
      v.billBookId = billId;
      return post("/Sale", v);
    },
    {
      onSuccess(res: any) {
        formik.resetForm();
        setSelectedItems([]);
        setActive(false);
        setPrintorView(false);
        setCustBalance(0);
        window.location.href = "hisabuk://print?id=" + res.id + href;
        window.location.reload();
      },
    }
  );

  const { values, handleChange, handleSubmit, setFieldValue, errors, touched } =
    formik;
  var { data: custbal } = useQuery(
    ["balance"],
    () => get("/Ledger/balance/" + values.ledgerId),
    {
      enabled: active,
      onSuccess(res) {
        setActive(false);
        setCustBalance(res.accountBal);
      },
      onError() {
        setActive(false);
        setCustBalance(0);
      },
    }
  );

  const [show, setShow] = useState(false);
  const [printView, setPrintorView] = useState(false);

  const GotoPrint = (id: any) => {
    const queryString = new URLSearchParams(id).toString();
    const printPage = `/print?id=${id}`;
    router.push(printPage);
  };

  const imageUrl = "../assets/hisa-icon.png";

  const handleShare = () => {
    const data = encodeURIComponent(`image:${imageUrl}`);
    const whaturl = `https://wa.me/9539018161/?text=${data}`;
    window.open(whaturl, "_blank");
    // window.location.href = shareUrl;
  };
  const [filter, setFilter] = useState(true);
  const [nofilter, setNoFilter] = useState(false);
  const qtys = selectItems?.map((x: any) => x.qty);
  const [inputType, setInputType] = useState(true);
  // const [amounts, setAmount] = useState(0);

  // useEffect(() => {
  //   const amount = itemList?.map((x: any) => {
  //     var rounding = Qty(x.id) * Math.round((x.salesRate * 100) / 100);
  //     return rounding;
  //   });
  //   amounts && setAmount(amount);
  // }, [amounts]);

  return (
    <div>
      {isLoading && <Loader />}
      <div className="w-full h-auto ">
        <Navbar passed={false} />
        <div className="w-full  flex flex-col pt-[50px] bg-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="w-full h-full ">
              <div className="w-full h-[px] bg-white p-3 mt-2">
                <div className="w-full h-full flex-col">
                  <label className="font-semibold">Customer</label>
                  <Select
                    isClearable
                    name="ledgerId"
                    value={values.customer}
                    className="w-full h-[30px] outline-none text-center mb-3"
                    options={customers}
                    onChange={(v) => {
                      setFieldValue("ledgerId", v?.ledgerId);
                      setCustBalance(0);
                      v && setActive(true);
                    }}
                  />
                  <RequiredError>
                    {errors?.ledgerId && (errors.ledgerId as string)}
                    {/* {errors.ledgerId as string} */}
                  </RequiredError>

                  <div className="w-full h-full flex justify-between items-center flex-row pt-3 p-2 gap-2">
                    <div className="w-[50%] flex flex-col justify-start items-start">
                      <div className="w-full h-full flex justify-between items-center">
                        <p className="p-1 font-semibold text-center text-green-700">
                          Balance
                        </p>

                        <p className="p-1 font-semibold text-center text-red-700">
                          {custBalance ? custBalance : 0}
                        </p>
                      </div>
                      <div className="w-full h-full flex justify-between items-center">
                        <p className="p-1 font-semibold text-center text-green-700">
                          Items
                        </p>

                        <p className="p-1 font-semibold text-center text-red-700">
                          {itemtot}
                        </p>
                      </div>
                      <div className="w-full h-full flex justify-between items-center">
                        <p className="p-1 font-semibold text-center text-green-700">
                          Quantity
                        </p>

                        <p className="p-1 font-semibold text-center text-red-700">
                          {Math.round(qtytot * 100) / 100}
                        </p>
                      </div>
                    </div>
                    <div className="w-[50%] flex flex-col justify-center items-center">
                      <div className="w-full h-full flex justify-between items-center">
                        <p className="p-1 text-sm font-semibold text-center text-green-700">
                          Bill Total
                        </p>

                        <p className="p-1 font-semibold text-center text-red-700">
                          {billState}
                        </p>
                      </div>

                      <div className="w-full h-full flex font-semibold justify-between items-center">
                        <p className="p-1  text-center  text-green-700">
                          Tax Total
                        </p>

                        <p className="p-1 font-semibold text-center text-red-700">
                          {taxState}
                        </p>
                      </div>

                      <div className="w-full h-full flex justify-between items-center">
                        <p className="w-[70%] h-full p-1 font-bold  text-center text-green-700">
                          Grand Total
                        </p>

                        <p className="w-[50%] h-full p-1 font-semibold text-xl text-end text-red-700">
                          {granTotal}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* { <BillPrint />} */}
              {show && (
                <div className="w-full h-[300px] fixed z-10 p-5 flex justify-center items-center">
                  <div className="w-full h-full bottom-0 bg-white  flex flex-col justify-between p-3 items-center rounded-lg shadow-lg shadow-gray-500">
                    <div className="w-full h-full flex flex-col pb-2 gap-3  items-center ">
                      {payments?.map((x: any) => (
                        <div
                          key={x?.ledgerId}
                          className="w-full h-[60px] bg-white flex justify-between items-center flex-row gap-3 p-2 rounded-lg"
                        >
                          <div className="flex justify-center items-center p-2">
                            <p
                              onClick={() => {
                                HandleChange(granTotal, x?.ledgerId, true);
                              }}
                              className="text-lg font-semibold"
                            >
                              {x?.name}
                            </p>
                            :
                          </div>
                          <div className="flex justify-end items-end p-2">
                            <input
                              value={x?.amount}
                              onChange={(e) =>
                                HandleChange(
                                  +e.target.value,
                                  x?.ledgerId,
                                  false
                                )
                              }
                              step="any"
                              name="amount"
                              placeholder="......."
                              type="number"
                              className="w-[150px] h-[40px] outline-none pl-3 m-2 text-xl flex justify-end items-end bg-indigo-50 rounded"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-full h-[70px]">
                      <div className="w-full h-full">
                        <div className="w-full h-full flex justify-evenly items-center gap-2 p-2">
                          <button
                            onClick={() => setShow(false)}
                            className="w-full h-full bg-blue-900 p-2 text-center text-white font-bold rounded-lg shadow-lg"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            // onClick={() => {
                            //   setShow(false);
                            //   // setPrintorView(true);
                            // }}
                            className="w-full h-full bg-blue-900 p-2 text-center text-white font-bold rounded-lg shadow-lg"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* {printView && (
                <div className="w-full h-[140px] fixed z-10 p-5 flex justify-center items-center mt-[100px]">
                  <div className="w-full h-full bottom-0 bg-white  flex flex-col justify-between p-3 items-center rounded-lg shadow-lg shadow-gray-500">
                    <div className="w-full h-[70px]">
                      <div className="w-full h-full bg--500 flex justify-center items-center">
                        <div className="w-full h-full flex justify-evenly items-center gap-2 p-2">
                          <button
                            onClick={handleShare}
                            className="w-full h-full flex flex-row justify-center items-center gap-3 bg-blue-900 p-2 text-white font-bold rounded-lg shadow-lg"
                          >
                            Share
                            <IoMdShareAlt size={20} className="fill-white" />
                          </button>
                          <button
                            type="submit"
                            className="w-full h-full flex flex-row justify-center items-center gap-3 bg-blue-900 p-2 text-white font-bold rounded-lg shadow-lg"
                          >
                            Print
                            <BsPrinter size={20} className="fill-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
              <div className="w-full h-full flex  justify-center items-start mt-2 pb-[60px] relative">
                <div className="w-full  flex flex-col justify-center items-center ">
                  <div className="w-full h-[100px] flex flex-col justify-normal items-start p-1">
                    <p className="pl-4  text-center font-semibold">Find Item</p>
                    <div className="w-full h-[50px] flex flex-row justify-center items-center p-3 gap-2 rounded ">
                      <div className="w-full h-[35px] flex flex-row bg-white border-b-1 rounded-md border-gray-800">
                        <div className="bg-white w-[50px] items-center rounded-md justify-self-center">
                          <LuSearch
                            size={20}
                            className="ml-2 mt-2 bg-whitie"
                            fill="#eef3f3"
                          />
                        </div>
                        <div className="w-full flex justify-center items-center">
                          <input
                            className="h-[35px] w-full bg-whitie outline-none text-gray-700 rounded-md"
                            type="text"
                            placeholder="search"
                            onChange={(e) => {
                              setSearch(e.target.value);
                            }}
                            value={search}
                          />
                          {filter && (
                            <FaFilter
                              onClick={() => {
                                setNoFilter(true);
                                setFilter(false);
                                setSearch(":selected");
                              }}
                              className="mr-2"
                            />
                          )}
                          {nofilter && (
                            <IoMdClose
                              onClick={() => {
                                setFilter(true);
                                setNoFilter(false);
                                setSearch("");
                              }}
                              className="mr-2 font-bold"
                              size={20}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full  flex flex-col gap-3 overflow-x-auto overflow-y-hidden">
                    {itemList?.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="w-full  flex justify-center items-center border-b border-[#80808075] rounded-md p-2"
                      >
                        <div className="w-[80%] h-full  rounded-l-md">
                          <div className="w-full h-full flex flex-col ">
                            <div className="w-full flex flex-col border-b">
                              <p className="text-base text flex flex-col ml-1">
                                {item.itemName}
                                {""}-[{item.itemCode}]
                              </p>
                            </div>
                            <div className="w-full h-full flex justify-center items-center ">
                              <p className="">
                                {Qty(item.id)} x {item.salesRate}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="w-[40%] h-full flex flex-row gap-2">
                          {inputType && (
                            <div className="w-full h-full bg-white flex justify-center items-center rounded-md">
                              <input
                                value={
                                  Math.round(
                                    selectItems.filter(
                                      (x) => x.id === item.id
                                    )?.[0]?.qty * 100
                                  ) / 100
                                }
                                step="any"
                                min={0}
                                type="number"
                                onChange={(e) => {
                                  handleQtyChange(item.id, +e.target.value);
                                }}
                                className="w-[80px] outline-none pl-2 text-center border h-[30px] rounded-md "
                              />
                              <input
                                value={
                                  Math.round(
                                  selectItems.filter(
                                    (x) => x.id === item.id
                                  )?.[0]?.total* 100
                                  ) / 100
                                }
                                onChange={(e) => {
                                  handlePriceChange(item.id, +e.target.value);
                                }}
                                type="number"
                                className="w-[80px] outline-none pl-2 text-center border h-[30px] rounded-md"
                              />
                            </div>
                          )}
                          {!inputType && (
                            <>
                              <div className="w-full h-full bg-white flex justify-center items-center rounded-md">
                                <button
                                  type="button"
                                  onClick={() => handleIncrement(item.id)}
                                  className="bg-green-600 rounded-md "
                                >
                                  <CiSquarePlus
                                    size={30}
                                    className="fill-white"
                                  />
                                </button>
                              </div>
                              <div className="w-full h-full bg-white flex justify-center items-center rounded-md">
                                <button
                                  type="button"
                                  disabled={!selectItems}
                                  onClick={() => handleDecrement(item.id)}
                                  className="bg-red-600 rounded-md"
                                >
                                  <CiSquareMinus
                                    size={30}
                                    className="fill-white"
                                  />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full h-[50px] bg-white fixed bottom-0 left-0">
                <div className="w-full h-full flex justify-center items-center p-3">
                  <p
                    onClick={() => setShow(true)}
                    className="w-[100px] h-[40px] text-center flex justify-center items-center bg-blue-900 rounded-md drop-shadow-md text-white"
                  >
                    Save
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
