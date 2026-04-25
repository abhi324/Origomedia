"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  instagram_username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  phone_whatsapp: z.string().regex(/^\d{10}$/, "Enter exactly 10 digits"),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]),
  age: z.string().optional(),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  consent: z.boolean().refine((val) => val === true, "Consent is required"),
});

type FormValues = z.infer<typeof formSchema>;

const stateCityData: Record<string, string[]> = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Other"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Other"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Other"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Other"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Other"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Other"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Noida", "Other"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Other"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Udaipur", "Bikaner", "Other"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Other"],
  "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Other"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Other"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Other"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Other"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Other"],
  "Kerala": ["Kochi", "Trivandrum", "Kozhikode", "Thrissur", "Other"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Other"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Other"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Other"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani", "Other"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Other"],
  "Goa": ["Panaji", "Vasco da Gama", "Margao", "Other"],
  "Other": ["Other City"]
};

export default function JoinForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      languages: [],
      consent: false,
    },
  });

  const selectedState = watch("state");
  const selectedLanguages = watch("languages");
  const cities = selectedState ? stateCityData[selectedState] || ["Other City"] : [];

  useEffect(() => {
    setValue("city", "");
  }, [selectedState, setValue]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const phoneAsNumber = BigInt(data.phone_whatsapp.replace(/\D/g, ''));

      const { error: supabaseError } = await supabase
        .from("influencers")
        .insert([
          {
            ...data,
            phone_whatsapp: phoneAsNumber,
            age: data.age ? parseInt(data.age) : null,
          },
        ]);

      if (supabaseError) throw supabaseError;
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanguageToggle = (lang: string) => {
    const current = selectedLanguages;
    if (current.includes(lang)) {
      setValue("languages", current.filter(l => l !== lang));
    } else {
      setValue("languages", [...current, lang]);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[100] bg-[#1a1a1a] flex items-center justify-center p-6 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4A6357]/20 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 110 }}
            className="mx-auto mb-10 w-14 h-14 rounded-full bg-[#F5E68E]/15 border border-[#F5E68E]/40 flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-[#F5E68E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <span className="text-[#F5E68E] text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase mb-6 block">
            Application received
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-cormorant font-bold text-white mb-6 leading-[1.0]">
            Thanks. We&rsquo;ll be <br />
            <span className="italic font-normal text-[#F5E68E]">in touch.</span>
          </h2>

          <p className="text-white/60 text-base sm:text-lg font-inter max-w-md mx-auto leading-relaxed mb-12">
            We review every application by hand. If you&rsquo;re a fit, expect to hear from us within a week.
          </p>

          <Link
            href="/"
            className="inline-block px-10 py-4 border border-white/20 text-white/70 hover:text-white hover:border-white transition-all text-[11px] font-montserrat font-bold uppercase tracking-widest rounded-xl"
          >
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-inter font-black uppercase tracking-[0.3em] text-gray-400">Full Name</label>
          <input
            {...register("name")}
            className="bg-transparent border-b border-gray-200 py-3 focus:border-[#4A6357] outline-none font-cormorant text-xl transition-all placeholder:opacity-30"
            placeholder="John Doe"
          />
          {errors.name && <span className="text-red-500 text-[10px] uppercase font-black tracking-widest">{errors.name.message}</span>}
        </div>

        {/* Instagram Username */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-inter font-black uppercase tracking-[0.3em] text-gray-400">Instagram Username</label>
          <input
            {...register("instagram_username")}
            className="bg-transparent border-b border-gray-200 py-3 focus:border-[#4A6357] outline-none font-cormorant text-xl transition-all placeholder:opacity-30"
            placeholder="@username"
          />
          {errors.instagram_username && <span className="text-red-500 text-[10px] uppercase font-black tracking-widest">{errors.instagram_username.message}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-inter font-black uppercase tracking-[0.3em] text-gray-400">Email Address</label>
          <input
            {...register("email")}
            type="email"
            className="bg-transparent border-b border-gray-200 py-3 focus:border-[#4A6357] outline-none font-cormorant text-xl transition-all placeholder:opacity-30"
            placeholder="john@example.com"
          />
          {errors.email && <span className="text-red-500 text-[10px] uppercase font-black tracking-widest">{errors.email.message}</span>}
        </div>

        {/* Phone / WhatsApp */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-inter font-black uppercase tracking-[0.3em] text-gray-400">WhatsApp Number</label>
          <input
            {...register("phone_whatsapp")}
            maxLength={10}
            className="bg-transparent border-b border-gray-200 py-3 focus:border-[#4A6357] outline-none font-cormorant text-xl transition-all placeholder:opacity-30"
            placeholder="XXXXXXXXXX"
          />
          {errors.phone_whatsapp && <span className="text-red-500 text-[10px] uppercase font-black tracking-widest">{errors.phone_whatsapp.message}</span>}
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-inter font-black uppercase tracking-[0.3em] text-gray-400">Gender</label>
          <select
            {...register("gender")}
            className="bg-transparent border-b border-gray-200 py-3 focus:border-[#4A6357] outline-none font-cormorant text-xl transition-all cursor-pointer"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {errors.gender && <span className="text-red-500 text-[10px] uppercase font-black tracking-widest">{errors.gender.message}</span>}
        </div>

        {/* Age */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-inter font-black uppercase tracking-[0.3em] text-gray-400">Age (Optional)</label>
          <input
            {...register("age")}
            type="number"
            className="bg-transparent border-b border-gray-200 py-3 focus:border-[#4A6357] outline-none font-cormorant text-xl transition-all placeholder:opacity-30"
            placeholder="24"
          />
        </div>

        {/* State Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-inter font-black uppercase tracking-[0.3em] text-gray-400">State</label>
          <select
            {...register("state")}
            className="bg-transparent border-b border-gray-200 py-3 focus:border-[#4A6357] outline-none font-cormorant text-xl transition-all cursor-pointer"
          >
            <option value="">Select State</option>
            {Object.keys(stateCityData).sort().map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <span className="text-red-500 text-[10px] uppercase font-black tracking-widest">{errors.state.message}</span>}
        </div>

        {/* City Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-inter font-black uppercase tracking-[0.3em] text-gray-400">City</label>
          <select
            {...register("city")}
            disabled={!selectedState}
            className="bg-transparent border-b border-gray-200 py-3 focus:border-[#4A6357] outline-none font-cormorant text-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <option value="">Select City</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <span className="text-red-500 text-[10px] uppercase font-black tracking-widest">{errors.city.message}</span>}
        </div>
      </div>

      {/* Languages */}
      <div className="flex flex-col gap-6">
        <label className="text-[10px] font-inter font-black uppercase tracking-[0.3em] text-gray-400">Language of Content</label>
        <div className="flex flex-wrap gap-4">
          {["English", "Hindi", "Mix (Hinglish)"].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => handleLanguageToggle(lang)}
              className={`px-8 py-3 rounded-xl text-sm font-cormorant italic transition-all border ${selectedLanguages.includes(lang)
                ? "bg-[#4A6357] text-white border-[#4A6357]"
                : "bg-transparent text-gray-400 border-gray-100 hover:border-[#4A6357]"
                }`}
            >
              {lang}
            </button>
          ))}
        </div>
        {errors.languages && <span className="text-red-500 text-[10px] uppercase font-black tracking-widest">{errors.languages.message}</span>}
      </div>

      {/* Consent */}
      <div className="flex items-start gap-4">
        <input
          {...register("consent")}
          type="checkbox"
          id="consent"
          className="mt-1.5 w-4 h-4 accent-[#4A6357]"
        />
        <label htmlFor="consent" className="text-sm text-gray-500 font-inter leading-relaxed">
          I consent to being contacted by Origo Media via WhatsApp and Email for campaign opportunities and agency updates.
        </label>
      </div>
      {errors.consent && <div className="text-red-500 text-[10px] uppercase font-black tracking-widest">{errors.consent.message}</div>}

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-inter">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-5 bg-[#4A6357] text-white rounded-2xl text-sm font-inter font-black uppercase tracking-[0.3em] hover:bg-[#3D5449] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#4A6357]/20"
      >
        {isSubmitting ? "Processing..." : "Submit Application"}
      </button>
    </form>
  );
}
