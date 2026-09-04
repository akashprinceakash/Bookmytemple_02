import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Temple, Offering, Booking, Settlement, AuditLog, BookingStatus, SettlementStatus, AuthUser } from '../types';
import { initialTemples, initialOfferings, initialBookings, initialSettlements, initialAuditLogs } from '../data/mockData';
import { DEMO_USERS } from '../data/authUsers';

interface AppContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (userOrEmail: AuthUser | string, password?: string) => boolean;
  logout: () => void;
  switchUser: (user: AuthUser) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTempleId: string;
  setActiveTempleId: (templeId: string) => void;
  currentTemple: Temple | undefined;
  temples: Temple[];
  offerings: Offering[];
  bookings: Booking[];
  settlements: Settlement[];
  auditLogs: AuditLog[];
  // Actions
  updateBookingStatus: (bookingId: string, status: BookingStatus, priestNotes?: string) => void;
  updateBookingDetails: (bookingId: string, updates: Partial<Booking>) => void;
  createOffering: (data: Omit<Offering, 'id' | 'approvalStatus' | 'isEnabled' | 'submittedAt' | 'templeName'>) => void;
  updateOffering: (id: string, updates: Partial<Offering>) => void;
  toggleOfferingEnabled: (id: string) => void;
  approveOffering: (offeringId: string) => void;
  rejectOffering: (offeringId: string, reason: string) => void;
  createSettlementBatch: (templeId: string, bookingIds: string[], notes?: string, paymentMode?: 'NEFT' | 'RTGS' | 'CMS_BULK') => void;
  advanceSettlementStatus: (settlementId: string, targetStatus: SettlementStatus, utrRef?: string, notes?: string) => void;
  toggleTempleActive: (templeId: string, reason?: string) => void;
  updateTemple: (templeId: string, updates: Partial<Temple>) => void;
  registerTemple: (data: Omit<Temple, 'id' | 'offeringsCount' | 'totalBookingsCount' | 'totalGMV'>) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH_USER: 'bmt_auth_user_v2',
  ROLE: 'bmt_admin_role',
  TEMPLE_ID: 'bmt_active_temple_id',
  TEMPLES: 'bmt_temples_v1',
  OFFERINGS: 'bmt_offerings_v1',
  BOOKINGS: 'bmt_bookings_v1',
  SETTLEMENTS: 'bmt_settlements_v1',
  AUDIT: 'bmt_audit_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role) return parsed.role;
      } catch (e) {
        console.error(e);
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved === 'TEMPLE_ADMIN' || saved === 'BMT_ADMIN') ? saved : 'BMT_ADMIN';
  });

  const [activeTempleId, setActiveTempleIdState] = useState<string>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.templeId) return parsed.templeId;
      } catch (e) {
        console.error(e);
      }
    }
    return localStorage.getItem(STORAGE_KEYS.TEMPLE_ID) || 'temple-kashi';
  });

  const [temples, setTemples] = useState<Temple[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialTemples;
  });

  const [offerings, setOfferings] = useState<Offering[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFERINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialOfferings;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialBookings;
  });

  const [settlements, setSettlements] = useState<Settlement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTLEMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialSettlements;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialAuditLogs;
  });

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLE_ID, activeTempleId);
  }, [activeTempleId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLES, JSON.stringify(temples));
  }, [temples]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFERINGS, JSON.stringify(offerings));
  }, [offerings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTLEMENTS, JSON.stringify(settlements));
  }, [settlements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (action: string, category: AuditLog['category'], details: string, templeId?: string, templeName?: string) => {
    const currentTempleObj = temples.find(t => t.id === (templeId || activeTempleId));
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorRole: role,
      actorName: role === 'BMT_ADMIN' ? 'BMT Platform Operations' : `${currentTempleObj?.contactPerson || 'Temple Admin'} (${currentTempleObj?.name || 'Temple'})`,
      action,
      category,
      details,
      templeId: templeId || currentTempleObj?.id,
      templeName: templeName || currentTempleObj?.name,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const setActiveTempleId = (templeId: string) => {
    setActiveTempleIdState(templeId);
  };

  const currentTemple = temples.find(t => t.id === activeTempleId);

  // Update Booking Status
  const updateBookingStatus = (bookingId: string, status: BookingStatus, priestNotes?: string) => {
    updateBookingDetails(bookingId, { status, ...(priestNotes ? { priestNotes } : {}) });
  };

  // Detailed Update for Bookings (Archaka assignment, tracking number, etc.)
  const updateBookingDetails = (bookingId: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          ...updates,
          ...(updates.status === 'Completed' && !b.performedAt ? { performedAt: new Date().toISOString() } : {}),
        };
      }
      return b;
    }));

    const bk = bookings.find(b => b.id === bookingId);
    addAuditLog(
      'BOOKING_STATUS_UPDATED',
      'BOOKING',
      `Booking ${bk?.bookingRef || bookingId} updated.${updates.status ? ` Status: "${updates.status}".` : ''}${updates.priestName ? ` Assigned: ${updates.priestName}.` : ''}${updates.trackingNumber ? ` AWB: ${updates.trackingNumber}.` : ''}`,
      bk?.templeId,
      bk?.templeName
    );
  };

  // Create Offering (Created by Temple Team -> MUST start in pending_approval!)
  const createOffering = (data: Omit<Offering, 'id' | 'approvalStatus' | 'isEnabled' | 'submittedAt' | 'templeName'>) => {
    const targetTemple = temples.find(t => t.id === data.templeId);
    const newOffering: Offering = {
      ...data,
      id: `off-${Date.now()}`,
      templeName: targetTemple?.name || 'Temple',
      approvalStatus: 'pending_approval',
      isEnabled: false,
      submittedAt: new Date().toISOString(),
    };

    setOfferings(prev => [newOffering, ...prev]);

    // Update temple offering count
    setTemples(prev => prev.map(t => t.id === data.templeId ? { ...t, offeringsCount: (t.offeringsCount || 0) + 1 } : t));

    addAuditLog(
      'OFFERING_SUBMITTED',
      'OFFERING',
      `Submitted new offering "${newOffering.title}" (${newOffering.type}) for BMT approval.`,
      targetTemple?.id,
      targetTemple?.name
    );
  };

  // Update Offering
  const updateOffering = (id: string, updates: Partial<Offering>) => {
    const existing = offerings.find(o => o.id === id);
    if (!existing) return;

    // If edited by Temple team, re-trigger approval required
    const requiresReapproval = role === 'TEMPLE_ADMIN' && updates.title !== undefined;
    const newApprovalStatus = requiresReapproval ? 'pending_approval' : (updates.approvalStatus || existing.approvalStatus);
    const newIsEnabled = requiresReapproval ? false : (updates.isEnabled !== undefined ? updates.isEnabled : existing.isEnabled);

    setOfferings(prev => prev.map(o => {
      if (o.id === id) {
        return {
          ...o,
          ...updates,
          approvalStatus: newApprovalStatus,
          isEnabled: newIsEnabled,
        };
      }
      return o;
    }));

    addAuditLog(
      'OFFERING_UPDATED',
      'OFFERING',
      `Updated offering "${existing.title}".${requiresReapproval ? ' Re-submitted for BMT approval.' : ''}`,
      existing.templeId,
      existing.templeName
    );
  };

  // Toggle Offering Enabled (Only for Approved offerings!)
  const toggleOfferingEnabled = (id: string) => {
    const off = offerings.find(o => o.id === id);
    if (!off) return;

    if (off.approvalStatus !== 'approved') {
      alert('This offering has not yet been approved by the BMT Admin team. Only approved offerings can be made live.');
      return;
    }

    const nextState = !off.isEnabled;
    setOfferings(prev => prev.map(o => o.id === id ? { ...o, isEnabled: nextState } : o));

    addAuditLog(
      'OFFERING_TOGGLED',
      'OFFERING',
      `Offering "${off.title}" was ${nextState ? 'enabled (Live)' : 'disabled (Paused)'} by ${role === 'BMT_ADMIN' ? 'BMT Admin' : 'Temple Admin'}.`,
      off.templeId,
      off.templeName
    );
  };

  // Approve Offering (BMT Admin)
  const approveOffering = (offeringId: string) => {
    const off = offerings.find(o => o.id === offeringId);
    if (!off) return;

    setOfferings(prev => prev.map(o => {
      if (o.id === offeringId) {
        return {
          ...o,
          approvalStatus: 'approved',
          isEnabled: true, // Go live upon approval
          approvedAt: new Date().toISOString(),
          rejectionReason: undefined,
        };
      }
      return o;
    }));

    addAuditLog(
      'OFFERING_APPROVED',
      'OFFERING',
      `Approved offering "${off.title}" for ${off.templeName}. It is now Live on the platform.`,
      off.templeId,
      off.templeName
    );
  };

  // Reject / Request Revision (BMT Admin)
  const rejectOffering = (offeringId: string, reason: string) => {
    const off = offerings.find(o => o.id === offeringId);
    if (!off) return;

    setOfferings(prev => prev.map(o => {
      if (o.id === offeringId) {
        return {
          ...o,
          approvalStatus: 'rejected',
          isEnabled: false,
          rejectionReason: reason,
        };
      }
      return o;
    }));

    addAuditLog(
      'OFFERING_REJECTED',
      'OFFERING',
      `Offering "${off.title}" was rejected / sent for revision. Reason: "${reason}".`,
      off.templeId,
      off.templeName
    );
  };

  // Create Settlement Batch (BMT Admin)
  const createSettlementBatch = (templeId: string, bookingIds: string[], notes?: string, paymentMode: 'NEFT' | 'RTGS' | 'CMS_BULK' = 'NEFT') => {
    const temple = temples.find(t => t.id === templeId);
    if (!temple) return;

    const selectedBookings = bookings.filter(b => bookingIds.includes(b.id));
    const grossAmount = selectedBookings.reduce((sum, b) => sum + b.amount, 0);
    const commission = Math.round((grossAmount * (temple.commissionRatePercent || 5)) / 100);
    const gstOnCommission = Math.round(commission * 0.18); // 18% GST
    const tdsDeduction = Math.round(grossAmount * 0.01); // 1% TDS Sec 194C
    const netPayoutAmount = grossAmount - commission - gstOnCommission - tdsDeduction;

    const newSettlement: Settlement = {
      id: `set-${Date.now()}`,
      settlementRef: `SET-${new Date().getFullYear()}-${temple.city.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      templeId: temple.id,
      templeName: temple.name,
      periodStart: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
      periodEnd: new Date().toISOString().slice(0, 10),
      bookingIds,
      bookingCount: bookingIds.length,
      grossAmount,
      platformCommission: commission,
      gstOnCommission,
      tdsDeduction,
      netPayoutAmount,
      paymentMode,
      status: 'Generated',
      createdAt: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      bankAccount: temple.bankDetails,
      notes: notes || `Settlement batch for ${bookingIds.length} completed bookings. (Less: 5% Comm, 18% GST on Comm, 1% TDS u/s 194C).`,
    };

    setSettlements(prev => [newSettlement, ...prev]);

    // Tag bookings with this settlement ID
    setBookings(prev => prev.map(b => bookingIds.includes(b.id) ? { ...b, settlementId: newSettlement.settlementRef } : b));

    addAuditLog(
      'SETTLEMENT_CREATED',
      'SETTLEMENT',
      `Created settlement batch ${newSettlement.settlementRef} for ${temple.name}: Gross ₹${grossAmount.toLocaleString('en-IN')}, Net Disbursal ₹${netPayoutAmount.toLocaleString('en-IN')} (less ₹${commission} Comm + ₹${gstOnCommission} GST + ₹${tdsDeduction} TDS) across ${bookingIds.length} bookings.`,
      temple.id,
      temple.name
    );
  };

  // Advance Settlement Lifecycle
  const advanceSettlementStatus = (settlementId: string, targetStatus: SettlementStatus, utrRef?: string, notes?: string) => {
    const set = settlements.find(s => s.id === settlementId);
    if (!set) return;

    setSettlements(prev => prev.map(s => {
      if (s.id === settlementId) {
        return {
          ...s,
          status: targetStatus,
          ...(targetStatus === 'Generated' ? { generatedAt: new Date().toISOString() } : {}),
          ...(targetStatus === 'Processing' ? { processingAt: new Date().toISOString() } : {}),
          ...(targetStatus === 'Completed' ? { completedAt: new Date().toISOString(), utrRef: utrRef || s.utrRef || `UTR-BMT-${Date.now().toString().slice(-8)}` } : {}),
          ...(notes ? { notes: `${s.notes ? s.notes + ' | ' : ''}${notes}` } : {}),
        };
      }
      return s;
    }));

    addAuditLog(
      'SETTLEMENT_STATUS_UPDATED',
      'SETTLEMENT',
      `Settlement ${set.settlementRef} transitioned to "${targetStatus}"${utrRef ? ` (UTR: ${utrRef})` : ''}.`,
      set.templeId,
      set.templeName
    );
  };

  // Activate / Deactivate Temple
  const toggleTempleActive = (templeId: string, reason?: string) => {
    const temple = temples.find(t => t.id === templeId);
    if (!temple) return;

    const nextState = !temple.isActive;
    setTemples(prev => prev.map(t => t.id === templeId ? { ...t, isActive: nextState } : t));

    addAuditLog(
      nextState ? 'TEMPLE_ACTIVATED' : 'TEMPLE_DEACTIVATED',
      'TEMPLE',
      `Temple "${temple.name}" access was ${nextState ? 'Activated' : 'Deactivated'}${reason ? ` (Reason: ${reason})` : ''} by BMT Admin.`,
      temple.id,
      temple.name
    );
  };

  // Update Temple Settings & Governance
  const updateTemple = (templeId: string, updates: Partial<Temple>) => {
    setTemples(prev => prev.map(t => t.id === templeId ? { ...t, ...updates } : t));

    const temple = temples.find(t => t.id === templeId);
    addAuditLog(
      'TEMPLE_UPDATED',
      'TEMPLE',
      `Updated governance parameters for temple "${temple?.name || templeId}".`,
      templeId,
      temple?.name
    );
  };

  // Register New Temple
  const registerTemple = (data: Omit<Temple, 'id' | 'offeringsCount' | 'totalBookingsCount' | 'totalGMV'>) => {
    const newTemple: Temple = {
      ...data,
      id: `temple-${Date.now()}`,
      offeringsCount: 0,
      totalBookingsCount: 0,
      totalGMV: 0,
    };

    setTemples(prev => [...prev, newTemple]);

    addAuditLog(
      'TEMPLE_REGISTERED',
      'TEMPLE',
      `Registered new temple "${newTemple.name}" located in ${newTemple.city}, ${newTemple.state}.`,
      newTemple.id,
      newTemple.name
    );
  };

  const login = (userOrEmail: AuthUser | string, _password?: string): boolean => {
    let targetUser: AuthUser | undefined;

    if (typeof userOrEmail === 'object') {
      targetUser = userOrEmail;
    } else {
      const email = userOrEmail.trim().toLowerCase();
      targetUser = DEMO_USERS.find(u => u.email.toLowerCase() === email);
      if (!targetUser) {
        const isBmt = email.includes('admin') || email.includes('bmt');
        targetUser = {
          id: `custom-user-${Date.now()}`,
          name: email.split('@')[0],
          email: email,
          role: isBmt ? 'BMT_ADMIN' : 'TEMPLE_ADMIN',
          templeId: isBmt ? undefined : 'temple-kashi',
          templeName: isBmt ? undefined : 'Shri Kashi Vishwanath Temple',
          designation: isBmt ? 'Platform Operations Officer' : 'Temple Operations Officer',
          avatarText: email.slice(0, 2).toUpperCase(),
        };
      }
    }

    if (targetUser) {
      setCurrentUser(targetUser);
      setRoleState(targetUser.role);
      if (targetUser.templeId) {
        setActiveTempleIdState(targetUser.templeId);
      }
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(targetUser));
      localStorage.setItem(STORAGE_KEYS.ROLE, targetUser.role);
      if (targetUser.templeId) {
        localStorage.setItem(STORAGE_KEYS.TEMPLE_ID, targetUser.templeId);
      }

      addAuditLog(
        'USER_LOGIN',
        'AUTH',
        `User ${targetUser.name} (${targetUser.email}) logged in with role ${targetUser.role}${targetUser.templeName ? ` for ${targetUser.templeName}` : ''}.`,
        targetUser.templeId,
        targetUser.templeName
      );
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog(
        'USER_LOGOUT',
        'AUTH',
        `User ${currentUser.name} (${currentUser.email}) signed out from the portal.`,
        currentUser.templeId,
        currentUser.templeName
      );
    }
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  };

  const switchUser = (user: AuthUser) => {
    login(user);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.TEMPLES);
    localStorage.removeItem(STORAGE_KEYS.OFFERINGS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.SETTLEMENTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    setCurrentUser(null);
    setTemples(initialTemples);
    setOfferings(initialOfferings);
    setBookings(initialBookings);
    setSettlements(initialSettlements);
    setAuditLogs(initialAuditLogs);
    setRoleState('BMT_ADMIN');
    setActiveTempleIdState('temple-kashi');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchUser,
        role,
        setRole,
        activeTempleId,
        setActiveTempleId,
        currentTemple,
        temples,
        offerings,
        bookings,
        settlements,
        auditLogs,
        updateBookingStatus,
        updateBookingDetails,
        createOffering,
        updateOffering,
        toggleOfferingEnabled,
        approveOffering,
        rejectOffering,
        createSettlementBatch,
        advanceSettlementStatus,
        toggleTempleActive,
        updateTemple,
        registerTemple,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
