import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout.jsx";
import axios from "axios";
import { useParams, useNavigate, json } from "react-router-dom";
import { Button, Card } from "antd";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext.jsx";

const { Meta } = Card;

function DetailedProduct() {
  const params = useParams();
  const navigate = useNavigate();
  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();
  const [prod, setProd] = useState(null); // Define product state, initialize as null to handle loading state
  const [relatedProducts, setRelatedProducts] = useState([]); // Define related products state

  const getProducts = async () => {
    try {
      const { data } = await axios.get(
        `https://hma-backend.onrender.com/api/v1/product/get-product/${params.slug}`
      );

      if (data?.product) {
        setProd(data.product);
        getRelatedProducts(data.product._id, data.product.category._id); // Fetch related products
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRelatedProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `https://hma-backend.onrender.com/api/v1/product/related-product/${pid}/${cid}`
      );

      if (data?.products) {
        setRelatedProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.slug) getProducts();
  }, [params.slug]);

  if (!prod) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-5xl font-semibold">Patient Details</h1>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <div className="p-5 md:col-span-1">
            <img
              alt={prod.name}
              src={`https://hma-backend.onrender.com/api/v1/product/product-photo/${prod._id}`}
            />
          </div>
          <div className="md:col-span-1">
            <h1 className="text-4xl font-serif font-bold">{prod.name}</h1>
            <h2 className="text-xl font-serif mt-24">{prod.description}</h2>
            <h2 className="text-xl font-serif font-bold">
              {prod.price} years old
            </h2>
            <h2>{prod?.category?.name}</h2>
            {console.log("cart", cart)}
            <Button
              type="default"
              className="ml-2 mt-5"
              onClick={() => {
                addToCart(prod); // Use the `addToCart` function from the context
                toast.success("Item Added to Criticals");
              }}
            >
              Add to Criticals
            </Button>
          </div>
          <div className="md:col-span-2 text-4xl font-serif mt-10 mb-11">
            Related Patients
            <div>
              <h1 className="text-xl font-serif font-bold">
                {relatedProducts.length < 1 ? <h1>no similar Patients</h1> : ""}
              </h1>
              {relatedProducts?.map((p) => (
                <Card
                  key={p._id}
                  hoverable
                  style={{ width: 300 }}
                  className="m-3 p-2"
                  cover={
                    <img
                      alt={p.name}
                      src={`https://hma-backend.onrender.com/api/v1/product/product-photo/${p._id}`}
                    />
                  }
                >
                  <Meta title={p.name} description={p.description} />
                  <div className="card-name-price mt-3">
                    <h5 className="card-title">{p.price} years old</h5>
                  </div>
                  <div className="mt-3 flex">
                    <Button
                      type="primary"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </Button>
                    <Button
                      type="default"
                      className="ml-2"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}
                    >
                      Add to Criticals
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DetailedProduct;
