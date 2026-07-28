import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export const StatRadar = ({ playerStats, opponentStats }: { playerStats: any, opponentStats: any }) => {
  const data = [
    { subject: 'HP', player: playerStats.hp, opponent: opponentStats.hp },
    { subject: 'Atk', player: playerStats.attack, opponent: opponentStats.attack },
    { subject: 'Def', player: playerStats.defense, opponent: opponentStats.defense },
    { subject: 'SpA', player: playerStats.spAtk, opponent: opponentStats.spAtk },
    { subject: 'SpD', player: playerStats.spDef, opponent: opponentStats.spDef },
    { subject: 'Speed', player: playerStats.speed, opponent: opponentStats.speed },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#334155" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
        <PolarRadiusAxis angle={30} domain={[0, 160]} tick={false} axisLine={false} />
        <Radar name="Player" dataKey="player" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.5} />
        <Radar name="Opponent" dataKey="opponent" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.5} />
      </RadarChart>
    </ResponsiveContainer>
  );
};
