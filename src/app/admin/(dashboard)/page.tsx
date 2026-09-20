export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to the Naqash Carpets Gallery admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg">Total Products</h3>
          <p className="text-3xl font-bold mt-2 text-primary">0</p>
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg">Pending Orders</h3>
          <p className="text-3xl font-bold mt-2 text-primary">0</p>
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg">Active Collections</h3>
          <p className="text-3xl font-bold mt-2 text-primary">0</p>
        </div>
      </div>
    </div>
  )
}
