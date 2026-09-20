'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Truck, 
  ExternalLink, 
  Eye, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Search,
  Filter,
  Receipt,
  PackageCheck,
  Trash2
} from 'lucide-react';
import type { Order } from '@/lib/ordersStorage';
import { updateOrderStatusAction, deleteOrderAction } from './actions';

interface OrdersListClientProps {
  initialOrders: Order[];
}

export function OrdersListClient({ initialOrders }: OrdersListClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'verified' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectReceiptUrl, setInspectReceiptUrl] = useState<string | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (
    orderId: string,
    updates: { payment_status?: Order['payment_status']; order_status?: Order['order_status'] }
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatusAction(orderId, updates);
      if (res.success) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, ...updates } : o))
        );
        if (selectedOrderDetails?.id === orderId) {
          setSelectedOrderDetails(prev => (prev ? { ...prev, ...updates } : null));
        }
      } else {
        alert(res.error || 'Failed to update order status.');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderNumber}? This cannot be undone.`)) {
      return;
    }
    setUpdatingId(orderId);
    try {
      const res = await deleteOrderAction(orderId);
      if (res.success) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        if (selectedOrderDetails?.id === orderId) {
          setSelectedOrderDetails(null);
        }
      } else {
        alert(res.error || 'Failed to delete order.');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting order.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    // Tab filter
    if (filterTab === 'pending' && order.payment_status !== 'pending_verification') return false;
    if (filterTab === 'verified' && (order.payment_status !== 'verified' || order.order_status === 'delivered')) return false;
    if (filterTab === 'delivered' && order.order_status !== 'delivered') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = order.order_number.toLowerCase().includes(q);
      const matchName = `${order.customer_first_name} ${order.customer_last_name}`.toLowerCase().includes(q);
      const matchEmail = order.customer_email.toLowerCase().includes(q);
      const matchPhone = order.customer_phone.includes(q);
      const matchCity = order.city.toLowerCase().includes(q);
      return matchNumber || matchName || matchEmail || matchPhone || matchCity;
    }

    return true;
  });

  const pendingCount = orders.filter(o => o.payment_status === 'pending_verification').length;

  return (
    <div className="space-y-6">
      {/* Header with Title and Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-heading font-semibold text-foreground">
              Orders & Payments
            </h1>
            {pendingCount > 0 && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Review customer acquisition orders, verify bank transfer receipts, and track fulfillment.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-card border p-3 rounded-xl shadow-xs">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              filterTab === 'all'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'pending'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingCount})</span>
          </button>
          <button
            onClick={() => setFilterTab('verified')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'verified'
                ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified / Processing</span>
          </button>
          <button
            onClick={() => setFilterTab('delivered')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'delivered'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-background border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/60 border-b text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment Receipt</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground">
                    <Receipt className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="font-medium text-sm text-foreground">No orders match this filter</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {searchQuery ? 'Try clearing your search query' : 'When customers check out, their orders appear here in real time.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      {/* Order ID & Date */}
                      <td className="p-4 align-top">
                        <div className="font-mono font-semibold text-sm text-foreground">
                          {order.order_number}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="p-4 align-top max-w-[200px]">
                        <div className="font-medium text-foreground text-sm">
                          {order.customer_first_name} {order.customer_last_name}
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-muted-foreground shrink-0" />
                          <a href={`tel:${order.customer_phone}`} className="hover:underline text-primary">
                            {order.customer_phone}
                          </a>
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span className="truncate">{order.city}</span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="p-4 align-top max-w-[220px]">
                        <div className="space-y-1.5">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {item.image_url ? (
                                <div className="relative w-8 h-10 rounded bg-muted overflow-hidden shrink-0 border">
                                  <Image src={item.image_url} alt={item.product_title} fill className="object-cover" />
                                </div>
                              ) : (
                                <div className="w-8 h-10 rounded bg-muted flex items-center justify-center text-[8px] text-muted-foreground border">
                                  Rug
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate max-w-[150px] leading-tight">
                                  {item.product_title}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {item.size} × {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-[10px] text-primary font-medium">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="p-4 align-top whitespace-nowrap">
                        <div className="font-bold text-sm text-foreground">
                          PKR {order.total_amount.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase">
                          {order.payment_method.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Payment Screenshot */}
                      <td className="p-4 align-top">
                        {order.payment_screenshot_url ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setInspectReceiptUrl(order.payment_screenshot_url)}
                              className="relative w-12 h-14 rounded-md border-2 border-primary/40 hover:border-primary overflow-hidden shadow-xs cursor-pointer group shrink-0"
                              title="Click to inspect receipt screenshot"
                            >
                              <Image
                                src={order.payment_screenshot_url}
                                alt="Payment slip"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setInspectReceiptUrl(order.payment_screenshot_url)}
                              className="text-[11px] text-primary hover:underline font-medium"
                            >
                              View Slip
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-[11px]">No receipt</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4 align-top space-y-1.5 whitespace-nowrap">
                        {/* Payment status badge */}
                        <div>
                          {order.payment_status === 'verified' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              Payment Verified
                            </span>
                          ) : order.payment_status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3" />
                              Payment Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              <Clock className="w-3 h-3" />
                              Needs Verification
                            </span>
                          )}
                        </div>

                        {/* Order fulfillment status badge */}
                        <div>
                          <span className="inline-block bg-muted text-foreground text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wider">
                            {order.order_status}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 align-top text-right whitespace-nowrap">
                        <div className="flex flex-col items-end gap-1.5">
                          {order.payment_status === 'pending_verification' && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleUpdateStatus(order.id, { payment_status: 'verified', order_status: 'processing' })}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                Verify
                              </button>
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleUpdateStatus(order.id, { payment_status: 'rejected', order_status: 'cancelled' })}
                                className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {order.payment_status === 'verified' && order.order_status === 'processing' && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(order.id, { order_status: 'shipped' })}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Truck className="w-3 h-3" />
                              Mark Shipped
                            </button>
                          )}

                          {order.order_status === 'shipped' && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(order.id, { order_status: 'delivered' })}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <PackageCheck className="w-3 h-3" />
                              Mark Delivered
                            </button>
                          )}

                          <div className="flex items-center gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => setSelectedOrderDetails(order)}
                              className="text-primary hover:underline text-[11px] font-medium cursor-pointer"
                            >
                              Details & Address →
                            </button>
                            <span className="text-muted-foreground/40">|</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id, order.order_number)}
                              className="text-red-500 hover:text-red-700 hover:underline text-[11px] font-medium cursor-pointer"
                              title="Delete this order"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Screenshot Lightbox Modal */}
      {inspectReceiptUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setInspectReceiptUrl(null)}
        >
          <div 
            className="relative bg-card border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-semibold text-lg">Bank Transfer Receipt</h3>
              </div>
              <button
                onClick={() => setInspectReceiptUrl(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 min-h-[350px] bg-muted/40 rounded-xl overflow-hidden flex items-center justify-center">
              <Image
                src={inspectReceiptUrl}
                alt="Payment Receipt Screenshot"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={inspectReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <span>Open Original Image</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setInspectReceiptUrl(null)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-xs font-medium hover:bg-secondary/80"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Full Details Modal */}
      {selectedOrderDetails && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedOrderDetails(null)}
        >
          <div 
            className="relative bg-card border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Order Details</span>
                <h3 className="font-heading font-bold text-xl text-foreground mt-0.5">
                  {selectedOrderDetails.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl text-xs">
              <div>
                <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">Customer</span>
                <p className="text-sm font-medium mt-1">
                  {selectedOrderDetails.customer_first_name} {selectedOrderDetails.customer_last_name}
                </p>
                <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> {selectedOrderDetails.customer_email}
                </p>
                <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> {selectedOrderDetails.customer_phone}
                </p>
              </div>

              <div>
                <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">Delivery Address</span>
                <p className="mt-1 leading-relaxed text-muted-foreground">
                  {selectedOrderDetails.street_address}<br />
                  {selectedOrderDetails.city}{selectedOrderDetails.postal_code ? `, ${selectedOrderDetails.postal_code}` : ''}<br />
                  Pakistan
                </p>
                {selectedOrderDetails.notes && (
                  <p className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded">
                    <strong>Note:</strong> {selectedOrderDetails.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Items List */}
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">Purchased Items</h4>
              <div className="border rounded-xl divide-y">
                {selectedOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {item.image_url && (
                        <div className="relative w-10 h-12 rounded bg-muted overflow-hidden border">
                          <Image src={item.image_url} alt={item.product_title} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">{item.product_title}</p>
                        <p className="text-muted-foreground text-[11px]">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary & Verification CTA */}
            <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-xs text-muted-foreground">Total Paid via Bank Transfer:</span>
                <p className="text-2xl font-bold text-primary">
                  PKR {selectedOrderDetails.total_amount.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedOrderDetails.payment_status === 'pending_verification' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedOrderDetails.id, { payment_status: 'verified', order_status: 'processing' })}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Verify & Approve Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedOrderDetails.id, { payment_status: 'rejected', order_status: 'cancelled' })}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(selectedOrderDetails.id, selectedOrderDetails.order_number)}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Order</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
