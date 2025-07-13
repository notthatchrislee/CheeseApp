import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditCheese = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    // Fetch cheese data
    fetch(`/api/cheese/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch cheese');
        return res.json();
      })
      .then(data => {
        setName(data.name);
        setDescription(data.description);
        setCountry(data.country || '');
        setRating(data.rating || 0);
        setSelectedCategories(data.categoryIds || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
    // Fetch all categories
    fetch('/api/category')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/cheese/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, country, rating, categoryIds: selectedCategories }),
    });
    navigate('/');
  };

  const handleCategoryChange = (e) => {
    const options = Array.from(e.target.options);
    setSelectedCategories(options.filter(o => o.selected).map(o => Number(o.value)));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded  bg-white mb-4">
      <h2 className="mb-3">Edit Cheese</h2>
      <div className="mb-3">
        <label className="form-label">Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required className="form-control rounded" />
      </div>
      <div className="mb-3">
        <label className="form-label">Description:</label>
        <input value={description} onChange={e => setDescription(e.target.value)} required className="form-control rounded" />
      </div>
      <div className="mb-3">
        <label className="form-label">Country of Origin:</label>
        <input value={country} onChange={e => setCountry(e.target.value)} required className="form-control rounded" />
      </div>
      <div className="mb-3">
        <label className="form-label">Rating:</label>
        <div>
          {[1,2,3,4,5].map(star => (
            <span
              key={star}
              style={{ cursor: 'pointer', color: star <= rating ? '#ffc107' : '#e4e5e9', fontSize: '1.5rem' }}
              onClick={() => setRating(star)}
              onMouseOver={() => setRating(star)}
              onMouseOut={() => setRating(rating)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Categories:</label>
        <select multiple value={selectedCategories.map(String)} onChange={handleCategoryChange} className="form-select rounded" style={{height: '120px'}}>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {selectedCategories.length > 0 && (
          <div className="mt-2">
            <strong>Selected Categories:</strong> {categories.filter(cat => selectedCategories.includes(cat.id)).map(cat => cat.name).join(', ')}
          </div>
        )}
      </div>
      <button type="submit" className="btn btn-primary cheese-btn rounded">Save</button>
    </form>
  );
};

export default EditCheese;
