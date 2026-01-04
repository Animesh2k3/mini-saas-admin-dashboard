import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [entityFilter, setEntityFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/audit-logs", {
        params: {
          entity: entityFilter,
          userEmail: userFilter,
        },
      });

      // ✅ SAFE STATE UPDATE
      setLogs(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
      setLogs([]); // ✅ fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [entityFilter, userFilter]);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold mb-6">Audit Logs</h2>

        {/* Filters */}
        <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Filter by Entity
            </label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">All</option>
              <option value="users">Users</option>
              <option value="configurations">Configurations</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Filter by User (email)
            </label>
            <input
              type="text"
              placeholder="admin@test.com"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">Action</th>
                <th className="p-3 text-left text-sm font-semibold">Entity</th>
                <th className="p-3 text-left text-sm font-semibold">
                  Description
                </th>
                <th className="p-3 text-left text-sm font-semibold">
                  Performed By
                </th>
                <th className="p-3 text-left text-sm font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs?.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="p-3 text-sm font-semibold">
                      {log.action}
                    </td>
                    <td className="p-3 text-sm">{log.entity}</td>
                    <td className="p-3 text-sm">{log.description}</td>
                    <td className="p-3 text-sm">
                      {log.performed_by || "System"}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AuditLogs;
