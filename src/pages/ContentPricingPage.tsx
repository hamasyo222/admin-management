import React from 'react';
import { ContentPricingManagement } from '../../components/admin/ContentPricingManagement';

const ContentPricingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">コンテンツ価格管理</h1>
        <p className="text-gray-600">コンテンツの価格設定と割引管理</p>
      </div>
      
      <ContentPricingManagement />
    </div>
  );
};

export default ContentPricingPage;