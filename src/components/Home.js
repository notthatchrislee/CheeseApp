import React, { useEffect, useState } from 'react';

const Home = () => {
  const [cheeses, setCheeses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCheeses = () => {
    setLoading(true);
    fetch('/api/cheese')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch cheeses');
        return res.json();
      })
      .then(data => {
        setCheeses(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCheeses();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/cheese/${id}`, { method: 'DELETE' });
    fetchCheeses();
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Welcome to the Cheese App!</h1>
      <p>Use the navigation above to add a new cheese or view cheeses.</p>
      <h2 className="mb-3">Cheese List</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {cheeses.map(cheese => (
          <li key={cheese.id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2 rounded">
            <span>
              <strong>{cheese.name}</strong>: {cheese.description}
              <span className="ms-2 text-secondary"> | Country: {cheese.country} | Rating: {cheese.rating}</span>
              {cheese.categories && cheese.categories.length > 0 && (
                <span className="ms-2 text-secondary"> | Categories: {cheese.categories.map(cat => cat.name).join(', ')}</span>
              )}
            </span>
            <span className="mt-2 mt-md-0">
              <button className="btn btn-danger btn-sm me-2 rounded" onClick={() => handleDelete(cheese.id)}>Delete</button>
              <button className="btn btn-primary btn-sm rounded" onClick={() => window.location.href = `/edit-cheese/${cheese.id}`}>Edit</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
