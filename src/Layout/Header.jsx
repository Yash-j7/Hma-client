import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/auth.jsx";
import toast from "react-hot-toast";
import SearchForm from "./../Pages/form/SearchForm";
import useCategory from "../hooks/useCategory.jsx";
import { useCart } from "../context/CartContext.jsx";

function Header() {
  const [auth, setAuth] = useAuth();
  const { cart } = useCart();
  const categories = useCategory();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [hover, setHover] = useState(false);

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
    toast.success("logged out succesfully");
  };

  return (
    <div className="navbar bg-[#bfe1f4] fixed z-10 h-1 p-10">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <NavLink to="/" className="hover:border-b-2">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/category">Category</NavLink>
            </li>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </ul>
        </div>
        <NavLink
          to="/"
          className="btn btn-ghost text-2xl font-bold tracking-wide text-black hover:text-blue-800 transition-colors duration-200 p-2"
        >
          Hospital
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex mt-3">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink to="/" className="hover:border-b-2">
              Home
            </NavLink>
          </li>
          <li className="">
            <details className="dropdown">
              <summary className="" onMouseEnter={() => setHover(true)}>
                category
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li>
                  <Link to="/category">All categories</Link>
                </li>
                {hover &&
                  categories?.map((c) => {
                    return (
                      <li className="m-1" key={c.id}>
                        <Link to={`/category/${c.slug}`}>{c.name}</Link>
                      </li>
                    );
                  })}
              </ul>
            </details>
          </li>
          {!auth.user ? (
            <>
              <li>
                <NavLink to="/register" className="hover:border-b-2">
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" className="hover:border-b-2">
                  Login
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <details>
                  <summary>{auth?.user?.name}</summary>
                  <ul className="bg-base-100 rounded-t-none p-2 z-10">
                    <li>
                      <NavLink
                        to={`/dashboard/${
                          auth?.user?.role === 1 ? "admin" : "user"
                        }`}
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={handleLogout}
                        to="/"
                        className="hover:border-b-2"
                      >
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </details>
              </li>
            </>
          )}
          <li>
            {/* <label className="flex cursor-pointer gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
              <input
                type="checkbox"
                value="synthwave"
                className="toggle theme-controller"
                onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                checked={theme === "dark"}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </label> */}
          </li>
        </ul>
        <div className="mb-2">
          <SearchForm />
        </div>
      </div>
      <div className="navbar-end">
        <NavLink
          to="/cart"
          className="bg-red-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out flex items-center space-x-2"
        >
          <span>🚨</span>
          <span>Critical Patients: {cart?.length}</span>
        </NavLink>
      </div>
    </div>
  );
}

export default Header;
