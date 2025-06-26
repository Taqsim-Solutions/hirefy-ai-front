import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";
import { loginEmail } from "@/api";

function App() {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isSignedIn && user && !localStorage.getItem("hireliy-token")) {
      loginEmail({ email: user.primaryEmailAddress?.emailAddress || "" })
        .then((res) => {
          console.log(res);
          const token = res?.data?.accessToken;
          if (token) {
            localStorage.setItem("hireliy-token", token);
          }
        })
        .catch((err) => {
          console.error("Your API login failed:", err);
        });
    }
  }, [isSignedIn, user]);

  if (!isSignedIn && isLoaded) {
    return <Navigate to={"/auth/sign-in"} />;
  }

  return (
    <>
      <Header />
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
