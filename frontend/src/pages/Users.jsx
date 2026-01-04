import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users", {
        params: {
          page,
          limit: 10,
          search,
          role: roleFilter,
          status: statusFilter,
        },
      });
      setUsers(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleToggleStatus = async (user) => {
    try {
      await api.patch(`/users/${user.id}/status`, {
        is_active: !user.is_active,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update user status");
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setEditName("");
    setEditEmail("");
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/users/${selectedUser.id}`, {
        name: editName,
        email: editEmail,
      });
      closeEditModal();
      fetchUsers();
      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.response?.data?.message || "Failed to update user");
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/users/${selectedUser.id}`);
      closeDeleteModal();
      fetchUsers();
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleChangeRole = async (user, newRole) => {
    try {
      await api.patch(`/users/${user.id}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error("Error changing role:", error);
      alert("Failed to change user role");
    }
  };

  if (loading && users.length === 0) {
    return (
      <>
        <Navbar />
        <div className="p-6 flex items-center justify-center h-screen">
          <div className="text-xl">Loading users...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">User Management</h2>
          <button
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            Refresh
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={handleSearch}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">Role</label>
              <select
                value={roleFilter}
                onChange={handleRoleFilter}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-gray-600">
          Showing {users.length} of {total} users
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold border-b">
                    Avatar
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold border-b">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold border-b">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold border-b">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold border-b">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
  <img
    src={user.avatar_url || "/default-avatar.png"}
    alt="avatar"
    className="w-10 h-10 rounded-full object-cover"
  />
  
</td>

                    <td className="px-6 py-4 text-sm">{user.name}</td>
                    <td className="p-3">
  <div className="flex flex-col">
    {/* Role */}
    <span className="text-purple-900 font-bold">
     {user.role.toUpperCase()}
    </span>

    {/* Email */}
    <span className="text-sm text-gray-800">
      {user.email}
    </span>
  </div>
</td>

                    <td className="px-6 py-4 text-sm">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                          user.is_active
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded ${
                page === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              Delete User
            </h3>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <strong>{selectedUser.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users; 