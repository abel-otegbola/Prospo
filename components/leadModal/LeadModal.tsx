'use client';
import { useContext, useEffect, useRef } from "react";
import { Formik } from "formik";
import { CloseCircle } from "@solar-icons/react";
import Input from "../input/Input";
import Button from "../button/Button";
import { leadSchema } from "../../schema/leadSchema";
import type { Lead } from "../../contexts/LeadsContextValue";
import LoadingIcon from "../../assets/icons/loadingIcon";
import { AuthContext } from "../../contexts/AuthContextValue";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Lead, 'id' | 'addedDate'>) => Promise<void>;
  lead?: Lead | null;
  title: string;
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

const industryOptions = [
  'Technology',
  'SaaS',
  'E-commerce',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Real Estate',
  'Creative Agency',
  'Consulting',
  'Manufacturing',
  'Retail',
  'Other'
];

export default function LeadModal({ isOpen, onClose, onSubmit, lead, title }: LeadModalProps) {
  const { user } = useContext(AuthContext);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initialValues = lead ? {
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: typeof lead.phone === 'string' ? lead.phone : '',
    location: lead.location,
    status: lead.status,
    value: lead.value,
    userId: user.uid,
    industry: lead.industry,
    score: lead.score,
    companyWebsite: lead.companyWebsite,
    serviceNeeds: lead.serviceNeeds,
    notes: lead.notes || '',
  } : {
    name: '',
    company: '',
    email: '',
    phone: '',
    location: '',
    status: 'new' as const,
    value: 0,
    userId: user.uid,
    industry: '',
    score: 50,
    companyWebsite: '',
    serviceNeeds: ['Website Design', 'SEO Optimization'],
    notes: '',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray/ hover:opacity-[0.6] transition-colors"
          >
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto p-4">
          <Formik
            initialValues={initialValues}
            validationSchema={leadSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await onSubmit({ ...values, userId: user.uid });
                onClose();
              } catch (error) {
                console.error('Error submitting lead:', error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    label="Lead Name"
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name ? errors.name : ''}
                    placeholder="John Doe"
                  />
                  <Input
                    name="company"
                    label="Company Name"
                    value={values.company}
                    onChange={handleChange}
                    error={touched.company ? errors.company : ''}
                    placeholder="Acme Corp"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="email"
                    label="Email Address"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email ? errors.email : ''}
                    placeholder="john@acme.com"
                  />
                  <Input
                    name="phone"
                    label="Phone Number"
                    value={values.phone}
                    onChange={handleChange}
                    error={touched.phone ? errors.phone : ''}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Location & Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="location"
                    label="Location"
                    value={values.location}
                    onChange={handleChange}
                    error={touched.location ? errors.location : ''}
                    placeholder="New York, NY"
                  />
                  <Input
                    name="companyWebsite"
                    label="Company Website"
                    value={values.companyWebsite}
                    onChange={handleChange}
                    error={touched.companyWebsite ? errors.companyWebsite : ''}
                    placeholder="https://example.com"
                  />
                </div>

                {/* Industry & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="industry" className="text-sm font-medium">
                      Industry
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={values.industry}
                      onChange={handleChange}
                      className={`px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                        touched.industry && errors.industry ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select Industry</option>
                      {industryOptions.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    {touched.industry && errors.industry && (
                      <p className="text-xs text-red-500">{errors.industry}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      className={`px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                        touched.status && errors.status ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {touched.status && errors.status && (
                      <p className="text-xs text-red-500">{errors.status}</p>
                    )}
                  </div>
                </div>

                {/* Value & Score */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="value"
                    label="Project Value ($)"
                    type="number"
                    value={values.value}
                    onChange={handleChange}
                    error={touched.value ? errors.value : ''}
                    placeholder="5000"
                  />
                  <div className="flex flex-col gap-2">
                    <label htmlFor="score" className="text-sm font-medium">
                      Lead Score (0-100)
                    </label>
                    <input
                      id="score"
                      name="score"
                      type="range"
                      min="0"
                      max="100"
                      value={values.score}
                      onChange={handleChange}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-[0.6]">Score: {values.score}</span>
                      <input
                        type="number"
                        name="score"
                        value={values.score}
                        onChange={handleChange}
                        className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                        min="0"
                        max="100"
                      />
                    </div>
                    {touched.score && errors.score && (
                      <p className="text-xs text-red-500">{errors.score}</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary min-h-[80px]"
                    placeholder="Add any additional notes about this lead..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <LoadingIcon color="white" className="animate-spin w-5 h-5" />
                    ) : lead ? (
                      'Update Lead'
                    ) : (
                      'Create Lead'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
