import React, { useEffect, useState } from "react";
import Layout from "./../Layout/Layout";
import axios from "axios";
import { Card, Checkbox, Radio, Button } from "antd";
import { Age } from "./Prices";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.jsx";
import { useCart } from "../context/CartContext.jsx";

const { Meta } = Card;

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();
  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://hma-backend.onrender.com/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      if (data.success) setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "https://hma-backend.onrender.com/api/v1/category/get-category"
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        "https://hma-backend.onrender.com/api/v1/product/product-count"
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page == 1) return;
    loadmore();
  }, [page]);

  const loadmore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://hma-backend.onrender.com/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      if (data.success) setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const truncateDescription = (description, maxLength = 15) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        "https://hma-backend.onrender.com/api/v1/product/product-filters",
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  useEffect(() => {
    if (!checked.length && !radio.length) getProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  const location = useLocation();
  const shouldRenderButton = location.pathname === "/";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="lg:grid lg:grid-cols-12 gap-8 font-serif">
          {/* Horizontal filter section for mobile */}
          <div className="lg:col-span-3 p-4 bg-white shadow-md rounded-md lg:flex-col">
            <h3 className="text-xl font-semibold mb-4">Filters</h3>

            {/* Horizontal filter arrangement on mobile */}
            <div className="flex flex-col lg:flex-col sm:flex-row flex-wrap gap-4 mb-4">
              {/* Category Filter */}
              <div className="sm:flex-row flex-wrap w-full sm:w-1/2 lg:w-full">
                <h3 className="text-sm font-semibold mb-2">Category</h3>
                <div className="flex sm:flex-row flex-wrap gap-3">
                  {categories?.map((c) => (
                    <Checkbox
                      key={c._id}
                      onChange={(e) => handleFilter(e.target.checked, c._id)}
                    >
                      {c.name}
                    </Checkbox>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              {/* Price Filter */}
              <div className="w-full sm:w-1/2 lg:w-full">
                <h3 className="text-sm font-semibold mb-2">Age</h3>
                <Radio.Group
                  onChange={(e) => setRadio(e.target.value)}
                  className="w-full"
                >
                  <div className="flex flex-wrap gap-4">
                    {Age?.map((p) => (
                      <Radio key={p._id} value={p.array}>
                        {p.name}
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
              </div>
            </div>

            <Button
              type="danger"
              className="w-full mt-5"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </Button>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-9">
            <h1 className="text-center text-5xl font-semibold font-mono text-sky-700 mb-8 mt-5 md:mt-1">
              Patients
            </h1>
            <div className="grid grid-cols-2 md:p-3 sm:p-6 lg:grid-cols-3 gap-6">
              {products?.map((p) => (
                // Inside your Card component
                <Card
                  key={p._id}
                  hoverable
                  className="rounded-lg shadow-md"
                  cover={
                    <img
                      alt={p.name}
                      src={`https://hma-backend.onrender.com/api/v1/product/product-photo/${p._id}`}
                      className="h-64 w-full object-cover rounded-t-lg"
                    />
                  }
                >
                  <Meta title={p.name} />
                  <div className="mt-2 font-semibold">
                    {truncateDescription(p.description)}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-lg font-semibold">Age:{p.price}</p>
                    <div className="flex m-2 flex-col gap-y-1">
                      <Button
                        type="primary"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        Details
                      </Button>

                      <Button
                        type="default"
                        onClick={() => {
                          addToCart(p);
                          toast.success("Patient added to Critical");
                        }}
                      >
                        Add to Critical
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-8 text-center">
              {products && shouldRenderButton && products.length < total && (
                <Button
                  type="primary"
                  loading={loading}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? "Loading..." : "Load More"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
