import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  useAnalyticsBookings,
  computeMonthlyRevenue,
  computeBarberRevenue,
  computeServiceRevenue,
  computeCategoryRevenue,
  formatRevenue,
} from "@/hooks/useAnalytics";
import { useServices } from "@/hooks/useServices";
import { useBarbers } from "@/hooks/useBarbers";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, Users, Scissors } from "lucide-react";

const COLORS = ["#C5A55A", "#8B7335", "#E8D5A3", "#A08642", "#D4B96A", "#6B5A2E", "#F0E0B0"];

const now = new Date();
const currentMonth = format(now, "yyyy-MM");

function generateMonthOptions() {
  const options: { value: string; label: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({ value: format(d, "yyyy-MM"), label: format(d, "MMMM yyyy") });
  }
  return options;
}

const monthOptions = generateMonthOptions();

const AdminAnalytics = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedBarber, setSelectedBarber] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");

  const { data: services } = useServices(false);
  const { data: barbers } = useBarbers(false);

  // Fetch all completed bookings (unfiltered for trend chart)
  const { data: allBookings, isLoading: loadingAll } = useAnalyticsBookings();

  // Fetch filtered bookings for detail views
  const { data: filteredBookings, isLoading: loadingFiltered } = useAnalyticsBookings({
    month: selectedMonth || undefined,
    barberId: selectedBarber !== "all" ? selectedBarber : undefined,
    serviceId: selectedService !== "all" ? selectedService : undefined,
  });

  const monthlyData = useMemo(
    () => computeMonthlyRevenue(allBookings ?? [], services ?? []),
    [allBookings, services]
  );

  const barberData = useMemo(
    () => computeBarberRevenue(filteredBookings ?? [], services ?? [], barbers ?? []),
    [filteredBookings, services, barbers]
  );

  const serviceData = useMemo(
    () => computeServiceRevenue(filteredBookings ?? [], services ?? []),
    [filteredBookings, services]
  );

  const categoryData = useMemo(
    () => computeCategoryRevenue(serviceData),
    [serviceData]
  );

  const totalRevenue = useMemo(
    () => (filteredBookings ?? []).reduce((sum, b) => {
      const svc = services?.find(s => s.id === b.service_id);
      return sum + (svc ? (b.payment_method === "cash" ? svc.cash_price : svc.card_price) : 0);
    }, 0),
    [filteredBookings, services]
  );

  const totalBookings = filteredBookings?.length ?? 0;

  const isLoading = loadingAll || loadingFiltered;

  const tooltipFormatter = (value: number) => formatRevenue(value);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={selectedMonth || "all-time"} onValueChange={v => setSelectedMonth(v === "all-time" ? "" : v)}>
          <SelectTrigger className="w-[180px] border-primary/30">
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-time">All Time</SelectItem>
            {monthOptions.map(m => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedBarber} onValueChange={setSelectedBarber}>
          <SelectTrigger className="w-[180px] border-primary/30">
            <SelectValue placeholder="All Barbers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Barbers</SelectItem>
            {barbers?.map(b => (
              <SelectItem key={b.id} value={b.id}>{b.display_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger className="w-[180px] border-primary/30">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {services?.map(s => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
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
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <SummaryCard icon={DollarSign} label="Total Revenue" value={formatRevenue(totalRevenue)} />
            <SummaryCard icon={TrendingUp} label="Bookings" value={totalBookings.toString()} />
            <SummaryCard icon={Users} label="Active Barbers" value={(barbers?.filter(b => b.is_active).length ?? 0).toString()} />
            <SummaryCard icon={Scissors} label="Services" value={(services?.filter(s => s.is_active).length ?? 0).toString()} />
          </div>

          {/* Monthly Revenue Trend - Line Chart */}
          <ChartCard title="Monthly Revenue Trend">
            {monthlyData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tickFormatter={v => `$${v / 100}`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip formatter={tooltipFormatter} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="total" stroke="#C5A55A" strokeWidth={2} dot={{ fill: "#C5A55A", r: 4 }} activeDot={{ r: 6 }} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Barber-wise Revenue - Bar Chart */}
          <ChartCard title="Barber-wise Revenue">
            {barberData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barberData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="barberName" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tickFormatter={v => `$${v / 100}`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip formatter={tooltipFormatter} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="total" fill="#C5A55A" radius={[4, 4, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Category Revenue - Pie/Donut Chart */}
          <ChartCard title="Revenue by Service Category">
            {categoryData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={tooltipFormatter} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Top Services Table */}
          <ChartCard title="Revenue by Service">
            {serviceData.length === 0 ? (
              <EmptyChart />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">Service</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Category</th>
                      <th className="text-right py-2 text-muted-foreground font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceData.map(s => (
                      <tr key={s.serviceId} className="border-b border-border/50">
                        <td className="py-2 text-foreground">{s.serviceName}</td>
                        <td className="py-2 text-muted-foreground">{s.category}</td>
                        <td className="py-2 text-right text-primary font-medium">{formatRevenue(s.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ChartCard>
        </>
      )}
    </div>
  );
};

function SummaryCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <Icon className="w-5 h-5 text-primary mb-2" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-heading text-foreground">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-xl border border-border bg-card">
      <h4 className="font-heading text-lg text-foreground mb-4">{title}</h4>
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
      No data available for the selected filters
    </div>
  );
}

export default AdminAnalytics;
