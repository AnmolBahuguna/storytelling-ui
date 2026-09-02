import React from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LANDING_THEME } from "../../constants/theme-landing";

const SERVER_URL =
  import.meta && import.meta.env && import.meta.env.VITE_SERVER_URL
    ? import.meta.env.VITE_SERVER_URL
    : "";

export function PricingSection() {
  const navigate = useNavigate();
  const [currentTier, setCurrentTier] = React.useState(null);

  React.useEffect(() => {
    const fetchTier = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];
      
      if (!token) return;

      try {
        const response = await fetch(`${SERVER_URL}/api/payments/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentTier(data.tier);
        }
      } catch (err) {
        console.error("Failed to fetch tier", err);
      }
    };
    fetchTier();
  }, []);

  const handleSubscribe = async (tier) => {
    if (tier === "BASIC") {
       // Typically directs user to free tier dashboard or sign up
       navigate("/dashboard");
       return;
    }
    
    // Check internal cookie for auth
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

    if (!token) {
      alert("Please login or create an account first to upgrade your plan!");
      // Optionally scroll or trigger login modal if possible here
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tier })
      });
      const data = await response.json();
      
      if (response.ok && data.url) {
        // Redirection boundary: Redirects to Stripe Checkout Hosted Session
        window.location.href = data.url; 
      } else {
        alert("Payment initialization failed: " + (data.detail || "Unknown error"));
      }
    } catch(err) {
      console.error(err);
      alert("Failed to connect to the payment server. Please try again later.");
    }
  };

  const plans = [
    {
      name: "BASIC",
      price: "0",
      features: ["5 Stories per month", "Standard AI", "Web access"],
      buttonText: "Start Free",
      isPopular: false,
    },
    {
      name: "ADVENTURER",
      price: "9",
      features: [
        "Unlimited Stories",
        "Advanced AI Narrator",
        "Offline downloads",
        "Ad-free experience",
      ],
      buttonText: "Start Adventure",
      isPopular: true,
    },
    {
      name: "LEGEND",
      price: "19",
      features: [
        "Family Plan (4 users)",
        "Custom Character Avatars",
        "Hardcover Print options",
      ],
      buttonText: "Become Legend",
      isPopular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className={`py-24 ${LANDING_THEME.colors.background.transparent} relative z-10`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={`${LANDING_THEME.typography.size.h2} ${LANDING_THEME.typography.weight.heading} ${LANDING_THEME.colors.text.heading} mb-4 tracking-tight`}
          >
            Simple Pricing
          </h2>
          <p
            className={`${LANDING_THEME.typography.size.subtitle} ${LANDING_THEME.colors.text.subtitle}`}
          >
            Choose the perfect plan for your little explorer.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-[2rem] p-8 flex flex-col h-full transition-all duration-300 ${
                plan.isPopular
                  ? `bg-transparent backdrop-blur-xl border-2 border-violet-500 shadow-xl shadow-violet-500/10 lg:-mt-8 lg:mb-8 z-10`
                  : "bg-transparent backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md"
              }`}
            >
              {/* Most Popular Badge */}
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full ${LANDING_THEME.colors.accent.brandBg} text-white shadow-md`}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              {/* Card Header */}
              <div className="mb-8">
                <h3
                  className={`text-sm ${LANDING_THEME.typography.weight.bold} tracking-widest uppercase mb-4 ${plan.isPopular ? LANDING_THEME.colors.text.brand : LANDING_THEME.colors.text.light}`}
                >
                  {plan.name}
                </h3>
                <div
                  className={`flex items-baseline ${LANDING_THEME.colors.text.heading}`}
                >
                  <span
                    className={`text-5xl ${LANDING_THEME.typography.weight.heading} tracking-tight`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={`${LANDING_THEME.colors.text.light} ml-1 ${LANDING_THEME.typography.weight.subtitle}`}
                  >
                    /month
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check
                      className={`w-5 h-5 ${LANDING_THEME.colors.text.brand} mr-3 shrink-0`}
                      strokeWidth={3}
                    />
                    <span
                      className={`${LANDING_THEME.colors.text.subtitle} ${LANDING_THEME.typography.weight.subtitle}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button
                onClick={() => handleSubscribe(plan.name)}
                disabled={currentTier === plan.name}
                className={`w-full py-3 px-6 rounded-xl ${LANDING_THEME.typography.weight.bold} transition-all ${
                  currentTier === plan.name 
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500" 
                    : plan.isPopular
                      ? LANDING_THEME.components.button.primary
                      : LANDING_THEME.components.button.secondary
                }`}
              >
                {currentTier === plan.name ? "Current Plan" : plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
