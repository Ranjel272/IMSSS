import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditDescriptionModal.css";

const EditDescriptionModal = ({
  product = {},
  productName,
  productDescription,
  unitPrice,
  category,
  onClose,
  onSave,
}) => {
  const [editedProduct, setEditedProduct] = useState({
    productName: product.productName || productName || "",
    productDescription: product.productDescription || productDescription || "",
    unitPrice: product.unitPrice || unitPrice || 0,
    category: product.category || category || "",
    image: product.image_path || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedProduct({
      productName: product.productName || productName || "",
      productDescription: product.productDescription || productDescription || "",
      unitPrice: product.unitPrice || unitPrice || 0,
      category: product.category || category || "",
      image: product.image_path || "",
    });
  }, [product, productName, productDescription, unitPrice, category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProduct((prevState) => ({
          ...prevState,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (
      !editedProduct.productName ||
      !editedProduct.productDescription ||
      !editedProduct.unitPrice ||
      !editedProduct.category
    ) {
      alert("Please fill out all fields.");
      return;
    }

    const updatedProduct = {
      productName: product.productName,
      productDescription: product.productDescription,
      category: category,
      unitPrice: product.unitPrice,
      newProductName: editedProduct.productName.trim(),
      newProductDescription: editedProduct.productDescription.trim(),
      newCategory: editedProduct.category.trim(),
      newUnitPrice: parseFloat(editedProduct.unitPrice),
      newImage: editedProduct.image,
    };

    setLoading(true);
    try {
      const response = await axios.put(
        `/ims/products/update/name/description/size/category/image`,
        updatedProduct,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Server Response:", response.data);
      onSave(updatedProduct);
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-description-modal-overlay">
      <div className="edit-description-modal-content">
        <button className="edit-description-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Product</h2>
        <div className="edit-description-form">
          <label>
            Image:
            <div className="image-upload-container">
              {editedProduct.image && (
                <img
                  src={editedProduct.image}
                  alt="Product"
                  className="edit-product-image"
                />
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </label>
          <label>
            Product Name:
            <input
              type="text"
              name="productName"
              value={editedProduct.productName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="productDescription"
              value={editedProduct.productDescription}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="unitPrice"
              value={editedProduct.unitPrice}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={editedProduct.category}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDescriptionModal;
