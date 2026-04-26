"use client";

import { Formik } from "formik";
import { useContext } from "react";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import { resetPasswordSchema } from "../../../schema/authSchema";
import LoadingIcon from "../../../assets/icons/loadingIcon";
import AuthOverlay from "../../../components/authOverlay/authOverlay";
import { AuthContext } from "../../../contexts/AuthContextValue";
import { Lock } from "@solar-icons/react";
import Link from "next/link";

export default function ResetPassword() {
  const { resetPassword, loading } = useContext(AuthContext);

  return (
    <div className="h-screen flex justify-between">

      <div className="flex items-center justify-center 2xl:w-[54.375%] xl:w-[55%] md:w-[55%] h-full w-full md:px-0 px-6">
        <div className="2xl:w-[520px] sm:w-[400px] py-[15%] md:mx-0 mx-auto w-full">
          <div className="relative flex flex-col justify-center 2xl:gap-12 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-[24px] text-center">Reset Password</h1>
              <p className="text-[#7C7E7E] font-medium text-center">Enter your new password</p>
            </div>

            <Formik
              initialValues={{ password: "", confirmPassword: "" }}
              validationSchema={resetPasswordSchema}
              onSubmit={(values, { setSubmitting }) => {
                resetPassword(values.password);
                setSubmitting(false);
              }}
            >
              {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
                  <Input
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Enter your new password"
                    lefticon={<Lock size={20} color="currentColor" />}
                    error={touched.password ? errors.password : ""}
                    label="New Password"
                  />
                  <Input
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="Confirm your new password"
                    lefticon={<Lock size={20} color="currentColor" />}
                    error={touched.confirmPassword ? errors.confirmPassword : ""}
                    label="Confirm Password"
                  />
                  <Button type="submit" className="w-full py-[12px] mt-4">
                    {isSubmitting || loading ? <LoadingIcon color="white" className="animate-spin w-[20px]" /> : "Reset Password"}
                  </Button>
                </form>

              )}
            </Formik>

            <div className="flex justify-center gap-2 items-center font-medium">
              <span className="text-[#7C7E7E]">Remember your password? </span>
              <Link href="/login" className="text-primary">Back to Login</Link>
            </div>

            <div className="flex justify-center gap-4 items-center mb-8">
              <Link href="/termsofuse" className="text-gray-200 hover:underline">
                Terms of Use
              </Link>
              <Link href="/privacypolicy" className="text-gray-200 hover:underline">
                Privacy Policy
              </Link>
              <Link href="/privacysettings" className="text-gray-200 hover:underline">
                Privacy Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
      <AuthOverlay />

    </div>
  );
}
