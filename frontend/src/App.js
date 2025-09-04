

// import React, { useEffect, useState } from "react";
// import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "./api"; // ⚡ include updateTransaction
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
// import Swal from "sweetalert2"; // ⚡ import SweetAlert2
// import "./App.css";

// function App() {
//   const [transactions, setTransactions] = useState([]);
//   const [form, setForm] = useState({ title: "", amount: "", type: "expense", category: "" });
//   const [editingId, setEditingId] = useState(null); // ⚡ track editing

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const res = await getTransactions();
//     setTransactions(res.data);
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!form.title || !form.amount || !form.category) return;

//   if (editingId) {
//     // ⚡ confirm before updating
//     Swal.fire({
//       title: "Update Transaction?",
//       text: "Do you want to save the changes to this transaction?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#28a745",
//       cancelButtonColor: "#6c757d",
//       confirmButtonText: "Yes, update it!",
//       cancelButtonText: "Cancel"
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         await updateTransaction(editingId, form);
//         setEditingId(null);
//         setForm({ title: "", amount: "", type: "expense", category: "" });
//         fetchData();
//         Swal.fire("Updated!", "Transaction updated successfully.", "success");
//       }
//     });
//   } else {
//     // ⚡ add new transaction directly
//     await addTransaction(form);
//     setForm({ title: "", amount: "", type: "expense", category: "" });
//     fetchData();
//   }
// };


//   const handleDelete = async (id) => {
//   Swal.fire({
//     title: "Are you sure?",
//     text: "This transaction will be permanently deleted!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#d33",
//     cancelButtonColor: "#3085d6",
//     confirmButtonText: "Yes, delete it!",
//     cancelButtonText: "Cancel"
//   }).then(async (result) => {
//     if (result.isConfirmed) {
//       await deleteTransaction(id);
//       fetchData();
//       Swal.fire("Deleted!", "The transaction has been deleted.", "success");
//     }
//   });
// };

//   const handleEdit = (transaction) => {
//     setForm({
//       title: transaction.title,
//       amount: transaction.amount,
//       type: transaction.type,
//       category: transaction.category,
//     });
//     setEditingId(transaction._id);
//   };

//   // ---- Totals ----
//   const totalIncome = transactions
//     .filter(t => t.type === "income")
//     .reduce((sum, t) => sum + t.amount, 0);

//   const totalExpense = transactions
//     .filter(t => t.type === "expense")
//     .reduce((sum, t) => sum + t.amount, 0);

//   const balance = totalIncome - totalExpense;

//   // ---- Expense Categories ----
//   const expenseData = Object.values(
//     transactions
//       .filter(t => t.type === "expense")
//       .reduce((acc, t) => {
//         acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
//         acc[t.category].value += t.amount;
//         return acc;
//       }, {})
//   );

//   // ---- Income vs Expense ----
//   const summaryData = [
//     { name: "Income", value: totalIncome },
//     { name: "Expense", value: totalExpense }
//   ];

//   const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#FF6384"];

//   return (
//     <div className="container">
//       <h1 className="title">Expense Tracker</h1>

//       {/* Summary Cards */}
//       <div className="summary">
//         <div className="card income">Income: {totalIncome}</div>
//         <div className="card expense">Expense: {totalExpense}</div>
//         <div className="card balance">Balance: {balance}</div>
//       </div>

//       {/* Form */}
//       <form className="form" onSubmit={handleSubmit}>
//         <input
//           placeholder="Title"
//           value={form.title}
//           onChange={e => setForm({ ...form, title: e.target.value })}
//         />
//         <input
//           placeholder="Amount"
//           type="number"
//           value={form.amount}
//           onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
//         />
//         <select
//           value={form.type}
//           onChange={e => setForm({ ...form, type: e.target.value })}
//         >
//           <option value="expense">Expense</option>
//           <option value="income">Income</option>
//         </select>
//         <input
//           placeholder="Category"
//           value={form.category}
//           onChange={e => setForm({ ...form, category: e.target.value })}
//         />
//         <button className="btn" type="submit">
//           {editingId ? "Update" : "Add"} {/* ⚡ dynamic button */}
//         </button>
//       </form>

//       {/* Transactions Table */}
//       <table className="transaction-table">
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Amount</th>
//             <th>Category</th>
//             <th>Type</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map(t => (
//             <tr key={t._id} className={t.type}>
//               <td>{t.title}</td>
//               <td>{t.amount}</td>
//               <td>{t.category}</td>
//               <td>{t.type}</td>
//               <td>
//                 <button className="edit-btn" onClick={() => handleEdit(t)}>✏️</button>
//                 <button className="delete-btn" onClick={() => handleDelete(t._id)}>❌</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Charts */}
//       <h2>Category Breakdown (Expenses)</h2>
//       <div className="chart">
//         <PieChart width={400} height={300}>
//           <Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={120}>
//             {expenseData.map((entry, index) => (
//               <Cell key={index} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </div>

//       <h2>Income vs Expense</h2>
//       <div className="chart">
//         <PieChart width={400} height={300}>
//           <Pie data={summaryData} dataKey="value" nameKey="name" outerRadius={120}>
//             {summaryData.map((entry, index) => (
//               <Cell key={index} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </div>
//     </div>
//   );
// }

// export default App;










import React, { useEffect, useState, useRef } from "react";
import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "./api";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", type: "expense", category: "" });
  const [editingId, setEditingId] = useState(null);

  // 🔹 Filtering states
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showExportMenu, setShowExportMenu] = useState(false);

  // 🔹 Ref for export dropdown
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchData();

    // Auto-close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
    const res = await getTransactions();
    setTransactions(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category) return;

    if (editingId) {
      Swal.fire({
        title: "Update Transaction?",
        text: "Do you want to save the changes?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, update it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateTransaction(editingId, form);
          setEditingId(null);
          setForm({ title: "", amount: "", type: "expense", category: "" });
          fetchData();
          Swal.fire("Updated!", "Transaction updated successfully.", "success");
        }
      });
    } else {
      await addTransaction(form);
      setForm({ title: "", amount: "", type: "expense", category: "" });
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This transaction will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteTransaction(id);
        fetchData();
        Swal.fire("Deleted!", "The transaction has been deleted.", "success");
      }
    });
  };

  const handleEdit = (transaction) => {
    setForm({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
    });
    setEditingId(transaction._id);
  };

  // 🔹 Filtering logic
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === "all" || t.type === filterType;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const today = new Date();
      const txnDate = new Date(t.createdAt);

      if (dateFilter === "7days") {
        const last7 = new Date();
        last7.setDate(today.getDate() - 7);
        matchesDate = txnDate >= last7;
      } else if (dateFilter === "month") {
        matchesDate =
          txnDate.getMonth() === today.getMonth() &&
          txnDate.getFullYear() === today.getFullYear();
      } else if (dateFilter === "year") {
        matchesDate = txnDate.getFullYear() === today.getFullYear();
      }
    }

    return matchesSearch && matchesType && matchesDate;
  });

  // ---- Totals ----
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // ---- Expense Categories ----
  const expenseData = Object.values(
    filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
        acc[t.category].value += t.amount;
        return acc;
      }, {})
  );

  // ---- Income vs Expense ----
  const summaryData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  // ---- Monthly Trend ----
  const monthlyData = (() => {
    const map = {};
    filteredTransactions.forEach((t) => {
      if (!t.createdAt) return;
      const date = new Date(t.createdAt);
      const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
      if (t.type === "income") map[key].income += t.amount;
      else map[key].expense += t.amount;
    });
    return Object.values(map);
  })();

  // ---- Export CSV ----
  const exportCSV = () => {
    const headers = ["Title", "Amount", "Category", "Type", "Date"];
    const rows = filteredTransactions.map((t) => [
      t.title,
      t.amount,
      t.category,
      t.type,
      t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—",
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transactions.csv");
  };

  // ---- Export PDF ----
  const exportPDF = () => {
  const doc = new jsPDF();
  doc.text("Transactions Report", 14, 16);
  autoTable(doc, {  // <-- pass doc here
    head: [["Title", "Amount", "Category", "Type", "Date"]],
    body: filteredTransactions.map((t) => [
      t.title,
      t.amount,
      t.category,
      t.type,
      t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—",
    ]),
  });
  doc.save("transactions.pdf");
};


  // ---- Print Report ----
  const printReport = () => {
    const content = `
      <h1>Transactions Report</h1>
      <p><b>Total Income:</b> ${totalIncome}</p>
      <p><b>Total Expense:</b> ${totalExpense}</p>
      <p><b>Balance:</b> ${balance}</p>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Title</th><th>Amount</th><th>Category</th><th>Type</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${filteredTransactions
            .map(
              (t) =>
                `<tr>
                  <td>${t.title}</td>
                  <td>${t.amount}</td>
                  <td>${t.category}</td>
                  <td>${t.type}</td>
                  <td>${t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}</td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;
    const win = window.open("", "_blank");
    win.document.write(content);
    win.document.close();
    win.print();
  };

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#FF6384"];

  return (
    <div className="container">
      <h1 className="title">Expense Tracker</h1>

      {/* Summary Cards */}
      <div className="summary">
        <div className="card income">Income: {totalIncome}</div>
        <div className="card expense">Expense: {totalExpense}</div>
        <div className="card balance">Balance: {balance}</div>
      </div>

      {/* Export Dropdown */}
      <div className="export-dropdown" ref={dropdownRef}>
        <button onClick={() => setShowExportMenu(!showExportMenu)}>⬇️ Export Options ▾</button>
        {showExportMenu && (
          <div className="dropdown-menu">
            <button onClick={exportCSV}>📑 Export CSV</button>
            <button onClick={exportPDF}>📄 Export PDF</button>
            <button onClick={printReport}>🖨️ Print Report</button>
          </div>
        )}
      </div>

      {/* Form */}
      <form className="form" onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
        />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <button className="btn" type="submit">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* 🔹 Filtering UI */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by title, category or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">All Time</option>
          <option value="7days">Last 7 Days</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Transactions Table */}
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Type</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((t) => (
            <tr key={t._id} className={t.type}>
              <td>{t.title}</td>
              <td>{t.amount}</td>
              <td>{t.category}</td>
              <td>{t.type}</td>
              <td>
                {t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "—"}
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(t)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(t._id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Charts */}
      <h2>Category Breakdown (Expenses)</h2>
      <div className="chart">
        {expenseData.length > 0 ? (
          <PieChart width={400} height={300}>
            <Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={120}>
              {expenseData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <p className="no-data">No Expense Data Available</p>
        )}
      </div>

      <h2>Income vs Expense</h2>
      <div className="chart">
        <PieChart width={400} height={300}>
          <Pie data={summaryData} dataKey="value" nameKey="name" outerRadius={120}>
            {summaryData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <h2>Monthly Trend</h2>
      <div className="chart">
        {monthlyData.length > 0 ? (
          <>
            <BarChart width={500} height={300} data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#0088FE" />
              <Bar dataKey="expense" fill="#FF8042" />
            </BarChart>

            <LineChart width={500} height={300} data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#0088FE" />
              <Line type="monotone" dataKey="expense" stroke="#FF8042" />
            </LineChart>
          </>
        ) : (
          <p className="no-data">No Monthly Data Available</p>
        )}
      </div>
    </div>
  );
}

export default App;
