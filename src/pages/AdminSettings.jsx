import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AdminLayout from "../components/AdminLayout";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import api from "../lib/api";

export default function AdminSettings({ navigate, onLogout }) {
  const { user } = useApp();
  const [deliveryFee, setDeliveryFee] = useState(2.5);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const adminEmail = user?.email || "admin@cravings.com";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/settings");
        if (!mounted) return;
        setDeliveryFee(res.data.deliveryFee ?? 2.5);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/settings/delivery-fee", {
        deliveryFee: Number(deliveryFee),
      });
      // optional: show toast
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return _jsx(AdminLayout, {
    activeNav: "admin-settings",
    navigate: navigate,
    onLogout: onLogout,
    pageTitle: "Settings",
    children: _jsxs("div", {
      className: "max-w-2xl space-y-4",
      children: [
        _jsxs("div", {
          className: "bg-white rounded-2xl border border-stone-200 p-6",
          children: [
            _jsx("h2", {
              className: "font-semibold text-stone-900 mb-4",
              style: { fontFamily: "var(--font-display)" },
              children: "Restaurant settings",
            }),
            _jsx("div", {
              className: "space-y-4",
              children: [
                {
                  label: "Restaurant name",
                  value: "Cravings Kitchen",
                  type: "text",
                },
                { label: "Contact email", value: adminEmail, type: "email" },
                {
                  label: "Contact phone",
                  value: "+234 800 CRAVINGS",
                  type: "tel",
                },
              ].map(({ label, value, type }) => {
                const fieldValue =
                  label === "Contact email" ? adminEmail : value;
                return _jsxs(
                  "div",
                  {
                    children: [
                      _jsx("label", {
                        className:
                          "block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide",
                        children: label,
                      }),
                      _jsx("input", {
                        type: type,
                        defaultValue: fieldValue,
                        className:
                          "w-full h-11 px-4 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-colors",
                      }),
                    ],
                  },
                  label,
                );
              }),
            }),
            _jsxs("div", {
              className: "mt-4",
              children: [
                _jsx("label", {
                  className:
                    "block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide",
                  children: "Delivery fee (₦)",
                }),
                _jsx("input", {
                  type: "number",
                  value: deliveryFee,
                  onChange: (e) => setDeliveryFee(e.target.value),
                  className:
                    "w-full h-11 px-4 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-colors",
                }),
                _jsx("div", {
                  className: "mt-4 flex items-center gap-3",
                  children: [
                    _jsx("button", {
                      onClick: handleSave,
                      disabled: saving,
                      className:
                        "mt-5 h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors",
                      children: saving ? "Saving..." : "Save settings",
                    }),
                    _jsx("span", {
                      className: "text-sm text-stone-500",
                      children: loading
                        ? "Loading..."
                        : "Current value will apply to delivery orders",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        _jsxs("div", {
          className: "bg-white rounded-2xl border border-stone-200 p-6",
          children: [
            _jsx("h2", {
              className: "font-semibold text-stone-900 mb-2",
              children: "Danger zone",
            }),
            _jsx("p", {
              className: "text-sm text-stone-500 mb-4",
              children: "These actions affect all users and cannot be undone.",
            }),
            _jsx("button", {
              className:
                "h-10 px-5 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors",
              children: "Clear all orders (demo)",
            }),
          ],
        }),
      ],
    }),
  });
}
