
import MarqueeText from "react-fast-marquee";
import type { Product } from "@/types/product";
import { fetchFromAPI } from "@/lib/api";

type ProductsResponse =
  | Product[]
  | {
      data: Product[];
    };

const Marquee = async () => {
  const data = await fetchFromAPI<ProductsResponse>(
    "/products",
    86400,
  );

  const products: Product[] = Array.isArray(data)
    ? data
    : data.data;

  if (!Array.isArray(products)) {
    throw new Error("Invalid products data");
  }

  const changedProducts = products.filter(
    (product) =>
      product.change?.dir === "up" ||
      product.change?.dir === "down",
  );

  const unitLabel: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };

  return (
    <div className="w-full overflow-hidden border-y border-gray-200 bg-white">
      <MarqueeText
        speed={200}
        direction="left"
        pauseOnHover
        gradient={false}
        autoFill
      >
        {changedProducts.map((product) => {
          const isUp = product.change.dir === "up";
          const isDown = product.change.dir === "down";

          return (
            <div
              key={product.id}
              className="flex items-center gap-2 border-r border-gray-300/70 px-2 py-1"
            >
              <span>{product.categoryIcon}</span>

              <span className="font-normal text-gray-700">
                {product.nameBn}
              </span>

              <span className="font-normal text-gray-600">
                {product.today.toLocaleString("bn-BD")} টাকা/
                {unitLabel[product.unit] ?? product.unit}
              </span>

              <span
                className={
                  isUp
                    ? "font-normal text-red-600"
                    : isDown
                      ? "font-normal text-green-700"
                      : ""
                }
              >
                {isUp ? "▲" : "▼"}{" "}
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
