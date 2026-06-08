import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import FoodItem from "../components/FoodItem";
import Spinner from "../components/Spinner";
import { fetchFoods } from "../slice/foodSlice";
import { getEstimatedPrepTime } from "../utils/orderTiming";

function Home() {
  const dispatch = useDispatch();
  const { foods, isLoading, isError, message, searchTerm } = useSelector(
    (state) => state.food,
  );
  const availableFoods = foods.filter((food) => food.available !== false);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredFoods = normalizedSearchTerm
    ? availableFoods.filter((food) =>
        [food.name, food.category, food.description].some((value) =>
          value?.toLowerCase().includes(normalizedSearchTerm),
        ),
      )
    : availableFoods;
  const prepTimes = availableFoods
    .map((food) => food.preparationTime)
    .filter((time) => Number.isFinite(time) && time > 0);
  const fastestPrepTime = prepTimes.length > 0 ? Math.min(...prepTimes) : 15;
  const slowestPrepTime =
    prepTimes.length > 0 ? Math.max(...prepTimes) : getEstimatedPrepTime();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(fetchFoods());
  }, [dispatch, isError, message]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl text-[#2C2C2C] mb-3">
            Order Your Favorite Food
          </h2>
          <p className="text-lg text-gray-600">
            Fast Delivery | Quality Ingredients | Best Prices
          </p>
          <p className="text-sm text-[#FF6B35] mt-3">
            Menu prep time typically ranges from {fastestPrepTime} to{" "}
            {slowestPrepTime} minutes.
          </p>
        </div>
        {normalizedSearchTerm && (
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredFoods.length} result
            {filteredFoods.length === 1 ? "" : "s"} for "{searchTerm.trim()}"
          </p>
        )}
        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food) => (
              <FoodItem key={food._id} food={food} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <h3 className="text-xl text-[#2C2C2C] mb-2">No foods found</h3>
            <p className="text-gray-600">
              Try searching by food name, category, or description.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Home;
