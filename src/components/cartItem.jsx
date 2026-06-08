import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { increaseQty, decreaseQty, removeFromCart } from "../slice/cartSlice";
import { formatCurrency } from "../utils/formatCurrency";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleIncreaseQty = () => {
    dispatch(increaseQty(item._id));
  };

  const handleDecreaseQty = () => {
    dispatch(decreaseQty(item._id));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(item._id));
  };

  const price = item.price * item.qty;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      <div className="w-24 h-24 bg-gray-100 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg text-[#2C2C2C] mb-2">{item.name}</h3>
        <p className="text-xl text-[#FF6B35] mb-3">{formatCurrency(price)}</p>
        <p className="text-sm text-gray-500 mb-3">
          Prep time: {item.preparationTime || 15} minutes
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
            <button
              type="button"
              className="p-2 hover:bg-gray-100 transition-colors"
              onClick={handleDecreaseQty}
            >
              <Minus className="h-4 w-4 text-[#2C2C2C]" />
            </button>
            <span className="text-lg text-[#2C2C2C] min-w-[2rem] text-center">
              {item.qty}
            </span>
            <button
              type="button"
              className="p-2 hover:bg-gray-100 transition-colors"
              onClick={handleIncreaseQty}
            >
              <Plus className="h-4 w-4 text-[#2C2C2C]" />
            </button>
          </div>
          <button
            type="button"
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            onClick={handleRemoveFromCart}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg text-[#2C2C2C]">
          {formatCurrency(item.price * item.qty)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
