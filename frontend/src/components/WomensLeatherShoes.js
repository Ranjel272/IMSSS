import React, { useState, useEffect } from "react";
import "./WomensLeatherShoes.css";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import EditDescriptionModal from "./EditDescriptionModal";

const WomensLeatherShoes = () => {
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
    setProductToEdit({ product, category: "women" });
    setIsDescriptionModalOpen(true);
    setIsProductFormOpen(false);
  };

  const openEditProduct = (product) => {
    setProductToEdit({ product, category: "women" });
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
        const response = await fetch("/ims/products/Womens-Leather-Shoes");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        // Remove duplicates based on productName, productDescription, and unitPrice
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
    <div className="womens-catalog-products-container">
      <h1 className="womens-catalog-header">Women’s Leather Shoes</h1>
      <button className="womens-catalog-add-product-btn" onClick={openModal}>
        Add Product
      </button>

      <AddProductForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={addProduct}
      />

      {error && <div className="error-message">{error}</div>}

      <div className="womens-catalog-products-grid">
        {products.map((product, index) => (
          <div key={index} className="womens-catalog-product-card">
            <img
              src={product.image_path}
              alt={product.productName}
              onClick={() => openEditProduct(product)}
            />
            <div className="womens-catalog-product-info">
              <h3>{product.productName}</h3>
              <p>{product.productDescription}</p>
              <p>Price: ${product.unitPrice}</p>
            </div>

            <div className="womens-catalog-product-actions">
              <button
                className="womens-catalog-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditDescription(product);
                }}
              >
                Edit
              </button>
              <button
                className="womens-catalog-delete-btn"
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
        <div className="womens-catalog-modal-overlay">
          <div className="womens-catalog-modal-content">
            <button
              className="womens-catalog-close-btn"
              onClick={closeDeleteModal}
            >
              &times;
            </button>
            <h2>
              Are you sure you want to delete "{productToDelete?.productName}"?
            </h2>
            <div className="womens-catalog-modal-actions">
              <button
                className="womens-catalog-confirm-btn"
                onClick={deleteProduct}
              >
                Yes
              </button>
              <button
                className="womens-catalog-cancel-btn"
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

export default WomensLeatherShoes;
