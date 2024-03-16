import React from "react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";

const index = () => {
  const { isSignedIn } = useUser();

  return (
    <div className="mt-10 flex flex-col gap-8">
      <h1 className="text-center font-sans text-5xl font-extrabold tracking-tight">
        Your Super Cool Saas App{" "}
      </h1>
      {isSignedIn ? (
        <SignOutButton>
          <button className="mx-auto w-min whitespace-nowrap border border-rose-900 bg-gradient-to-br from-rose-500 to-rose-700 px-10 py-2 text-2xl tracking-wide text-neutral-100 ">
            Signout
          </button>
        </SignOutButton>
      ) : (
        <div className="mx-auto flex flex-col gap-4 ">
          <SignUpButton>
            <button>Signup</button>
          </SignUpButton>
          <SignInButton redirectUrl="/">
            <button className="text-center text-lg font-bold text-indigo-900">
              Or login
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
};

export default index;
