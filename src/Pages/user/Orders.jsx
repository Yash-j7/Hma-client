import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import UserMenu from "../../Layout/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        "https://hma-backend.onrender.com/api/v1/auth/order",
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      setOrders(data);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <UserMenu />
          </div>
          <div className="md:col-span-9">
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="text-center font-bold text-4xl mb-8 mt-5">
                All Orders
              </div>
              {orders.length > 0 ? (
                orders.map((o, i) => (
                  <div className="overflow-x-auto mb-8" key={o._id}>
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 border-b">#</th>
                          <th className="px-4 py-2 border-b">Status</th>
                          <th className="px-4 py-2 border-b">Buyer</th>
                          <th className="px-4 py-2 border-b">Date</th>
                          <th className="px-4 py-2 border-b">Payment</th>
                          <th className="px-4 py-2 border-b">Quantity</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="hover:bg-gray-100">
                          <td className="px-4 py-2 border-b">{i + 1}</td>
                          <td className="px-4 py-2 border-b">{o.status}</td>
                          <td className="px-4 py-2 border-b">
                            {o.buyer?.name}
                          </td>
                          <td className="px-4 py-2 border-b">
                            {moment(o.createAt).fromNow()}
                          </td>
                          <td className="px-4 py-2 border-b">
                            {o.payment.success ? "Success" : "Failed"}
                          </td>
                          <td className="px-4 py-2 border-b">
                            {o.products.length}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="container">
                      {o?.products?.map((p, i) => (
                        <div className="row mb-2 p-3 card flex-row" key={p._id}>
                          <div className="col-md-4">
                            <img
                              src={`https://hma-backend.onrender.com/api/v1/product/product-photo/${p._id}`}
                              className="card-img-top"
                              alt={p.name}
                              width="100px"
                              height={"100px"}
                            />
                          </div>
                          <div className="col-md-8 ml-12">
                            <p>{p.name}</p>
                            <p>{p.description.substring(0, 30)}</p>
                            <p>Price : {p.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No orders found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Orders;
