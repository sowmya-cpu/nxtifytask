import React from 'react';
import "./ProductCard.css";

export default function ProductCard({ product, onDelete, onEdit, style }) {
  return (
    <div className="card pop" style={style}>
      <h3>{product.name}</h3>
      <p className="price"> Price: ₹{product.price}</p>
      <p className="category">Category:{product.category}</p>
      <p className="desc">Description:{product.description}</p>
      <div className="actions">
        <button onClick={onDelete}>Delete</button>
        <button onClick={() => onEdit(product)}>Edit</button>
      </div>
    </div>
  );
}
