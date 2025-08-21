export interface FilterState {
  searchText: string;
  caseType: 'all' | 'my' | 'unassigned';
  scanStatus: 'all' | 'fully_scanned' | 'pending';
  urgentOnly: boolean;
  noImagesOnly: boolean;
  completedSharesOnly: boolean;
  unseenImagesOnly: boolean;
  selectedSites: string[];
  selectedSectors: string[];
  selectedDoctors: number[];
  dateRange: 'all' | 'today' | 'yesterday' | 'last_week' | 'last_month' | 'from';
  dateFrom?: Date;
  dateTo?: Date;
}