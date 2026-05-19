export default function OrbitRing({ radius }) {
  return (
    <div
      className="absolute rounded-full border border-white/10"
      style={{
        width: radius * 2,
        height: radius * 2,
      }}
    />
  );
}
