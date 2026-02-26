import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import { Collapse, ConfigProvider, theme } from "antd";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const { Panel } = Collapse;

const pageEnter = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const PrivacyPolicy = () => {
  return (
    <div className="overflow-hidden min-h-screen bg-base-100 flex flex-col">
      <motion.section
        variants={pageEnter}
        initial="hidden"
        animate="visible"
        className="pt-28 pb-16 md:pt-36 md:pb-20 relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.1),transparent_70%)] opacity-50" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            variants={fadeUp}
            className="w-20 h-1 mx-auto mb-8 bg-primary/40 rounded-full"
          />
          <motion.p
            variants={fadeUp}
            className="text-secondary-content/80 text-sm uppercase tracking-[0.4em] mb-4 font-body font-medium"
          >
            Legal Information
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-heading text-5xl md:text-7xl text-base-content mb-6 font-bold tracking-tight"
          >
            Privacy <span className="text-primary drop-shadow-md">Policy</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-base-content/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Your privacy is important to us. This policy outlines how Gabru Looks
            Salon collects, uses, and protects your personal information in
            accordance with the Australian Privacy Act 1988.
          </motion.p>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary/30" />
        <Scissors className="w-5 h-5 text-primary/40 mx-4" />
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary/30" />
      </div>

      <section className="pb-28 pt-8 flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollReveal>
            <div className="card bg-base-100/80 backdrop-blur-xl shadow-xl border border-primary/10 p-6 md:p-10">
              <p className="text-sm text-base-content/60 mb-8 italic">
                Last Updated: {new Date().toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
              </p>

              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                  token: {
                    colorPrimary: '#d4af37', // Gabru Gold
                    colorBgContainer: 'transparent',
                    colorBorder: 'rgba(212, 175, 55, 0.2)',
                    colorText: 'hsl(var(--bc))',
                    colorTextHeading: 'hsl(var(--bc))',
                    fontFamily: 'inherit',
                  },
                  components: {
                    Collapse: {
                      headerBg: 'rgba(212, 175, 55, 0.05)',
                      contentBg: 'transparent',
                    },
                  },
                }}
              >
                <Collapse
                  defaultActiveKey={['1']}
                  expandIconPosition="end"
                  className="bg-transparent border border-primary/20 rounded-xl overflow-hidden shadow-sm"
                  accordion
                >
                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">1. Introduction</span>} key="1" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      Gabru Looks Salon ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website, book our services, or visit our salon at 263 Heaths Rd, Werribee VIC 3030, Australia.
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      We comply with the Australian Privacy Principles (APPs) as set out in the Privacy Act 1988 (Cth).
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">2. Information We Collect</span>} key="2" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">We may collect, use, store and transfer different kinds of personal data about you, including:</p>
                    <ul className="list-disc pl-6 space-y-2 text-base-content/80">
                      <li><strong>Identity Data:</strong> First name, last name, username or similar identifier.</li>
                      <li><strong>Contact Data:</strong> Billing address, delivery address, email address (e.g., info@gabrulooks.com.au), and telephone numbers.</li>
                      <li><strong>Booking Details:</strong> Information regarding your appointments, service history, and preferences.</li>
                      <li><strong>Financial Data:</strong> Processed temporarily via third-party payment gateways (we do not store your full credit card details on our servers).</li>
                      <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, operating system, and platform.</li>
                    </ul>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">3. How We Use Your Information</span>} key="3" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">We will only use your personal data when the law allows us to. Most commonly, we use it to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-base-content/80">
                      <li>Process and manage your bookings and appointments.</li>
                      <li>Provide you with the salon services you have requested.</li>
                      <li>Manage your payments, fees, and charges.</li>
                      <li>Notify you about changes to our terms or privacy policy.</li>
                      <li>Send you marketing communications (if you have opted in).</li>
                      <li>Improve our website, services, marketing, and customer relationships.</li>
                    </ul>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">4. Data Storage and Security</span>} key="4" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      We utilize modern, secure infrastructure (such as Supabase for database management) which employs robust encryption and access controls. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">5. Third-Party Services & Cookies</span>} key="5" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      <strong>Third-Party Services:</strong> We may share your data with trusted third parties for processing payments, hosting our application, or sending SMS/Email reminders. These third parties are bound by strict confidentiality agreements.
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      <strong>Cookies:</strong> Our website uses cookies and similar tracking technologies to distinguish you from other users, providing a better experience and allowing us to improve our site. You can set your browser to refuse all or some browser cookies.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">6. Access and Correction Rights</span>} key="6" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      Under the Australian Privacy Principles, you have the right to request access to the personal information we hold about you and request corrections if it is inaccurate, out of date, incomplete, irrelevant, or misleading.
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      If you wish to exercise these rights, please contact us using the details provided below. We may need to request specific information from you to help us confirm your identity.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">7. Complaints Process</span>} key="7" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      If you believe that we have breached the Australian Privacy Principles, please contact us outlining the nature of your complaint. We will investigate your complaint and respond within a reasonable timeframe (usually 30 days).
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      If you are not satisfied with our response, you may complain to the Office of the Australian Information Commissioner (OAIC).
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">8. Contact Information</span>} key="8">
                    <div className="bg-base-200/50 p-6 rounded-lg border border-primary/10">
                      <p className="text-base-content/80 leading-relaxed mb-2 font-semibold">Gabru Looks Salon</p>
                      <p className="text-base-content/80 leading-relaxed mb-1"><strong>Address:</strong> 263 Heaths Rd, Werribee VIC 3030, Australia</p>
                      <p className="text-base-content/80 leading-relaxed mb-1"><strong>Phone:</strong> +61 460 309 333</p>
                      <p className="text-base-content/80 leading-relaxed"><strong>Email:</strong> info@gabrulooks.com.au</p>
                    </div>
                  </Panel>
                </Collapse>
              </ConfigProvider>
              
              <div className="mt-12 text-center">
                <Link to="/contact">
                  <Button className="btn btn-primary rounded-full shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all px-8">
                    Contact Us for Privacy Inquiries
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
