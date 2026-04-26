"use client";

import { Formik } from "formik";
import { useContext } from "react";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import { forgotPasswordSchema } from "../../../schema/authSchema";
import LoadingIcon from "../../../assets/icons/loadingIcon";
import AuthOverlay from "../../../components/authOverlay/authOverlay";
import { AuthContext } from "../../../contexts/AuthContextValue";
import { Letter } from "@solar-icons/react";
import Link from "next/link";

export default function ForgotPassword() {
  const { forgotPassword, loading } = useContext(AuthContext);

  return (
    <div className="h-screen flex justify-between">

      <div className="flex items-center justify-center 2xl:w-[54.375%] xl:w-[55%] md:w-[55%] w-full h-full md:px-0 px-6">
        <div className="2xl:w-[520px] sm:w-[400px] py-[15%] md:mx-0 mx-auto w-full">
          <div className="relative flex flex-col justify-center items-center 2xl:gap-12 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-[24px] text-center">Forgot Password?</h1>
              <p className="text-[#7C7E7E] font-medium text-center">Enter your email address and we&apos;ll send you a code to reset your password</p>
            </div>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotPasswordSchema}
              onSubmit={(values, { setSubmitting }) => {
                forgotPassword(values.email);
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
                    lefticon={<Letter size={20} color="currentColor" />}
                    error={touched.email ? errors.email : ""}
                    label="Email Address"
                  />
                  <Button type="submit" className="w-full py-[12px] mt-4">
                    {isSubmitting || loading ? <LoadingIcon color="white" className="animate-spin w-[20px]" /> : "Send Reset Code"}
                  </Button>
                </form>

              )}
            </Formik>

            <div className="flex justify-center gap-2 items-center font-medium">
              <span className="text-[#7C7E7E]">Remember your password? </span>
              <Link href="/login" className="text-primary">Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
      <AuthOverlay />

    </div>
  );
}
