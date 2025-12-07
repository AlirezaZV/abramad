import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import type { UserFormPayload } from "../../types/user";

interface UserFormProps {
  onSubmit: (data: UserFormPayload) => void;
  onClose?: () => void;
}

export function UserForm({ onSubmit, onClose }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormPayload>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [formMessage, setFormMessage] = useState<
    { type: "error" | "success"; text: string }
  | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpStatusMessage, setOtpStatusMessage] = useState<string | null>(null);
  const [otpPreview, setOtpPreview] = useState<string | null>(null);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateSystemgroupEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@systemgroup\.net$/i;
    return emailRegex.test(email.trim());
  };

  const handlePhoneBlur = () => {
    if (formData.phone && !validatePhone(formData.phone)) {
      setErrors({
        ...errors,
        phone: "شماره تلفن باید با 09 شروع شود و ۱۱ رقم باشد",
      });
    } else {
      setErrors({ ...errors, phone: "" });
    }
  };

  const checkExistingUser = async () => {
    try {
      const response = await fetch("/api/user-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "بررسی اطلاعات با خطا روبه‌رو شد");
      }

      if (data.exists) {
        setFormMessage({
          type: "error",
          text:
            data.message ??
            "شما با این ایمیل یا شماره موبایل قبلا در مسابقه شرکت کرده‌اید!",
        });
        return false;
      }

      setFormMessage(null);
      return true;
    } catch (error) {
      setFormMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "برقراری ارتباط با سرور ممکن نشد",
      });
      return false;
    }
  };

  const requestOtp = async () => {
    setOtpError("");
    setOtpStatusMessage(null);
    setOtpPreview(null);
    setIsRequestingOtp(true);

    try {
      const response = await fetch("/api/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "ارسال کد تایید با خطا مواجه شد");
      }

      setOtpStatusMessage(data.message ?? "کد تایید ارسال شد");

      if (data.otpPreview) {
        setOtpPreview(data.otpPreview);
      }

      return true;
    } catch (error) {
      setOtpError(
        error instanceof Error
          ? error.message
          : "ارسال کد تایید با خطا روبه‌رو شد"
      );
      return false;
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors = {
      firstName: formData.firstName.trim() === "" ? "نام الزامی است" : "",
      lastName:
        formData.lastName.trim() === "" ? "نام خانوادگی الزامی است" : "",
      phone:
        formData.phone.trim() === ""
          ? "شماره تماس الزامی است"
          : !validatePhone(formData.phone)
          ? "شماره تلفن نامعتبر است"
          : "",
      email:
        formData.email.trim() === ""
          ? "ایمیل سازمانی الزامی است!"
          : !validateSystemgroupEmail(formData.email)
          ? "ایمیل سازمانی باید متعلق به دامنه systemgroup.net باشد"
          : "",
    };

    setErrors(newErrors);

    const isFormValid =
      !newErrors.firstName &&
      !newErrors.lastName &&
      !newErrors.phone &&
      !newErrors.email;

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const isUnique = await checkExistingUser();

      if (!isUnique) {
        return;
      }

      const otpRequested = await requestOtp();

      if (otpRequested) {
        setShowOTP(true);
        setOtp("");
        setOtpError("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (value: string) => {
    setIsVerifyingOtp(true);

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, code: value }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "کد تایید نامعتبر است");
      }

      setOtpError("");
      onSubmit(formData);
    } catch (error) {
      setOtpError(
        error instanceof Error ? error.message : "کد تایید نامعتبر است"
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);

    if (value.length === 4 && !isVerifyingOtp) {
      void verifyOtp(value);
    } else if (value.length < 4) {
      setOtpError("");
    }
  };

  const handleBackToForm = () => {
    setShowOTP(false);
    setOtp("");
    setOtpError("");
    setOtpStatusMessage(null);
    setOtpPreview(null);
  };

  const handleResendOtp = async () => {
    if (isRequestingOtp) {
      return;
    }

    await requestOtp();
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-8 w-full border border-gray-700 shadow-2xl relative">
      {/* Close button (only show in popup mode) */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <AnimatePresence mode="wait">
        {!showOTP ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-white text-center mb-2">
              قبل از شروع، کمک کن بهتر بشناسمت.
            </h2>

            {formMessage && (
              <p
                className={`text-sm mb-3 text-center ${
                  formMessage.type === "error"
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {formMessage.text}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              {/* First Name Field */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-200">
                  نام <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 text-right"
                  placeholder="نام خود را وارد کنید"
                  dir="rtl"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm text-right">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name Field */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-200">
                  نام خانوادگی <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 text-right"
                  placeholder="نام خانوادگی خود را وارد کنید"
                  dir="rtl"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm text-right">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-200">
                  شماره تماس <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  onBlur={handlePhoneBlur}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                  placeholder="09123456789"
                  maxLength={11}
                  dir="ltr"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm text-right">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  ایمیل <span className="text-gray-400 text-sm">(سازمانی)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                  placeholder="user@systemgroup.net"
                  dir="ltr"
                />
                                {errors.email && (
                  <p className="text-red-400 text-sm text-right">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "در حال بررسی..." : "بریم شرکت رو نجات بدیم!"}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-white text-center mb-2">تایید شماره تماس</h2>

            <p className="text-gray-300 mb-6 text-center">
              کد ۴ رقمی ارسال شده به شماره{" "}
              <span className="text-blue-400 font-mono">{formData.phone}</span>{" "}
              را وارد کنید:
            </p>

            {otpStatusMessage && (
              <p className="text-blue-300 text-sm text-center mb-4">
                {otpStatusMessage}
              </p>
            )}

            {otpPreview && (
              <p className="text-emerald-300 text-sm text-center mb-4">
                کد تست: <span className="font-mono text-lg">{otpPreview}</span>
              </p>
            )}

            <div className="flex justify-center mb-6">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={handleOtpChange}
                dir="ltr"
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <InputOTPSlot
                    index={1}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <InputOTPSlot
                    index={2}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <InputOTPSlot
                    index={3}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {otpError && (
              <p className="text-red-400 text-sm text-center mb-4">
                {otpError}
              </p>
            )}

            {isVerifyingOtp && (
              <p className="text-gray-400 text-sm text-center mb-4">
                در حال تایید کد...
              </p>
            )}

            <div className="flex flex-col gap-3">
              {/* Back button */}
              <Button
                onClick={handleBackToForm}
                variant="outline"
                className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                بازگشت و تغییر شماره
              </Button>

              <p className="text-gray-400 text-sm text-center">
                کد ارسال نشد؟{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isRequestingOtp}
                  className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  {isRequestingOtp ? "در حال ارسال..." : "ارسال مجدد"}
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserForm;
