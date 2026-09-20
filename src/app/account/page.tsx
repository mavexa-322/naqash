import { Button } from '@/components/ui/button';
import { User, Package, Settings, LogOut, MapPin, CreditCard, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'My Account | Naqash Carpets',
  description: 'Manage your account and view order history.',
};

export default function AccountPage() {
  return (
    <div className="container px-4 md:px-8 py-12 md:py-20 min-h-[70vh]">
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground">Welcome back, John Doe. Manage your profile, orders, and preferences here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {/* Sidebar Navigation */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-muted/30 rounded-2xl p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">John Doe</h3>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              <a href="#profile" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-colors">
                <User className="w-5 h-5" />
                Profile Info
              </a>
              <a href="#orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-foreground transition-colors">
                <Package className="w-5 h-5" />
                Order History
              </a>
              <a href="#addresses" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-foreground transition-colors">
                <MapPin className="w-5 h-5" />
                Addresses
              </a>
              <a href="#payment" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-foreground transition-colors">
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </a>
              <a href="#settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-foreground transition-colors">
                <Settings className="w-5 h-5" />
                Settings
              </a>
              <button className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-left w-full">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-8 lg:col-span-9 space-y-10">
          {/* Profile Section */}
          <section id="profile" className="bg-card rounded-2xl p-6 md:p-8 border shadow-sm">
            <h2 className="font-heading text-2xl font-bold mb-6 border-b pb-4">Profile Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">First Name</label>
                <div className="px-4 py-2.5 rounded-lg border bg-muted/20">John</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Last Name</label>
                <div className="px-4 py-2.5 rounded-lg border bg-muted/20">Doe</div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                <div className="px-4 py-2.5 rounded-lg border bg-muted/20">john.doe@example.com</div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
                <div className="px-4 py-2.5 rounded-lg border bg-muted/20">+92 300 1234567</div>
              </div>
            </div>
            
            <Button className="rounded-full px-6">Edit Profile</Button>
          </section>

          {/* Orders Section */}
          <section id="orders" className="bg-card rounded-2xl p-6 md:p-8 border shadow-sm">
            <h2 className="font-heading text-2xl font-bold mb-6 border-b pb-4">Recent Orders</h2>
            
            <div className="py-12 text-center text-muted-foreground">
              No orders found for this account.
            </div>
            
            <Button variant="link" className="mt-4 text-primary p-0 flex items-center">View All Orders <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </section>
        </div>
      </div>
    </div>
  );
}
