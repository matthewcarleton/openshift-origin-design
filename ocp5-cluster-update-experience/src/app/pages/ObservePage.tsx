import { useState } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, AlertCircle, TrendingUp, Cpu, HardDrive, Network, Sparkles } from "@/lib/pfIcons";
import FavoriteButton from "../components/FavoriteButton";
import { useChat } from "../contexts/ChatContext";

export default function ObservePage() {
  const { setIsOpen: setIsAIOpen } = useChat();
  const [timeRange, setTimeRange] = useState("1h");

  // CPU usage data
  const cpuData = [
    { time: "8:00", usage: 45 },
    { time: "8:05", usage: 52 },
    { time: "8:10", usage: 48 },
    { time: "8:15", usage: 61 },
    { time: "8:20", usage: 58 },
    { time: "8:25", usage: 55 },
    { time: "8:30", usage: 67 },
    { time: "8:35", usage: 64 },
    { time: "8:40", usage: 59 },
    { time: "8:45", usage: 72 },
  ];

  // Memory usage data
  const memoryData = [
    { time: "8:00", usage: 62, available: 38 },
    { time: "8:05", usage: 65, available: 35 },
    { time: "8:10", usage: 64, available: 36 },
    { time: "8:15", usage: 68, available: 32 },
    { time: "8:20", usage: 70, available: 30 },
    { time: "8:25", usage: 67, available: 33 },
    { time: "8:30", usage: 72, available: 28 },
    { time: "8:35", usage: 74, available: 26 },
    { time: "8:40", usage: 71, available: 29 },
    { time: "8:45", usage: 75, available: 25 },
  ];

  // Network traffic data
  const networkData = [
    { time: "8:00", in: 3.2, out: 2.8 },
    { time: "8:05", in: 4.1, out: 3.5 },
    { time: "8:10", in: 3.8, out: 3.2 },
    { time: "8:15", in: 5.2, out: 4.3 },
    { time: "8:20", in: 4.9, out: 4.1 },
    { time: "8:25", in: 4.5, out: 3.8 },
    { time: "8:30", in: 6.1, out: 5.2 },
    { time: "8:35", in: 5.8, out: 4.9 },
    { time: "8:40", in: 5.3, out: 4.5 },
    { time: "8:45", in: 7.2, out: 6.1 },
  ];

  // Pod status data
  const podStatusData = [
    { status: "Running", count: 247 },
    { status: "Pending", count: 12 },
    { status: "Failed", count: 8 },
    { status: "Succeeded", count: 156 },
  ];

  return (
    <div className="ocs-app-page-outer h-full min-h-0 overflow-y-auto">
        <div className="flex items-center justify-between mb-[24px]">
          <div>
            <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
              Observe
            </h1>
            <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
              Monitor cluster health, metrics, alerts, and logging across your infrastructure
            </p>
          </div>
          <div className="flex gap-[12px]">
            <div className="flex items-center gap-[12px]">
              <FavoriteButton name="Observe" path="/observe" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] rounded-[8px] px-[16px] py-[10px] text-[#151515] dark:text-white cursor-pointer"
              >
                <option value="15m">Last 15 minutes</option>
                <option value="1h">Last hour</option>
                <option value="6h">Last 6 hours</option>
                <option value="24h">Last 24 hours</option>
              </select>
            </div>
            <button
              onClick={() => setIsAIOpen(true)}
              className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] transition-colors flex items-center gap-[8px]"
            >
              <Sparkles className="size-[16px]" />
              Ask AI
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-[24px] mb-[32px]">
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-[12px] mb-[12px]">
              <div className="p-[10px] bg-[#e7f1fa] dark:bg-[rgba(79,171,247,0.15)] rounded-[10px]">
                <Cpu className="size-[20px] text-[#0066cc] dark:text-[#4dabf7]" />
              </div>
              <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] uppercase tracking-wide">CPU Usage</p>
            </div>
            <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[32px] text-[#151515] dark:text-white mb-[4px]">72%</p>
            <div className="flex items-center gap-[4px] text-[#3e8635] dark:text-[#81c784]">
              <TrendingUp className="size-[14px]" />
              <p className="text-[13px] font-semibold">+8% from last hour</p>
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-[12px] mb-[12px]">
              <div className="p-[10px] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)] rounded-[10px]">
                <HardDrive className="size-[20px] text-[#3e8635] dark:text-[#81c784]" />
              </div>
              <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] uppercase tracking-wide">Memory Usage</p>
            </div>
            <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[32px] text-[#151515] dark:text-white mb-[4px]">75%</p>
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">24.1 GiB / 32.1 GiB</p>
          </div>

          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-[12px] mb-[12px]">
              <div className="p-[10px] bg-[#fff4e5] dark:bg-[rgba(255,152,0,0.15)] rounded-[10px]">
                <Network className="size-[20px] text-[#ff9800] dark:text-[#ffb74d]" />
              </div>
              <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] uppercase tracking-wide">Network</p>
            </div>
            <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[32px] text-[#151515] dark:text-white mb-[4px]">7.2</p>
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">MBps incoming</p>
          </div>

          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-[12px] mb-[12px]">
              <div className="p-[10px] bg-[#ffebee] dark:bg-[rgba(211,47,47,0.15)] rounded-[10px]">
                <AlertCircle className="size-[20px] text-[#d32f2f] dark:text-[#ef5350]" />
              </div>
              <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] uppercase tracking-wide">Active Alerts</p>
            </div>
            <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[32px] text-[#151515] dark:text-white mb-[4px]">3</p>
            <p className="text-[13px] text-[#d32f2f] dark:text-[#ef5350]">2 critical, 1 warning</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-[24px] mb-[32px]">
          {/* CPU Usage Chart */}
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[18px] text-[#151515] dark:text-white mb-[20px]">
              CPU Usage Over Time
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066cc" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0066cc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="time" stroke="#4d4d4d" style={{ fontSize: '12px' }} />
                <YAxis stroke="#4d4d4d" style={{ fontSize: '12px' }} unit="%" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)', 
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }} 
                />
                <Area type="monotone" dataKey="usage" stroke="#0066cc" strokeWidth={2} fill="url(#cpuGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Memory Usage Chart */}
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[18px] text-[#151515] dark:text-white mb-[20px]">
              Memory Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={memoryData}>
                <defs>
                  <linearGradient id="memoryUsedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3e8635" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3e8635" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="memoryAvailGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b0b0b0" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#b0b0b0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="time" stroke="#4d4d4d" style={{ fontSize: '12px' }} />
                <YAxis stroke="#4d4d4d" style={{ fontSize: '12px' }} unit="%" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)', 
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Area type="monotone" dataKey="usage" stackId="1" stroke="#3e8635" strokeWidth={2} fill="url(#memoryUsedGradient)" name="Used" />
                <Area type="monotone" dataKey="available" stackId="1" stroke="#b0b0b0" strokeWidth={2} fill="url(#memoryAvailGradient)" name="Available" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Network Traffic Chart */}
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[18px] text-[#151515] dark:text-white mb-[20px]">
              Network Traffic
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="time" stroke="#4d4d4d" style={{ fontSize: '12px' }} />
                <YAxis stroke="#4d4d4d" style={{ fontSize: '12px' }} unit=" MB/s" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)', 
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Line type="monotone" dataKey="in" stroke="#ff9800" strokeWidth={2} dot={{ r: 4 }} name="Incoming" />
                <Line type="monotone" dataKey="out" stroke="#2b9af3" strokeWidth={2} dot={{ r: 4 }} name="Outgoing" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pod Status Chart */}
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[18px] text-[#151515] dark:text-white mb-[20px]">
              Pod Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={podStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="status" stroke="#4d4d4d" style={{ fontSize: '12px' }} />
                <YAxis stroke="#4d4d4d" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)', 
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }} 
                />
                <Bar dataKey="count" fill="#0066cc" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[18px] text-[#151515] dark:text-white mb-[20px]">
            Active Alerts
          </h3>
          
          <div className="space-y-[12px]">
            <div className="bg-[#ffebee] dark:bg-[rgba(211,47,47,0.15)] border border-[#d32f2f] dark:border-[#ef5350] rounded-[12px] p-[16px]">
              <div className="flex items-start gap-[12px]">
                <AlertCircle className="size-[20px] text-[#d32f2f] dark:text-[#ef5350] shrink-0 mt-[2px]" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-[4px]">
                    <p className="font-semibold text-[#151515] dark:text-white text-[14px]">High Memory Usage on Node worker-3</p>
                    <span className="px-[10px] py-[4px] bg-[#d32f2f] dark:bg-[#ef5350] text-white rounded-[999px] text-[11px] font-semibold uppercase">Critical</span>
                  </div>
                  <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">
                    Memory usage has exceeded 90% threshold (91.2% used)
                  </p>
                  <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0]">Mar 11, 2026, 8:42 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-[#ffebee] dark:bg-[rgba(211,47,47,0.15)] border border-[#d32f2f] dark:border-[#ef5350] rounded-[12px] p-[16px]">
              <div className="flex items-start gap-[12px]">
                <AlertCircle className="size-[20px] text-[#d32f2f] dark:text-[#ef5350] shrink-0 mt-[2px]" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-[4px]">
                    <p className="font-semibold text-[#151515] dark:text-white text-[14px]">Pod CrashLoopBackOff Detected</p>
                    <span className="px-[10px] py-[4px] bg-[#d32f2f] dark:bg-[#ef5350] text-white rounded-[999px] text-[11px] font-semibold uppercase">Critical</span>
                  </div>
                  <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">
                    Pod "nginx-deployment-7d8c9f6b-4xk2p" in namespace "production" is crash looping
                  </p>
                  <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0]">Mar 11, 2026, 8:38 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-[#fff4e5] dark:bg-[rgba(255,152,0,0.1)] border border-[#ff9800] dark:border-[#ffb74d] rounded-[12px] p-[16px]">
              <div className="flex items-start gap-[12px]">
                <AlertCircle className="size-[20px] text-[#ff9800] dark:text-[#ffb74d] shrink-0 mt-[2px]" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-[4px]">
                    <p className="font-semibold text-[#151515] dark:text-white text-[14px]">High CPU Usage Detected</p>
                    <span className="px-[10px] py-[4px] bg-[#ff9800] dark:bg-[#ffb74d] text-white rounded-[999px] text-[11px] font-semibold uppercase">Warning</span>
                  </div>
                  <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">
                    Cluster CPU usage at 72%, approaching threshold
                  </p>
                  <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0]">Mar 11, 2026, 8:45 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

    </div>
  );
}