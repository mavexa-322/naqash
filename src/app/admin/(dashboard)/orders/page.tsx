import { Button } from "@/components/ui/button";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-semibold text-foreground">Orders & Payments</h1>
          <p className="text-muted-foreground mt-2">View customer orders and verify payment screenshots.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Total (PKR)</th>
              <th className="p-4 font-medium">Payment Screenshot</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                No orders found. When a customer checks out and uploads a payment screenshot, it will appear here.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
