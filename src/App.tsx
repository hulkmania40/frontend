import { BrowserRouter, Routes, Route } from "react-router"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import Layout from "./components/Layout"
import Inventory from "./pages/Inventory/Inventory"
import Admin from "./pages/Admin"
import InvoiceList from "./pages/Invoice/InvoiceList"
import InvoiceForm from "./pages/Invoice/InvoiceForm"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page WITHOUT layout */}
        <Route path="/" element={<LoginPage />} />

        {/* All other pages WITH layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/invoice" element={<InvoiceList />} />
          <Route path="/invoice/new" element={<InvoiceForm />} />
          <Route path="/invoice/:id" element={<InvoiceForm />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
