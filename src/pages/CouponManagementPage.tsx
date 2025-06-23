import React, { useState } from 'react';
import { CouponList } from '../../components/payment/CouponList';
import { CouponForm } from '../../components/payment/CouponForm';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CouponManagementPage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreateCoupon = async (couponData: any) => {
    try {
      // In a real implementation, this would call an API
      console.log('Creating coupon:', couponData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowAddForm(false);
      toast.success('クーポンを作成しました');
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error('クーポンの作成中にエラーが発生しました');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">クーポン管理</h1>
        <p className="text-gray-600">割引クーポンの作成と管理</p>
      </div>
      
      {showAddForm ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">新規クーポン作成</h2>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <CouponForm 
            onSubmit={handleCreateCoupon}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      ) : (
        <CouponList 
          onAddNew={() => setShowAddForm(true)}
          isAdmin={true}
        />
      )}
    </div>
  );
};

export default CouponManagementPage;