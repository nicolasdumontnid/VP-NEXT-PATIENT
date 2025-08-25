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
      title: 'Case #002 - Cytologie Review',
      assignedDoctorId: 3,
      site: 'CHU-Angers',
      sector: 'Cytologie',
      date: new Date(Date.now() - 86400000),
      status: 'pending',
      isScanned: true,
      hasUnseenImages: false,
      isFullyScanned: true,
      hasShares: false
    },
    {
      id: 3,
      title: 'Case #003 - Florescence Study',
      assignedDoctorId: 9,
      site: 'CHU-Angers',
      sector: 'Florescence',
      date: new Date(Date.now() - 172800000),
      status: 'pending',
      isScanned: true,
      hasUnseenImages: false,
      isFullyScanned: true,
      hasShares: false
    },
    {
      id: 4,
      title: 'Case #004 - Throat Examination',
      assignedDoctorId: 4,
      site: 'CHU-Caen',
      sector: 'Throat',
      date: new Date(Date.now() - 259200000),
      status: 'urgent',
      isScanned: false,
      hasUnseenImages: true,
      isFullyScanned: false,
      hasShares: true
    },
    {
      id: 5,
      title: 'Case #005 - Oncology Review',
      assignedDoctorId: 2,
      site: 'CHU-Caen',
      sector: 'Oncology',
      date: new Date(Date.now() - 345600000),
      status: 'completed',
      isScanned: true,
      hasUnseenImages: false,
      isFullyScanned: true,
      hasShares: true
    },
    {
      id: 6,
      title: 'Case #006 - General Medicine',
      assignedDoctorId: 5,
      site: 'CHU-Caen',
      sector: 'General',
      date: new Date(Date.now() - 432000000),
      status: 'pending',
      isScanned: false,
      hasUnseenImages: false,
      isFullyScanned: false,
      hasShares: false
    },
    {
      id: 7,
      title: 'Case #007 - Lungs Analysis',
      assignedDoctorId: 6,
      site: 'CHU-Brest',
      sector: 'Lungs',
      date: new Date(Date.now() - 518400000),
      status: 'pending',
      isScanned: true,
      hasUnseenImages: true,
      isFullyScanned: false,
      hasShares: false
    },
    {
      id: 8,
      title: 'Case #008 - Chest X-ray Analysis',
      assignedDoctorId: 7,
      site: 'CHU-Brest',
      sector: 'Chest',
      date: new Date(Date.now() - 604800000),
      status: 'urgent',
      isScanned: false,
      hasUnseenImages: false,
      isFullyScanned: false,
      hasShares: false
    },
    {
      id: 9,
      title: 'Case #009 - Breast Screening',
      assignedDoctorId: 6,
      site: 'CHU-Brest',
      sector: 'Breast',
      date: new Date(Date.now() - 691200000),
      status: 'completed',
      isScanned: true,
      hasUnseenImages: false,
      isFullyScanned: true,
      hasShares: true
    },
    {
      id: 10,
      title: 'Case #010 - Histologie Analysis',
      assignedDoctorId: 8,
      site: 'CHU-Brest',
      sector: 'Histologie',
      date: new Date(Date.now() - 777600000),
      status: 'completed',
      isScanned: true,
      hasUnseenImages: false,
      isFullyScanned: true,
      hasShares: true
    },
    {
      id: 11,
      title: 'Case #011 - Remote Care',
      assignedDoctorId: 10,
      site: 'Remote site',
      sector: 'General',
      date: new Date(Date.now() - 864000000),
      status: 'pending',
      isScanned: false,
      hasUnseenImages: true,
      isFullyScanned: false,
      hasShares: false
    },
    {
      id: 12,
      title: 'Case #012 - Colon Follow-up',
      assignedDoctorId: 1,
      site: 'CHU-Angers',
      sector: 'Colon',
      date: new Date(Date.now() - 950400000),
      status: 'completed',
      isScanned: true,
      hasUnseenImages: false,
      isFullyScanned: true,
      hasShares: true
    },
    {
      id: 13,
      title: 'Case #013 - Cytologie Screening',
      assignedDoctorId: 1,
      site: 'CHU-Angers',
      sector: 'Cytologie',
      date: new Date(Date.now() - 1036800000),
      status: 'urgent',
      isScanned: true,
      hasUnseenImages: true,
      isFullyScanned: false,
      hasShares: false
    },
    {
      id: 14,
      title: 'Case #014 - Florescence Research',
      assignedDoctorId: 1,
      site: 'CHU-Angers',
      sector: 'Florescence',
      date: new Date(Date.now() - 1123200000),
      status: 'pending',
      isScanned: false,
      hasUnseenImages: false,
      isFullyScanned: false,
      hasShares: false
    },
    {
      id: 15,
      title: 'Case #015 - General Radiology',
      assignedDoctorId: 4,
      site: 'CHU-Caen',
      sector: 'General',
      date: new Date(Date.now() - 1209600000),
      status: 'pending',
      isScanned: true,
      hasUnseenImages: false,
      isFullyScanned: true,
      hasShares: false
    },
    {
      id: 16,
      title: 'Case #016 - Oncology Imaging',
      assignedDoctorId: 4,
      site: 'CHU-Caen',
      sector: 'Oncology',
      date: new Date(Date.now() - 1296000000),
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