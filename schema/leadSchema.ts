import * as Yup from 'yup';

export const leadSchema = Yup.object({
    name: Yup.string()
        .required('Lead name is required')
        .min(2, 'Name must be at least 2 characters'),
    company: Yup.string()
        .required('Company name is required')
        .min(2, 'Company name must be at least 2 characters'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[\d\s-]+$/, 'Invalid phone number format'),
    location: Yup.string()
        .required('Location is required')
        .min(3, 'Location must be at least 3 characters'),
    industry: Yup.string()
        .required('Industry is required'),
    status: Yup.string()
        .required('Status is required')
        .oneOf(['new', 'contacted', 'qualified', 'negotiating', 'won', 'lost']),
    value: Yup.number()
        .required('Project value is required')
        .min(0, 'Value must be greater than 0')
        .typeError('Value must be a number'),
    score: Yup.number()
        .required('Lead score is required')
        .min(0, 'Score must be between 0 and 100')
        .max(100, 'Score must be between 0 and 100')
        .typeError('Score must be a number'),

    about: Yup.string()
        .nullable(),
});
