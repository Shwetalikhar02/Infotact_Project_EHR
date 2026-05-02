import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, FileText, User, Users, BarChart2,
  Settings, LogOut, Menu, X, ChevronRight, Stethoscope, Shield,
  Bell, ClipboardList
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/lib/index';
import { ROUTE_PATHS } from '@/lib/index';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  userEmail: string;
}

const patientNav: NavItem[] = [
  { label: 'Dashboard', path: ROUTE_PATHS.PATIENT_DASHBOARD, icon: <LayoutDashboard size={18} /> },
  { label: 'My Appointments', path: ROUTE_PATHS.PATIENT_BOOK, icon: <Calendar size={18} /> },
  { label: 'Prescriptions', path: ROUTE_PATHS.PATIENT_PRESCRIPTIONS, icon: <FileText size={18} /> },
  { label: 'Profile', path: ROUTE_PATHS.PATIENT_PROFILE, icon: <User size={18} /> },
];

const doctorNav: NavItem[] = [
  { label: 'Dashboard', path: ROUTE_PATHS.DOCTOR_DASHBOARD, icon: <LayoutDashboard size={18} /> },
  { label: 'Appointments', path: ROUTE_PATHS.DOCTOR_APPOINTMENTS, icon: <Calendar size={18} /> },
  { label: 'Patients', path: ROUTE_PATHS.DOCTOR_PATIENTS, icon: <Users size={18} /> },
  { label: 'Prescriptions', path: ROUTE_PATHS.DOCTOR_PRESCRIPTION, icon: <ClipboardList size={18} /> },
  { label: 'Profile', path: ROUTE_PATHS.DOCTOR_PROFILE, icon: <User size={18} /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: ROUTE_PATHS.ADMIN_DASHBOARD, icon: <LayoutDashboard size={18} /> },
  { label: 'Manage Doctors', path: ROUTE_PATHS.ADMIN_DOCTORS, icon: <Stethoscope size={18} /> },
  { label: 'Manage Patients', path: ROUTE_PATHS.ADMIN_PATIENTS, icon: <Users size={18} /> },
  { label: 'Analytics', path: ROUTE_PATHS.ADMIN_ANALYTICS, icon: <BarChart2 size={18} /> },
  { label: 'Settings', path: ROUTE_PATHS.ADMIN_SETTINGS, icon: <Settings size={18} /> },
];

const navMap: Record<UserRole, NavItem[]> = {
  patient: patientNav,
  doctor: doctorNav,
  admin: adminNav,
};

const roleConfig: Record<UserRole, { label: string; color: string; icon: React.ReactNode }> = {
  patient: { label: 'Patient', color: 'bg-blue-500', icon: <User size={14} /> },
  doctor: { label: 'Doctor', color: 'bg-accent', icon: <Stethoscope size={14} /> },
  admin: { label: 'Admin', color: 'bg-purple-500', icon: <Shield size={14} /> },
};

export function DashboardLayout({ children, role, userName, userEmail }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const navItems = navMap[role];
  const rc = roleConfig[role];
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => {
    navigate(ROUTE_PATHS.HOME);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-sidebar-border">
        <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Stethoscope size={16} className="text-sidebar-primary-foreground" />
          </div>
          <span className="text-sidebar-foreground font-bold text-lg tracking-tight">MediConnect</span>
        </Link>
      </div>

      {/* Role Badge */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white ${rc.color}`}>
          {rc.icon}
          {rc.label} Portal
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span>{item.label}</span>
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User Profile Bottom */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground text-sm font-medium truncate">{userName}</p>
            <p className="text-sidebar-foreground/50 text-xs truncate">{userEmail}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar shrink-0 h-full overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-64 bg-sidebar z-50 lg:hidden flex flex-col overflow-hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-card border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu size={20} className="text-foreground" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-foreground font-semibold text-base">
                {navItems.find(n => n.label === 'Dashboard')?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>

            {/* User Avatar + Name */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-border">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-foreground text-sm font-medium leading-tight">{userName}</p>
                <p className="text-muted-foreground text-xs">{rc.label}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── Status Badge Component ──────────────────────────────────────────────────
export function StatusBadge({ status, config }: { status: string; config: Record<string, { label: string; className: string }> }) {
  const cfg = config[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  accentColor?: string;
  loading?: boolean;
}

export function StatCard({ title, value, icon, subtitle, accentColor = 'bg-primary', loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-card rounded-xl p-5 border border-border shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-28 bg-muted rounded" />
          <div className="w-10 h-10 rounded-lg bg-muted" />
        </div>
        <div className="h-8 w-20 bg-muted rounded mb-2" />
        <div className="h-3 w-24 bg-muted rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        <div className={`w-10 h-10 rounded-lg ${accentColor} flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>}
    </motion.div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-foreground font-semibold text-lg">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
