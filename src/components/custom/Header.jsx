import { useEffect } from "react";
import { Button } from "../ui/button";
import { Link, Navigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { loginEmail } from "@/api";

function Header() {
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
    localStorage.clear();
    return <Navigate to={"/auth/sign-in"} />;
  }

  return (
    <div className="p-3 px-5 flex justify-between shadow-md">
      <Link
        to={"/dashboard"}
        className="flex gap-3 items-center text-xl font-bold text-[#77a5eb]"
      >
        <img
          src="/logo.svg"
          className="cursor-pointer"
          width={45}
          height={45}
        />
        Hireliy
      </Link>
      {isSignedIn ? (
        <div className="flex gap-2 items-center">
          <Link to={"/dashboard"}>
            <Button variant="outline">Dashboard</Button>
          </Link>
          <UserButton />
        </div>
      ) : (
        <Link to={"/auth/sign-in"}>
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  );
}

export default Header;
