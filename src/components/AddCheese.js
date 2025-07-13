import React, { useState } from 'react';

const AddCheese = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [rating, setRating] = useState(1);

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
    setRating(1);
    alert('Cheese added!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded shadow bg-white mb-4">
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
        <label className="form-label">Rating (1-5):</label>
        <input type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} required className="form-control rounded" />
      </div>
      <button type="submit" className="btn btn-primary rounded">Add</button>
    </form>
  );
};

export default AddCheese;
