"use client";

import React, { useEffect, useState } from "react";
import logo from "./assets/hisa-icon.png";
import Image from "next/image";
import { BsPersonCircle } from "react-icons/bs";
import Link from "next/link";
import { HiOutlineLogout } from "react-icons/hi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { removeUserContext } from "./app_packages/tocken";

const Navbar = ({ passed }: { passed: boolean }) => {
  const [showPop, setShowPop] = useState(false);
  const [showIcon, setShowicon] = useState(passed);

  const router = useRouter();
  const handleLogOut = () => {
    removeUserContext();
    router.push("/login");
    toast("Logout Successfully");
    setShowPop(false);

     

  };

  return (
    <div className="">
      <nav className="w-full h-[50px] fixed top-0 left-0 z-10">
        <div className=" bg-blue-900 flex justify-between items-center p-3 relative">
          <div className=" flex justify-center items-center">
            <Link href={"/dashboard"}>
              <Image
              onClick={()=>setShowPop(false)}
                alt=""
                src={logo}
                width={150}
                className="fill-blue-900 drop-shadow-md"
              />
            </Link>
          </div>
          <div className="flex justify-center  fill-white items-center rounded-full">
            <BsPersonCircle
              className="fill-white"
              onClick={() => setShowPop(true)}
              size={35}
            />
          </div>
          {showPop && showIcon && (
            <div className="w-36 bg-white  ring-1 ring-red-600 shadow-xl rounded-md flex flex-col absolute top- right-1 ">
              <button
                onClick={handleLogOut}
                className="p-2 flex items-center gap-3 cursor-pointer rounded-lg hover:bg-gray-50 text-base"
              >
                <HiOutlineLogout size={25} />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import logo from "./assets/hisa-icon.png";
// import Image from "next/image";
// import { BsPersonCircle } from "react-icons/bs";
// import Link from "next/link";
// import { HiOutlineLogout } from "react-icons/hi";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import { removeUserContext } from "./app_packages/tocken";
// // import OuterClick from 'react-outer-click'

// const Navbar = ({ passed }: { passed: boolean }) => {
//   const [showPop, setShowPop] = useState(false);
//   const [showIcon, setShowicon] = useState(passed);

//   const router = useRouter();
//   const el = useRef(null);

//   const handleLogout = () => {
//     removeUserContext();
//     router.push('/login');
//     toast('Logout Successful');
//     setShowPop(false);
//   };

//   useEffect(() => {
//     const handleDocClick = (e:any) => {
//       if (e.target.textContent === 'Logout') {
//         handleLogout();
//       }
//       setShowPop(false);
//     };

//     document.body.addEventListener('click', handleDocClick);

//     return () => {
//       document.body.removeEventListener('click', handleDocClick);
//     };
//   }, [router]);

//   const handleOuterClick = () => {
//     setShowPop(false);
//   };
//   // const handleLogOut = () => {
//   //   removeUserContext();
//   //   router.push("/login");
//   //   toast("Logout Successfully");
//   //   setShowPop(false);
//   //   document.body.addEventListener("click", handleLogOut);
//   //   return () => {
//   //     document.body.removeEventListener("click", handleLogOut);
//   //   };
//   // };

//   return (
//     <div className="">
//       <nav className="w-full h-[50px] fixed top-0 left-0 z-10">
//         <div className=" bg-blue-900 flex justify-between items-center p-3">
//           <div className=" flex justify-center items-center">
//             <Link href={"/dashboard"}>
//               <Image alt="" src={logo} width={150} className="fill-blue-900 drop-shadow-md" />
//             </Link>
//           </div>
//           <div className="flex justify-center  fill-white items-center rounded-full">
//             <BsPersonCircle className="fill-white" onClick={() => setShowPop(true)} size={35} />
//           </div>
//           {showPop && showIcon && (
//             <OuterClick onOuterClick={handleOuterClick}>
//             <div className="w-48 bg-white  ring-1 ring-red-600 shadow-xl rounded-md flex flex-col absolute top-12 right-1 ">
//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 flex items-center gap-3 cursor-pointer rounded-lg hover:bg-gray-50 text-base"
//               >
//                 <HiOutlineLogout size={25} />
//                 Logout
//               </button>
//             </div>
//             </OuterClick>
//           )}
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;
