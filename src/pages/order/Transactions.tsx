import React, { useEffect, useState } from 'react';
import { transactionService } from '../../services/transactionService';
import { useAuth } from '../../hooks/useAuth';
import type { Order } from '../../types';
import { format } from 'date-fns';
import { Modal } from '../../components/ui/Modal';
import { Upload, XCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const CountdownTimer: React.FC<{ createdAt: string }> = ({ createdAt }) => {
  const [timeLeft, setTimeLeft] = React.useState<string>('Calculating...');

  React.useEffect(() => {
    const expiresAt = new Date(createdAt).getTime() + 2 * 60 * 60 * 1000;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = expiresAt - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('Expired');
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');

      setTimeLeft(`Time left: ${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  if (timeLeft === 'Expired') {
    return <span className="text-red-500 font-bold text-xs mt-1 block px-2 py-0.5 border border-red-500/30 rounded bg-red-500/10 w-fit">Status is Expired</span>;
  }

  return <span className="text-orange-400 font-mono text-xs mt-1 block px-2 py-0.5 border border-orange-500/30 rounded bg-orange-500/10 w-fit">{timeLeft}</span>;
};

export const Transactions: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await transactionService.getOrders(user?.role);
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'waiting_payment': return <span className="flex items-center text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20"><Clock size={12} className="mr-1"/> Awaiting Payment</span>;
      case 'waiting_confirmation': return <span className="flex items-center text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20"><Clock size={12} className="mr-1"/> Awaiting Confirmation</span>;
      case 'done': return <span className="flex items-center text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20"><CheckCircle size={12} className="mr-1"/> Completed</span>;
      case 'rejected': return <span className="flex items-center text-red-500 bg-red-500/10 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20"><XCircle size={12} className="mr-1"/> Rejected</span>;
      case 'canceled': return <span className="flex items-center text-gray-400 bg-gray-500/10 px-3 py-1 rounded-full text-xs font-bold border border-gray-500/20"><XCircle size={12} className="mr-1"/> Canceled</span>;
      case 'expired': return <span className="flex items-center text-gray-500 bg-gray-500/10 px-3 py-1 rounded-full text-xs font-bold border border-gray-500/20"><AlertTriangle size={12} className="mr-1"/> Expired</span>;
      default: return <span className="text-gray-400">{status}</span>;
    }
  };

  const handleUploadPayment = async () => {
    if (!selectedOrder || !paymentFile) return;
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('paymentProof', paymentFile);
      
      await transactionService.payOrder(selectedOrder.id, formData);
      setIsPaymentModalOpen(false);
      setPaymentFile(null);
      fetchOrders();
    } catch (error) {
      console.error("Failed to upload payment proof", error);
      alert("Failed to upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelOrder = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await transactionService.cancelOrder(id);
      fetchOrders();
    } catch (error) {
      alert("Failed to cancel order.");
    }
  };

  // For organizers to confirm/reject orders
  const handleConfirmOrder = async (id: number) => {
    try {
      await transactionService.confirmOrder(id);
      fetchOrders();
    } catch (error) {
      alert("Failed to confirm order.");
    }
  };

  const handleRejectOrder = async (id: number) => {
    if (!confirm("Are you sure you want to reject this order?")) return;
    try {
      await transactionService.rejectOrder(id);
      fetchOrders();
    } catch (error) {
      alert("Failed to reject order.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white border-b border-slate-800 pb-4 mb-8">Transactions</h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No transactions found</h3>
            <p className="text-gray-500">You haven't made any orders yet.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4 font-mono">#{order.id}</td>
                      <td className="px-6 py-4 font-semibold text-white">{order.event?.title || `Event #${order.eventId}`}</td>
                      <td className="px-6 py-4">{format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}</td>
                      <td className="px-6 py-4 text-purple-400 font-bold">IDR {order.totalPrice.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                        {order.status === 'waiting_payment' && <CountdownTimer createdAt={order.createdAt} />}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 flex justify-end items-center h-full gap-2">
                        {user?.role === 'customer' && order.status === 'waiting_payment' && (
                          <>
                            <button
                              onClick={() => { setSelectedOrder(order); setIsPaymentModalOpen(true); }}
                              className="text-white bg-purple-600 hover:bg-purple-500 px-3 py-1.5 rounded flex items-center transition"
                            >
                              <Upload size={14} className="mr-1" /> Pay
                            </button>
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-red-400 hover:text-red-300 px-2 py-1.5 transition"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        
                        {user?.role === 'organizer' && order.status === 'waiting_confirmation' && (
                          <>
                            {order.paymentProofUrl && (
                               <a href={order.paymentProofUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline mr-2 text-xs">View Proof</a>
                            )}
                            <button
                              onClick={() => handleConfirmOrder(order.id)}
                              className="text-white bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded transition text-xs"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order.id)}
                              className="text-white bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded transition text-xs"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => { setIsPaymentModalOpen(false); setPaymentFile(null); }}
        title="Upload Payment Proof"
        footer={
           <>
             <button
               onClick={() => setIsPaymentModalOpen(false)}
               className="px-4 py-2 text-gray-300 hover:text-white"
             >
               Cancel
             </button>
             <button
               onClick={handleUploadPayment}
               disabled={!paymentFile || isUploading}
               className="px-4 py-2 bg-purple-600 text-white rounded-md disabled:opacity-50 flex items-center"
             >
               {isUploading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>}
               Upload Proof
             </button>
           </>
        }
      >
         <div className="space-y-4 text-gray-300">
            <p>Please upload your transfer receipt for Order <strong>#{selectedOrder?.id}</strong>.</p>
            <div className="p-4 bg-slate-800 border border-purple-500/30 rounded-lg">
               <p className="text-sm">Total to pay:</p>
               <p className="text-2xl font-bold text-white">IDR {selectedOrder?.totalPrice.toLocaleString()}</p>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-600 file:text-white
                  hover:file:bg-purple-500 transition cursor-pointer"
              />
            </div>
         </div>
      </Modal>
    </div>
  );
};
