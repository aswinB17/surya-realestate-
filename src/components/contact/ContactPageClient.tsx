"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { useCmsData } from "@/hooks/useCmsData";
import { projectsData } from "@/data/projects";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Building2,
  Navigation,
  ArrowRight,
} from "lucide-react";

export default function ContactPageClient() {
  const { language } = useLanguage();
  const { data: cmsData } = useCmsData();
  const company = cmsData?.company;
  const phone = company?.phone || "+91 78457 16453";
  const email = company?.email || "suryapromotersmdu@gmail.com";
  const address = company?.address || "120 Feet Road, Near Mattuthavani Bus Stand, K.K. Nagar Corridor, Madurai, Tamil Nadu 625020";
  const mapsLink = company?.mapsLink || "https://www.google.com/maps?q=9.9253208,78.1702385&z=17&hl=en";
  const instagramUrl = (company as any)?.instagramUrl || "https://www.instagram.com/surya_promoters_madurai?cnvx=cTNuOGhsZ21kM203";
  const instagramImage = (company as any)?.instagramImage || "/images/instagram-promo.jpg";
  const instagramHandle = (company as any)?.instagramHandle || "@surya_promoters_madurai";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    project: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formStatus === "error") {
      setFormStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setFormStatus("error");
      setErrorMessage(language === "ta" ? "தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்" : "Please enter your name");
      return;
    }

    const cleanPhone = formData.phone.replace(/[\s-]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setFormStatus("error");
      setErrorMessage(
        language === "ta"
          ? "சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்"
          : "Please enter a valid 10-digit mobile number"
      );
      return;
    }

    setFormStatus("submitting");

    // Simulate backend submission
    setTimeout(() => {
      setFormStatus("success");
    }, 1200);
  };

  return (
    <div className="w-full">
      {/* Hero Header */}
      <section className="bg-[#173D2B] text-white pt-16 pb-20 px-6 sm:px-10 lg:px-16 border-b border-[#64865A]/30">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C6A66B]/20 border border-[#C6A66B]/40 text-[#C6A66B] text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>
              {language === "ta"
                ? "இந்திய விமானப்படை வீரர் மேலாண்மை · உடனடி நேரடி தொடர்பு"
                : "IAF Veteran Leadership · Direct Transparent Advisory"}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {language === "ta"
              ? "எங்களைத் தொடர்பு கொள்ளுங்கள் · நேரடி ஆலோசனைகள்"
              : "Contact Surya Promoters Madurai"}
          </h1>

          <p className="text-sm sm:text-base text-[#F5F4EE]/80 max-w-2xl mx-auto font-sans leading-relaxed">
            {language === "ta"
              ? "மதுரையின் முதன்மையான வீட்டு மனைகள், வணிக நிலங்கள் மற்றும் பண்ணைத் தோட்டங்களை நேரில் பார்வையிடவும் ஆவணங்களைச் சரிபார்க்கவும் எங்களை நேரடியாகத் தொடர்பு கொள்ளுங்கள்."
              : "Connect directly with our leadership team for DTCP site visits, certified revenue documentation, layout map verification, and custom property acquisition."}
          </p>
        </div>
      </section>

      {/* Main Section: 4 Channels + Enquiry Form */}
      <section className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        
        {/* 4 Direct Communication Channels (Section 15 Requirement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Channel 1: Call Now */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E2D7] shadow-xs hover:border-[#173D2B] hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-[#173D2B]/10 flex items-center justify-center text-[#173D2B] mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#64865A] uppercase tracking-wider">
                {language === "ta" ? "நேரடி அழைப்பு" : "Direct Hotline"}
              </span>
              <h3 className="font-display text-lg font-bold text-[#171B18] mt-1">
                {phone}
              </h3>
              <p className="text-xs text-[#77766F] mt-1 leading-relaxed">
                {language === "ta"
                  ? "திட்ட விவரங்கள், விலை மற்றும் நேரடி ஆலோசனைகளுக்கு உடனடியாக அழைக்கவும்."
                  : "Immediate telephone consultation with our senior project coordinator."}
              </p>
            </div>
            <a
              href={`tel:${phone}`}
              className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#173D2B] hover:bg-[#64865A] text-white text-xs font-mono font-bold uppercase tracking-wider transition shadow-2xs"
            >
              <Phone className="h-4 w-4" />
              <span>{language === "ta" ? "அழைக்க" : "Call Now"}</span>
            </a>
          </div>

          {/* Channel 2: Document & Legal Advisory */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E2D7] shadow-xs hover:border-[#173D2B] hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-[#173D2B]/10 flex items-center justify-center text-[#173D2B] mb-4">
                <ShieldCheck className="h-6 w-6 text-[#173D2B]" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#64865A] uppercase tracking-wider">
                {language === "ta" ? "பட்டா ஆவண சரிபார்ப்பு" : "Document & Legal Desk"}
              </span>
              <h3 className="font-display text-lg font-bold text-[#171B18] mt-1">
                {phone}
              </h3>
              <p className="text-xs text-[#77766F] mt-1 leading-relaxed">
                {language === "ta"
                  ? "30 ஆண்டுகால வில்லங்க சான்றிதழ் மற்றும் கணினி பட்டா ஆவண சரிபார்ப்பு ஆலோசனை."
                  : "30-year encumbrance search, DTCP title verification, and transparent registry guidance."}
              </p>
            </div>
            <a
              href={`tel:${phone}`}
              className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#173D2B] hover:bg-[#64865A] text-white text-xs font-mono font-bold uppercase tracking-wider transition shadow-2xs"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{language === "ta" ? "ஆலோசனைக்கு அழைக்க" : "Call Legal Desk"}</span>
            </a>
          </div>

          {/* Channel 3: Email */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E2D7] shadow-xs hover:border-[#C6A66B] hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-[#C6A66B]/15 flex items-center justify-center text-[#C6A66B] mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#C6A66B] uppercase tracking-wider">
                {language === "ta" ? "மின்னஞ்சல்" : "Official Email"}
              </span>
              <h3 className="font-display text-base font-bold text-[#171B18] mt-1 break-all">
                {email}
              </h3>
              <p className="text-xs text-[#77766F] mt-1 leading-relaxed">
                {language === "ta"
                  ? "கார்ப்பரேட் கொள்முதல், நிறுவன முதலீடு மற்றும் சட்டபூர்வ ஆவண வினவல்கள்."
                  : "For corporate proposals, institutional land acquisition, and formal documentation."}
              </p>
            </div>
            <a
              href={`mailto:${email}`}
              className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#173D2B] hover:bg-[#64865A] text-white text-xs font-mono font-bold uppercase tracking-wider transition shadow-2xs"
            >
              <Mail className="h-4 w-4" />
              <span>{language === "ta" ? "மின்னஞ்சல் அனுப்ப" : "Send Email"}</span>
            </a>
          </div>

          {/* Channel 4: Visit Office */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E2D7] shadow-xs hover:border-[#173D2B] hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-[#64865A]/15 flex items-center justify-center text-[#64865A] mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#64865A] uppercase tracking-wider">
                {language === "ta" ? "தலைமை அலுவலகம்" : "Headquarters"}
              </span>
              <h3 className="font-display text-sm font-bold text-[#171B18] mt-1">
                Madurai, Tamil Nadu
              </h3>
              <p className="text-xs text-[#77766F] mt-1 leading-relaxed">
                {address}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white text-xs font-mono font-bold uppercase tracking-wider transition shadow-2xs"
                title="Follow Surya Promoters on Instagram"
              >
                <svg className="h-4 w-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#173D2B] hover:bg-[#64865A] text-white text-xs font-mono font-bold uppercase tracking-wider transition shadow-2xs"
              >
                <Navigation className="h-4 w-4" />
                <span>{language === "ta" ? "வழிசெலுத்து" : "Get Directions"}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Dual Layout: Interactive Form + Founder & Office Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Quick Enquiry Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2D7] shadow-sm">
            <div className="mb-8">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6A66B]">
                {language === "ta" ? "உடனடி விசாரணை படிவம்" : "Quick Enquiry & Site Visit Booking"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#171B18] mt-1">
                {language === "ta"
                  ? "உங்கள் தேவையைப் பகிர்ந்து கொள்ளுங்கள்"
                  : "Schedule a Personalized Site Inspection"}
              </h2>
              <p className="text-xs sm:text-sm text-[#77766F] mt-2 leading-relaxed">
                {language === "ta"
                  ? "கீழே உள்ள படிவத்தைப் பூர்த்தி செய்யுங்கள். எங்கள் நிர்வாகக் குழு 30 நிமிடங்களுக்குள் உங்களுடன் தொடர்பு கொள்ளும்."
                  : "Fill out the verified details below. Our field executive will connect with layout sketches, current availability, and site transportation."}
              </p>
            </div>

            {/* Status Feedback */}
            {formStatus === "success" ? (
              <div className="p-8 rounded-2xl bg-[#173D2B]/5 border border-[#173D2B]/20 text-center space-y-4">
                <div className="h-14 w-14 rounded-full bg-[#173D2B] text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="h-8 w-8 text-[#C6A66B]" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#173D2B]">
                  {language === "ta"
                    ? "நன்றி! உங்கள் விசாரணை பதிவு செய்யப்பட்டது"
                    : "Enquiry Received Successfully!"}
                </h3>
                <p className="text-xs sm:text-sm text-[#77766F] max-w-md mx-auto leading-relaxed">
                  {language === "ta"
                    ? `வணக்கம் ${formData.name}, உங்கள் கோரிக்கையை எங்கள் குழு பெற்றுக்கொண்டது. உடனடியாக உங்களைத் தொடர்பு கொள்கிறோம்.`
                    : `Thank you ${formData.name}. Our property advisor has received your request for ${
                        formData.project || "Surya Promoters projects"
                      } and will call you shortly on ${formData.phone}.`}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setFormStatus("idle");
                      setFormData({ name: "", phone: "", email: "", project: "", message: "" });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#173D2B] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#64865A] transition"
                  >
                    {language === "ta" ? "மற்றொரு விசாரணை" : "Submit Another Enquiry"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {formStatus === "error" && errorMessage && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#171B18] mb-1.5">
                      {language === "ta" ? "உங்கள் பெயர் *" : "Customer Name *"}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={language === "ta" ? "எ.கா: சுந்தரம்" : "e.g. Sundaram Natarajan"}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E2D7] bg-[#F5F4EE]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B] focus:bg-white transition"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#171B18] mb-1.5">
                      {language === "ta" ? "தொலைபேசி எண் *" : "Mobile Number *"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={language === "ta" ? "எ.கா: 98765 43210" : "e.g. +91 98765 43210"}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E2D7] bg-[#F5F4EE]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#171B18] mb-1.5">
                      {language === "ta" ? "மின்னஞ்சல் (விருப்பத்தேர்வு)" : "Email Address (Optional)"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E2D7] bg-[#F5F4EE]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B] focus:bg-white transition"
                    />
                  </div>

                  {/* Project Selector (Dropdown of all 9 projects) */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#171B18] mb-1.5">
                      {language === "ta" ? "ஆர்வமுள்ள திட்டம் *" : "Interested Project *"}
                    </label>
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E2D7] bg-[#F5F4EE]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B] focus:bg-white transition cursor-pointer"
                    >
                      <option value="">{language === "ta" ? "-- திட்டத்தைத் தேர்ந்தெடுக்கவும் --" : "-- Select a Project --"}</option>
                      {projectsData.map((p) => (
                        <option key={p.id} value={p.title.en}>
                          {p.title.en} ({p.category.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#171B18] mb-1.5">
                    {language === "ta" ? "உங்கள் செய்தி / தளப் பார்வை நாள்" : "Message or Preferred Visit Date"}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={
                      language === "ta"
                        ? "நீங்கள் விரும்பும் பட்ஜெட் அல்லது தளப் பார்வைக்கான தேதியைக் குறிப்பிடவும்..."
                        : "Describe your requirements, preferred plot sizes, budget range, or proposed site visit date..."
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E2D7] bg-[#F5F4EE]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B] focus:bg-white transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#173D2B] hover:bg-[#64865A] text-white text-xs sm:text-sm font-mono font-bold uppercase tracking-wider shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>
                    {formStatus === "submitting"
                      ? language === "ta"
                        ? "அனுப்பப்படுகிறது..."
                        : "Sending Enquiry..."
                      : language === "ta"
                      ? "விசாரணையை அனுப்புக"
                      : "Submit Enquiry Now"}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Office Credentials, Founder Trust & Working Hours (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Founder Profile Card */}
            <div className="bg-white rounded-3xl p-7 border border-[#E8E2D7] shadow-xs flex flex-col sm:flex-row items-center gap-5">
              <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border-2 border-[#C6A66B] shadow">
                <Image
                  src="/images/founder/founder.png"
                  alt="Mr. Manickam Natarajan - Founder Surya Promoters"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#173D2B]/10 text-[#173D2B] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="h-3 w-3 text-[#C6A66B]" />
                  <span>{language === "ta" ? "நிறுவனர் & நிர்வாக இயக்குனர்" : "Founder & Managing Director"}</span>
                </span>
                <h3 className="font-display text-base font-extrabold text-[#171B18]">
                  Mr. Manickam Natarajan
                </h3>
                <p className="text-xs text-[#64865A] font-semibold">
                  Indian Air Force (IAF) Veteran
                </p>
                <p className="text-[11px] text-[#77766F] mt-1">
                  16+ years of military-grade honesty, 100% legal title scrutiny, and zero-litigation record.
                </p>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-white rounded-3xl p-7 border border-[#E8E2D7] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#C6A66B]/15 flex items-center justify-center text-[#C6A66B]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-[#171B18]">
                    {language === "ta" ? "அலுவலக வேலை நேரம்" : "Office & Site Visit Timings"}
                  </h4>
                  <span className="text-[11px] font-mono text-[#64865A]">
                    {language === "ta" ? "வாரத்தின் 7 நாட்களும் இயங்குகிறது" : "Open 7 Days a Week"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono pt-2 border-t border-[#F5F4EE]">
                <div className="flex justify-between py-1">
                  <span className="text-[#77766F]">{language === "ta" ? "திங்கள் - வெள்ளி:" : "Monday – Friday:"}</span>
                  <span className="font-bold text-[#171B18]">9:00 AM – 7:30 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#77766F]">{language === "ta" ? "சனி - ஞாயிறு (தளப்பார்வை):" : "Saturday – Sunday (Site Visits):"}</span>
                  <span className="font-bold text-[#173D2B]">8:30 AM – 8:00 PM</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5F4EE] border border-[#E8E2D7] text-xs text-[#77766F] leading-relaxed">
                {language === "ta"
                  ? "குறிப்பு: சனி மற்றும் ஞாயிற்றுக்கிழமைகளில் வாடிக்கையாளர்களுக்கு இலவச வாகனப் போக்குவரத்து வசதி ஏற்பாடு செய்யப்பட்டுள்ளது."
                  : "Complimentary air-conditioned transport is arranged for site inspections across Madurai on weekends."}
              </div>
            </div>

            {/* Quick Interactive Map Card */}
            <div className="bg-white rounded-3xl p-7 border border-[#E8E2D7] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#173D2B]" />
                  <h4 className="font-display text-sm font-bold text-[#171B18]">
                    {language === "ta" ? "வரைபடத்தில் காண்க" : "Locate Our Office"}
                  </h4>
                </div>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-bold text-[#173D2B] hover:text-[#64865A] inline-flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>

              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-[#E8E2D7] bg-[#F5F4EE]">
                <Image
                  src="/images/projects/vaigai-commercial.jpg"
                  alt="Madurai Central Office Location"
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/95 text-[#173D2B] font-mono text-xs font-bold shadow-lg hover:bg-white transition flex items-center gap-1.5"
                  >
                    <Navigation className="h-3.5 w-3.5 text-[#173D2B]" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>



          </div>
        </div>
      </section>
    </div>
  );
}
