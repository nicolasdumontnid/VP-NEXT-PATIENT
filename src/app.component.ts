import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxHeaderComponent } from './components/inbox-header/inbox-header.component';
import { DashboardFilterComponent } from './components/dashboard-filter/dashboard-filter.component';
import { FilterState } from './models/filter.model';
import { CaseService } from './services/case.service';
import { UserService } from './services/user.service';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, InboxHeaderComponent, DashboardFilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  resultsFound = 6;
  private filterState$ = new BehaviorSubject<FilterState>({
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
  });

  constructor(
    private caseService: CaseService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with mock data for now
    // In a real application, this would involve API calls with the filter state
    this.filterState$.pipe(
      startWith(this.filterState$.value),
      switchMap(filterState => {
        // Here you would normally call your service with the filter criteria
        return this.caseService.search({
          query: filterState.searchText,
          page: 1,
          pageSize: 50
        });
      })
    ).subscribe(result => {
      this.resultsFound = result.total;
      this.cdr.markForCheck();
    });
  }

  onFilterChange(filterState: FilterState) {
    this.filterState$.next(filterState);
  }

  onSortToggle() {
    console.log('Sort toggled');
    // Implement sorting logic here
  }
}