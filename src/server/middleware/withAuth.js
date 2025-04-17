"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import apiendpoint from "../../../apiendpoint";

export function withAuth(WrappedComponent) {
  axios.defaults.withCredentials = true;

  return function AuthHOC(props) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get(`${apiendpoint}api/auth/verify`, {
            withCredentials: true,
          });

          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            sessionStorage.setItem("redirectAfterLogin", pathname);
            router.push("/login");
          }
        } catch (error) {
          sessionStorage.setItem("redirectAfterLogin", pathname);
          router.push("/login");
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [router, pathname]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
