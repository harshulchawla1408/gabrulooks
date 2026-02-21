import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Instagram, Clock, Send, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useToast } from "@/hooks/use-toast";
import qrCode from "@/assets/gabru-qr.png";
import tiktokQr from "@/assets/gabru-tiktok-qr.png";

const pageEnter = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
  </svg>
);

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent!", description: "We'll get back to you soon." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="overflow-hidden">
      <motion.section variants={pageEnter} initial="hidden" animate="visible" className="py-28 md:py-36 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.1),transparent_70%)] opacity-50" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div variants={fadeUp} className="w-20 h-1 mx-auto mb-8 bg-primary/40 rounded-full" />
          <motion.p variants={fadeUp} className="text-secondary-content/80 text-sm uppercase tracking-[0.4em] mb-4 font-body font-medium">
            Get In Touch
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-heading text-5xl md:text-7xl text-base-content mb-6 font-bold tracking-tight">
            Contact <span className="text-primary drop-shadow-md">Us</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base-content/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Book your appointment or reach out — we'd love to hear from you.
          </motion.p>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary/30" />
        <Scissors className="w-5 h-5 text-primary/40 mx-4" />
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary/30" />
      </div>

      <section className="pb-28 pt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Form */}
            <ScrollReveal direction="left">
              <form onSubmit={handleSubmit} className="card bg-base-100/80 backdrop-blur-xl shadow-xl border border-primary/10 p-8 space-y-6">
                <h2 className="font-heading text-3xl text-base-content mb-4 text-center">Send a Message</h2>
                <div className="form-control w-full">
                  <label className="label text-sm text-base-content/70 font-medium">Name <span className="text-error ml-1">*</span></label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" maxLength={100} className="input input-bordered input-primary w-full bg-base-100/50" />
                </div>
                <div className="form-control w-full">
                  <label className="label text-sm text-base-content/70 font-medium">Email <span className="text-error ml-1">*</span></label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" maxLength={255} className="input input-bordered input-primary w-full bg-base-100/50" />
                </div>
                <div className="form-control w-full">
                  <label className="label text-sm text-base-content/70 font-medium">Phone</label>
                  <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+61 ..." maxLength={20} className="input input-bordered input-primary w-full bg-base-100/50" />
                </div>
                <div className="form-control w-full">
                  <label className="label text-sm text-base-content/70 font-medium">Message <span className="text-error ml-1">*</span></label>
                  <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you need..." maxLength={1000} rows={4} className="textarea textarea-primary w-full bg-base-100/50" />
                </div>
                <Button type="submit" className="btn btn-primary w-full rounded-full shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all h-12 text-lg mt-4">
                  <Send className="w-5 h-5 mr-2" /> Send Message
                </Button>
              </form>
            </ScrollReveal>

            {/* Info + Map */}
            <div className="space-y-6">
              <ScrollReveal direction="right" delay={100}>
                <div className="card bg-base-100 shadow-xl border border-primary/10 p-8 space-y-6">
                  <h2 className="font-heading text-3xl text-base-content mb-4 text-center">Business Info</h2>
                  <div className="flex items-start gap-4 p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-base-content/80 text-base mt-1">263 Heaths Rd, Werribee VIC 3030, Australia</p>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <a href="tel:+61460309333" className="text-base-content/80 text-base hover:text-primary transition-colors duration-300">+61 460 309 333</a>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <Instagram className="w-6 h-6 text-primary" />
                    </div>
                    <a href="https://www.instagram.com/gabru_looks/" target="_blank" rel="noopener noreferrer" className="text-base-content/80 text-base hover:text-primary transition-colors duration-300">@gabru_looks</a>
                  </div>
                  <div className="flex items-start gap-4 p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <Clock className="w-6 h-6 text-primary mt-0.5" />
                    </div>
                    <div className="text-base-content/80 text-base space-y-1 mt-1">
                      <p>Mon–Fri: 9:00 AM – 7:00 PM</p>
                      <p>Sat–Sun: 9:00 AM – 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <a href="tel:+61460309333" className="w-full">
                      <Button className="btn btn-primary w-full rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none">
                        <Phone className="w-5 h-5 mr-2" /> Call Now
                      </Button>
                    </a>
                    <a href="https://maps.google.com/?q=263+Heaths+Rd+Werribee+VIC+3030" target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" className="btn btn-outline btn-primary w-full rounded-full transition-all duration-300 hover:-translate-y-1">
                        <MapPin className="w-5 h-5 mr-2" /> Directions
                      </Button>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={200}>
                <div className="rounded-2xl overflow-hidden h-64 border border-border">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145.8!2d144.6561!3d-37.8887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDUzJzE5LjMiUyAxNDTCsDM5JzIxLjgiRQ!5e0!3m2!1sen!2sau!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Gabru Looks Location"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
