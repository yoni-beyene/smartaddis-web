'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ServiceCard from './ServiceCard';

interface Service {
  id: string;
  type: string;
  name: string;
  description?: string;
}

interface CategoryConfig {
  label: string;
  color: string;
  types: string[];
}

interface ServicesSectionProps {
  services: Service[];
}

// Service emoji map
const EMOJI_MAP: Record<string, string> = {
  RESTAURANT: '🍽️',
  CAFETERIA: '☕',
  TOILET: '🚻',
  PARKING: '🅿️',
  FIRST_AID: '🏥',
  SHOP: '🛍️',
};

// Category configuration
const CATEGORIES: Record<string, CategoryConfig> = {
  dining: {
    label: 'Dining',
    color: 'border-green-200',
    types: ['RESTAURANT', 'CAFETERIA'],
  },
  facilities: {
    label: 'Facilities',
    color: 'border-blue-200',
    types: ['TOILET', 'PARKING'],
  },
  health_safety: {
    label: 'Health & Safety',
    color: 'border-red-200',
    types: ['FIRST_AID'],
  },
  shopping: {
    label: 'Shopping',
    color: 'border-purple-200',
    types: ['SHOP'],
  },
};

export default function ServicesSection({ services }: ServicesSectionProps) {
  // State to track which service is expanded per category
  const [expandedState, setExpandedState] = useState<Record<string, string | null>>(
    Object.keys(CATEGORIES).reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {} as Record<string, string | null>)
  );

  // Group services by category
  const groupedServices: Record<string, Service[]> = Object.keys(CATEGORIES).reduce(
    (acc, categoryKey) => {
      const categoryConfig = CATEGORIES[categoryKey];
      acc[categoryKey] = services.filter((service) =>
        categoryConfig.types.includes(service.type)
      );
      return acc;
    },
    {} as Record<string, Service[]>
  );

  // Handle category toggle (expand/collapse category header)
  const handleCategoryToggle = (categoryKey: string) => {
    setExpandedState((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey] ? null : (groupedServices[categoryKey][0]?.id || null),
    }));
  };

  // Handle service toggle (expand/collapse a specific service)
  const handleServiceToggle = (categoryKey: string, serviceId: string) => {
    setExpandedState((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey] === serviceId ? null : serviceId,
    }));
  };

  // Determine if a category is expanded (has any expanded service)
  const isCategoryExpanded = (categoryKey: string): boolean => {
    return expandedState[categoryKey] !== null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="font-display text-lg text-forest-ink mb-4">Services</h3>

      <div className="space-y-4">
        {Object.entries(CATEGORIES).map(([categoryKey, categoryConfig]) => {
          const categoryServices = groupedServices[categoryKey];

          // Skip empty categories
          if (categoryServices.length === 0) {
            return null;
          }

          const isExpanded = isCategoryExpanded(categoryKey);

          return (
            <div key={categoryKey}>
              {/* Category Header */}
              <button
                type="button"
                onClick={() => handleCategoryToggle(categoryKey)}
                aria-expanded={isExpanded}
                className="w-full flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-base font-semibold text-forest-ink">
                  {categoryConfig.label}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-forest-ink transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Services Container (only when category open) */}
              {isExpanded && (
                <div className="mt-2 space-y-2 pl-2">
                  {categoryServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      emoji={EMOJI_MAP[service.type] || '📌'}
                      isExpanded={expandedState[categoryKey] === service.id}
                      onToggle={() => handleServiceToggle(categoryKey, service.id)}
                      categoryColor={categoryConfig.color}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
