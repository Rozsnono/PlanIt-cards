export default function ColorPicker({ choosen }: { choosen: (color: string) => void }) {
    const arcs = [
        { color: "#ea323c", startAngle: -90, endAngle: 0, name: 'R' }, //red
        { color: "#0098dc", startAngle: 0, endAngle: 90, name: 'B' }, //blue
        { color: "#ffc825", startAngle: 90, endAngle: 180, name: 'Y' }, //yellow
        { color: "#33984b", startAngle: 180, endAngle: 270, name: 'G' }, //green
    ];

    // Segédfüggvény a körív koordináták kiszámításához
    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians)
        };
    };

    return (
        <main className="fixed w-full h-full flex justify-center items-center bg-[#00000060] z-[100]">

            <div className="w-[10rem] h-[10rem] flex justify-center items-center overflow-visible">
                <svg width="550" height="550" viewBox="0 0 550 550" className="overflow-visible" >
                    {arcs.map((arc, index) => (
                        <path
                            onClick={() => { choosen(arc.name) }}
                            key={index}
                            d={describeArc(275, 275, 211, arc.startAngle, arc.endAngle)}
                            fill="none"
                            stroke={arc.color}
                            strokeWidth="100"
                            className="transition-transform duration-300 hover:scale-[120%] origin-center cursor-pointer"
                        />
                    ))}
                </svg>
            </div>
        </main>
    );
};