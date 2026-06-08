import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFoodById } from "../slice/foodSlice";
import { addToCart } from "../slice/cartSlice";
import Spinner from "../components/Spinner";
import { formatCurrency } from "../utils/formatCurrency";

function FoodPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { food, isLoading } = useSelector((state) => state.food);

  const [qty, setQty] = useState(1);

  const incrementQty = () => setQty((prev) => prev + 1);
  const decrementQty = () => {
    if (qty > 1) setQty((prev) => prev - 1);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchFoodById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!food || !food._id) {
      return;
    }

    dispatch(
      addToCart({
        _id: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
        preparationTime: food.preparationTime,
        qty,
      }),
    );
    navigate("/cart");
  };

  if (isLoading || !food) {
    return <Spinner />;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        type="button"
        className="flex items-center gap-2 text-[#2C2C2C] hover:text-[#FF6B35] mb-6"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Menu</span>
      </button>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-96 md:h-full bg-gray-100">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] text-sm rounded-full mb-4">
                {food.category}
              </span>
              <h1 className="text-4xl text-[#2C2C2C] mb-3">{food.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{food.description}</p>
            </div>
            <div className="mb-8">
              <div className="text-3xl text-[#FF6B35] mb-6">
                {formatCurrency(food.price)}
              </div>
              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    onClick={decrementQty}
                  >
                    <Minus className="h-5 w-5 text-[#2C2C2C]" />
                  </button>
                  <span className="text-xl text-[#2C2C2C] min-w-[40px] text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    onClick={incrementQty}
                  >
                    <Plus className="h-5 w-5 text-[#2C2C2C]" />
                  </button>
                </div>
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#FF6B35] text-white text-lg rounded-lg hover:bg-[#FF5722] transition-colors"
                type="button"
                disabled={!food._id}
                onClick={handleAddToCart}
              >
                <Plus className="h-5 w-5" />
                Add to Cart - {formatCurrency(food.price * qty)}
              </button>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg text-[#2C2C2C] mb-4">
                Additional Information
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>Preparation time: {food.preparationTime || 15} minutes</li>
                {food.additionalInfo && <li>{food.additionalInfo}</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default FoodPage;
