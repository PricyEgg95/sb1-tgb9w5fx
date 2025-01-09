import React from 'react';

export default function FamilyTreeLegend() {
  const relationships = [
    { type: 'Parent', class: 'legend-dot-parent' },
    { type: 'Child', class: 'legend-dot-child' },
    { type: 'Spouse', class: 'legend-dot-spouse' },
    { type: 'Sibling', class: 'legend-dot-sibling' }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-[var(--color-cream)]">
      <h3 className="font-medium mb-2 text-[var(--color-espresso)]">Family Connections</h3>
      <div className="grid grid-cols-2 gap-3">
        {relationships.map(({ type, class: dotClass }) => (
          <div key={type} className="legend-item">
            <div className={`legend-dot ${dotClass}`} />
            <span>{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}