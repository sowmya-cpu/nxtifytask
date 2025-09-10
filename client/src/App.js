import React, { useState, useEffect } from 'react';
import EditProductForm from './components/EditProductForm';
import API from './api';
import AddProductForm from './components/AddProductForm';
import ProductList from './components/ProductList';
import './index.css';
import './App.css';

function App() {
  const [theme, setTheme] = useState("light");
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState("show");
  const [showDropdown, setShowDropdown] = useState(false);

  // Dynamic search states
  const [showSearch, setShowSearch] = useState(false);
  const [tempSearch, setTempSearch] = useState('');

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const fetchProducts = async () => {
    try {
      const res = await API.get(`/?sort=${sortOrder}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addProductToState = (product) => {
    setProducts(prev => [product, ...prev]);
    setPage("show");
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const res = await API.put(`/${id}`, updatedData);
      setProducts(prev => prev.map(p => p._id === id ? res.data : p));
      setEditing(null);
      setPage("show");
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const deleteProduct = async (id) => {
    const ok = window.confirm('Are you sure you want to delete this product?');
    if (!ok) return;
    try {
      await API.delete(`/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sortOrder]);

  // Filtered products based on search
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle search submit
  const handleSearch = () => {
    setSearch(tempSearch);
    setTempSearch('');
    setShowSearch(false);
  };

  return (
    <div className={`app ${theme}`}>
      <nav className="navbar">
        <h1 className="typing">Product Management </h1>
        <div className="nav-links">
          <button className="glow-button" onClick={() => setPage("show")}>Show Products</button>
          <button className="glow-button" onClick={() => setPage("add")}>Add Product</button>
          <button className="mode-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>

      <div className="content">
        {page === "add" && (
          <div className="container">
            <AddProductForm onAdd={addProductToState} />
            <div className="drops">
              <div className="drop drop-1"></div>
              <div className="drop drop-2"></div>
              <div className="drop drop-3"></div>
              <div className="drop drop-4"></div>
              <div className="drop drop-5"></div>
            </div>
          </div>
        )}

        {page === "edit" && editing &&
          <div className="container">
            <EditProductForm
              product={editing}
              onCancel={() => { setEditing(null); setPage("show"); }}
              onSave={updateProduct}
            />
            <div className="drops">
              <div className="drop drop-1"></div>
              <div className="drop drop-2"></div>
              <div className="drop drop-3"></div>
              <div className="drop drop-4"></div>
              <div className="drop drop-5"></div>
            </div>
          </div>
        }

        {page === "show" &&
          <>
            <div className="controls">
              <div className="left-controls">
                {!showSearch && (
                  <button className="glow-button" onClick={() => setShowSearch(true)}>
                    🔍 Search
                  </button>
                )}
                {showSearch && (
                  <div className="search-wrapper">
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={tempSearch}
                      onChange={(e) => setTempSearch(e.target.value)}
                      className="glass-button-input"
                    />
                    <button
                      className="glow-button"
                      onClick={handleSearch}
                    >
                      🔍
                    </button>
                  </div>
                )}
              </div>

              <div className="right-controls">
                <div className="dropdown">
                  <button
                    className="glow-button"
                    onClick={() => setShowDropdown(prev => !prev)}
                  >
                    Price ▼
                  </button>
                  {showDropdown && (
                    <div className="dropdown-content">
                      <button onClick={() => { setSortOrder("asc"); setShowDropdown(false); }}>Low → High</button>
                      <button onClick={() => { setSortOrder("desc"); setShowDropdown(false); }}>High → Low</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ProductList
              products={filtered}
              onDelete={deleteProduct}
              onEdit={(p) => { setEditing(p); setPage("edit"); }}
            />
          </>
        }
      </div>
    </div>
  );
}

export default App;