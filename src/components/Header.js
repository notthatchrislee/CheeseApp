import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div>
            <nav>
                <Link to="/" className="btn btn-primary btn-sm rounded m-2">Home</Link>
                <Link to="/add-cheese" className="btn btn-primary btn-sm rounded m-2">Add Cheese</Link> 
                <Link to="/add-category" className="btn btn-primary btn-sm rounded m-2">Add Category</Link> 
                <Link to="/categories" className="btn btn-primary btn-sm rounded m-2">Category List</Link>
            </nav>
        </div>
    )
}

export default Header