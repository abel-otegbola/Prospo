"use client";

import { Formik } from "formik";
import { profileSchema } from "../../../schema/authSchema";
import { Case, Letter, User } from "@solar-icons/react";
import Button from "../../../components/button/Button";
import LoadingIcon from "../../../assets/icons/loadingIcon";
import { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContextValue";
import { UserProfileContext } from "../../../contexts/UserProfileContextValue";
import Dropdown from "../../../components/dropdown/dropdown";
import Input from "../../../components/input/Input";
import { FREELANCING_SPECIALTIES } from "../../../constants/specialties";
import Image from "next/image";

type Section = "personal" | "projects" | "links";

export default function Profile() {
    const { user, updateUser, loading } = useContext(AuthContext);
    const { profile } = useContext(UserProfileContext);
    const [photoURL, setPhotoURL] = useState<string>(user?.photoURL || profile?.photoURL || "");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeSection, setActiveSection] = useState<Section>("personal");

    const NAV_ITEMS: { id: Section; label: string }[] = [
      { id: "personal", label: "Personal Information" },
      { id: "projects", label: "Projects" },
      { id: "links", label: "Links" },
    ];

    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhotoURL(user?.photoURL || profile?.photoURL || "/profile.jpg");
    }, [user?.photoURL, profile?.photoURL]);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoURL(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleDeletePhoto = () => {
      setPhotoURL("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

  return (
    <div className="w-full">
      <div className="h-full p-4 md:p-6 lg:col-span-2 ">
          <div className="mb-6">
              <h1 className="text-2xl font-medium mb-2">Profile</h1>
              <p className="opacity-[0.6]">Manage your information and account</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 md:p-6 rounded-lg md:border border-gray/[0.1] md:bg-gray/[0.03] min-h-[500px]">
            {/* Sidebar nav */}
            <nav className="lg:w-64 flex lg:flex-col flex-row gap-1 shrink-0 md:border-r border-gray/[0.09] md:pr-6">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`text-left px-3 py-2 rounded-lg font-medium ${
                    activeSection === item.id
                      ? "bg-background text-text border border-gray/[0.2]"
                      : "opacity-[0.6] hover:bg-gray/[0.08]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex-1 rounded-lg md:border border-gray/[0.1] md:p-6">
                <Formik
                  initialValues={{ 
                    fullname: profile?.fullName || user?.displayName || "", 
                    email: user?.email || "", 
                    specialty: profile?.specialty || "",
                    bio: profile?.bio || "",
                    password: "" 
                  }}
                  validationSchema={profileSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      await updateUser({
                        email: values.email,
                        password: values.password || undefined,
                        fullname: values.fullname,
                        specialty: values.specialty,
                        bio: values.bio,
                        photoURL: photoURL
                      });
                    } catch (error) {
                      console.error('Failed to update profile:', error);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ values, errors, touched, setFieldValue, handleChange, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-6">
                      
                      {/* Profile Picture Section */}
                      <div>
                        <label className="block text-sm font-medium opacity-[0.6] mb-3">Profile picture</label>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {photoURL ? (
                              <Image 
                                src={photoURL} 
                                alt="Profile" 
                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border border-gray/[0.2]">
                                <User size={32} className="opacity-[0.6]" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="small"
                              onClick={() => fileInputRef.current?.click()}
                              className="shadow-none leading-[110%] py-2"
                            >
                              Change picture
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              size="small"
                              onClick={handleDeletePhoto}
                              className="shadow-none leading-[110%] py-2 text-red-400 border border-red-200"
                            >
                              Delete picture
                            </Button>
                          </div>
                        </div>
                      </div>

                    <Input
                        name="fullname"
                        value={values.fullname}
                        onChange={handleChange}
                        type="text"
                        lefticon={<User size={20} color="currentColor" />}
                        error={touched.fullname ? errors.fullname : ""}
                        label="Full Name"
                        />
                    <Input
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        type="email"
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

                      {/* About Me / Bio */}
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium opacity-[0.6] mb-2">
                          About me
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={values.bio}
                          onChange={handleChange}
                          rows={5}
                          className="w-full bg-background px-4 py-2.5 border border-gray/[0.2] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                          placeholder="Tell us about yourself..."
                        />
                        {touched.bio && errors.bio && (
                          <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                        )}
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-4 border-t border-gray/[0.1]">
                        <Button 
                          type="submit" 
                          disabled={isSubmitting || loading}
                        >
                          {(isSubmitting || loading) ? (
                            <LoadingIcon color="currentColor" className="animate-spin w-[20px]" />
                          ) : (
                            "Save changes"
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </Formik>
            </div>
          </div>
      </div>
    </div>
  )
}