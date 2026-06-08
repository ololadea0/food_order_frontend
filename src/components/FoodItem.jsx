import { useDispatch } from "react-redux";
import { addToCart } from "../slice/cartSlice";
import { Link } from "react-router-dom";
import { Clock3, Plus } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

const FoodItem = ({ food }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
        preparationTime: food.preparationTime,
        qty: 1,
      }),
    );
  };

  return (
    <div className="bg-white rounded-xl hover:shadow-xl transition-shadow duration-300 overflow-hidden group p-4">
      <Link to={`/food/${food._id}`}>
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-40 object-cover rounded mb-4 group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div>
        <Link to={`/food/${food._id}`}>
          <h3 className="text-lg hover:text-[#FF6B35] transition-colors font-bold text-gray-800 mb-2">
            {food.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {food.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Clock3 className="h-4 w-4" />
          <span>{food.preparationTime || 15} mins prep</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl text-[#FF6B35]">
            {formatCurrency(food.price)}
          </span>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF5722] transition-colors"
            onClick={handleAddToCart}
          >
            <Plus className="h-5 w-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
