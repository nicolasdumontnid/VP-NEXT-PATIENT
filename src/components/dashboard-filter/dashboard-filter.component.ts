import { Component, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterState } from '../../models/filter.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CaseService } from '../../services/case.service';
import { Case } from '../../models/case.model';

interface FilterOption {
  name: string;
  count: number;
  site?: string;
}

interface DoctorOption extends FilterOption {
  id: number;
  site: string;
}

@Component({
  selector: 'app-dashboard-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-filter.component.html',
  styleUrl: './dashboard-filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<FilterState>();

  isCollapsed = false;
  
  filterState: FilterState = {
    searchText: '',
    caseType: 'all',
    scanStatus: 'all',
    urgentOnly: false,
    noImagesOnly: false,
    completedSharesOnly: false,
    unseenImagesOnly: false,
    selectedSites: [],
    selectedSectors: [],
    selectedDoctors: [],
    dateRange: 'all',
    dateFrom: undefined,
    dateTo: undefined
  };

  // Filter strings for search inputs
  siteFilter = '';
  sectorFilter = '';
  doctorFilter = '';
  dateFilter = '';

  // Original data
  sites: FilterOption[] = [
    { name: 'CHU-Angers', count: Math.floor(Math.random() * 15) },
    { name: 'CHU-Caen', count: Math.floor(Math.random() * 15) },
    { name: 'CHU-Brest', count: Math.floor(Math.random() * 15) },
    { name: 'Remote site', count: Math.floor(Math.random() * 15) },
    { name: 'CH Le Mans', count: Math.floor(Math.random() * 15) },
    { name: 'AZ Sint-Maarten', count: Math.floor(Math.random() * 15) }
  ];

  sectors: FilterOption[] = [
    { name: 'Colon', count: Math.floor(Math.random() * 15), site: 'CHU-Angers' },
    { name: 'Cytologie', count: Math.floor(Math.random() * 15), site: 'CHU-Angers' },
    { name: 'Florescence', count: Math.floor(Math.random() * 15), site: 'CHU-Angers' },
    { name: 'Lungs', count: Math.floor(Math.random() * 15), site: 'CHU-Brest' },
    { name: 'Chest', count: Math.floor(Math.random() * 15), site: 'CHU-Brest' },
    { name: 'Breast', count: Math.floor(Math.random() * 15), site: 'CHU-Brest' },
    { name: 'Histologie', count: Math.floor(Math.random() * 15), site: 'CHU-Brest' },
    { name: 'Throat', count: Math.floor(Math.random() * 15), site: 'CHU-Caen' },
    { name: 'Oncology', count: Math.floor(Math.random() * 15), site: 'CHU-Caen' },
    { name: 'General', count: Math.floor(Math.random() * 15), site: 'CHU-Caen' }
  ];

  doctors: DoctorOption[] = [];

  // Filtered data
  filteredSites: FilterOption[] = [];
  filteredSectors: FilterOption[] = [];
  filteredDoctors: DoctorOption[] = [];

  // Date strings for inputs
  dateFromString = '';
  dateToString = '';

  constructor(
    private userService: UserService,
    private caseService: CaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeDoctors();
    this.initializeFiltered();
    this.loadCasesAndUpdateFilters();
    this.emitFilter();
  }

  private loadCasesAndUpdateFilters() {
    this.caseService.search({ query: '', page: 1, pageSize: 1000 }).subscribe(result => {
      this.updateFilteredOptions(result.items);
    });
  }

  private updateFilteredOptions(cases: Case[]) {
    // Filter cases based on current selections
    let filteredCases = cases;

    // Apply site filter
    if (this.filterState.selectedSites.length > 0) {
      filteredCases = filteredCases.filter(c => 
        this.filterState.selectedSites.includes(c.site)
      );
    }

    // Apply sector filter
    if (this.filterState.selectedSectors.length > 0) {
      filteredCases = filteredCases.filter(c => 
        this.filterState.selectedSectors.includes(c.sector)
      );
    }

    // Apply doctor filter
    if (this.filterState.selectedDoctors.length > 0) {
      filteredCases = filteredCases.filter(c => 
        this.filterState.selectedDoctors.includes(c.assignedDoctorId)
      );
    }


    // Get available sites, sectors, and doctors from filtered cases
    const availableSites = [...new Set(filteredCases.map(c => c.site))];
    const availableSectors = [...new Set(filteredCases.map(c => c.sector))];
    const availableDoctorIds = [...new Set(filteredCases.map(c => c.assignedDoctorId))];


    // Update filtered sites
    this.filteredSites = this.sites.filter(site => 
      availableSites.includes(site.name) && 
      site.name.toLowerCase().includes(this.siteFilter.toLowerCase())
    ).map(site => ({
      ...site,
      count: cases.filter(c => 
        c.site === site.name &&
        (this.filterState.selectedSectors.length === 0 || this.filterState.selectedSectors.includes(c.sector)) &&
        (this.filterState.selectedDoctors.length === 0 || this.filterState.selectedDoctors.includes(c.assignedDoctorId))
      ).length
    }));

    // Update filtered sectors
    let availableSectorsForSites = this.sectors;
    
    // If sites are selected, only show sectors that belong to those sites
    if (this.filterState.selectedSites.length > 0) {
      availableSectorsForSites = this.sectors.filter(s => 
        this.filterState.selectedSites.includes(s.site!)
      );
    }
    
    this.filteredSectors = availableSectorsForSites.filter(sector => 
      availableSectors.includes(sector.name) && 
      sector.name.toLowerCase().includes(this.sectorFilter.toLowerCase())
    ).map(sector => ({
      ...sector,
      count: cases.filter(c => 
        c.sector === sector.name &&
        (this.filterState.selectedSites.length === 0 || this.filterState.selectedSites.includes(c.site)) &&
        (this.filterState.selectedDoctors.length === 0 || this.filterState.selectedDoctors.includes(c.assignedDoctorId))
      ).length
    }));

    // Update filtered doctors - only show doctors from available sites
    let availableDoctorsForSites = this.doctors;
    if (this.filterState.selectedSites.length > 0) {
      availableDoctorsForSites = this.doctors.filter(doctor => 
        this.filterState.selectedSites.includes(doctor.site)
      );
    }
    
    this.filteredDoctors = this.doctors.filter(doctor => 
      availableDoctorIds.includes(doctor.id) &&
      availableDoctorsForSites.some(d => d.id === doctor.id) &&
      doctor.name.toLowerCase().includes(this.doctorFilter.toLowerCase())
    ).map(doctor => ({
      ...doctor,
      count: cases.filter(c => 
        c.assignedDoctorId === doctor.id &&
        (this.filterState.selectedSites.length === 0 || this.filterState.selectedSites.includes(c.site)) &&
        (this.filterState.selectedSectors.length === 0 || this.filterState.selectedSectors.includes(c.sector))
      ).length
    }));

    this.cdr.markForCheck();
  }

  private initializeDoctors() {
    this.userService.getAllUsers().subscribe(users => {
      this.doctors = users.map(user => ({
        id: user.id,
        name: user.name,
        count: Math.floor(Math.random() * 15),
        site: user.site
      }));
      this.filteredDoctors = [...this.doctors];
      this.cdr.markForCheck();
      this.loadCasesAndUpdateFilters();
    });
  }

  private initializeFiltered() {
    this.filteredSites = [...this.sites];
    this.filteredSectors = [...this.sectors];
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  onFilterChange() {
    this.loadCasesAndUpdateFilters();
    this.emitFilter();
  }

  filterSites() {
    const filter = this.siteFilter.toLowerCase();
    this.loadCasesAndUpdateFilters();
  }

  filterSectors() {
    const filter = this.sectorFilter.toLowerCase();
    this.loadCasesAndUpdateFilters();
  }

  filterDoctors() {
    const filter = this.doctorFilter.toLowerCase();
    this.loadCasesAndUpdateFilters();
  }

  toggleSite(siteName: string) {
    const index = this.filterState.selectedSites.indexOf(siteName);
    if (index > -1) {
      this.filterState.selectedSites.splice(index, 1);
    } else {
      this.filterState.selectedSites.push(siteName);
    }
    this.loadCasesAndUpdateFilters();
    this.emitFilter();
  }

  toggleSector(sectorName: string) {
    const index = this.filterState.selectedSectors.indexOf(sectorName);
    if (index > -1) {
      this.filterState.selectedSectors.splice(index, 1);
    } else {
      this.filterState.selectedSectors.push(sectorName);
    }
    this.loadCasesAndUpdateFilters();
    this.emitFilter();
  }

  toggleDoctor(doctorId: number) {
    const index = this.filterState.selectedDoctors.indexOf(doctorId);
    if (index > -1) {
      this.filterState.selectedDoctors.splice(index, 1);
    } else {
      this.filterState.selectedDoctors.push(doctorId);
    }
    this.loadCasesAndUpdateFilters();
    this.emitFilter();
  }

  onDateRangeChange(range: string) {
    this.filterState.dateRange = range as any;
    const today = new Date();
    
    switch (range) {
      case 'all':
        this.filterState.dateFrom = undefined;
        this.filterState.dateTo = undefined;
        this.dateFromString = '';
        this.dateToString = '';
        break;
      case 'today':
        this.filterState.dateFrom = today;
        this.filterState.dateTo = today;
        this.dateFromString = this.formatDateForInput(today);
        this.dateToString = this.formatDateForInput(today);
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        this.filterState.dateFrom = yesterday;
        this.filterState.dateTo = yesterday;
        this.dateFromString = this.formatDateForInput(yesterday);
        this.dateToString = this.formatDateForInput(yesterday);
        break;
      case 'last_week':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        this.filterState.dateFrom = monthAgo;
        this.filterState.dateTo = today;
        this.dateFromString = this.formatDateForInput(monthAgo);
        this.dateToString = this.formatDateForInput(today);
        break;
      case 'last_month':
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        this.filterState.dateFrom = sixMonthsAgo;
        this.filterState.dateTo = today;
        this.dateFromString = this.formatDateForInput(sixMonthsAgo);
        this.dateToString = this.formatDateForInput(today);
        break;
      case 'from':
        this.filterState.dateFrom = undefined;
        this.filterState.dateTo = today;
        this.dateFromString = '';
        this.dateToString = this.formatDateForInput(today);
        break;
    }
    this.loadCasesAndUpdateFilters();
    this.emitFilter();
  }

  onManualDateChange() {
    this.filterState.dateRange = 'from';
    this.filterState.dateFrom = this.dateFromString ? new Date(this.dateFromString) : undefined;
    this.filterState.dateTo = this.dateToString ? new Date(this.dateToString) : undefined;
    this.loadCasesAndUpdateFilters();
    this.emitFilter();
  }

  public getRandomCount(): number {
    return Math.floor(Math.random() * 16);
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private emitFilter() {
    this.filterChange.emit({ ...this.filterState });
  }
}