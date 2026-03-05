import React from "react";
import { Sparkles, Shield, BookCopy } from "lucide-react";
import { LANDING_THEME } from "../../constants/theme-landing";

export function WhyChooseUs() {
  const features = [
    {
      title: "AI Magic",
      description:
        "Our AI weaves unique tales tailored to your child's specific interests and curiosities.",
      icon: Sparkles,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      title: "Safe & Kid-Friendly",
      description:
        "Built-in filters ensure every generated story is appropriate, educational, and positive.",
      icon: Shield,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Endless Stories",
      description:
        "The library never ends, with millions of possible character and theme combinations.",
      icon: BookCopy,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

  return (
    <section
      className={`py-20 ${LANDING_THEME.colors.background.transparent} relative z-10`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={`${LANDING_THEME.typography.size.h2} ${LANDING_THEME.typography.weight.heading} ${LANDING_THEME.colors.text.heading} mb-4 tracking-tight`}
          >
            Why Choose Us
          </h2>
          <p
            className={`${LANDING_THEME.typography.size.subtitle} ${LANDING_THEME.colors.text.subtitle}`}
          >
            Designed with parents in mind and powered by advanced AI to provide
            a safe, creative environment.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-[2rem] border border-white/60 bg-transparent backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col items-start"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${feature.iconBg}`}
                >
                  <Icon
                    className={`w-7 h-7 ${feature.iconColor}`}
                    strokeWidth={2.5}
                  />
                </div>

                <h3
                  className={`text-xl ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.heading} mb-3`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`${LANDING_THEME.colors.text.subtitle} leading-relaxed`}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
