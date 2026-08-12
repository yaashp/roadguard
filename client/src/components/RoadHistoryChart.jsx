import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function RoadHistoryChart({ incidents }) {
  const data = [...incidents]
    .sort((a, b) => a.year - b.year)
    .map((i) => ({
      year: i.year,
      Potholes: i.potholesReported,
      Accidents: i.accidentsReported,
      "Safety Trend": Math.max(0, 100 - (i.potholesReported * 4 + i.accidentsReported * 10)),
    }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.5} />
          <YAxis tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.5} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "none", fontSize: 13, boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Potholes" fill="#E13B3B" radius={[6, 6, 0, 0]} barSize={22} />
          <Bar dataKey="Accidents" fill="#F2A93B" radius={[6, 6, 0, 0]} barSize={22} />
          <Line type="monotone" dataKey="Safety Trend" stroke="#17B890" strokeWidth={2.5} dot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
