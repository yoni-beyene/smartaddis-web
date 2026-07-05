interface Service {
  id: string;
  type: string;
  name: string;
  description?: string;
}

interface ServiceCardProps {
  service: Service;
  emoji: string;
  isExpanded: boolean;
  onToggle: () => void;
  categoryColor: string;
}

export default function ServiceCard({
  service,
  emoji,
  isExpanded,
  onToggle,
  categoryColor,
}: ServiceCardProps) {
  // Expanded state: card layout
  if (isExpanded) {
    return (
      <div
        className={`bg-white border-2 ${categoryColor} p-4 rounded-lg flex items-start gap-3 transition-all duration-300`}
      >
        {/* Emoji */}
        <span className="text-2xl flex-shrink-0">{emoji}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm text-forest-ink">{service.name}</h3>
            {/* Close button */}
            <button
              type="button"
              onClick={onToggle}
              aria-label={`Collapse ${service.name}`}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {service.description ? service.description : 'No additional information'}
          </p>
        </div>
      </div>
    );
  }

  // Collapsed state: pill layout
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Expand ${service.name}`}
      className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 hover:scale-105 transition-colors transition-transform duration-300 w-full"
    >
      {/* Emoji */}
      <span className="text-base flex-shrink-0">{emoji}</span>

      {/* Name */}
      <span className="text-sm text-gray-600 truncate text-left">{service.name}</span>
    </button>
  );
}
