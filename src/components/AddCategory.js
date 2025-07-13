import React, { useState } from 'react';

const AddCategory = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    alert('Category added!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded bg-white mb-4">
      <h2 className="mb-3">Add Category</h2>
      <div className="mb-3">
        <label className="form-label">Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required className="form-control rounded" />
      </div>
      <button type="submit" className="btn btn-primary rounded">Add</button>
    </form>
  );
};

export default AddCategory;
