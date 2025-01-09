export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'Male' | 'Female' | 'Other';
  relationType: string;
  deathDate?: string;
  photoUrl?: string;
  notes?: string;
  contactInfo?: string;
  userId: string;
}

export interface Relation {
  id: string;
  person1Id: string;
  person2Id: string;
  relationType: 'Parent' | 'Child' | 'Spouse' | 'Sibling';
  createdAt: string;
}

export interface RelationWithPerson extends Relation {
  relatedPerson: Person;
}