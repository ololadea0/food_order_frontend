import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, getCurrentUser } from "../slice/authSlice";
import { useNavigate } from "react-router-dom";
import { User, Mail, MapPin, Phone } from "lucide-react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const getProfileDraft = (user) => ({
  name: user?.name || "",
  email: user?.email || "",
  address: user?.deliveryAddress?.address || "",
  city: user?.deliveryAddress?.city || "",
  phone: user?.deliveryAddress?.phone || "",
});

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(() => getProfileDraft(user));

  const { name, email, address, city, phone } = formData;

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser())
        .unwrap()
        .catch(() => {
          navigate("/login", { replace: true });
        });
    }
  }, [user, dispatch, navigate]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const draft = {
      ...getProfileDraft(user),
      ...formData,
    };

    const payload = {
      name: draft.name,
      email: draft.email,
      deliveryAddress: {
        address: draft.address,
        city: draft.city,
        phone: draft.phone,
      },
    };

    dispatch(updateUserProfile(payload))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully");
        navigate("/profile");
      })
      .catch((error) => {
        toast.error(error || "Unable to update profile");
      });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-3xl text-[#2C2C2C] mb-6">Edit Profile</h2>

      <form
        onSubmit={onSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-5"
      >
        <div>
          <label className="text-sm text-gray-600 flex items-center gap-2">
            <User size={16} /> Name
          </label>
          <input
            type="text"
            name="name"
            value={name || user?.name || ""}
            onChange={onChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:ring-2 focus:border-transparent focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 flex items-center gap-2">
            <Mail size={16} /> Email
          </label>
          <input
            type="email"
            name="email"
            value={email || user?.email || ""}
            onChange={onChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:ring-2 focus:border-transparent focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 flex items-center gap-2">
            <MapPin size={16} /> Address
          </label>
          <input
            type="text"
            name="address"
            value={address || user?.deliveryAddress?.address || ""}
            onChange={onChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:ring-2 focus:border-transparent focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">City</label>
          <input
            type="text"
            name="city"
            value={city || user?.deliveryAddress?.city || ""}
            onChange={onChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:ring-2 focus:border-transparent focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 flex items-center gap-2">
            <Phone size={16} /> Phone
          </label>
          <input
            type="text"
            name="phone"
            value={phone || user?.deliveryAddress?.phone || ""}
            onChange={onChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:ring-2 focus:border-transparent focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FF6B35] text-white py-3 rounded-lg hover:bg-[#ff5722] transition"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}

export default EditProfile;
