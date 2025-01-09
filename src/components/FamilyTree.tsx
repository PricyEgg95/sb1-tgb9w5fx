import React from 'react';
import { Person } from '../models/types';
import { useNavigate } from 'react-router-dom';
import FamilyTreeLegend from './FamilyTreeLegend';

interface TreeNodeProps {
  person: Person;
  relations?: Array<{
    person: Person;
    type: string;
  }>;
}

export default function FamilyTree({ person, relations = [] }: TreeNodeProps) {
  const navigate = useNavigate();
  
  const familyGroups = {
    parents: relations.filter(r => r.type === 'Parent'),
    children: relations.filter(r => r.type === 'Child'),
    spouses: relations.filter(r => r.type === 'Spouse'),
    siblings: relations.filter(r => r.type === 'Sibling')
  };

  const PersonCard = ({ person, type }: { person: Person; type?: string }) => (
    <div
      className={`relationship-card relationship-card-${type?.toLowerCase()}`}
      onClick={() => navigate(`/person/${person.id}`)}
    >
      {/* Steam Animation Elements */}
      <div className="steam" />
      <div className="steam" />
      <div className="steam" />
      
      <div className="flex items-center gap-3 relative">
        {person.photoUrl ? (
          <img
            src={person.photoUrl}
            alt={`${person.firstName} ${person.lastName}`}
            className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-cream)]"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[var(--color-cream)] flex items-center justify-center">
            <span className="text-[var(--color-espresso)] text-lg font-medium">
              {person.firstName[0]}
            </span>
          </div>
        )}
        <div>
          <div className="font-medium text-[var(--color-espresso)]">
            {person.firstName} {person.lastName}
          </div>
          {type && (
            <div className="text-sm text-[var(--color-mocha)]">
              {type}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 coffee-pattern p-6 rounded-xl">
      <div className="grid gap-8">
        {/* Parents Section */}
        {familyGroups.parents.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-[var(--color-espresso)]">Parents</h3>
            <div className="grid grid-cols-2 gap-4">
              {familyGroups.parents.map(({ person: parent }) => (
                <PersonCard key={parent.id} person={parent} type="Parent" />
              ))}
            </div>
          </div>
        )}

        {/* Current Person & Spouse Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-[var(--color-espresso)]">Current Person & Spouse</h3>
          <div className="grid grid-cols-2 gap-4">
            <PersonCard person={person} />
            {familyGroups.spouses.map(({ person: spouse }) => (
              <PersonCard key={spouse.id} person={spouse} type="Spouse" />
            ))}
          </div>
        </div>

        {/* Siblings Section */}
        {familyGroups.siblings.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-[var(--color-espresso)]">Siblings</h3>
            <div className="grid grid-cols-2 gap-4">
              {familyGroups.siblings.map(({ person: sibling }) => (
                <PersonCard key={sibling.id} person={sibling} type="Sibling" />
              ))}
            </div>
          </div>
        )}

        {/* Children Section */}
        {familyGroups.children.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-[var(--color-espresso)]">Children</h3>
            <div className="grid grid-cols-2 gap-4">
              {familyGroups.children.map(({ person: child }) => (
                <PersonCard key={child.id} person={child} type="Child" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-8">
        <FamilyTreeLegend />
      </div>
    </div>
  );
}