import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css";

const API_URL = "https://clothing-store-uq04.onrender.com/api/products";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleAddProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.description ||
      !newProduct.imageUrl
    ) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const response = await axios.post(API_URL, newProduct, {
        headers: { "Content-Type": "application/json" },
      });
      setProducts([...products, response.data]);
      setNewProduct({ name: "", price: "", description: "", imageUrl: "" });
    } catch (error) {
      console.error("Error adding product:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/${editingProduct._id}`,
        editingProduct
      );
      setProducts(
        products.map((product) =>
          product._id === editingProduct._id ? response.data : product
        )
      );
      setEditingProduct(null); // Reset editingProduct state
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div class="container">
      <h1 class="title">Admin Page</h1>
      <div class="form-container">
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="text"
            class="form-control"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <button class="btn btn-primary" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
        <div class="form-group">
          <textarea
            class="form-control"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          ></textarea>
          <input
            type="text"
            class="form-control"
            placeholder="Image URL"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageUrl: e.target.value })
            }
          />
        </div>
      </div>

      <div class="product-list">
        {products.map((product) => (
          <div class="product-card" key={product._id}>
            {editingProduct && editingProduct._id === product._id ? (
              <>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Name"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                />
                <div class="row">
                  <div class="col">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Price"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div class="col">
                    <textarea
                      class="form-control"
                      placeholder="Description"
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div class="col">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Image URL"
                      value={editingProduct.imageUrl}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          imageUrl: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div class="btn-group">
                  <button class="btn btn-primary" onClick={handleSaveEdit}>
                    Save
                  </button>
                  <button
                    class="btn btn-danger"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 class="product-name">{product.name}</h3>
                <p class="product-description">{product.description}</p>
                <p class="product-price">${product.price}</p>
                <div class="btn-group">
                  <button
                    class="btn btn-primary"
                    onClick={() => handleEditProduct(product)}
                  >
                    Update
                  </button>
                  <button
                    class="btn btn-danger"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
