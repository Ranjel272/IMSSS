import React, { useState, useEffect } from "react";
import "./BoysLeatherShoes.css";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import EditDescriptionModal from "./EditDescriptionModal";

const BoysLeatherShoes = () => {
  // Similar to the others but for boys
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addProduct = (product) => setProducts([...products, product]);

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const deleteProduct = () => {
    setProducts(products.filter((p) => p !== productToDelete));
    closeDeleteModal();
  };

  const openEditDescription = (product) => {
    setProductToEdit({ product, category: "boys" });
    setIsDescriptionModalOpen(true);
    setIsProductFormOpen(false);
  };

  const openEditProduct = (product) => {
    setProductToEdit({ product, category: "boys" });
    setIsProductFormOpen(true);
    setIsDescriptionModalOpen(false);
  };

  const closeEditProduct = () => {
    setProductToEdit(null);
    setIsProductFormOpen(false);
  };

  const closeEditDescription = () => {
    setProductToEdit(null);
    setIsDescriptionModalOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/ims/products/Boys-Leather-Shoes");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        const uniqueProducts = data.filter((product, index, self) => 
          index === self.findIndex((p) => (
            p.productName === product.productName &&
            p.productDescription === product.productDescription &&
            p.unitPrice === product.unitPrice
          ))
        );

        setProducts(uniqueProducts);
      } catch (error) {
        console.error(error);
        setError("Could not fetch products. Please try again later.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="boys-catalog-products-container">
      <h1 className="boys-catalog-header">Boys’ Leather Shoes</h1>
      <button className="boys-catalog-add-product-btn" onClick={openModal}>
        Add Product
      </button>

      <AddProductForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={addProduct}
      />

      {error && <div className="error-message">{error}</div>}

      <div className="boys-catalog-products-grid">
        {products.map((product, index) => (
          <div key={index} className="boys-catalog-product-card">
            <img
              src={product.image_path}
              alt={product.productName}
              onClick={() => openEditProduct(product)}
            />
            <div className="boys-catalog-product-info">
              <h3>{product.productName}</h3>
              <p>{product.productDescription}</p>
              <p>Price: ${product.unitPrice}</p>
            </div>

            <div className="boys-catalog-product-actions">
              <button
                className="boys-catalog-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditDescription(product);
                }}
              >
                Edit
              </button>
              <button
                className="boys-catalog-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal(product);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isProductFormOpen && productToEdit && (
        <EditProductForm
          product={productToEdit.product}
          category={productToEdit.category}
          onClose={closeEditProduct}
        />
      )}

      {isDescriptionModalOpen && productToEdit && (
        <EditDescriptionModal
          product={productToEdit.product}
          category={productToEdit.category}
          image={productToEdit.product.image_path}
          onClose={closeEditDescription}
        />
      )}

      {isDeleteModalOpen && (
        <div className="boys-catalog-modal-overlay">
          <div className="boys-catalog-modal-content">
            <button
              className="boys-catalog-close-btn"
              onClick={closeDeleteModal}
            >
              &times;
            </button>
            <h2>
              Are you sure you want to delete "{productToDelete?.productName}"?
            </h2>
            <div className="boys-catalog-modal-actions">
              <button
                className="boys-catalog-confirm-btn"
                onClick={deleteProduct}
              >
                Yes
              </button>
              <button
                className="boys-catalog-cancel-btn"
                onClick={closeDeleteModal}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoysLeatherShoes;
