import MarqueeText from "react-fast-marquee";

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

const Marquee = async () => {
  const res = await fetch(
    "https://api.abcz.workers.dev/api/bazardor/products",
    {
      next: {
        revalidate: 86400,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: Product[] = await res.json();

  return (
    <div className="w-full overflow-hidden border-t border-b border-gray-200">
      <MarqueeText
        speed={200}
        direction="left"
        pauseOnHover={true}
        gradient={false}
        autoFill={true}
      >
        {data.map((product) => {
          const isUp = product.change.dir === "up";
          const isDown = product.change.dir === "down";
          const isFlat = product.change.dir === "flat";

          return (
            <div
              key={product.id}
              className="flex items-center gap-2 px-6 py-1 whitespace-nowrap border-r border-gray-400/50"
            >
              {/* Product Icon */}
              <span className="text-lg">
                {product.image || product.categoryIcon}
              </span>

              {/* Product Name */}
              <span className="font-medium text-gray-900">
                {product.nameBn}
              </span>

              {/* Price */}
              <span className="font-bold text-gray-900">
                {product.today.toLocaleString("bn-BD")} টাকা/
                {product.unit === "kg"
                  ? "কেজি"
                  : product.unit === "litre"
                    ? "লিটার"
                    : product.unit}
              </span>

              {/* Change */}
              <span
                className={
                  isUp
                    ? "font-semibold text-green-700"
                    : isDown
                      ? "font-semibold text-red-600"
                      : "font-semibold text-gray-700"
                }
              >
                {isUp && "▲"}
                {isDown && "▼"}
                {isFlat && "—"}{" "}
                {Math.abs(product.change.pct).toLocaleString("bn-BD")}%
              </span>
            </div>
          );
        })}
      </MarqueeText>
    </div>
  );
};

export default Marquee;