import React, { useState, useEffect } from "react";
import axios from "axios";
import { isAuthenticated, logout } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";

const API_URL = "https://clothing-store-uq04.onrender.com/api/products";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    quantity: 0,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(API_URL, {
          headers: { Authorization: token },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [navigate]);

  const handleAddProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.description ||
      !newProduct.imageUrl ||
      newProduct.quantity === null ||
      newProduct.quantity < 0
    ) {
      alert(
        "Vui lòng điền đầy đủ thông tin và đảm bảo số lượng là một số hợp lệ"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        API_URL,
        {
          ...newProduct,
          quantity: Number(newProduct.quantity),
        },
        {
          headers: { "Content-Type": "application/json", Authorization: token },
        }
      );
      setProducts([...products, response.data]);
      setNewProduct({
        name: "",
        price: "",
        description: "",
        imageUrl: "",
        quantity: 0,
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
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/${editingProduct._id}`,
        editingProduct,
        {
          headers: { "Content-Type": "application/json", Authorization: token },
        }
      );
      setProducts(
        products.map((product) =>
          product._id === editingProduct._id ? response.data : product
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: token },
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <h1 className="title">Trang quản trị</h1>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#e74c3c",
          color: "#fff",
          padding: "10px 22px",
          border: "none",
          borderRadius: "6px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
          marginBottom: "10px", // Thêm dòng này để nhích lên trên
        }}
      >
        Đăng xuất
      </button>
      <div className="form-container">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Tên sản phẩm"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control"
            placeholder="Giá"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <input
            type="number"
            className="form-control"
            placeholder="Số lượng"
            value={newProduct.quantity}
            onChange={(e) =>
              setNewProduct({ ...newProduct, quantity: Number(e.target.value) })
            }
          />
          <button className="btn btn-primary" onClick={handleAddProduct}>
            Thêm sản phẩm
          </button>
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            placeholder="Mô tả"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          ></textarea>
          <input
            type="text"
            className="form-control"
            placeholder="URL ảnh"
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
                  placeholder="Tên"
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
                      placeholder="Giá"
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
                      placeholder="Mô tả"
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
                      placeholder="URL ảnh"
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
                      placeholder="Số lượng"
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
                    Lưu
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => setEditingProduct(null)}
                  >
                    Hủy
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
                <p className="product-quantity">Số lượng: {product.quantity}</p>
                <div className="btn-group">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditProduct(product)}
                  >
                    Cập nhật
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Xóa
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
