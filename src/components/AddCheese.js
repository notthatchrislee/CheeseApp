import React, { useState } from 'react';

const AddCheese = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/cheese', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, country, rating }),
    });
    setName('');
    setDescription('');
    setCountry('');
    setRating(0);
    alert('Cheese added!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded bg-white mb-4">
      <h2 className="mb-3">Add Cheese</h2>
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
      <button type="submit" className="btn btn-primary cheese-btn rounded">Add</button>
    </form>
  );
};

export default AddCheese;
