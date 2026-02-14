"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function BarChartComponent({ data, dataKey, categoryKey, color = "#10b981" }: { data: any[], dataKey: string, categoryKey: string, color?: string }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis
                    dataKey={categoryKey}
                    stroke="#ffffff40"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#ffffff40' }}
                />
                <YAxis
                    stroke="#ffffff40"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#ffffff40' }}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: "#111", borderColor: "#333", borderRadius: "12px", color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                    cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function DonutChartComponent({ data, dataKey, nameKey }: { data: any[], dataKey: string, nameKey: string }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey={dataKey}
                    nameKey={nameKey}
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ backgroundColor: "#111", borderColor: "#333", borderRadius: "12px", color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-white/60 text-sm ml-1">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

export function LineChartComponent({ data, dataKeys, categoryKey }: { data: any[], dataKeys: { key: string, color: string, name: string }[], categoryKey: string }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis
                    dataKey={categoryKey}
                    stroke="#ffffff40"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#ffffff40' }}
                />
                <YAxis
                    stroke="#ffffff40"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#ffffff40' }}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: "#111", borderColor: "#333", borderRadius: "12px", color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                />
                <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-white/60 text-sm ml-1">{value}</span>}
                />
                {dataKeys.map((dk, i) => (
                    <Line
                        key={i}
                        type="monotone"
                        dataKey={dk.key}
                        name={dk.name}
                        stroke={dk.color}
                        strokeWidth={2}
                        dot={{ r: 4, fill: dk.color, strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}
