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

const RefundPolicy = () => {
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
            Refund <span className="text-primary drop-shadow-md">Policy</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-base-content/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Our refund policy at Gabru Looks Salon respects your rights under
            the Australian Consumer Law while outlining guidelines for our
            services and retail products.
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
                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">1. Australian Consumer Law Guarantee</span>} key="1" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      Our goods and services come with guarantees that cannot be excluded under the Australian Consumer Law (ACL).
                    </p>
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      For major failures with the service, you are entitled:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-base-content/80 mb-4">
                      <li>To cancel your service contract with us; and</li>
                      <li>To a refund for the unused portion, or to compensation for its reduced value.</li>
                    </ul>
                    <p className="text-base-content/80 leading-relaxed">
                      If a failure does not amount to a major failure, you are entitled to have problems with the service rectified in a reasonable time and, if this is not done, to cancel your contract and obtain a refund for the unused portion of the contract.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">2. Service-Based Refunds</span>} key="2" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      We pride ourselves on exceptional quality. Because salon services involve time and effort that cannot be returned, we do not issue refunds for "change of mind."
                    </p>
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      <strong>Incorrect Service Resolution:</strong> If you are unhappy with the result of a service, please contact us within 48 hours of your appointment. We ask that you return to the salon so our team can visually inspect the result. We will make every effort to correct the service at no additional charge.
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      Adjustments must be requested within a reasonable timeframe (usually within 7 days of the original service).
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">3. Retail Product Refunds</span>} key="3" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      We accept returns of unused, unopened retail products in their original packaging within 14 days of purchase for an exchange, store credit, or refund, with proof of purchase.
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      Under the ACL, you are entitled to a replacement or refund for a product that has a major problem (e.g., faulty packaging, expired or contaminated product). We do not offer refunds on opened/used products if you simply change your mind or do not care for the fragrance/texture.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">4. Non-Refundable Deposits & Prepaid Services</span>} key="4" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      If a deposit was required to secure your appointment or you purchased a prepaid package, please note that deposits and packages may be non-refundable.
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      However, they may be held on your account as store credit if you cancel in accordance with our Cancellation Policy. (See Cancellation Policy for specific notice periods).
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">5. Processing Timeline</span>} key="5" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed">
                      Approved refunds will be processed using the original method of payment. Please allow 3-7 business days for funds to appear in your account, depending on your financial institution.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">6. Contact for Refunds</span>} key="6">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      To request a refund, rectification, or exchange, please contact us at:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-base-content/80 font-medium">
                      <li>Phone: +61 460 309 333</li>
                      <li>Email: info@gabrulooks.com.au</li>
                      <li>In-Store: 263 Heaths Rd, Werribee VIC 3030, Australia</li>
                    </ul>
                  </Panel>
                </Collapse>
              </ConfigProvider>
              
              <div className="mt-12 text-center">
                <Link to="/contact">
                  <Button className="btn btn-primary rounded-full shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all px-8">
                    Contact Management
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

export default RefundPolicy;
