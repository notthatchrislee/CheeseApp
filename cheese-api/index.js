// SQLite API for storing cheese data
// cheese-api/index.js

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const dbPath = path.resolve(__dirname, 'cheese.db');
const db = new sqlite3.Database(dbPath);

app.use(bodyParser.json());
app.use(cors());

// Create table if not exists
const createTable = () => {
  db.run(`CREATE TABLE IF NOT EXISTS cheese (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    country TEXT,
    rating INTEGER
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS cheese_category (
    cheese_id INTEGER,
    category_id INTEGER,
    PRIMARY KEY (cheese_id, category_id),
    FOREIGN KEY (cheese_id) REFERENCES cheese(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
  )`);
};
createTable();

// Auto-migrate cheese table to add country and rating columns if missing
const migrateCheeseTable = () => {
  db.get("PRAGMA table_info(cheese)", (err, columns) => {
    if (err) return;
    const colNames = Array.isArray(columns) ? columns.map(c => c.name) : [];
    if (!colNames.includes('country')) {
      db.run('ALTER TABLE cheese ADD COLUMN country TEXT');
    }
    if (!colNames.includes('rating')) {
      db.run('ALTER TABLE cheese ADD COLUMN rating INTEGER');
    }
  });
};
migrateCheeseTable();

// Add cheese
app.post('/api/cheese', (req, res) => {
  const { name, description, country, rating } = req.body;
  db.run(
    'INSERT INTO cheese (name, description, country, rating) VALUES (?, ?, ?, ?)',
    [name, description, country, rating],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, name, description, country, rating });
    }
  );
});

// Get all cheese (with categories)
app.get('/api/cheese', (req, res) => {
  db.all('SELECT * FROM cheese', [], (err, cheeses) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const cheeseIds = cheeses.map(c => c.id);
    if (cheeseIds.length === 0) return res.json([]);
    db.all('SELECT cheese_category.cheese_id, category.id as category_id, category.name FROM cheese_category JOIN category ON cheese_category.category_id = category.id WHERE cheese_category.cheese_id IN (' + cheeseIds.map(() => '?').join(',') + ')', cheeseIds, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const cheeseMap = {};
      cheeses.forEach(c => cheeseMap[c.id] = { ...c, categories: [] });
      rows.forEach(row => {
        cheeseMap[row.cheese_id].categories.push({ id: row.category_id, name: row.name });
      });
      res.json(Object.values(cheeseMap));
    });
  });
});

// Get cheese by id (with categories)
app.get('/api/cheese/:id', (req, res) => {
  db.get('SELECT * FROM cheese WHERE id = ?', [req.params.id], (err, cheese) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!cheese) return res.status(404).json({ error: 'Not found' });
    db.all('SELECT category_id FROM cheese_category WHERE cheese_id = ?', [req.params.id], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      cheese.categoryIds = rows.map(r => r.category_id);
      res.json(cheese);
    });
  });
});

// Update cheese by id and its categories
app.put('/api/cheese/:id', (req, res) => {
  const { name, description, country, rating, categoryIds } = req.body;
  db.run(
    'UPDATE cheese SET name = ?, description = ?, country = ?, rating = ? WHERE id = ?',
    [name, description, country, rating, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      // Update cheese_category links
      db.run('DELETE FROM cheese_category WHERE cheese_id = ?', [req.params.id], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (Array.isArray(categoryIds) && categoryIds.length > 0) {
          const stmt = db.prepare('INSERT INTO cheese_category (cheese_id, category_id) VALUES (?, ?)');
          categoryIds.forEach(catId => stmt.run(req.params.id, catId));
          stmt.finalize();
        }
        res.json({ id: Number(req.params.id), name, description, country, rating, categoryIds });
      });
    }
  );
});

// Delete cheese by id
app.delete('/api/cheese/:id', (req, res) => {
  db.run('DELETE FROM cheese WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.status(204).send();
  });
});

// Add category
app.post('/api/category', (req, res) => {
  const { name } = req.body;
  db.run(
    'INSERT INTO category (name) VALUES (?)',
    [name],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, name });
    }
  );
});

// Get all categories
app.get('/api/category', (req, res) => {
  db.all('SELECT * FROM category', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Delete category by id
app.delete('/api/category/:id', (req, res) => {
  db.run('DELETE FROM category WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.status(204).send();
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Cheese API server running on port ${PORT}`);
});
