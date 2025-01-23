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

  // ... existing API calls remain the same ...

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-end mb-4">
          <Button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full"
          >
            {mobileFilterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Filter Section - Responsive */}
          <div
            className={`
            ${mobileFilterOpen ? "block" : "hidden"} 
            lg:block 
            lg:col-span-3 
            bg-white 
            shadow-md 
            rounded-md 
            p-4 
            mb-4 
            lg:mb-0
          `}
          >
            <h3 className="text-xl font-semibold mb-4">Filters</h3>

            {/* Category Filter - Responsive */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                {categories?.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                    className="w-full"
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>
            </div>

            {/* Age Filter - Responsive */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Age</h3>
              <Radio.Group
                onChange={(e) => setRadio(e.target.value)}
                className="w-full"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                  {Age?.map((p) => (
                    <Radio key={p._id} value={p.array} className="w-full">
                      {p.name}
                    </Radio>
                  ))}
                </div>
              </Radio.Group>
            </div>

            <Button
              type="danger"
              className="w-full mt-4"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </Button>
          </div>

          {/* Products Section - Responsive */}
          <div className="lg:col-span-9">
            <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-semibold font-mono text-sky-700 mb-8 mt-5 md:mt-1">
              Patients
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products?.map((p) => (
                <Card
                  key={p._id}
                  hoverable
                  className="rounded-lg shadow-md"
                  cover={
                    <img
                      alt={p.name}
                      src={`https://hma-backend.onrender.com/api/v1/product/product-photo/${p._id}`}
                      className="h-48 sm:h-56 lg:h-64 w-full object-cover rounded-t-lg"
                    />
                  }
                >
                  <Meta title={p.name} />
                  <div className="mt-2 font-semibold text-sm">
                    {truncateDescription(p.description)}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-3 space-y-2 sm:space-y-0">
                    <p className="text-lg font-semibold">Age: {p.price}</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => navigate(`/product/${p.slug}`)}
                        className="w-full sm:w-auto"
                      >
                        Details
                      </Button>
                      <Button
                        type="default"
                        size="small"
                        onClick={() => {
                          addToCart(p);
                          toast.success("Patient added to Critical");
                        }}
                        className="w-full sm:w-auto"
                      >
                        Add to Critical
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More Button - Responsive */}
            <div className="mt-8 text-center">
              {products && shouldRenderButton && products.length < total && (
                <Button
                  type="primary"
                  loading={loading}
                  className="w-full sm:w-auto"
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
