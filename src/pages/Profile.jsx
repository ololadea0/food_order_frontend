import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Settings, Package2, LogOut, Key } from "lucide-react";
import { logoutUser, reset } from "../slice/authSlice";
import { useDispatch, useSelector } from "react-redux";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const address = user?.deliveryAddress?.address || "";
  const city = user?.deliveryAddress?.city || "";
  const phone = user?.deliveryAddress?.phone || "";

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(reset());
    navigate("/login", { replace: true });
  };
  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl text-[#2C2C2C] mb-8">Profile</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className=" h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl text-[#2C2C2C] mb-1">{user?.name}</h3>
              <p
                className="text-sm text-gray-600"
                data-fg-cnbm13="1.80:1.4423:/src/app/pages/Profile.tsx:27:15:1081:59:e:p:t"
                data-fgid-cnbm13=":r6i:"
              >
                {user?.email}
              </p>
              <button
                className="mt-4 w-full py-2 border border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35] hover:text-white transition-colors"
                onClick={() => navigate("/profile/edit")}
              >
                Edit Profile
              </button>
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className=" h-5 w-5 text-[#FF6B35]" />
                <h3 className="text-xl text-[#2C2C2C]">Saved Address(es)</h3>
              </div>
              <div className="space-y-3">
                {address ? (
                  <>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-[#2C2C2C] mb-1">Home</p>
                      <p className="text-sm text-gray-600">
                        {address}, {city}
                      </p>
                      <p className="text-sm text-gray-600">{phone}</p>
                    </div>
                    <button
                      className="w-full py-2 border border-gray-300 text-gray-600 rounded-lg hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
                      onClick={() => navigate("/profile/edit")}
                    >
                      + Add New Address
                    </button>
                  </>
                ) : (
                  <div className="  px-3 py-1 rounded-full">
                    <span className="text-lg mb-8 text-[#FF6B35]">
                      Address not available
                    </span>
                    <button
                      className="w-full py-2 border border-gray-300 text-gray-600 rounded-lg hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
                      onClick={() => navigate("/profile/edit")}
                    >
                      + Add New Address
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className=" h-5 w-5 text-[#FF6B35]" />
                <h3
                  className="text-xl text-[#2C2C2C]"
                  data-fg-cnbm54="1.80:1.4423:/src/app/pages/Profile.tsx:77:17:3635:52:e:h3:t"
                  data-fgid-cnbm54=":r7c:"
                >
                  Settings
                </h3>
              </div>
              <div className="space-y-3">
                <button
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  onClick={() => navigate("/orders")}
                >
                  <Package2 className=" h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Orders</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  onClick={() => navigate("/change-password")}
                >
                  <Key className=" h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Change password</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  onClick={handleLogout}
                >
                  <LogOut className=" h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;
