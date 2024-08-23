"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import apiendpoint from "../../../apiendpoint";

export function withAuth(WrappedComponent) {
  axios.defaults.withCredentials = true;
  return function AuthHOC(props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          await axios.get(`${apiendpoint}api/auth/verify`, {
            withCredentials: true,
          });
          setIsLoading(false);
        } catch (error) {
          router.push("/login");
        }
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}
