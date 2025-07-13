import React, { useEffect, useState } from 'react';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/category')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/category/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  return (
    <div className="container mt-5">
      <h2>Category List</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul className="list-group">
        {categories.map(category => (
          <li key={category.id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2 rounded">
            <span>
              <strong>{category.name}</strong>
            </span>
            <span>
              <button onClick={() => handleDelete(category.id)} className="btn btn-danger btn-sm me-2 rounded">Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
