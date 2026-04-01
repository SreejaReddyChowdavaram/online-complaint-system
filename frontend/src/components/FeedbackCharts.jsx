import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, Star } from "lucide-react";
import "./FeedbackCharts.css";

const FeedbackCharts = ({ data }) => {
  // 1. Prepare Bar Chart Data (Ratings Distribution)
  const barData = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach((f) => {
      if (counts[f.rating] !== undefined) counts[f.rating]++;
    });
    return Object.keys(counts).map((key) => ({
      rating: `${key} Stars`,
      count: counts[key],
    }));
  }, [data]);

  // 2. Prepare Doughnut Chart Data (Feedback Type Distribution)
  const pieData = useMemo(() => {
    const counts = { Positive: 0, Neutral: 0, Negative: 0 };
    data.forEach((f) => {
      if (counts[f.type] !== undefined) counts[f.type]++;
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [data]);

  // Colors matching Design System
  const SENTIMENT_COLORS = {
    Positive: "#16a34a", // Green
    Neutral: "#6b7280",  // Gray
    Negative: "#dc2626"   // Red
  };

  if (!data || data.length === 0) {
    return (
      <div className="no-charts-data">
        <BarChart3 size={48} color="#94a3b8" />
        <p>Insufficient data to generate analytics performance report.</p>
      </div>
    );
  }

  return (
    <div className="feedback-charts-container">
      {/* RATINGS DISTRIBUTION - BAR CHART */}
      <div className="chart-wrapper">
        <h3 className="chart-title">Ratings Distribution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
            <XAxis 
              dataKey="rating" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }} 
            />
            <YAxis 
              allowDecimals={false} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} 
            />
            <Tooltip 
              cursor={{ fill: 'var(--bg-body)', opacity: 0.4 }} 
              contentStyle={{ 
                background: 'var(--bg-card)', 
                color: 'var(--text-primary)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                padding: '8px 12px'
              }} 
              itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            />
            <Bar dataKey="count" fill="var(--primary-color)" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SENTIMENT ANALYSIS - DOUGHNUT CHART */}
      <div className="chart-wrapper">
        <h3 className="chart-title">Feedback Sentiment</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={8}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name]} stroke="var(--bg-card)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                background: 'var(--bg-card)', 
                color: 'var(--text-primary)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                padding: '8px 12px'
              }} 
              itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle" 
              formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeedbackCharts;
