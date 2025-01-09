import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, collection, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface FormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'Male' | 'Female' | 'Other';
  relationType: string;
  notes?: string;
  contactInfo?: string;
}

export default function PersonForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: 'Male',
    relationType: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.birthDate || 
        !formData.gender || !formData.relationType) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const personData = {
        ...formData,
        userId: auth.currentUser?.uid,
        createdAt: new Date().toISOString()
      };

      const docRef = doc(collection(db, 'people'));
      await setDoc(docRef, personData);

      navigate('/');
    } catch (error) {
      console.error('Error saving person:', error);
      setError('Failed to save person');
    } finally {
      setLoading(false);
    }
  }

  const inputClasses = "mt-1 block w-full rounded-md border-[var(--color-cream)] shadow-sm focus:border-[var(--color-cappuccino)] focus:ring focus:ring-[var(--color-latte)] focus:ring-opacity-50";
  const labelClasses = "block text-sm font-medium text-[var(--color-espresso)]";

  return (
    <div className="min-h-screen coffee-pattern py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-[var(--color-cream)]">
          <h1 className="text-2xl font-bold mb-6 text-[var(--color-espresso)]">Add New Person</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Birth Date *</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value as 'Male' | 'Female' | 'Other'})}
                  className={inputClasses}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Relation Type *</label>
              <select
                value={formData.relationType}
                onChange={(e) => setFormData({...formData, relationType: e.target.value})}
                className={inputClasses}
                required
              >
                <option value="">Select relation type</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Spouse">Spouse</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Grandchild">Grandchild</option>
                <option value="Aunt/Uncle">Aunt/Uncle</option>
                <option value="Niece/Nephew">Niece/Nephew</option>
                <option value="Cousin">Cousin</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Contact Information</label>
              <textarea
                value={formData.contactInfo}
                onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                className={inputClasses}
                placeholder="Phone, email, address..."
                rows={3}
              />
            </div>

            <div>
              <label className={labelClasses}>Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className={inputClasses}
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--color-espresso)] text-white px-6 py-2 rounded hover:bg-[var(--color-mocha)] disabled:bg-[var(--color-latte)] transition-colors duration-200"
              >
                {loading ? 'Saving...' : 'Add Person'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
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