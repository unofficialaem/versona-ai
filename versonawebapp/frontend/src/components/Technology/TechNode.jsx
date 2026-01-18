// The TechNode component creates an animated icon that is positioned in a circle and moves slightly with a small wobble effect.

function TechNode({ item, radius, baseAngle, index, total }) {
  const ref = React.useRef();  //This lets us manipulate the DOM element directly (e.g., move it around the screen).

  // Fixed spacing between icons
  const offset = (index / total) * Math.PI * 2; //Calculating the Position of Each Icon
                                   //math.pi is a full circle in radians (about 6.28 radians), so this ensures the icons are evenly spaced in a circle.
  // Small random wobble (life, but safe)
  const wobble = React.useRef(Math.random() * 0.35);

  useAnimationFrame(() => {  // This hook allows us to update the position of the icon on every animation frame
    const angle = baseAngle.current + offset + wobble.current;  //The angular offset based on the icon's position in the circle.

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;   //These functions are used to calculate the x and y position of the icon in polar coordinates (a circle).

    if (ref.current) {
      ref.current.style.transform = `translate(${x}px, ${y}px)`; //This sets the icon's position using CSS to move it to the right spot on the circle.
    }
  });

  return (
    <div ref={ref} className="absolute group">
      <div className="
        relative h-12 w-12 rounded-full
        bg-black/60 border border-white/20
        backdrop-blur-md
        flex items-center justify-center
        transition-all duration-300
        group-hover:scale-110
        group-hover:border-purple-400
      ">
        <img
          src={item.icon}
          alt={item.name}
          className="h-6 w-6 object-contain"
        />

        {/* Glow on hover */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-purple-500/20 blur-md transition" />
      </div>

      {/* Tooltip */}
      <div className="
        absolute left-1/2 top-full mt-2
        -translate-x-1/2
        text-xs text-white/80
        opacity-0 group-hover:opacity-100
        transition
        whitespace-nowrap
      ">
        {item.name}
      </div>
    </div>
  );
}
