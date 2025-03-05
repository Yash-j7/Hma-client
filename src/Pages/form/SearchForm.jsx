import React from "react";
import { useSearch } from "../../context/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchForm() {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.get(
        `https://hma-backend.onrender.com/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <div className="w-full px-4">
      <form
        className="flex flex-col sm:flex-row sm:items-center gap-2"
        onSubmit={handleSubmit}
      >
        {/* Search Input */}
        <input
          type="text"
          className="w-full sm:flex-grow px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search..."
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />

        {/* Search Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300 sm:flex-shrink-0"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchForm;
