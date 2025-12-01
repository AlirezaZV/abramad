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
  });
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const validatePhone = (phone: string) => {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone);
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

  const handleSubmit = (e: React.FormEvent) => {
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
    };

    setErrors(newErrors);

    if (!newErrors.firstName && !newErrors.lastName && !newErrors.phone) {
      setShowOTP(true);
    }
  };

  const handleOTPComplete = (value: string) => {
    setOtp(value);
    // Simulate OTP verification
    if (value.length === 4) {
      // In a real app, you would verify the OTP with backend
      // For demo purposes, accept any 4-digit code
      setTimeout(() => {
        onSubmit(formData);
      }, 500);
    }
  };

  const handleBackToForm = () => {
    setShowOTP(false);
    setOtp("");
    setOtpError("");
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
                  ایمیل <span className="text-gray-400 text-sm">(اختیاری)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                  placeholder="email@example.com"
                  dir="ltr"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white"
                size="lg"
              >
                بریم شرکت رو نجات بدیم!
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

            <div className="flex justify-center mb-6">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={handleOTPComplete}
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
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  ارسال مجدد
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
