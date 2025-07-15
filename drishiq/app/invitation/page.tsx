"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "ar", label: "Arabic" },
  { code: "zh", label: "Chinese" },
  { code: "ru", label: "Russian" },
  { code: "pt", label: "Portuguese" },
  { code: "tr", label: "Turkish" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "bn", label: "Bengali" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "mr", label: "Marathi" },
  { code: "it", label: "Italian" },
  { code: "nl", label: "Dutch" },
  { code: "ur", label: "Urdu" },
  { code: "kn", label: "Kannada" },
];

const COUNTRY_CODES = [
  { code: '+1', label: 'United States (+1)' },
  { code: '+44', label: 'United Kingdom (+44)' },
  { code: '+91', label: 'India (+91)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+39', label: 'Italy (+39)' },
  { code: '+86', label: 'China (+86)' },
  { code: '+7', label: 'Russia (+7)' },
  { code: '+55', label: 'Brazil (+55)' },
  { code: '+34', label: 'Spain (+34)' },
  { code: '+27', label: 'South Africa (+27)' },
  { code: '+82', label: 'South Korea (+82)' },
  { code: '+62', label: 'Indonesia (+62)' },
  { code: '+234', label: 'Nigeria (+234)' },
  { code: '+92', label: 'Pakistan (+92)' },
  { code: '+880', label: 'Bangladesh (+880)' },
  { code: '+20', label: 'Egypt (+20)' },
  { code: '+966', label: 'Saudi Arabia (+966)' },
  { code: '+971', label: 'United Arab Emirates (+971)' },
  { code: '+63', label: 'Philippines (+63)' },
  { code: '+60', label: 'Malaysia (+60)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+64', label: 'New Zealand (+64)' },
  { code: '+351', label: 'Portugal (+351)' },
  { code: '+90', label: 'Turkey (+90)' },
  { code: '+98', label: 'Iran (+98)' },
  { code: '+212', label: 'Morocco (+212)' },
  { code: '+254', label: 'Kenya (+254)' },
  { code: '+94', label: 'Sri Lanka (+94)' },
  { code: '+977', label: 'Nepal (+977)' },
  { code: '+855', label: 'Cambodia (+855)' },
  { code: '+66', label: 'Thailand (+66)' },
  { code: '+84', label: 'Vietnam (+84)' },
  { code: '+380', label: 'Ukraine (+380)' },
  { code: '+994', label: 'Azerbaijan (+994)' },
  { code: '+374', label: 'Armenia (+374)' },
  { code: '+995', label: 'Georgia (+995)' },
  { code: '+961', label: 'Lebanon (+961)' },
  { code: '+962', label: 'Jordan (+962)' },
  { code: '+964', label: 'Iraq (+964)' },
  { code: '+965', label: 'Kuwait (+965)' },
  { code: '+968', label: 'Oman (+968)' },
  { code: '+973', label: 'Bahrain (+973)' },
  { code: '+974', label: 'Qatar (+974)' },
  { code: '+975', label: 'Bhutan (+975)' },
  { code: '+976', label: 'Mongolia (+976)' },
  { code: '+960', label: 'Maldives (+960)' },
  { code: '+93', label: 'Afghanistan (+93)' },
  { code: '+967', label: 'Yemen (+967)' },
  { code: '+972', label: 'Israel (+972)' },
  { code: '+992', label: 'Tajikistan (+992)' },
  { code: '+993', label: 'Turkmenistan (+993)' },
  { code: '+996', label: 'Kyrgyzstan (+996)' },
  { code: '+998', label: 'Uzbekistan (+998)' },
];

const ALLOWED_REGIONS = ["India", "United States", "United Kingdom", "Canada", "Australia"];

export default function InvitationPage() {
  const router = useRouter();
  const t = (key: string) => key;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+1',
    phone: '',
    language: '',
    challenge: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Validate phone/email uniqueness
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name.';
    if (!formData.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errs.email = 'Please enter a valid email address.';
    if (!formData.phone.match(/^\d{7,15}$/)) errs.phone = 'Please enter a valid phone number.';
    if (!formData.language) errs.language = 'Please select a preferred language.';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setFormData((f) => ({ ...f, [name]: fieldValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      // Redirect to phone verification with prefilled data
      const params = new URLSearchParams({
        phone: formData.phone,
        countryCode: formData.countryCode,
        email: formData.email,
        name: formData.name,
        language: formData.language,
        challenge: formData.challenge // Pass challenge in params if filled
      });
      router.push(`/verify-phone?${params.toString()}`);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrors({ submit: err.message || 'Submission failed.' });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Link href="/" className="flex flex-col items-center mb-2">
          <Image
            src="/assets/logo/Logo.png"
            alt="DrishiQ Logo"
            width={180}
            height={80}
            className="h-12 w-auto mb-1"
            priority
          />
          <span className="text-sm text-[#0B4422]/70 -mt-2">Intelligence of Perception</span>
        </Link>
        <h1 className="text-3xl font-bold text-[#0B4422] mb-4 mt-6">Thank you for your interest!</h1>
        <p className="text-lg text-gray-700 mb-6 max-w-xl text-center">
          We&apos;re building an invite-only community of forward-thinking individuals who want to unlock their potential through personalized guidance.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Join a community of individuals who&apos;ve taken control of their decision-making and life outcomes.
        </p>
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <button
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => window.open('/blog', '_blank')}
          >
            Read our Blog
          </button>
          <div className="w-full flex justify-center">
            <video
              src="/assets/intro.mp4"
              controls
              className="w-full rounded-lg shadow"
              style={{ maxWidth: '100%', minWidth: 0 }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <button
            className="w-full px-6 py-3 bg-[#0B4422] text-white rounded-lg hover:bg-[#083318] transition-colors"
            onClick={() => router.push("/")}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex flex-col items-center mb-2">
            <Image
              src="/assets/logo/Logo.png"
              alt="DrishiQ Logo"
              width={180}
              height={80}
              className="h-12 w-auto mb-1"
              priority
            />
            <span className="text-sm text-[#0B4422]/70 -mt-2">Intelligence of Perception</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Invitation Form
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please fill out the form below to request an invitation.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#0B4422] focus:border-[#0B4422] focus:z-10 sm:text-sm`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#0B4422] focus:border-[#0B4422] focus:z-10 sm:text-sm`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 flex">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  className="block w-48 px-3 py-2 border border-gray-300 text-gray-900 rounded-l-md focus:outline-none focus:ring-[#0B4422] focus:border-[#0B4422] sm:text-sm"
                >
                  {COUNTRY_CODES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`flex-1 appearance-none relative block px-3 py-2 border border-l-0 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-r-md focus:outline-none focus:ring-[#0B4422] focus:border-[#0B4422] focus:z-10 sm:text-sm`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                Preferred Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.language ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 rounded-md focus:outline-none focus:ring-[#0B4422] focus:border-[#0B4422] sm:text-sm`}
              >
                <option value="">Select a language</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
              {errors.language && <p className="mt-1 text-sm text-red-600">{errors.language}</p>}
            </div>

            <div>
              <label htmlFor="challenge" className="block text-sm font-medium text-gray-700">
                What is your biggest challenge right now?
              </label>
              <textarea
                id="challenge"
                name="challenge"
                rows={4}
                value={formData.challenge}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.challenge ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#0B4422] focus:border-[#0B4422] focus:z-10 sm:text-sm resize-none`}
                placeholder="Describe your challenge..."
              />
              {errors.challenge && <p className="mt-1 text-sm text-red-600">{errors.challenge}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0B4422] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B4422] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-[#0B4422] text-base max-w-lg font-medium">
          We respect your privacy. Your information will only be used for invitation purposes.
        </div>
        {errors.submit && <div className="text-red-500 text-xs mt-2 text-center">{errors.submit}</div>}
      </div>
    </div>
  );
} 