import React, { useState } from "react";
import { Mail, Phone, Building, X, Sparkles, AlertCircle } from "lucide-react";
import { JobData } from "../types";

interface ContactConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: JobData;
  onConfirm: (contactInfo: { email: string; phone: string; company: string }) => void;
  isSubmitting: boolean;
}

export default function ContactConfirmModal({
  isOpen,
  onClose,
  jobData,
  onConfirm,
  isSubmitting
}: ContactConfirmModalProps) {
  const [email, setEmail] = useState(jobData.email || "");
  const [phone, setPhone] = useState(jobData.phone || "");
  const [company, setCompany] = useState(jobData.company || "");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Please enter a contact email address.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setErrorMessage("Please enter a valid email address (e.g. hr@company.com).");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("Please enter a contact phone or WhatsApp number.");
      return;
    }

    if (!company.trim()) {
      setErrorMessage("Please enter your company name.");
      return;
    }

    setErrorMessage("");
    onConfirm({ email: email.trim(), phone: phone.trim(), company: company.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Banner */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-br from-amber-50/70 to-orange-50/40">
          <div className="w-11 h-11 bg-[#F9A121]/15 text-[#F9A121] rounded-2xl flex items-center justify-center mb-3">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0E1F28]">
            Confirm Contact Information
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Please verify your email and phone number so candidate applications and posting updates reach you.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. AJobThing Sdn Bhd"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F9A121]/30 focus:border-[#F9A121]"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. hr@yourcompany.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F9A121]/30 focus:border-[#F9A121]"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Phone / WhatsApp <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +6012-3456789"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F9A121]/30 focus:border-[#F9A121]"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Information Pill */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F9A121] shrink-0" />
            <span>This contact info will be stored directly into your Google Sheet record.</span>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#F9A121] hover:bg-[#EE9410] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm & Post Job</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
