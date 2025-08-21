export interface Case {
  id: number;
  title: string;
  assignedDoctorId: number;
  site: string;
  sector: string;
  date: Date;
  status: 'pending' | 'completed' | 'urgent';
  isScanned: boolean;
  hasUnseenImages: boolean;
  isFullyScanned: boolean;
  hasShares: boolean;
}

export interface SearchCriteria {
  query?: string;
  page: number;
  pageSize: number;
  assignedDoctorId?: number;
  site?: string;
  sector?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}