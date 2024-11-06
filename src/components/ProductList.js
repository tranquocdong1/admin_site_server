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
    quantity: 0, // Đặt mặc định là số 0
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
      !newProduct.imageUrl ||
      newProduct.quantity === null || // Kiểm tra xem quantity có bị null không
      newProduct.quantity < 0
    ) {
      alert("Please fill out all fields and ensure quantity is a valid number");
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        {
          ...newProduct,
          quantity: Number(newProduct.quantity), // Đảm bảo quantity là số
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setProducts([...products, response.data]);
      setNewProduct({
        name: "",
        price: "",
        description: "",
        imageUrl: "",
        quantity: 0, // Đặt lại quantity về 0 sau khi thêm
      });
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
    <div className="container">
      <h1 className="title">Admin Page</h1>
      <div className="form-container">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <input
            type="number"
            className="form-control"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={(e) =>
              setNewProduct({ ...newProduct, quantity: Number(e.target.value) })
            }
          />
          <button className="btn btn-primary" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          ></textarea>
          <input
            type="text"
            className="form-control"
            placeholder="Image URL"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageUrl: e.target.value })
            }
          />
        </div>
      </div>

      <div className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            {editingProduct && editingProduct._id === product._id ? (
              <>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                />
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
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
                  <div className="col">
                    <textarea
                      className="form-control"
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
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
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
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Quantity"
                      value={editingProduct.quantity}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          quantity: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={handleSaveEdit}>
                    Save
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
                <p className="product-quantity">Quantity: {product.quantity}</p>
                <div className="btn-group">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditProduct(product)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
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
