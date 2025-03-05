import React, { useState } from "react";
import Layout from "../Layout/Layout";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  UserOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { Button, Tooltip, Modal } from "antd";

function Cart() {
  const [auth] = useAuth();
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Proceed to Ventilation Modal
  const showProceedModal = () => {
    setIsModalVisible(true);
  };

  const handleProceedConfirm = () => {
    // Add your ventilation allocation logic here
    toast.success("Ventilation Request Submitted", {
      style: {
        background: "#2C3E50",
        color: "#fff",
      },
      icon: "🏥",
    });
    setIsModalVisible(false);
    clearCart(); // Optional: clear cart after submission
    navigate("/dashboard/user/orders");
  };

  const handleProceedCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Critical Patients List
          </h1>
          <div className="flex items-center space-x-2">
            <UserOutlined className="text-blue-600" />
            <span className="text-gray-600">
              {cart.length} Critical Patients
            </span>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <MedicineBoxOutlined className="text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-600">
              No Patients in Critical List
            </p>
            <Button
              type="primary"
              className="mt-4"
              onClick={() => navigate("/")}
            >
              Add Patients
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Patient List */}
            <div className="lg:col-span-8 space-y-6">
              {cart.map((patient) => (
                <div
                  key={patient._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden 
                    border border-gray-100 p-6 flex items-center"
                >
                  {/* Patient Image */}
                  <div className="flex-shrink-0 mr-6">
                    <img
                      src={`https://hma-backend.onrender.com/api/v1/product/product-photo/${patient._id}`}
                      alt={patient.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Patient Details */}
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {patient.name}
                    </h2>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {patient.description}
                    </p>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-semibold text-blue-600">
                        <UserOutlined className="mr-2" />
                        {patient.price} Years Old
                      </span>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center mt-4 space-x-3">
                      <Tooltip title="Decrease Patient Priority">
                        <Button
                          icon={<MinusCircleOutlined />}
                          onClick={() => decreaseQuantity(patient._id)}
                          className="text-red-500 border-red-500"
                        />
                      </Tooltip>
                      <span className="text-lg font-semibold">
                        Priority Level: {patient.quantity || 1}
                      </span>
                      <Tooltip title="Increase Patient Priority">
                        <Button
                          icon={<PlusCircleOutlined />}
                          onClick={() => increaseQuantity(patient._id)}
                          className="text-green-500 border-green-500"
                        />
                      </Tooltip>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Tooltip title="Remove Patient from Critical List">
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => {
                        removeFromCart(patient._id);
                        toast.success("Patient Removed from Critical List");
                      }}
                    />
                  </Tooltip>
                </div>
              ))}
            </div>

            {/* Summary and Actions */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Patient Summary
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Patients:</span>
                    <span className="font-semibold">{cart.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Highest Priority:</span>
                    <span className="font-semibold">
                      {Math.max(...cart.map((p) => p.quantity || 1))}
                    </span>
                  </div>
                </div>

                {auth?.user?.address ? (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Current Allocation:
                    </h3>
                    <p className="text-gray-600">{auth.user.address}</p>
                    <Button
                      type="link"
                      className="pl-0"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="default"
                    className="w-full mb-4"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Add Allocation Address
                  </Button>
                )}

                <Button
                  type="primary"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={showProceedModal}
                  disabled={cart.length === 0}
                >
                  Proceed to Ventilation
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Ventilation Confirmation Modal */}
        <Modal
          title="Confirm Ventilation Request"
          visible={isModalVisible}
          onOk={handleProceedConfirm}
          onCancel={handleProceedCancel}
          okText="Confirm"
          cancelText="Cancel"
        >
          <p>
            Are you sure you want to proceed with ventilation for {cart.length}{" "}
            patients?
          </p>
          <p className="text-red-600 mt-2">
            * This action will submit a critical care request.
          </p>
        </Modal>
      </div>
    </Layout>
  );
}

export default Cart;
