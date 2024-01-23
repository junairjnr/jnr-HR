"use client";

import Image from "next/image";
import Login from "./login/page";
import Dashboard from "./dashboard/page";
import Invoice from "./invoice/page";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { getUserContext } from "./app_packages/tocken";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (getUserContext()) {
      router.push("/dashboard");
    } else {
      router.push("login");
    }
  }, [router]);
}
