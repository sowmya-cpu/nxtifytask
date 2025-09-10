import React, { useState, useEffect } from 'react';

export default function EditProductForm({ product, onCancel, onSave }) {
  const [form, setForm] = useState({ name:'', price:'', description:'', category:'' });
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      name: product?.name ?? '',
      price: product?.price ?? '',
      description: product?.description ?? '',
      category: product?.category ?? ''
    });
  }, [product]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || form.price === '') {
      setError('Name and price are required');
      return;
    }
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Price must be a non-negative number');
      return;
    }
    setError('');
    // pass numeric price to backend
    onSave(product._id, { ...form, price: priceNum });
  };

  return (
    <>
   <h3 style={{ textAlign: "center" }}>Edit</h3>

    <form className="add-form" onSubmit={handleSubmit} >
  
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <div style={{ display: 'flex', gap: '8px' ,}}>
        <button type="submit" style={{marginleft:'4px'}}>Save</button>
        <button type="button" onClick={onCancel} style={{ background: '#ccc' }}>Cancel</button>
      </div>
      {error && <div className="error">{error}</div>}
    
    </form>
    
    </>
  );
}
