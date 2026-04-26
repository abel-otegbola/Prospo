"use client";

import { Formik } from "formik";
import { useContext } from "react";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import { signupSchema } from "../../../schema/authSchema";
import LoadingIcon from "../../../assets/icons/loadingIcon";
import AuthOverlay from "../../../components/authOverlay/authOverlay";
import { AuthContext } from "../../../contexts/AuthContextValue";
import { Case, Letter, Lock, User } from "@solar-icons/react";
import { FREELANCING_SPECIALTIES } from "../../../constants/specialties";
import Dropdown from "../../../components/dropdown/dropdown";
import Link from "next/link";

export default function Signup() {
  const { signUp, loading } = useContext(AuthContext);

  return (
    <div className="h-screen overflow-y-auto flex sm:items-center justify-between">

      <div className="scroll flex items-center justify-center 2xl:w-[54.375%] xl:w-[55%] md:w-[55%] h-screen overflow-y-auto w-full md:px-0 px-6">
        <div className="2xl:w-[520px] sm:w-[400px] py-[15%] md:mx-0 mx-auto w-full">
          <div className="relative flex flex-col justify-center 2xl:gap-12 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-[24px] text-center">Get Started</h1>
              <p className="text-[#7C7E7E] font-medium text-center">Create your account to start finding clients</p>
            </div>

            <Formik
              initialValues={{ fullname: "", email: "", specialty: "", password: "" }}
              validationSchema={signupSchema}
              onSubmit={(values, { setSubmitting }) => {
                signUp({
                  email: values.email,
                  password: values.password,
                  fullname: values.fullname,
                  specialty: values.specialty
                });
                setSubmitting(false);
              }}
            >
              {({ values, errors, touched, setFieldValue, handleChange, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
                  <Input
                    name="fullname"
                    value={values.fullname}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g John Doe"
                    lefticon={<User size={20} color="currentColor" />}
                    error={touched.fullname ? errors.fullname : ""}
                    label="Full Name"
                  />
                  <Input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="e.g john.doe@example.com"
                    lefticon={<Letter size={20} color="currentColor" />}
                    error={touched.email ? errors.email : ""}
                    label="Work Email"
                  />
                  <Dropdown 
                    label="Specialty" 
                      leftIcon={<Case size={20} color="currentColor" />}
                    value={values.specialty} 
                    onChange={(value) => setFieldValue("specialty", value)} 
                    error={touched.specialty ? errors.specialty : ""}
                    options={FREELANCING_SPECIALTIES.map(specialty => { return { id: specialty.label, title: specialty.label } })} 
                  />
                  
                  <Input
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Enter your password"
                    lefticon={<Lock size={20} color="currentColor" />}
                    error={touched.password ? errors.password : ""}
                    label="Password"
                  />
                  <Button type="submit" className="w-full mt-4 py-[12px]">
                    {isSubmitting || loading ? <LoadingIcon color="white" className="animate-spin w-[20px]" /> : "Create Account"}
                  </Button>
                </form>
              )}
            </Formik>

            <div className="text-center flex gap-2 items-center justify-center font-medium">
              <span className="text-[#7C7E7E]">Already have an account? </span>
              <Link href="/login" className="text-primary font-medium">Log in</Link>
            </div>
          </div>
        </div>
      </div>

      <AuthOverlay />
    </div>
  );
}
