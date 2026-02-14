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
      {/* Hero */}
      <motion.section variants={pageEnter} initial="hidden" animate="visible" className="py-28 md:py-36 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--gold)/0.06),transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div variants={fadeUp} className="w-16 h-px mx-auto mb-6 bg-primary/40" />
          <motion.p variants={fadeUp} className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4 font-body font-medium">
            Get In Touch
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-heading text-4xl md:text-6xl text-foreground mb-6">
            Contact <span className="gold-text-gradient">Us</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">
            Book your appointment or reach out — we'd love to hear from you.
          </motion.p>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary/30" />
        <Scissors className="w-4 h-4 text-primary/40 mx-3" />
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary/30" />
      </div>

      <section className="pb-28 pt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Form */}
            <ScrollReveal direction="left">
              <form onSubmit={handleSubmit} className="premium-card p-8 space-y-5">
                <h2 className="font-heading text-2xl text-foreground mb-2">Send a Message</h2>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Name *</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" maxLength={100} className="bg-background/50 border-border focus:border-primary transition-colors duration-500" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email *</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" maxLength={255} className="bg-background/50 border-border focus:border-primary transition-colors duration-500" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Phone</label>
                  <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+61 ..." maxLength={20} className="bg-background/50 border-border focus:border-primary transition-colors duration-500" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Message *</label>
                  <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you need..." maxLength={1000} rows={4} className="bg-background/50 border-border focus:border-primary transition-colors duration-500" />
                </div>
                <Button type="submit" className="w-full gold-gradient text-background font-semibold py-6 transition-shadow duration-500 hover:shadow-xl">
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </form>
            </ScrollReveal>

            {/* Info + Map */}
            <div className="space-y-6">
              <ScrollReveal direction="right" delay={100}>
                <div className="premium-card p-8 space-y-5">
                  <h2 className="font-heading text-2xl text-foreground mb-2">Business Info</h2>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-muted-foreground text-sm">263 Heaths Rd, Werribee VIC 3030, Australia</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <a href="tel:+61460309333" className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300">+61 460 309 333</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-primary shrink-0" />
                    <a href="https://www.instagram.com/gabru_looks/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300">@gabru_looks</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <TikTokIcon />
                    <span className="text-muted-foreground text-sm">@gabru_looks</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div className="text-muted-foreground text-sm">
                      <p>Mon–Fri: 9:00 AM – 7:00 PM</p>
                      <p>Sat–Sun: 9:00 AM – 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <a href="tel:+61460309333">
                      <Button className="gold-gradient text-background font-semibold transition-shadow duration-500 hover:shadow-xl">
                        <Phone className="w-4 h-4 mr-1" /> Call Now
                      </Button>
                    </a>
                    <a href="https://maps.google.com/?q=263+Heaths+Rd+Werribee+VIC+3030" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-primary/20 text-primary hover:bg-accent transition-all duration-500">
                        <MapPin className="w-4 h-4 mr-1" /> Directions
                      </Button>
                    </a>
                  </div>
                  <div className="pt-4 border-t border-border flex gap-4">
                    <div>
                      <p className="text-muted-foreground text-xs mb-2">Instagram</p>
                      <img src={qrCode} alt="Instagram QR" className="w-20 h-20 rounded-xl border border-border" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-2">TikTok</p>
                      <img src={tiktokQr} alt="TikTok QR" className="w-20 h-20 rounded-xl border border-border" />
                    </div>
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
