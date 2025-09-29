const Circle = ({ colour, percentage }) => {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - percentage) * circ) / 100 || 0; // where stroke will start, e.g. from 15% to 100%.
  return (
    <circle
      r={r}
      cx={170}
      cy={-30}
      fill="transparent"
      stroke={strokePct !== circ ? colour : ""} // remove colour as 0% sets full circumference
      strokeWidth={".4rem"}
      strokeDasharray={circ}
      strokeDashoffset={strokePct}
    ></circle>
  );
};

const Text = ({ percentage }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={".8em"}
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

export default function Progress({pcent}) {
  return(
    <svg width={60} height={60}>
      <g transform={`rotate(-90 ${"100 100"}) scale(1,-1)`}>
        <Circle colour="lightgrey" />
        <Circle colour="blue" percentage={pcent} />
      </g>
      <Text percentage={pcent} />
    </svg>
  )
}