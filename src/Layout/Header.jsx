import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/auth.jsx";
import toast from "react-hot-toast";
import SearchForm from "./../Pages/form/SearchForm";
import useCategory from "../hooks/useCategory.jsx";
import { useCart } from "../context/CartContext.jsx";
import {
  MenuOutlined,
  HomeOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  DashboardOutlined,
  MedicineBoxOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { Drawer, Button, Dropdown, Menu } from "antd";

function Header() {
  const [auth, setAuth] = useAuth();
  const { cart } = useCart();
  const categories = useCategory();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const element = document.documentElement;
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
  };

  // Category Dropdown Menu
  const categoryMenu = (
    <Menu>
      <Menu.Item key="all-categories">
        <Link to="/category">All Categories</Link>
      </Menu.Item>
      {categories?.map((c) => (
        <Menu.Item key={c.slug}>
          <Link to={`/category/${c.slug}`}>{c.name}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  // User Dropdown Menu
  const userMenu = (
    <Menu>
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <NavLink to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}>
          Dashboard
        </NavLink>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-white flex items-center space-x-2 hover:text-gray-200 transition-colors"
        >
          <MedicineBoxOutlined />
          <span className="hidden sm:inline">Hospital Management</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <NavLink
            to="/"
            className="text-white hover:text-cyan-200 transition-colors flex items-center space-x-1"
          >
            <HomeOutlined />
            <span>Home</span>
          </NavLink>

          {/* Category Dropdown */}
          <Dropdown overlay={categoryMenu} placement="bottomCenter">
            <a className="text-white hover:text-cyan-200 transition-colors flex items-center space-x-1">
              <MedicineBoxOutlined />
              <span>Categories</span>
            </a>
          </Dropdown>

          {/* Authentication Links */}
          {!auth.user ? (
            <>
              <NavLink
                to="/register"
                className="text-white hover:text-cyan-200 transition-colors flex items-center space-x-1"
              >
                <UserOutlined />
                <span>Register</span>
              </NavLink>
              <NavLink
                to="/login"
                className="text-white hover:text-cyan-200 transition-colors flex items-center space-x-1"
              >
                <LoginOutlined />
                <span>Login</span>
              </NavLink>
            </>
          ) : (
            <Dropdown overlay={userMenu} placement="bottomCenter">
              <a className="text-white hover:text-cyan-200 transition-colors flex items-center space-x-1">
                <UserOutlined />
                <span>{auth?.user?.name}</span>
              </a>
            </Dropdown>
          )}

          {/* Search and Cart */}
          {/* Desktop Navigation Section */}
          <div className="hidden lg:flex items-center space-x-4">
            <SearchForm />
            <NavLink
              to="/cart"
              className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-red-600 transition-colors"
            >
              <AlertOutlined />
              <span>Critical: {cart?.length}</span>
            </NavLink>
          </div>

          {/* Mobile Navigation Section */}
          <div className="lg:hidden flex items-center space-x-2">
            <div className="flex-grow mr-2">
              <SearchForm />
            </div>
            <NavLink
              to="/cart"
              className="bg-red-500 text-white px-3 py-2 rounded-full flex items-center justify-center 
      w-12 h-12 hover:bg-red-600 transition-colors"
            >
              <div className="flex flex-col items-center">
                <AlertOutlined className="text-lg" />
                <span className="text-xs -mt-1">{cart?.length}</span>
              </div>
            </NavLink>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center space-x-4">
          <SearchForm />
          <NavLink
            to="/cart"
            className="bg-red-500 text-white px-3 py-2 rounded-full flex items-center space-x-1 hover:bg-red-600 transition-colors"
          >
            <AlertOutlined />
            <span>{cart?.length}</span>
          </NavLink>
          <Button
            type="text"
            icon={<MenuOutlined className="text-white text-2xl" />}
            onClick={() => setMobileMenuVisible(true)}
          />
        </div>

        {/* Mobile Drawer Menu */}
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setMobileMenuVisible(false)}
          visible={mobileMenuVisible}
          className="lg:hidden"
        >
          <Menu mode="vertical">
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <NavLink to="/">Home</NavLink>
            </Menu.Item>

            <Menu.SubMenu
              key="categories"
              icon={<MedicineBoxOutlined />}
              title="Categories"
            >
              <Menu.Item key="all-categories">
                <Link to="/category">All Categories</Link>
              </Menu.Item>
              {categories?.map((c) => (
                <Menu.Item key={c.slug}>
                  <Link to={`/category/${c.slug}`}>{c.name}</Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>

            {!auth.user ? (
              <>
                <Menu.Item key="register" icon={<UserOutlined />}>
                  <NavLink to="/register">Register</NavLink>
                </Menu.Item>
                <Menu.Item key="login" icon={<LoginOutlined />}>
                  <NavLink to="/login">Login</NavLink>
                </Menu.Item>
              </>
            ) : (
              <Menu.SubMenu
                key="user"
                icon={<UserOutlined />}
                title={auth?.user?.name}
              >
                <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                  <NavLink
                    to={`/dashboard/${
                      auth?.user?.role === 1 ? "admin" : "user"
                    }`}
                  >
                    Dashboard
                  </NavLink>
                </Menu.Item>
                <Menu.Item
                  key="logout"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.SubMenu>
            )}
          </Menu>
        </Drawer>
      </div>
    </header>
  );
}

export default Header;
