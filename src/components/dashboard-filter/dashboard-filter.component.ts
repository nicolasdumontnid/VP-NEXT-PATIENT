import { Component, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterState } from '../../models/filter.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

interface FilterOption {
  name: string;
  count: number;
}

interface DoctorOption extends FilterOption {
  id: number;
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

  // Original data
  sites: FilterOption[] = [
    { name: 'CHU-Angers', count: Math.floor(Math.random() * 15) },
    { name: 'CHU-Caen', count: Math.floor(Math.random() * 15) },
    { name: 'CHU-Brest', count: Math.floor(Math.random() * 15) },
    { name: 'Remote site', count: Math.floor(Math.random() * 15) }
  ];

  sectors: FilterOption[] = [
    { name: 'Colon', count: Math.floor(Math.random() * 15) },
    { name: 'Cytologie', count: Math.floor(Math.random() * 15) },
    { name: 'Florescence', count: Math.floor(Math.random() * 15) },
    { name: 'Lungs', count: Math.floor(Math.random() * 15) },
    { name: 'Chest', count: Math.floor(Math.random() * 15) }
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeDoctors();
    this.initializeFiltered();
    this.emitFilter();
  }

  private initializeDoctors() {
    this.userService.getAllUsers().subscribe(users => {
      this.doctors = users.map(user => ({
        id: user.id,
        name: user.name,
        count: Math.floor(Math.random() * 15)
      }));
      this.filteredDoctors = [...this.doctors];
      this.cdr.markForCheck();
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
    this.emitFilter();
  }

  filterSites() {
    const filter = this.siteFilter.toLowerCase();
    this.filteredSites = this.sites.filter(site => 
      site.name.toLowerCase().includes(filter)
    );
  }

  filterSectors() {
    const filter = this.sectorFilter.toLowerCase();
    this.filteredSectors = this.sectors.filter(sector => 
      sector.name.toLowerCase().includes(filter)
    );
  }

  filterDoctors() {
    const filter = this.doctorFilter.toLowerCase();
    this.filteredDoctors = this.doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(filter)
    );
  }

  toggleSite(siteName: string) {
    const index = this.filterState.selectedSites.indexOf(siteName);
    if (index > -1) {
      this.filterState.selectedSites.splice(index, 1);
    } else {
      this.filterState.selectedSites.push(siteName);
    }
    this.emitFilter();
  }

  toggleSector(sectorName: string) {
    const index = this.filterState.selectedSectors.indexOf(sectorName);
    if (index > -1) {
      this.filterState.selectedSectors.splice(index, 1);
    } else {
      this.filterState.selectedSectors.push(sectorName);
    }
    this.emitFilter();
  }

  toggleDoctor(doctorId: number) {
    const index = this.filterState.selectedDoctors.indexOf(doctorId);
    if (index > -1) {
      this.filterState.selectedDoctors.splice(index, 1);
    } else {
      this.filterState.selectedDoctors.push(doctorId);
    }
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
    this.emitFilter();
  }

  onManualDateChange() {
    this.filterState.dateRange = 'from';
    this.filterState.dateFrom = this.dateFromString ? new Date(this.dateFromString) : undefined;
    this.filterState.dateTo = this.dateToString ? new Date(this.dateToString) : undefined;
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