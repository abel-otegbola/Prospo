'use client';
import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import { loginSchema } from "../../../schema/authSchema";
import LoadingIcon from "../../../assets/icons/loadingIcon";
import AuthOverlay from "../../../components/authOverlay/authOverlay";
import { AuthContext } from "../../../contexts/AuthContextValue";
import { Letter, Lock } from "@solar-icons/react";
import GoogleIcon from "../../../assets/icons/googleIcon";
import LineCircleIcon from "../../../assets/icons/lineCircle";
import Link from "next/link";

export default function Login() {
  const { login, loading, sociallogin } = useContext(AuthContext);
  const [rememberMe, setRememberMe] = useState(false)
  const [callbackURL, setCallbackURL] = useState("")

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setCallbackURL(query.get("callbackURL") || "");
  }, []);

  return (
    <div className="h-screen flex justify-between">

      <div className="scroll flex items-center justify-center 2xl:w-[54.375%] xl:w-[55%] md:w-[55%] h-screen overflow-y-auto w-full md:px-0 px-6">
        <div className="2xl:w-[520px] sm:w-[400px] py-[15%] md:mx-0 mx-auto w-full">
          <div className="relative flex flex-col justify-center 2xl:gap-12 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-[24px] text-center">Sign in to your Account</h1>
              <p className="text-[#7C7E7E] font-medium text-center">Manage your leads and grow your business</p>
            </div>
            <Button variant="secondary" onClick={() => sociallogin("google")} className="w-full font-semibold shadow-none"><GoogleIcon /> Sign in with Google</Button>

            <div className="flex items-center gap-4 w-full">
              <LineCircleIcon className="flex-1 "/>
              <span className="text-gray/ rounded font-medium border border-gray/[0.2] p-4 md:px-[15%] leading-[12px] py-2 text-nowrap text-[12px]">Or sign in with Email</span>
              <LineCircleIcon className="flex-1 rotate-180" />
            </div>


            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={(values, { setSubmitting }) => {
                login(values.email, values.password, rememberMe, callbackURL || "/account");
                setSubmitting(false);
              }}
            >
              {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
                  <Input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter your email"
                    lefticon={<Letter size={20} color="currentColor" />}
                    error={touched.email ? errors.email : ""}
                    label="Email Address"
                  />
                  <Input
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Enter your password"
                    lefticon={<Lock size={20} color="currentColor" />}
                    error={!touched.password ? errors.password : ""}
                    label="Password"
                  />
                  <div className="flex justify-between items-center w-full">
                    <div className="text-center flex gap-1 items-center text-[#7C7E7E] font-medium leading-[0px]">
                      <input id="remember" checked={rememberMe} type="checkbox" onChange={() => setRememberMe(!rememberMe)} />
                      <label htmlFor="remember">Remember me</label>
                    </div>
                    <Link href="/forgot-password" className="text-primary font-medium">
                      Forgot Password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full py-[12px] mt-4">
                    {isSubmitting || loading ? <LoadingIcon color="white" className="animate-spin w-[20px]" /> : "Login"}
                  </Button>
                </form>

              )}
            </Formik>

            <div className="flex justify-center gap-2 items-center font-medium">
              <span className="text-[#7C7E7E]">Don&apos;t have an account? </span>
              <Link href="/signup" className="text-primary">Sign up for free</Link>
            </div>
          </div>
        </div>
      </div>
      <AuthOverlay />

    </div>
  );
}

