import * as Yup from 'yup';

export const loginSchema = Yup.object({
    email: Yup.string().required('Email is required').email("Invalid email address"),
    password: Yup.string().required("Password is required"),
})

export const signupSchema = Yup.object({
    fullname: Yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
    email: Yup.string().required('Work email is required').email("Invalid email address"),
    specialty: Yup.string().required('Please select your specialty').notOneOf([''], 'Please select your specialty'),
    password: Yup.string()
        .required("Password is required")
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number'),
})

export const forgotPasswordSchema = Yup.object({
    email: Yup.string().required('Email is required').email("Invalid email address"),
})

export const verifyOtpSchema = Yup.object({
    otp: Yup.string().required('OTP is required').length(6, 'OTP must be 6 digits'),
})

export const resetPasswordSchema = Yup.object({
    password: Yup.string()
        .required("Password is required")
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref('password')], 'Passwords must match'),
})

export const profileSchema = Yup.object({
    fullname: Yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
    username: Yup.string().optional(),
    email: Yup.string().required('Email is required').email("Invalid email address"),
    specialty: Yup.string().optional(),
    status: Yup.string().optional(),
    bio: Yup.string().optional(),
    password: Yup.string().optional(),
})