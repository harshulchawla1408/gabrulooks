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

const CancellationPolicy = () => {
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
            Cancellation <span className="text-primary drop-shadow-md">Policy</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-base-content/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            To provide the best scheduling for all our guests, Gabru Looks
            requires a minimum notice period for cancelling or rescheduling
            your salon appointments.
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
                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">1. Cancellation Window</span>} key="1" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      We value your time and ours. If you need to cancel or reschedule your appointment, we require a minimum of <strong>24 hours' notice</strong> prior to your scheduled time.
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      This courtesy allows us to offer the appointment slot to other waiting clients.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">2. Late Cancellations & Rescheduling</span>} key="2" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      Cancellations or rescheduling requests made within 24 hours of the appointment time will be considered a "Late Cancellation" and may incur a cancellation fee equal to 50% of the scheduled service cost.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">3. No-Show Policy</span>} key="3" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      Failing to attend your appointment without any prior notice ("No-Show") will result in a fee equal to 100% of the scheduled service cost.
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      Clients with a history of No-Shows may be required to prepay for future appointments in full at the time of booking.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">4. Running Late</span>} key="4" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed mb-4">
                      If you anticipate running late, please call us as soon as possible at <strong>+61 460 309 333</strong>.
                    </p>
                    <p className="text-base-content/80 leading-relaxed">
                      If you arrive more than 15 minutes late, we may need to shorten or reschedule your appointment to respect the time of the next scheduled client. In such cases, the full service fee or a late cancellation fee may apply.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">5. Deposit Forfeiture</span>} key="5" className="border-b border-primary/20">
                    <p className="text-base-content/80 leading-relaxed">
                      For appointments requiring a deposit, failure to provide the required 24 hours' notice for cancellation or rescheduling will result in the forfeiture of your deposit. Let us know ahead of time, and your deposit can easily be transferred to your new booked appointment.
                    </p>
                  </Panel>

                  <Panel header={<span className="font-heading text-lg md:text-xl font-semibold">6. Emergency Exceptions</span>} key="6">
                    <p className="text-base-content/80 leading-relaxed">
                      We understand that sudden illnesses and genuine emergencies occur. If you are unable to keep your appointment due to an unforeseen emergency, please communicate with us at your earliest convenience. Exceptions to our policy are made at the sole discretion of the salon management.
                    </p>
                  </Panel>
                </Collapse>
              </ConfigProvider>
              
              <div className="mt-12 text-center">
                <Link to="/book">
                  <Button className="btn btn-primary rounded-full shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all px-8">
                    Manage My Bookings
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

export default CancellationPolicy;
