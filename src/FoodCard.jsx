import { useApp } from "../context/AppContext";
import { formatCurrency } from "./lib/formatters";

export default function FoodCard({ food, navigate }) {
  const { addToCart, toggleFavorite, favorites } = useApp();
  const id = food._id || food.id;
  const image = food.imageUrl || food.image;
  const isFav = favorites.includes(id);

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md hover:border-stone-300 transition-all duration-200">
      <div
        className="relative overflow-hidden bg-stone-100 cursor-pointer"
        onClick={() => navigate("food-detail", { foodId: id })}
      >
        <img
          src={image}
          alt={food.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(id);
          }}
          aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFav ? "bg-red-500 text-white shadow-sm" : "bg-white/80 text-stone-400 hover:text-red-500 hover:bg-white backdrop-blur-sm"}`}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill={isFav ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        <span className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {food.category}
        </span>
      </div>

      <div className="p-4">
        <div
          className="flex items-start justify-between gap-2 cursor-pointer"
          onClick={() => navigate("food-detail", { foodId: id })}
        >
          <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
            {food.name}
          </h3>
          <span className="text-stone-900 font-bold text-sm flex-shrink-0">
            {formatCurrency(food.price)}
          </span>
        </div>

        <p className="text-stone-500 text-xs mt-1 mb-3 line-clamp-2 leading-relaxed">
          {food.description}
        </p>

        <div className="flex items-center justify-end">
          <button
            onClick={() => addToCart(food)}
            disabled={!food.available}
            className="flex items-center gap-1.5 h-8 px-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
