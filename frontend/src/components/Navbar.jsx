import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const avatar = localStorage.getItem("avatar");
  const userRole = localStorage.getItem("role");
  const userEmail = localStorage.getItem("email");

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-6">
        <Link to="/">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/configs">Configurations</Link>
        {userRole === "admin" && (
  <Link to="/audit-logs">Audit Logs</Link>
)}

      </div>

      {/* RIGHT SIDE */}
      <div ref={dropdownRef} className="relative flex items-center gap-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-col text-right leading-tight">
            <span className="text-xs font-semibold uppercase text-gray-300">
              {userRole ? userRole.toUpperCase() : "USER"}
            </span>
            <span className="text-sm text-white">
              {userEmail || "email@example.com"}
            </span>
          </div>

          <img
            src={avatar || "/default-avatar.png"}
            alt="profile"
            className="w-9 h-9 rounded-full object-cover border"
          />
        </div>

        {open && (
          <div className="absolute right-0 top-12 w-56 bg-white text-gray-800 rounded-md shadow-lg overflow-hidden z-50">
            <div className="px-4 py-3 border-b">
              <p className="text-xs font-semibold uppercase text-purple-700">
                {userRole ? userRole.toUpperCase() : "USER"}
              </p>
              <p className="text-sm text-gray-800 truncate">
                {userEmail || "email@example.com"}
              </p>
            </div>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/avatar");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Change Photo
            </button>

            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
