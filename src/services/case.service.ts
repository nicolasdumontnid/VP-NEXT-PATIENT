import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Case, SearchCriteria, SearchResult } from '../models/case.model';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private mockCases: Case[] = [
    {
      id: 1,
      title: 'Case #001 - Colon Analysis',
      assignedDoctorId: 1,
      site: 'CHU-Angers',
      sector: 'Colon',
      date: new Date(),
      status: 'pending',
      isScanned: true,
      hasUnseenImages: false,
      isFullyScanned: true,
      hasShares: false
    },
    {
      id: 2,
      title: 'Case #002 - Throat Examination',
      assignedDoctorId: 2,
      site: 'CHU-Caen',
      sector: 'Throat',
      date: new Date(Date.now() - 86400000),
      status: 'urgent',
      isScanned: false,
      hasUnseenImages: true,
      isFullyScanned: false,
      hasShares: true
    },
    {
      id: 3,
      title: 'Case #003 - Cytology Review',
      assignedDoctorId: 1,
      site: 'CHU-Angers',
      sector: 'Cytologie',
      date: new Date(Date.now() - 172800000),
      status: 'completed',
      isScanned: true,
      hasUnseenImages: false,
      isFullyScanned: true,
      hasShares: true
    },
    {
      id: 4,
      title: 'Case #004 - Fluorescence Study',
      assignedDoctorId: 6,
      site: 'CHU-Brest',
      sector: 'Florescence',
      date: new Date(Date.now() - 259200000),
      status: 'pending',
      isScanned: true,
      hasUnseenImages: true,
      isFullyScanned: false,
      hasShares: false
    },
    {
      id: 5,
      title: 'Case #005 - Chest X-ray Analysis',
      assignedDoctorId: 6,
      site: 'CHU-Brest',
      sector: 'Chest',
      date: new Date(Date.now() - 345600000),
      status: 'urgent',
      isScanned: false,
      hasUnseenImages: false,
      isFullyScanned: false,
      hasShares: false
    },
    {
      id: 6,
      title: 'Case #006 - Pulmonary Investigation',
      assignedDoctorId: 8,
      site: 'CHU-Brest',
      sector: 'Lungs',
      date: new Date(Date.now() - 432000000),
      status: 'completed',
      isScanned: true,
      hasUnseenImages: false,
      isFullyScanned: true,
      hasShares: true
    }
  ];

  getById(id: number): Observable<Case | undefined> {
    return of(this.mockCases.find(c => c.id === id)).pipe(delay(300));
  }

  search(criteria: SearchCriteria): Observable<SearchResult<Case>> {
    let filteredCases = [...this.mockCases];
    
    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      filteredCases = filteredCases.filter(c => 
        c.title.toLowerCase().includes(query) || 
        c.site.toLowerCase().includes(query) ||
        c.sector.toLowerCase().includes(query)
      );
    }

    const startIndex = (criteria.page - 1) * criteria.pageSize;
    const endIndex = startIndex + criteria.pageSize;
    const paginatedCases = filteredCases.slice(startIndex, endIndex);

    return of({
      items: paginatedCases,
      total: filteredCases.length,
      page: criteria.page,
      pageSize: criteria.pageSize
    }).pipe(delay(300));
  }

  create(caseData: Omit<Case, 'id'>): Observable<Case> {
    const newCase: Case = {
      ...caseData,
      id: Math.max(...this.mockCases.map(c => c.id)) + 1
    };
    this.mockCases.push(newCase);
    return of(newCase).pipe(delay(300));
  }

  update(id: number, caseData: Partial<Case>): Observable<Case | undefined> {
    const index = this.mockCases.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCases[index] = { ...this.mockCases[index], ...caseData };
      return of(this.mockCases[index]).pipe(delay(300));
    }
    return of(undefined).pipe(delay(300));
  }

  delete(id: number): Observable<boolean> {
    const index = this.mockCases.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCases.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  getCasesAssignedToUser(userId: number): Observable<Case[]> {
    return of(this.mockCases.filter(c => c.assignedDoctorId === userId)).pipe(delay(300));
  }

  getUnassignedCases(): Observable<Case[]> {
    return of(this.mockCases.filter(c => !c.assignedDoctorId)).pipe(delay(300));
  }
}