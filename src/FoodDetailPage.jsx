import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "../store/foodSlice";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import Footer from "../components/Footer";
import { formatCurrency } from "./lib/formatters";

export default function FoodDetailPage({ foodId, navigate }) {
  const dispatch = useDispatch();
  const foods = useSelector((state) => state.food.items || []);
  const { addToCart, toggleFavorite, favorites } = useApp();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  const food = foods.find((item) => (item._id || item.id) === foodId);
  const related = foods
    .filter(
      (item) =>
        (item._id || item.id) !== foodId && item.category === food?.category,
    )
    .slice(0, 4);
  const isFav = food ? favorites.includes(food._id || food.id) : false;

  if (!food) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar currentPage="menu" navigate={navigate} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="font-semibold text-stone-900">Meal not found</p>
          <button
            onClick={() => navigate("menu")}
            className="text-orange-600 text-sm font-medium hover:underline"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(food, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="menu" navigate={navigate} />

      <div className="max-w-7xl mx-auto px-6 pt-4 pb-0 w-full">
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <button
            onClick={() => navigate("home")}
            className="hover:text-orange-600 transition-colors"
          >
            Home
          </button>
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline
              points="9 18 15 12 9 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <button
            onClick={() => navigate("menu")}
            className="hover:text-orange-600 transition-colors"
          >
            Menu
          </button>
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline
              points="9 18 15 12 9 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-stone-700 font-medium truncate max-w-[160px]">
            {food.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 w-full flex-1">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <div className="rounded-2xl overflow-hidden bg-stone-200 aspect-[4/3] lg:aspect-auto lg:max-h-[480px]">
            <img
              src={food.imageUrl || food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="inline-block bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
                  {food.category}
                </span>
                <h1
                  className="text-3xl font-semibold text-stone-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {food.name}
                </h1>
              </div>
              <button
                onClick={() => toggleFavorite(food._id || food.id)}
                className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${isFav ? "bg-red-50 border-red-200 text-red-500" : "bg-stone-50 border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-200"}`}
                aria-label={
                  isFav ? "Remove from favourites" : "Add to favourites"
                }
              >
                <svg
                  className="w-5 h-5"
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
              <span className="text-lg font-semibold text-stone-900">
                {formatCurrency(food.price)}
              </span>
            </div>

            <p className="text-stone-600 leading-relaxed mb-5">
              {food.description}
            </p>

            <div className="flex items-center justify-end mb-6">
              <div className="flex items-center gap-2 border border-stone-200 rounded-xl bg-stone-50 px-2 py-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg text-stone-700 hover:bg-white transition-colors"
                >
                  -
                </button>
                <span className="w-6 text-center text-sm font-semibold text-stone-800">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-8 h-8 rounded-lg text-stone-700 hover:bg-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className={`h-12 rounded-xl font-semibold text-sm transition-colors ${added ? "bg-green-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"}`}
              >
                {added
                  ? "Added to cart"
                  : `Add to cart · ${formatCurrency(Number(food.price) * qty)}`}
              </button>
              <button
                onClick={() => navigate("menu")}
                className="h-12 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium text-sm hover:bg-stone-50 transition-colors"
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2
              className="text-xl font-semibold text-stone-900 mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              More from {food.category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((item) => (
                <FoodCard
                  key={item._id || item.id}
                  food={item}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer navigate={navigate} />
    </div>
  );
}
