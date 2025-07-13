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
          <li key={cheese.id} className="list-group-item mb-4 p-4 rounded">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              <div>
                <h3 className="mb-2" style={{fontWeight: 'bold', fontSize: '1.5rem'}}>{cheese.name}</h3>
              </div>
              <div className="mt-3 mt-md-0 d-flex gap-2">
                <button className="btn btn-danger btn-sm me-2 rounded" onClick={() => handleDelete(cheese.id)}>Delete</button>
                <button className="btn btn-primary cheese-btn btn-sm rounded" onClick={() => window.location.href = `/edit-cheese/${cheese.id}`}>Edit</button>
                <button className="btn btn-secondary btn-sm rounded" type="button" data-bs-toggle="collapse" data-bs-target={`#cheese-details-${cheese.id}`}>Details</button>
              </div>
            </div>
            <div className="collapse mt-2" id={`cheese-details-${cheese.id}`}>
              <div className="card card-body">
                <div className="mb-2 text-secondary"><span className="fw-bold">Description:</span> {cheese.description}</div>
                <div className="mb-2"><span className="fw-bold">Country:</span> {cheese.country}</div>
                <div className="mb-2"><span className="fw-bold">Rating:</span> {Array.from({length: cheese.rating}, (_, i) => '★').join('')}{Array.from({length: 5 - (cheese.rating || 0)}, (_, i) => '☆').join('')}</div>
                {cheese.categories && cheese.categories.length > 0 && (
                  <div className="mb-2 text-secondary"><span className="fw-bold">Categories:</span> {cheese.categories.map(cat => cat.name).join(', ')}</div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
