import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SingleStatRadarProps {
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
  color?: string;
}

const formatStatName = (name: string) => {
  const map: Record<string, string> = {
    'hp': 'HP',
    'attack': 'ATK',
    'defense': 'DEF',
    'special-attack': 'SpA',
    'special-defense': 'SpD',
    'speed': 'SPD'
  };
  return map[name] || name.toUpperCase();
}

export const SingleStatRadar: React.FC<SingleStatRadarProps> = ({ stats, color = "#22d3ee" }) => {
  const data = useMemo(() => {
    return stats.map(s => ({
      subject: formatStatName(s.stat.name),
      value: s.base_stat,
      fullMark: 255
    }));
  }, [stats]);

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 255]} tick={false} axisLine={false} />
          <Radar
            name="Stats"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
