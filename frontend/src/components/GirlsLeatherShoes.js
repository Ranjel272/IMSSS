import React, { useState, useEffect } from "react";
import "./GirlsLeatherShoes.css";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import EditDescriptionModal from "./EditDescriptionModal";

const GirlsLeatherShoes = () => {
  // Similar logic as the Women's catalog, change category to "girls"
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
    setProductToEdit({ product, category: "girls" });
    setIsDescriptionModalOpen(true);
    setIsProductFormOpen(false);
  };

  const openEditProduct = (product) => {
    setProductToEdit({ product, category: "girls" });
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
        const response = await fetch("/ims/products/Girls-Leather-Shoes");
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
    <div className="girls-catalog-products-container">
      <h1 className="girls-catalog-header">Girls’ Leather Shoes</h1>
      <button className="girls-catalog-add-product-btn" onClick={openModal}>
        Add Product
      </button>

      <AddProductForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={addProduct}
      />

      {error && <div className="error-message">{error}</div>}

      <div className="girls-catalog-products-grid">
        {products.map((product, index) => (
          <div key={index} className="girls-catalog-product-card">
            <img
              src={product.image_path}
              alt={product.productName}
              onClick={() => openEditProduct(product)}
            />
            <div className="girls-catalog-product-info">
              <h3>{product.productName}</h3>
              <p>{product.productDescription}</p>
              <p>Price: ₱{product.unitPrice}</p>
            </div>

            <div className="girls-catalog-product-actions">
              <button
                className="girls-catalog-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditDescription(product);
                }}
              >
                Edit
              </button>
              <button
                className="girls-catalog-delete-btn"
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
        <div className="girls-catalog-modal-overlay">
          <div className="girls-catalog-modal-content">
            <button
              className="girls-catalog-close-btn"
              onClick={closeDeleteModal}
            >
              &times;
            </button>
            <h2>
              Are you sure you want to delete "{productToDelete?.productName}"?
            </h2>
            <div className="girls-catalog-modal-actions">
              <button
                className="girls-catalog-confirm-btn"
                onClick={deleteProduct}
              >
                Yes
              </button>
              <button
                className="girls-catalog-cancel-btn"
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

export default GirlsLeatherShoes;
