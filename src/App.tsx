import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './components/auth/LoginPage';
import { Booking, Settlement, Offering } from './types';

// BMT Admin Views
import { UnifiedOperationsDashboard } from './components/bmt/UnifiedOperationsDashboard';
import { SettlementManagement } from './components/bmt/SettlementManagement';
import { OfferingApprovalsQueue } from './components/bmt/OfferingApprovalsQueue';
import { TempleManagement } from './components/bmt/TempleManagement';
import { AuditTracking } from './components/bmt/AuditTracking';

// Temple Admin Views
import { TempleDashboard } from './components/temple/TempleDashboard';
import { TempleBookings } from './components/temple/TempleBookings';
import { TempleSettlements } from './components/temple/TempleSettlements';
import { TempleOfferings } from './components/temple/TempleOfferings';

// Modals
import { BookingDetailModal } from './components/modals/BookingDetailModal';
import { SettlementDetailModal } from './components/modals/SettlementDetailModal';
import { CreateSettlementModal } from './components/modals/CreateSettlementModal';
import { OfferingModal } from './components/modals/OfferingModal';
import { OnboardTempleModal } from './components/modals/OnboardTempleModal';

const AdminPortalContent: React.FC = () => {
  const { isAuthenticated, role, currentTemple } = useApp();

  // Navigation tab state
  const [bmtTab, setBmtTab] = useState<string>('dashboard');
  const [templeTab, setTempleTab] = useState<string>('settlements');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modal states
  const [inspectBooking, setInspectBooking] = useState<Booking | null>(null);
  const [inspectSettlement, setInspectSettlement] = useState<Settlement | null>(null);
  const [isCreateSettlementOpen, setIsCreateSettlementOpen] = useState<boolean>(false);
  const [isOfferingModalOpen, setIsOfferingModalOpen] = useState<boolean>(false);
  const [editingOffering, setEditingOffering] = useState<Offering | null>(null);
  const [isOnboardTempleOpen, setIsOnboardTempleOpen] = useState<boolean>(false);

  // If not authenticated, display login screen
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const currentTab = role === 'BMT_ADMIN' ? bmtTab : templeTab;
  const handleSelectTab = (tab: string) => {
    if (role === 'BMT_ADMIN') {
      setBmtTab(tab);
    } else {
      setTempleTab(tab);
    }
  };

  const getPageTitle = () => {
    if (role === 'BMT_ADMIN') {
      switch (bmtTab) {
        case 'dashboard': return 'Operations Dashboard';
        case 'settlements': return 'Settlement Management';
        case 'approvals': return 'Offering Approvals';
        case 'temples': return 'Temple Network';
        case 'audit': return 'Audit Trail';
        default: return 'Operations Dashboard';
      }
    } else {
      switch (templeTab) {
        case 'dashboard': return 'Dashboard';
        case 'bookings': return 'Bookings';
        case 'settlements': return 'Settlements';
        case 'offerings': return 'Offerings';
        default: return 'Dashboard';
      }
    }
  };

  const handleOpenEditOffering = (offering: Offering) => {
    setEditingOffering(offering);
    setIsOfferingModalOpen(true);
  };

  const handleOpenCreateOffering = () => {
    setEditingOffering(null);
    setIsOfferingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex font-sans antialiased selection:bg-[#0B1528] selection:text-white">
      
      {/* Sidebar with navy blue palette, gold accent logo & temple selector */}
      <Sidebar 
        currentTab={currentTab} 
        onSelectTab={handleSelectTab}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Header with Title, Portal Subtitle, Role Switcher Pill & Profile Avatar */}
        <Header 
          title={getPageTitle()} 
          subtitle={role === 'TEMPLE_ADMIN' ? 'Temple Admin Portal' : 'BMT Operations Portal'}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6">
          {role === 'BMT_ADMIN' ? (
            <>
              {bmtTab === 'dashboard' && (
                <UnifiedOperationsDashboard
                  onOpenBooking={(b) => setInspectBooking(b)}
                  onNavigateTab={(t) => setBmtTab(t)}
                />
              )}
              {bmtTab === 'settlements' && (
                <SettlementManagement
                  onOpenCreateModal={() => setIsCreateSettlementOpen(true)}
                  onOpenDetailModal={(s) => setInspectSettlement(s)}
                />
              )}
              {bmtTab === 'approvals' && <OfferingApprovalsQueue />}
              {bmtTab === 'temples' && (
                <TempleManagement
                  onOpenOnboardModal={() => setIsOnboardTempleOpen(true)}
                />
              )}
              {bmtTab === 'audit' && <AuditTracking />}
            </>
          ) : (
            <>
              {templeTab === 'dashboard' && (
                <TempleDashboard
                  onOpenBooking={(b) => setInspectBooking(b)}
                  onNavigateTab={(t) => setTempleTab(t)}
                />
              )}
              {templeTab === 'bookings' && (
                <TempleBookings
                  onOpenBooking={(b) => setInspectBooking(b)}
                />
              )}
              {templeTab === 'settlements' && (
                <TempleSettlements
                  onOpenDetailModal={(s) => setInspectSettlement(s)}
                />
              )}
              {templeTab === 'offerings' && (
                <TempleOfferings
                  onOpenCreateOffering={handleOpenCreateOffering}
                  onOpenEditOffering={handleOpenEditOffering}
                />
              )}
            </>
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 py-4 px-6 lg:px-8 text-xs text-slate-500 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              BookMyTemples &copy; {new Date().getFullYear()} &bull; Operational & Financial Governance Portal
            </p>
            <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-medium">
              <span>{role === 'TEMPLE_ADMIN' ? (currentTemple?.name || 'Sanctum Desk') : 'Central HQ Desk'}</span>
              <span>&bull;</span>
              <span className="text-slate-800 font-mono">RBAC Enforced</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Interactive Modals */}
      {inspectBooking && (
        <BookingDetailModal
          booking={inspectBooking}
          onClose={() => setInspectBooking(null)}
        />
      )}

      {inspectSettlement && (
        <SettlementDetailModal
          settlement={inspectSettlement}
          onClose={() => setInspectSettlement(null)}
        />
      )}

      {isCreateSettlementOpen && (
        <CreateSettlementModal
          onClose={() => setIsCreateSettlementOpen(false)}
        />
      )}

      {isOfferingModalOpen && (
        <OfferingModal
          offering={editingOffering}
          onClose={() => {
            setIsOfferingModalOpen(false);
            setEditingOffering(null);
          }}
        />
      )}

      {isOnboardTempleOpen && (
        <OnboardTempleModal
          onClose={() => setIsOnboardTempleOpen(false)}
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AdminPortalContent />
    </AppProvider>
  );
}
