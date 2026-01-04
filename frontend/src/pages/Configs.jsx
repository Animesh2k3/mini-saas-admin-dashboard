import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Configs = () => {
  const [configs, setConfigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selected, setSelected] = useState(null);

  const [formKey, setFormKey] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formCategory, setFormCategory] = useState("general");
  const [formEnabled, setFormEnabled] = useState(true);

  const fetchConfigs = async () => {
    setLoading(true);
    const res = await api.get("/configs", {
      params: { search, category: categoryFilter },
    });
    setConfigs(res.data.data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await api.get("/configs/categories");
    setCategories(res.data.categories);
  };

  useEffect(() => {
    fetchConfigs();
    fetchCategories();
  }, [search, categoryFilter]);

  const grouped = configs.reduce((acc, c) => {
    acc[c.category] = acc[c.category] || [];
    acc[c.category].push(c);
    return acc;
  }, {});

  const submitAdd = async (e) => {
    e.preventDefault();
    await api.post("/configs", {
      config_key: formKey,
      config_value: formValue,
      category: formCategory,
      is_enabled: formEnabled,
    });
    setShowAdd(false);
    fetchConfigs();
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    await api.put(`/configs/${selected.id}`, {
      config_key: formKey,
      config_value: formValue,
      category: formCategory,
      is_enabled: formEnabled,
    });
    setShowEdit(false);
    fetchConfigs();
  };

  const deleteConfig = async () => {
    await api.delete(`/configs/${selected.id}`);
    setShowDelete(false);
    fetchConfigs();
  };

  const toggle = async (c) => {
    await api.patch(`/configs/${c.id}/toggle`, {
      is_enabled: !c.is_enabled,
    });
    fetchConfigs();
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Configuration Management</h1>
          <button
            onClick={() => {
              setFormKey("");
              setFormValue("");
              setFormCategory("general");
              setFormEnabled(true);
              setShowAdd(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add Config
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            placeholder="Search by key"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          Object.keys(grouped).map((cat) => (
            <div key={cat} className="mb-6">
              <h2 className="font-bold text-lg mb-2 capitalize">{cat}</h2>
              <table className="w-full bg-white border table-fixed">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 w-1/4 text-left">Key</th>
                    <th className="p-2 w-1/3 text-left">Value</th>
                    <th className="p-2 w-1/6 text-center">Status</th>
                    <th className="p-2 w-1/6 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {grouped[cat].map((c) => (
                    <tr key={c.id} className="border-t">
                      {/* KEY */}
                      <td className="p-2 font-mono break-all">
                        {c.config_key}
                      </td>

                      {/* VALUE */}
                      <td className="p-2 break-all">
                        {c.config_value}
                      </td>

                      {/* STATUS */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => toggle(c)}
                          className={`px-2 py-1 rounded text-xs ${
                            c.is_enabled ? "bg-green-200" : "bg-red-200"
                          }`}
                        >
                          {c.is_enabled ? "Enabled" : "Disabled"}
                        </button>
                      </td>

                      {/* ✅ CHANGED: ACTIONS COLUMN - Made buttons more visible with proper styling */}
                      <td className="p-2 text-center">
                        {/* ✅ CHANGED: Wrapped buttons in flex container with gap */}
                        <div className="flex justify-center gap-2">
                          {/* ✅ CHANGED: Edit button - Added bg color, padding, and rounded corners */}
                          <button
                            onClick={() => {
                              setSelected(c);
                              setFormKey(c.config_key);
                              setFormValue(c.config_value);
                              setFormCategory(c.category);
                              setFormEnabled(c.is_enabled);
                              setShowEdit(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>

                          {/* ✅ CHANGED: Delete button - Added bg color, padding, and rounded corners */}
                          <button
                            onClick={() => {
                              setSelected(c);
                              setShowDelete(true);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
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
          ))
        )}
      </div>

      {/* ADD */}
      {showAdd && (
        <Modal title="Add Configuration" onClose={() => setShowAdd(false)}>
          <Form
            onSubmit={submitAdd}
            {...{
              formKey,
              setFormKey,
              formValue,
              setFormValue,
              formCategory,
              setFormCategory,
              formEnabled,
              setFormEnabled,
            }}
          />
        </Modal>
      )}

      {/* EDIT */}
      {showEdit && (
        <Modal title="Edit Configuration" onClose={() => setShowEdit(false)}>
          <Form
            onSubmit={submitEdit}
            {...{
              formKey,
              setFormKey,
              formValue,
              setFormValue,
              formCategory,
              setFormCategory,
              formEnabled,
              setFormEnabled,
            }}
          />
        </Modal>
      )}

      {/* DELETE */}
      {showDelete && (
        <Modal title="Delete?" onClose={() => setShowDelete(false)}>
          <p className="mb-4">Are you sure?</p>
          <button
            onClick={deleteConfig}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </Modal>
      )}
    </>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded w-96">
      <h2 className="font-bold mb-4">{title}</h2>
      {children}
      <button onClick={onClose} className="mt-4 text-sm text-gray-500">
        Close
      </button>
    </div>
  </div>
);

const Form = ({
  onSubmit,
  formKey,
  setFormKey,
  formValue,
  setFormValue,
  formCategory,
  setFormCategory,
  formEnabled,
  setFormEnabled,
}) => (
  <form onSubmit={onSubmit} className="space-y-3">
    <input
      required
      value={formKey}
      onChange={(e) => setFormKey(e.target.value.toUpperCase())}
      className="border p-2 w-full font-mono"
      placeholder="CONFIG_KEY"
    />
    <input
      required
      value={formValue}
      onChange={(e) => setFormValue(e.target.value)}
      className="border p-2 w-full"
      placeholder="Value"
    />
    <select
      value={formCategory}
      onChange={(e) => setFormCategory(e.target.value)}
      className="border p-2 w-full"
    >
      <option value="general">General</option>
      <option value="email">Email</option>
      <option value="security">Security</option>
      <option value="payment">Payment</option>
      <option value="storage">Storage</option>
    </select>
    <label className="flex gap-2">
      <input
        type="checkbox"
        checked={formEnabled}
        onChange={(e) => setFormEnabled(e.target.checked)}
      />
      Enabled
    </label>
    <button className="bg-blue-600 text-white px-4 py-2 rounded">
      Save
    </button>
  </form>
);

export default Configs;