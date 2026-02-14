import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  useAnalyticsBookings,
  computeMonthlyRevenue,
  computeServiceRevenue,
  computeDailyRevenue,
  formatRevenue,
} from "@/hooks/useAnalytics";
import { useServices } from "@/hooks/useServices";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Calendar, TrendingUp } from "lucide-react";

const now = new Date();

function generateMonthOptions() {
  const options: { value: string; label: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({ value: format(d, "yyyy-MM"), label: format(d, "MMMM yyyy") });
  }
  return options;
}

const monthOptions = generateMonthOptions();

const BarberEarnings = ({ barberId }: { barberId: string }) => {
  const [selectedMonth, setSelectedMonth] = useState(format(now, "yyyy-MM"));
  const { data: services } = useServices(false);

  // All completed bookings for this barber (for trend)
  const { data: allBookings, isLoading: loadingAll } = useAnalyticsBookings({ barberId });

  // Month-filtered bookings
  const { data: monthBookings, isLoading: loadingMonth } = useAnalyticsBookings({
    barberId,
    month: selectedMonth,
  });

  const monthlyData = useMemo(
    () => computeMonthlyRevenue(allBookings ?? [], services ?? []),
    [allBookings, services]
  );

  const dailyData = useMemo(
    () => computeDailyRevenue(monthBookings ?? [], services ?? []),
    [monthBookings, services]
  );

  const serviceData = useMemo(
    () => computeServiceRevenue(monthBookings ?? [], services ?? []),
    [monthBookings, services]
  );

  const totalEarnings = useMemo(
    () => (monthBookings ?? []).reduce((sum, b) => {
      const svc = services?.find(s => s.id === b.service_id);
      return sum + (svc ? (b.payment_method === "cash" ? svc.cash_price : svc.card_price) : 0);
    }, 0),
    [monthBookings, services]
  );

  const completedCount = monthBookings?.length ?? 0;
  const isLoading = loadingAll || loadingMonth;

  const tooltipFormatter = (value: number) => formatRevenue(value);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px] border-primary/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map(m => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card">
              <DollarSign className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Earnings</p>
              <p className="text-xl font-heading text-foreground">{formatRevenue(totalEarnings)}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <Calendar className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Bookings</p>
              <p className="text-xl font-heading text-foreground">{completedCount}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <TrendingUp className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Avg / Booking</p>
              <p className="text-xl font-heading text-foreground">
                {completedCount > 0 ? formatRevenue(Math.round(totalEarnings / completedCount)) : "$0"}
              </p>
            </div>
          </div>

          {/* Monthly Earnings Bar Chart */}
          <div className="p-5 rounded-xl border border-border bg-card">
            <h4 className="font-heading text-lg text-foreground mb-4">Monthly Earnings</h4>
            {monthlyData.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">No earnings data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tickFormatter={v => `$${v / 100}`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip formatter={tooltipFormatter} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="total" fill="#C5A55A" radius={[4, 4, 0, 0]} name="Earnings" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Daily Earnings Line Chart */}
          <div className="p-5 rounded-xl border border-border bg-card">
            <h4 className="font-heading text-lg text-foreground mb-4">Daily Earnings — {monthOptions.find(m => m.value === selectedMonth)?.label}</h4>
            {dailyData.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">No earnings this month</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tickFormatter={v => `$${v / 100}`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip formatter={tooltipFormatter} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="total" stroke="#C5A55A" strokeWidth={2} dot={{ fill: "#C5A55A", r: 3 }} name="Earnings" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Earnings by Service */}
          <div className="p-5 rounded-xl border border-border bg-card">
            <h4 className="font-heading text-lg text-foreground mb-4">Earnings by Service</h4>
            {serviceData.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">No service data</p>
            ) : (
              <div className="space-y-2">
                {serviceData.map(s => (
                  <div key={s.serviceId} className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-foreground">{s.serviceName}</span>
                    <span className="text-sm font-medium text-primary">{formatRevenue(s.total)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BarberEarnings;
