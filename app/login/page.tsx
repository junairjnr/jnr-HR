"use client";

import Image from "next/image";
import logo from "../assets/logoMain.png";
// import { FaUser } from "react-icons/fa";
import { GoPerson } from "react-icons/go";
import { CiLock } from "react-icons/ci";
import { FaRegCalendarAlt } from "react-icons/fa";
import tile from "../assets/tile.png";
import Link from "next/link";
import { useLogin } from "../data/auth";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { storeLoginDate, storeUserContext } from "../app_packages/tocken";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useRef, useState } from "react";
import { FieldError } from "../FieldError";
import { LoginFormValues } from "../Types";
import { TbLoaderQuarter } from "react-icons/tb";
import Loader from "../Loader";
import { json } from "stream/consumers";

const validationSchema: Yup.Schema<LoginFormValues> = Yup.object().shape({
  username: Yup.string().trim().required("Please type UserName"),
  password: Yup.string().trim().required("Please type Password"),
  date: Yup.string().trim().required("Please type Date"),
});

export default function Login() {
  const login = useLogin();
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);

  const form = useFormik<LoginFormValues>({
    initialValues: {
      username: "",
      password: "",
      date: new Date().toISOString().substring(0, 10),
    },
    validationSchema,
    onSubmit: (values) => {
      login.mutate(values, {
        onSuccess(data) {
          storeUserContext(data);
          setShowLoader(true);
          storeLoginDate(values.date);
          toast("Login Successfully");  
          router.push("/dashboard");
        },
        onError(e: any) {
          toast.error(e);
          // console.log("login_error", e);
        },
      });
    },
  });

  const { values, handleChange, handleSubmit, errors, touched } = form;
  const inputRef = useRef(null);

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* <div className="w-full h-screen bg-gradient-to-b from-blue-500 to-blue-800 flex flex-col "> */}
      {/* <div className="w-full h-screen bg-[url('assets/tile.png')] flex justify-center items-center  flex-col "> */}
      <div className="w-full h-screen bg-gray-100 flex justify-center items-center  flex-col ">
        <div className="w-full h-screen flex flex-col justify-center items-center ">
          {showLoader && <Loader />}
          <div className="w-[300px] h-[300px] flex flex-col justify-center items-center">
            <Image
              alt=""
              src={logo}
              width={100}
              height={100}
              className="cursor-pointer"
            />
          </div>
          <div className="w-[400px] h-[400px] flex flex-col justify-start items-center ">
            <form onSubmit={handleSubmit} className="flex flex-col ">
              <div className="w-[300px] h-[50px] bg-white flex flex-row justify-center items-center rounded-lg">
                <div className="">
                  {/* <FaUser className="w-[49px] h-[49px] p-3 fill-[#9c0c89] " /> */}
                  <GoPerson className="w-[49px] h-[49px] p-3 fill-[#180c9c] cursor-pointer" />
                </div>
                <div className="">
                  <input
                    value={values.username}
                    name="username"
                    type="text"
                    placeholder="Username"
                    className="p-3  w-[250px] outline-none rounded-r-lg"
                    onChange={handleChange}
                  />
                </div>
              </div>
              {touched.username && errors.username && (
                <FieldError text={errors.username} />
              )}
              <div className="w-[300px] h-[50px] bg-white flex flex-row justify-center items-center rounded-lg mt-4">
                <div className="">
                  <CiLock className="w-[49px] h-[49px] p-3 fill-[#180c9c] cursor-pointer" />
                </div>
                <div className="">
                  <input
                    value={values.password}
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="p-3  w-[250px] outline-none rounded-r-lg"
                    onChange={handleChange}
                  />
                </div>
              </div>
              {touched.password && errors.password && (
                <FieldError text={errors.password} />
              )}
              <label
                htmlFor="date"
                onClick={() => inputRef?.current as unknown as HTMLInputElement}
              >
                <div className="w-[300px] h-[50px] bg-white flex flex-row justify-center items-center rounded-lg mt-4">
                  <div className="">
                    <FaRegCalendarAlt className="w-[49px] h-[49px] p-3 fill-[#180c9c] cursor-pointer" />
                  </div>
                  <div className="">
                    <input
                      ref={inputRef}
                      value={values.date}
                      name="date"
                      type="date"
                      placeholder="date"
                      className="p-3  w-[250px] outline-none rounded-r-lg"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {touched.date && errors.date && (
                  <FieldError text={errors.date} />
                )}
              </label>
              <div className="flex justify-center">
                <button
                  //   disabled={isLoading}
                  type="submit"
                  className="bg-[#1e3a8a] text-base cursor-pointer font-semibold p-1 mt-10 w-40 rounded-lg ring-white ring-1 text-white flex justify-center items-center text-center "
                >
                  {" "}
                  LOG IN
                </button>
              </div>
            </form>
          </div>
          <div className="w-full h-auto flex justify-center items-center text-gray-800">
            <p className="mb-[100px] text-center text-sm">
              Powered By{" "}
              <a
                className="text-lg font-bold pl-2 text-gray-700"
                target="_blank"
                href="https://datastoneglobal.com/"
              >
                Datastone Solutions LLP
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
