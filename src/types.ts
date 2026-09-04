export type UserRole = 'BMT_ADMIN' | 'TEMPLE_ADMIN';

export type BookingStatus = 'Confirmed' | 'Completed' | 'In-Progress' | 'Cancelled';

export type OfferingType = 'Seva' | 'Special Pooja' | 'Classes';

export type OfferingApprovalStatus = 'approved' | 'pending_approval' | 'rejected' | 'draft';

export type SettlementStatus = 'Draft' | 'Generated' | 'Processing' | 'Completed';

export interface ScheduleSlot {
  id: string;
  dayOfWeek: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] or ['Daily']
  startTime: string; // e.g. "06:00 AM"
  endTime: string; // e.g. "07:30 AM"
  capacity: number; // max devotees per slot
  bookedCount?: number;
}

export interface Offering {
  id: string;
  templeId: string;
  templeName: string;
  title: string;
  type: OfferingType;
  deity: string;
  price: number;
  durationMinutes: number;
  description: string;
  prasadIncluded: boolean;
  prasadDetails?: string;
  dressCode?: string;
  sanctumLocation?: string;
  cutoffHoursBeforeSeva?: number;
  approvalStatus: OfferingApprovalStatus;
  isEnabled: boolean; // can only be enabled if approvalStatus === 'approved'
  submittedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  schedules: ScheduleSlot[];
}

export interface Booking {
  id: string;
  bookingRef: string; // e.g. "BMT-KV-2026-9812"
  templeId: string;
  templeName: string;
  offeringId: string;
  offeringTitle: string;
  offeringType: OfferingType;
  devoteeName: string;
  devoteePhone: string;
  devoteeEmail: string;
  gotra: string;
  nakshatra: string;
  rashi: string;
  familyMembers?: string;
  sankalpaNotes?: string;
  bookingDate: string; // YYYY-MM-DD
  slotTime: string;
  status: BookingStatus;
  amount: number;
  platformFee: number;
  templeShare: number;
  prasadDelivery: 'Temple Pickup' | 'Home Delivery' | 'None';
  deliveryAddress?: string;
  trackingNumber?: string;
  paymentRef: string;
  paymentMethod: 'UPI' | 'Net Banking' | 'Credit Card' | 'Debit Card';
  settlementId?: string; // linked settlement record if settled
  priestName?: string;
  priestPhone?: string;
  priestNotes?: string;
  performedAt?: string;
  notificationSent?: boolean;
}

export interface Settlement {
  id: string;
  settlementRef: string; // e.g. "SET-2026-KV-004"
  templeId: string;
  templeName: string;
  periodStart: string;
  periodEnd: string;
  bookingIds: string[];
  bookingCount: number;
  grossAmount: number;
  platformCommission: number;
  gstOnCommission?: number; // 18% GST
  tdsDeduction?: number; // 1% TDS Sec 194C
  netPayoutAmount: number;
  status: SettlementStatus;
  paymentMode?: 'NEFT' | 'RTGS' | 'CMS_BULK';
  createdAt: string;
  generatedAt?: string;
  processingAt?: string;
  completedAt?: string;
  bankAccount: {
    bankName: string;
    accountNumberMasked: string;
    ifsc: string;
    accountHolder: string;
  };
  utrRef?: string;
  notes?: string;
}

export interface Temple {
  id: string;
  name: string;
  city: string;
  state: string;
  primaryDeity: string;
  isActive: boolean;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  trustRegNumber?: string;
  panNumber?: string;
  fcraRegistered?: boolean;
  payoutCycle?: 'Weekly' | 'Bi-Weekly' | 'Monthly';
  bankVerificationStatus?: 'Verified' | 'Pending_Verification';
  bankDetails: {
    bankName: string;
    accountNumberMasked: string;
    ifsc: string;
    accountHolder: string;
  };
  commissionRatePercent: number; // e.g. 5
  establishedYear?: number;
  offeringsCount?: number;
  totalBookingsCount?: number;
  totalGMV?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  action: string;
  category: 'OFFERING' | 'SETTLEMENT' | 'TEMPLE' | 'BOOKING' | 'AUTH';
  details: string;
  templeId?: string;
  templeName?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  templeId?: string;
  templeName?: string;
  designation: string;
  avatarText: string;
}
