import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { query, getDocs, where, addDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth, peopleCollection, relationsCollection } from '../lib/firebase';
import { Person, Relation } from '../models/types';

export default function AddRelation() {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [relationType, setRelationType] = useState<Relation['relationType']>('Parent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPeople();
  }, []);

  async function loadPeople() {
    if (!auth.currentUser) return;
    
    try {
      const q = query(
        peopleCollection,
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const peopleData = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Person))
        .filter(person => person.id !== personId);
      setPeople(peopleData);
    } catch (error) {
      console.error('Error loading people:', error);
      setError('Failed to load people');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPerson || !relationType || !personId) {
      setError('Please select a person and relation type');
      return;
    }

    setLoading(true);
    try {
      // Get the current person's details
      const currentPersonDoc = await getDoc(doc(db, 'people', personId));
      if (!currentPersonDoc.exists()) {
        throw new Error('Current person not found');
      }

      // Create the relation
      const relationData = {
        person1Id: personId,
        person2Id: selectedPerson,
        relationType,
        createdAt: new Date().toISOString()
      };

      await addDoc(relationsCollection, relationData);

      // Create reciprocal relationship
      const reciprocalData = {
        person1Id: selectedPerson,
        person2Id: personId,
        relationType: getReciprocalRelationType(relationType),
        createdAt: new Date().toISOString()
      };

      await addDoc(relationsCollection, reciprocalData);

      navigate(`/person/${personId}`);
    } catch (error) {
      console.error('Error adding relation:', error);
      setError('Failed to add relation');
    } finally {
      setLoading(false);
    }
  }

  function getReciprocalRelationType(type: Relation['relationType']): Relation['relationType'] {
    switch (type) {
      case 'Parent':
        return 'Child';
      case 'Child':
        return 'Parent';
      case 'Spouse':
        return 'Spouse';
      case 'Sibling':
        return 'Sibling';
      default:
        return type;
    }
  }

  return (
    <div className="min-h-screen coffee-pattern py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-[var(--color-cream)]">
          <h1 className="text-2xl font-bold mb-6 text-[var(--color-espresso)]">Add Relation</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-espresso)]">
                Related Person
              </label>
              <select
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
                className="mt-1 block w-full rounded-md border-[var(--color-cream)] shadow-sm"
                required
              >
                <option value="">Select a person</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-espresso)]">
                Relation Type
              </label>
              <select
                value={relationType}
                onChange={(e) => setRelationType(e.target.value as Relation['relationType'])}
                className="mt-1 block w-full rounded-md border-[var(--color-cream)] shadow-sm"
                required
              >
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--color-espresso)] text-white px-6 py-2 rounded hover:bg-[var(--color-mocha)] disabled:bg-[var(--color-latte)] transition-colors duration-200"
              >
                {loading ? 'Adding...' : 'Add Relation'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/person/${personId}`)}
                className="bg-[var(--color-cream)] text-[var(--color-espresso)] px-6 py-2 rounded hover:bg-[var(--color-latte)] transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}