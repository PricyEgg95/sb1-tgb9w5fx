import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format } from 'date-fns';
import { Person } from '../models/types';
import { useAuth } from '../contexts/AuthContext';

export default function PeopleList() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    async function loadPeople() {
      if (!currentUser) return;
      
      try {
        const peopleRef = collection(db, 'people');
        const q = query(
          peopleRef,
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const peopleData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Person));
        
        // Sort people locally
        const sortedPeople = peopleData.sort((a, b) => {
          const lastNameCompare = a.lastName.localeCompare(b.lastName);
          if (lastNameCompare !== 0) return lastNameCompare;
          return a.firstName.localeCompare(b.firstName);
        });
        
        setPeople(sortedPeople);
      } catch (error) {
        console.error('Error loading people:', error);
        setError('Failed to load people');
      } finally {
        setLoading(false);
      }
    }

    loadPeople();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen coffee-pattern flex items-center justify-center">
        <div className="text-xl text-[var(--color-espresso)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen coffee-pattern">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-espresso)]">Family Tree</h1>
          <div className="flex gap-4">
            <Link
              to="/person/new"
              className="bg-[var(--color-espresso)] text-white px-4 py-2 rounded hover:bg-[var(--color-mocha)] transition-colors duration-200"
            >
              Add Person
            </Link>
            <button
              onClick={handleLogout}
              className="bg-[var(--color-cream)] text-[var(--color-espresso)] px-4 py-2 rounded hover:bg-[var(--color-latte)] transition-colors duration-200"
            >
              Log Out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {people.map((person) => (
            <Link
              key={person.id}
              to={`/person/${person.id}`}
              className="relationship-card hover:cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {person.photoUrl ? (
                  <img
                    src={person.photoUrl}
                    alt={`${person.firstName} ${person.lastName}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-cream)]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[var(--color-cream)] flex items-center justify-center">
                    <span className="text-2xl text-[var(--color-espresso)]">
                      {person.firstName[0]}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-espresso)]">
                    {person.firstName} {person.lastName}
                  </h2>
                  <p className="text-[var(--color-mocha)]">
                    Born: {format(new Date(person.birthDate), 'MMMM d, yyyy')}
                  </p>
                  {person.relationType && (
                    <span className="text-sm text-[var(--color-cappuccino)]">
                      {person.relationType}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {people.length === 0 && !loading && (
          <div className="text-center py-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-[var(--color-cream)]">
            <p className="text-[var(--color-mocha)]">No people added yet.</p>
            <Link
              to="/person/new"
              className="text-[var(--color-espresso)] hover:text-[var(--color-mocha)] underline mt-2 inline-block"
            >
              Add your first family member
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}