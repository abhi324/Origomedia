"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  handle: z.string().startsWith("@", "Handle must start with @"),
  niche: z.string().min(1, "Please select a niche"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
});

type FormValues = z.infer<typeof formSchema>;

export default function JoinForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "influencers"), {
        ...data,
        createdAt: serverTimestamp(),
        status: "pending",
      });
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-origo-dark/10 p-12"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-origo-green" />
        </div>
        <h3 className="text-3xl font-serif text-origo-dark mb-4">Application Received.</h3>
        <p className="text-origo-dark/70 text-lg mb-8">
          The origin of your growth starts here. Our team will review your profile and reach out within 48 hours.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-origo-dark font-semibold underline underline-offset-4"
        >
          Submit another application
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-[0.2em] uppercase text-origo-dark/50 ml-4">Full Name</label>
            <input
              {...register("fullName")}
              placeholder="John Doe"
              className={cn(
                "w-full px-6 py-4 rounded-2xl bg-white border border-origo-dark/10 focus:border-origo-dark outline-none transition-all placeholder:text-origo-dark/20",
                errors.fullName && "border-red-500"
              )}
            />
            {errors.fullName && <p className="text-xs text-red-500 ml-4">{errors.fullName.message}</p>}
          </div>

          {/* Social Handle */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-[0.2em] uppercase text-origo-dark/50 ml-4">Instagram / Social Handle</label>
            <input
              {...register("handle")}
              placeholder="@yourhandle"
              className={cn(
                "w-full px-6 py-4 rounded-2xl bg-white border border-origo-dark/10 focus:border-origo-dark outline-none transition-all placeholder:text-origo-dark/20",
                errors.handle && "border-red-500"
              )}
            />
            {errors.handle && <p className="text-xs text-red-500 ml-4">{errors.handle.message}</p>}
          </div>

          {/* Niche Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-[0.2em] uppercase text-origo-dark/50 ml-4">Primary Niche</label>
            <select
              {...register("niche")}
              className={cn(
                "w-full px-6 py-4 rounded-2xl bg-white border border-origo-dark/10 focus:border-origo-dark outline-none transition-all appearance-none cursor-pointer",
                errors.niche && "border-red-500"
              )}
            >
              <option value="">Select Niche</option>
              <option value="luxury">Luxury & Lifestyle</option>
              <option value="tech">Tech & Productivity</option>
              <option value="wellness">Wellness & Health</option>
              <option value="fashion">Fashion & Beauty</option>
            </select>
            {errors.niche && <p className="text-xs text-red-500 ml-4">{errors.niche.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-[0.2em] uppercase text-origo-dark/50 ml-4">Email Address</label>
            <input
              {...register("email")}
              type="email"
              placeholder="john@example.com"
              className={cn(
                "w-full px-6 py-4 rounded-2xl bg-white border border-origo-dark/10 focus:border-origo-dark outline-none transition-all placeholder:text-origo-dark/20",
                errors.email && "border-red-500"
              )}
            />
            {errors.email && <p className="text-xs text-red-500 ml-4">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-[0.2em] uppercase text-origo-dark/50 ml-4">Phone Number</label>
            <input
              {...register("phone")}
              placeholder="+91 00000 00000"
              className={cn(
                "w-full px-6 py-4 rounded-2xl bg-white border border-origo-dark/10 focus:border-origo-dark outline-none transition-all placeholder:text-origo-dark/20",
                errors.phone && "border-red-500"
              )}
            />
            {errors.phone && <p className="text-xs text-red-500 ml-4">{errors.phone.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-8 flex items-center justify-center gap-2 py-5 bg-origo-dark text-origo-beige rounded-2xl font-bold text-lg hover:bg-origo-green transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Submit Application
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
