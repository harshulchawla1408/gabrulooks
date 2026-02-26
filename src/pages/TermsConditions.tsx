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

const TermsConditions = () => {
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
            Terms & <span className="text-primary drop-shadow-md">Conditions</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-base-content/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Please read these terms and conditions carefully before booking or
            using the services at Gabru Looks Salon.
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
                    colorPrimary: '#d4af37',
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
                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">1. Business Overview</span>} key="1" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      These Terms and Conditions apply to all services provided by Gabru Looks Salon, located at 263 Heaths Rd, Werribee VIC 3030, Australia. By booking an appointment or utilizing our services, you agree to be bound by these terms.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">2. Booking Terms</span>} key="2" className="border-b border-primary/20">
                    <ul className="list-disc pl-6 space-y-2 text-base-content/80">
                      <li>Appointments can be made online, via phone, or in person.</li>
                      <li>We recommend booking in advance to secure your preferred time and stylist.</li>
                      <li>A confirmation notification will be sent upon successful booking.</li>
                      <li>Please arrive 5-10 minutes prior to your scheduled appointment.</li>
                    </ul>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">3. Pricing and Payment Terms</span>} key="3" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      All prices listed on our website or in-store are in Australian Dollars (AUD) and include GST unless stated otherwise. 
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-base-content/80">
                      <li>We offer dual pricing: a Cash Price and a Card Price. Payment by card may incur a surcharge to cover processing fees.</li>
                      <li>Prices are subject to change without prior notice. However, confirmed bookings will be honored at the price applicable at the time of booking.</li>
                      <li>Full payment is required upon completion of the service.</li>
                    </ul>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">4. Client Responsibilities</span>} key="4" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      To ensure we provide the best possible service, we ask that you:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-base-content/80">
                      <li>Inform your stylist of any allergies, medical conditions, or previous chemical treatments prior to your service.</li>
                      <li>Communicate openly about your desired results and expectations.</li>
                      <li>Behave respectfully towards our staff and other clients.</li>
                    </ul>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">5. Right to Refuse Service</span>} key="5" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed">
                      We reserve the right to refuse service to anyone at our discretion. This includes, but is not limited to, situations involving inappropriate behavior, health/safety risks, or unreasonable demands that compromise the integrity of our professional standards.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">6. Limitation of Liability</span>} key="6" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      While we exercise the utmost care and professional skill, Gabru Looks Salon shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our services or products, except where such liability cannot be excluded under the Australian Consumer Law.
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      We are not responsible for lost, damaged, or stolen personal items on our premises.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">7. Intellectual Property</span>} key="7" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed">
                      All content, logos, designs, and images on this website are the intellectual property of Gabru Looks Salon and may not be used, copied, or reproduced without our written consent.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">8. Governing Law & Dispute Resolution</span>} key="8">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      <strong>Governing Law:</strong> These Terms and Conditions are governed by and construed in accordance with the laws of Victoria, Australia. You irrevocably submit to the exclusive jurisdiction of the courts in Victoria.
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      <strong>Dispute Resolution:</strong> If a dispute arises out of or relates to these terms or our services, we encourage you to contact us first at info@gabrulooks.com.au to seek a resolution. If we cannot resolve it verbally or in writing within a reasonable time, you agree to engage in good faith mediation before commencing legal proceedings.
                    </p>
                  </Panel>
                </Collapse>
              </ConfigProvider>
              
              <div className="mt-12 text-center">
                <Link to="/book">
                  <Button className="btn btn-primary rounded-full shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all px-8">
                    Accept & Book Appointment
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

export default TermsConditions;
