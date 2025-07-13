import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddCheese from './components/AddCheese';
import Home from './components/Home';
import AddCategory from './components/AddCategory';
import CategoryList from './components/CategoryList';
import EditCheese from './components/EditCheese';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-cheese" element={<AddCheese />} />
          <Route path="/edit-cheese/:id" element={<EditCheese />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/categories" element={<CategoryList />} />
          {/* Add other routes here */}
        </Routes>
        <Footer />
      </div>
    </Router>

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
