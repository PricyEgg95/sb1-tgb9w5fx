import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth, peopleCollection, relationsCollection } from '../lib/firebase';
import { format } from 'date-fns';
import { Person, RelationWithPerson } from '../models/types';
import FamilyTree from './FamilyTree';

export default function PersonDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<Person | null>(null);
  const [relations, setRelations] = useState<RelationWithPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !auth.currentUser) {
      setError('Invalid person ID or not authenticated');
      setLoading(false);
      return;
    }
    
    async function loadData() {
      try {
        setLoading(true);
        setError('');

        // Load person details
        const personRef = doc(db, 'people', id);
        const personDoc = await getDoc(personRef);
        
        if (!personDoc.exists()) {
          setError('Person not found');
          setLoading(false);
          return;
        }

        const personData = { 
          id: personDoc.id, 
          ...personDoc.data() 
        } as Person;

        // Verify user has access
        if (personData.userId !== auth.currentUser?.uid) {
          setError('You do not have permission to view this person');
          setLoading(false);
          return;
        }

        setPerson(personData);

        // Load relations
        const relationsQuery = query(
          relationsCollection, 
          where('person1Id', '==', id)
        );
        
        const relationsSnapshot = await getDocs(relationsQuery);
        
        const relationPromises = relationsSnapshot.docs.map(async (doc) => {
          try {
            const relationData = doc.data();
            const otherPersonRef = doc(db, 'people', relationData.person2Id);
            const otherPersonDoc = await getDoc(otherPersonRef);
            
            if (!otherPersonDoc.exists()) return null;
            
            return {
              id: doc.id,
              ...relationData,
              relatedPerson: {
                id: otherPersonDoc.id,
                ...otherPersonDoc.data()
              } as Person
            } as RelationWithPerson;
          } catch (err) {
            console.error('Error loading relation:', err);
            return null;
          }
        });

        const loadedRelations = (await Promise.all(relationPromises))
          .filter((r): r is RelationWithPerson => r !== null);
          
        setRelations(loadedRelations);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load person details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen coffee-pattern flex items-center justify-center">
        <div className="text-xl text-[var(--color-espresso)]">Loading...</div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen coffee-pattern py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error || 'Person not found'}</span>
          </div>
          <Link
            to="/"
            className="text-[var(--color-espresso)] hover:text-[var(--color-mocha)] underline"
          >
            ← Back to Family Tree
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen coffee-pattern py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <Link
            to="/"
            className="text-[var(--color-espresso)] hover:text-[var(--color-mocha)]"
          >
            ← Back to Family Tree
          </Link>
          <div className="flex gap-4">
            <Link
              to={`/relation/new/${person.id}`}
              className="bg-[var(--color-espresso)] text-white px-4 py-2 rounded hover:bg-[var(--color-mocha)] transition-colors duration-200"
            >
              Add Relation
            </Link>
            <Link
              to={`/person/edit/${person.id}`}
              className="bg-[var(--color-cream)] text-[var(--color-espresso)] px-4 py-2 rounded hover:bg-[var(--color-latte)] transition-colors duration-200"
            >
              Edit Person
            </Link>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6 border border-[var(--color-cream)]">
          <div className="flex items-center gap-6 mb-6">
            {person.photoUrl ? (
              <img
                src={person.photoUrl}
                alt={`${person.firstName} ${person.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-[var(--color-cream)]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[var(--color-cream)] flex items-center justify-center">
                <span className="text-4xl text-[var(--color-espresso)]">
                  {person.firstName[0]}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-espresso)]">
                {person.firstName} {person.lastName}
              </h1>
              <p className="text-[var(--color-mocha)]">
                Born: {format(new Date(person.birthDate), 'MMMM d, yyyy')}
              </p>
              {person.deathDate && (
                <p className="text-[var(--color-mocha)]">
                  Died: {format(new Date(person.deathDate), 'MMMM d, yyyy')}
                </p>
              )}
            </div>
          </div>

          {person.contactInfo && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[var(--color-espresso)] mb-2">
                Contact Information
              </h2>
              <p className="text-[var(--color-mocha)] whitespace-pre-line">
                {person.contactInfo}
              </p>
            </div>
          )}

          {person.notes && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-espresso)] mb-2">
                Notes
              </h2>
              <p className="text-[var(--color-mocha)] whitespace-pre-line">
                {person.notes}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-[var(--color-cream)]">
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-espresso)]">Family Tree</h2>
          <FamilyTree
            person={person}
            relations={relations.map(relation => ({
              person: relation.relatedPerson,
              type: relation.relationType
            }))}
          />
        </div>
      </div>
    </div>
  );
}