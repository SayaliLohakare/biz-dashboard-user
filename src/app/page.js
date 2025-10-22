"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material"; // MUI loader

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("authToken2") || Cookies.get("authToken") ;

    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" size={60} thickness={5} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      {/* Your login form goes here */}
    </div>
  );
}
