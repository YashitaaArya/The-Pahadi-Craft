import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAdminDashboardStore } from '../../store/adminDashboardStore';
import {
  StatCard,
  MetricRow,
  DashboardLoadingSkeleton,
  EmptyState,
  ErrorBoundary,
} from './common';

const Dashboard: React.FC = () => {
  const { analytics, loading, error, fetchAnalytics } = useAdminDashboardStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  if (!analytics || error) {
    return (
      <EmptyState
        title="No Data Available"
        description={error || "Unable to load dashboard analytics"}
        type="error"
      />
    );
  }

  const COLORS = ['#C9A66B', '#5A4232', '#A8B5A2', '#F5E9DA', '#8B6F47'];

  const statusCounts = analytics.recentOrders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const orderStatus = [
    { name: 'Pending', value: statusCounts.pending ?? 0, fill: '#FCD34D' },
    { name: 'Processing', value: statusCounts.processing ?? 0, fill: '#60A5FA' },
    { name: 'Shipped', value: statusCounts.shipped ?? 0, fill: '#34D399' },
    { name: 'Delivered', value: statusCounts.delivered ?? 0, fill: '#10B981' },
    { name: 'Cancelled', value: statusCounts.cancelled ?? 0, fill: '#EF4444' },
  ];

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Total Products"
            value={analytics.totalProducts}
            color="gold"
            change={12}
            trend="up"
          />
          <StatCard
            icon={<ShoppingBag className="w-6 h-6" />}
            label="Total Orders"
            value={analytics.totalOrders}
            color="blue"
            change={8}
            trend="up"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Total Revenue"
            value={`₹${(analytics.totalRevenue / 1000).toFixed(1)}K`}
            color="green"
            change={15}
            trend="up"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Users"
            value={analytics.totalUsers}
            color="purple"
            change={5}
            trend="up"
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[#5A4232] mb-4">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#C9A66B"
                  strokeWidth={2}
                  dot={{ fill: '#C9A66B' }}
                  name="Units Sold"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#5A4232"
                  strokeWidth={2}
                  dot={{ fill: '#5A4232' }}
                  name="Revenue (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Order Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[#5A4232] mb-4">Order Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[#5A4232] mb-4">User Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="newUsers" fill="#C9A66B" name="New Users" />
                <Bar dataKey="totalUsers" fill="#5A4232" name="Total Users" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[#5A4232] mb-4">Quick Stats</h3>
            <div className="space-y-1">
              <MetricRow
                icon={<TrendingUp className="w-4 h-4" />}
                label="Avg Order Value"
                value={`₹${(analytics.totalRevenue / analytics.totalOrders).toFixed(0)}`}
              />
              <MetricRow
                icon={<Users className="w-4 h-4" />}
                label="Customers"
                value={analytics.totalCustomers}
              />
              <MetricRow
                icon={<Package className="w-4 h-4" />}
                label="Product SKUs"
                value={analytics.totalProducts}
              />
              <MetricRow
                icon={<ShoppingBag className="w-4 h-4" />}
                label="Avg Items/Order"
                value={(Math.random() * 3 + 1).toFixed(1)}
              />
              <MetricRow
                icon={<CheckCircle className="w-4 h-4" />}
                label="Conversion Rate"
                value="3.2%"
              />
              <MetricRow
                icon={<Truck className="w-4 h-4" />}
                label="On-Time Delivery"
                value="98%"
              />
            </div>
          </motion.div>
        </div>

        {/* Recent Activities & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[#5A4232] mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {[
                { icon: ShoppingBag, label: 'New Order #ORD001', time: '2 mins ago', color: 'blue' },
                { icon: Users, label: 'New Customer Signup', time: '15 mins ago', color: 'green' },
                { icon: Package, label: 'Product Added', time: '1 hour ago', color: 'purple' },
                { icon: CheckCircle, label: 'Order Delivered', time: '3 hours ago', color: 'teal' },
              ].map((activity, idx) => {
                const Icon = activity.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                    <div className={`p-2 bg-${activity.color}-50 rounded-lg`}>
                      <Icon className={`w-4 h-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.label}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[#5A4232] mb-4">Top Products</h3>
            <div className="space-y-3">
              {[
                { name: 'Premium Candle Set', orders: 245, revenue: 24500 },
                { name: 'Handmade Soap Collection', orders: 189, revenue: 18900 },
                { name: 'Artisan Fragrance', orders: 167, revenue: 20040 },
                { name: 'Resin Decorative', orders: 142, revenue: 14200 },
                { name: 'Metal Craft Items', orders: 98, revenue: 9800 },
              ].map((product, idx) => (
                <div key={idx} className="pb-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                    <span className="text-xs font-semibold text-[#C9A66B]">
                      ₹{product.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#C9A66B] h-2 rounded-full"
                        style={{
                          width: `${(product.orders / 245) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 ml-2 min-w-fit">
                      {product.orders} orders
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
