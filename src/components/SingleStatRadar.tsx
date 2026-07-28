import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export const SingleStatRadar = ({ stats, color = "#22d3ee" }: { stats: any[], color?: string }) => {
  if (!stats) return null;
  const data = [
    { subject: 'HP', val: stats.find(s => s.stat.name === 'hp')?.base_stat || 0 },
    { subject: 'Atk', val: stats.find(s => s.stat.name === 'attack')?.base_stat || 0 },
    { subject: 'Def', val: stats.find(s => s.stat.name === 'defense')?.base_stat || 0 },
    { subject: 'SpA', val: stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0 },
    { subject: 'SpD', val: stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0 },
    { subject: 'Spe', val: stats.find(s => s.stat.name === 'speed')?.base_stat || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <PolarGrid stroke="#1e293b" strokeWidth={1.5} />
        <PolarAngleAxis dataKey="subject" tick={{ fill: color, fontSize: 11, fontWeight: '900', fontFamily: 'monospace' }} />
        <PolarRadiusAxis angle={30} domain={[0, 200]} tick={false} axisLine={false} />
        <Radar 
          name="Stats" 
          dataKey="val" 
          stroke={color} 
          fill={color} 
          fillOpacity={0.25} 
          strokeWidth={3}
          dot={{ r: 3, fill: '#0f172a', stroke: color, strokeWidth: 2 }}
          isAnimationActive={true}
          style={{ filter: `drop-shadow(0px 0px 8px ${color})` }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
