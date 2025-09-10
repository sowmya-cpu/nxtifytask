import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products, onDelete, onEdit }) {
  if (!products || products.length === 0) return <p className="no-items">No products found.</p>;

  return (
    <div className="grid">
      {products.map((p, index) => (
        <ProductCard
          key={p._id}
          product={p}
          onDelete={() => onDelete(p._id)}
          onEdit={onEdit}
          style={{ animationDelay: `${index * 0.1}s` }} // stagger animation
        />
      ))}
    </div>
  );
}
