import React, { useEffect, useState } from "react";
import Layout from "./../Layout/Layout";
import axios from "axios";
import { Card, Checkbox, Radio, Button, Tag, Tooltip } from "antd";
import { Age } from "./Prices";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.jsx";
import { useCart } from "../context/CartContext.jsx";
import {
  UserOutlined,
  HeartOutlined,
  MedicalCrossOutlined,
  FileSearchOutlined,
  PlusCircleOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
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
      <div className="container mx-auto px-4 py-8 bg-gray-50">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-end mb-4">
          <Button
            icon={<FilterOutlined />}
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
          >
            {mobileFilterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filter Section - Responsive */}
          <div
            className={`
            ${mobileFilterOpen ? "block" : "hidden"} 
            lg:block 
            lg:col-span-3 
            bg-white 
            shadow-lg 
            rounded-xl 
            p-6 
            mb-4 
            lg:mb-0
            transform transition-all duration-300 hover:shadow-xl
          `}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
              <FilterOutlined className="mr-3 text-blue-500" />
              Filters
            </h3>

            {/* Category Filter - Responsive */}
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-4 text-gray-700">
                Category
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                {categories?.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                    className="w-full hover:bg-blue-50 p-2 rounded transition-colors"
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>
            </div>

            {/* Age Filter - Responsive */}
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-4 text-gray-700">Age</h4>
              <Radio.Group
                onChange={(e) => setRadio(e.target.value)}
                className="w-full"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                  {Age?.map((p) => (
                    <Radio
                      key={p._id}
                      value={p.array}
                      className="w-full hover:bg-blue-50 p-2 rounded transition-colors"
                    >
                      {p.name}
                    </Radio>
                  ))}
                </div>
              </Radio.Group>
            </div>

            <Button
              type="danger"
              icon={<ReloadOutlined />}
              className="w-full mt-4 bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </Button>
          </div>

          {/* Products Section - Responsive */}
          <div className="lg:col-span-9">
            <h1 className="text-center text-4xl lg:text-5xl font-bold font-sans text-blue-600 mb-10 animate-pulse">
              Patient Management
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((patient) => (
                <div
                  key={patient._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden 
                    transform transition-all duration-300 
                    hover:scale-105 hover:shadow-2xl 
                    border border-gray-100"
                >
                  {/* Patient Image */}
                  <div className="relative">
                    <img
                      src={`https://hma-backend.onrender.com/api/v1/product/product-photo/${patient._id}`}
                      alt={patient.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Tag color="blue" className="opacity-90">
                        <UserOutlined /> {patient.price} Years
                      </Tag>
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="p-5">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        {patient.name}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {patient.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Tooltip title="View Full Patient Details">
                        <Button
                          type="default"
                          icon={<FileSearchOutlined />}
                          className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => navigate(`/product/${patient.slug}`)}
                        >
                          Details
                        </Button>
                      </Tooltip>

                      <Tooltip title="Add to Critical Patients List">
                        <Button
                          type="primary"
                          icon={<PlusCircleOutlined />}
                          className="w-full bg-green-500 hover:bg-green-600 md:p-3 md:m-2"
                          onClick={() => {
                            addToCart(patient);
                            toast.success("Patient Added to Critical List", {
                              style: {
                                background: "#2C3E50",
                                color: "#fff",
                              },
                              icon: "🏥",
                            });
                          }}
                        >
                          Critical List
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button - Responsive */}
            <div className="mt-10 text-center">
              {products && shouldRenderButton && products.length < total && (
                <Button
                  type="primary"
                  loading={loading}
                  className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? "Loading..." : "Load More Patients"}
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
