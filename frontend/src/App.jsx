import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/employees`;

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [listStatusFilter, setListStatusFilter] = useState("ACTIVE");
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
    salary: "",
    status: "ACTIVE",
  });

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  async function parseJsonSafe(res) {
    const text = await res.text();
    if (!text) return {};
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(text);
      } catch {
        return { message: "Malformed JSON response from server" };
      }
    }
    return { message: text || "Server returned non-JSON response" };
  }

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const query = new URLSearchParams({
        status: listStatusFilter,
      }).toString();
      const res = await fetch(`${API_BASE}?${query}`);
      const data = await parseJsonSafe(res);
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch employees");
      }
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listStatusFilter]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm({
      id: "",
      name: "",
      email: "",
      department: "",
      salary: "",
      status: "ACTIVE",
    });
    setInfo("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");

    if (!form.name || !form.email || !form.department || !form.salary) {
      setError("Please fill in all required fields.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department.trim(),
      salary: Number(form.salary),
      status: form.status,
    };

    try {
      const url = isEditing ? `${API_BASE}/${form.id}` : API_BASE;
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }
      setInfo(
        isEditing
          ? "Employee updated successfully."
          : "Employee added successfully.",
      );
      resetForm();
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(emp) {
    setForm({
      id: emp._id,
      name: emp.name,
      email: emp.email,
      department: emp.department,
      salary: String(emp.salary),
      status: emp.status,
    });
    setInfo("");
    setError("");
  }

  async function handleDelete(id, status) {
    if (status === "INACTIVE") {
      setInfo("This employee is already INACTIVE.");
      setError("");
      return;
    }
    if (!window.confirm("Mark this employee as INACTIVE?")) return;
    setError("");
    setInfo("");
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const data = await parseJsonSafe(res);
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete employee");
      }
      setInfo("Employee marked as INACTIVE.");
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-10">
      <div className="w-full max-w-5xl px-4">
        <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-slate-200 bg-slate-50">
            <h1 className="text-2xl font-semibold text-slate-900">
              Employee Management System
            </h1>
          </div>

          <div className="px-6 py-4 space-y-3">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {info && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {info}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-end"
            >
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-600">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-600">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-600">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Engineering"
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-600">
                  Salary <span className="text-red-500">*</span>
                </label>
                <input
                  name="salary"
                  type="number"
                  min="0"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="50000"
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-600">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex gap-2 md:col-span-2 lg:col-span-1">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                >
                  {isEditing ? "Update Employee" : "Add Employee"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="px-6 pb-6 pt-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                Employees
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={listStatusFilter}
                  onChange={(event) => setListStatusFilter(event.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="ACTIVE">Show ACTIVE</option>
                  <option value="INACTIVE">Show INACTIVE</option>
                  <option value="ALL">Show ALL</option>
                </select>
                <button
                  onClick={fetchEmployees}
                  disabled={loading}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Refreshing…" : "Refresh"}
                </button>
              </div>
            </div>

            {employees.length === 0 ? (
              <p className="text-sm text-slate-500">
                No employees found for selected filter.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">
                        Department
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700 hidden md:table-cell">
                        Salary
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700 hidden md:table-cell">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {employees.map((emp) => (
                      <tr key={emp._id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="font-medium text-slate-900">
                            {emp.name}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-slate-700">
                          {emp.email}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-slate-700">
                          {emp.department}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-slate-700 hidden md:table-cell">
                          {emp.salary}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              emp.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                : "bg-red-50 text-red-700 ring-1 ring-red-100"
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(emp)}
                              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(emp._id, emp.status)}
                              disabled={emp.status === "INACTIVE"}
                              className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium shadow-sm ${
                                emp.status === "INACTIVE"
                                  ? "cursor-not-allowed bg-slate-200 text-slate-500"
                                  : "bg-red-600 text-white hover:bg-red-700"
                              }`}
                            >
                              {emp.status === "INACTIVE"
                                ? "Already Inactive"
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
