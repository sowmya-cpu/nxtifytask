// src/components/AddProductForm.js
import React, { useState } from 'react';
import API from '../api';

export default function AddProductForm({ onAdd }) {
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || form.price === '') {
      setError('Name and price are required');
      return;
    }
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Price must be a positive number');
      return;
    }
    setError('');
    try {
      const res = await API.post('/', { ...form, price: priceNum });
      onAdd(res.data);
      setForm({ name: '', price: '', description: '', category: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to add product');
    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit} 

>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <button type="submit" className="glow-button">Add Product</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
