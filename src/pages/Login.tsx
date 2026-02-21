import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Loader2, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logo from "@/assets/gabru-logo.png";
import salonInterior from "@/assets/salon-interior.jpg";

const COUNTRY_CODES = [
  { code: "+61", label: "🇦🇺 Australia (+61)", placeholder: "4XX XXX XXX" },
  { code: "+91", label: "🇮🇳 India (+91)", placeholder: "XXXXX XXXXX" },
];

const pageEnter = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [mode, setMode] = useState<"phone" | "otp">("phone");
  const [countryCode, setCountryCode] = useState("+61");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const fullPhone = `${countryCode}${phoneNumber.replace(/\s/g, "")}`;
  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode)!;

  const handleGoogleSignIn = async () => {
  setLoading(true);
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  } catch {
    toast({
      title: "Sign in failed",
      description: "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  const handleAppleSignIn = async () => {
  setLoading(true);
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  } catch {
    toast({
      title: "Sign in failed",
      description: "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.replace(/\s/g, "").length < 8) {
      toast({ title: "Enter a valid phone number", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (error) {
      toast({ title: "Failed to send OTP", description: error.message, variant: "destructive" });
    } else {
      setMode("otp");
      toast({ title: "OTP sent!", description: "Check your phone for the verification code" });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      toast({ title: "Enter the 6-digit OTP", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: "sms" });
    setLoading(false);
    if (error) {
      toast({ title: "Invalid OTP", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome to Gabru Looks!" });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img src={salonInterior} alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <motion.div variants={pageEnter} initial="hidden" animate="visible" className="w-full max-w-md z-10">
        <motion.div variants={fadeUp} className="card bg-base-100/90 backdrop-blur-xl shadow-2xl border border-primary/20 p-8 space-y-8">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-base-100 rounded-full flex items-center justify-center shadow-lg border border-base-200">
              <img src={logo} alt="Gabru Looks" className="w-16" />
            </div>
            <h1 className="font-heading text-3xl text-base-content font-bold mb-2">Welcome Back</h1>
            <p className="text-base-content/60 text-sm">Sign in to your account</p>
          </div>

          {/* Social Sign In */}
          <motion.div variants={fadeUp} className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="btn btn-outline w-full rounded-xl hover:bg-base-200 hover:text-base-content hover:border-base-300 transition-all duration-300 h-12"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </Button>

            <Button
              onClick={handleAppleSignIn}
              disabled={loading}
              variant="outline"
              className="btn btn-outline w-full rounded-xl hover:bg-base-200 hover:text-base-content hover:border-base-300 transition-all duration-300 h-12"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Apple className="w-5 h-5 mr-3" />
              )}
              Continue with Apple
            </Button>
          </motion.div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Phone OTP */}
          <motion.div variants={fadeUp}>
            {mode === "phone" ? (
              <div className="space-y-4">
                <div className="form-control w-full">
                  <label className="label text-sm text-base-content/70 font-medium">
                    <span className="flex items-center"><Phone className="w-4 h-4 mr-2" /> Phone Number</span>
                  </label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-[140px] select select-bordered select-primary bg-base-100/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map(c => (
                          <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d\s]/g, ""))}
                      placeholder={selectedCountry.placeholder}
                      maxLength={15}
                      className="input input-bordered input-primary flex-1 bg-base-100/50"
                    />
                  </div>
                </div>
                <Button onClick={handleSendOtp} disabled={loading} className="btn btn-primary w-full rounded-full shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all h-12 mt-4 text-base">
                  {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Phone className="w-5 h-5 mr-2" />}
                  Send OTP
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-sm text-base-content/70 text-center">
                  Enter the 6-digit code sent to <span className="text-primary font-bold">{fullPhone}</span>
                </p>
                <div className="form-control">
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="input input-bordered input-primary w-full bg-base-100/50 text-center text-3xl tracking-[0.5em] font-mono h-16 shadow-inner"
                  />
                </div>
                <Button onClick={handleVerifyOtp} disabled={loading} className="btn btn-primary w-full rounded-full shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all h-12 text-base">
                  {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                  Verify & Sign In
                </Button>
                <button onClick={() => { setMode("phone"); setOtp(""); }} className="btn btn-ghost w-full hover:bg-transparent text-base-content/60 hover:text-primary transition-colors">
                  ← Change number
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
