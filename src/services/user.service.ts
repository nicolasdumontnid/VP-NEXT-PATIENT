import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { User } from '../models/user.model';
import { SearchResult, SearchCriteria } from '../models/case.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUsers: User[] = [
    { id: 1, name: 'Damien', specialty: 'Oncologue', site: 'CHU-Angers' },
    { id: 2, name: 'Nicolas', specialty: 'Oncologue', site: 'CHU-Caen' },
    { id: 3, name: 'Déborah', specialty: 'Pédiatre', site: 'CHU-Angers' },
    { id: 4, name: 'Daniel', specialty: 'Radiographer', site: 'CHU-Caen' },
    { id: 5, name: 'Sylvie', specialty: 'Médecin généraliste', site: 'CHU-Caen' },
    { id: 6, name: 'Claire', specialty: 'Cardiologue', site: 'CHU-Brest' },
    { id: 7, name: 'Julien', specialty: 'Urgentiste', site: 'CHU-Brest' },
    { id: 8, name: 'Fatima', specialty: 'Neurologue', site: 'CHU-Brest' },
    { id: 9, name: 'Thomas', specialty: 'Chirurgien orthopédique', site: 'CHU-Angers' },
    { id: 10, name: 'Marie', specialty: 'Infirmière en chef', site: 'Remote site' }
  ];

  getById(id: number): Observable<User | undefined> {
    return of(this.mockUsers.find(user => user.id === id)).pipe(delay(300));
  }

  search(criteria: SearchCriteria): Observable<SearchResult<User>> {
    let filteredUsers = [...this.mockUsers];
    
    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.specialty.toLowerCase().includes(query)
      );
    }

    const startIndex = (criteria.page - 1) * criteria.pageSize;
    const endIndex = startIndex + criteria.pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return of({
      items: paginatedUsers,
      total: filteredUsers.length,
      page: criteria.page,
      pageSize: criteria.pageSize
    }).pipe(delay(300));
  }

  create(user: Omit<User, 'id'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: Math.max(...this.mockUsers.map(u => u.id)) + 1
    };
    this.mockUsers.push(newUser);
    return of(newUser).pipe(delay(300));
  }

  update(id: number, user: Partial<User>): Observable<User | undefined> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index] = { ...this.mockUsers[index], ...user };
      return of(this.mockUsers[index]).pipe(delay(300));
    }
    return of(undefined).pipe(delay(300));
  }

  delete(id: number): Observable<boolean> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  getCurrentUser(): Observable<User> {
    return this.getById(1).pipe(
      map(user => user!)
    );
  }

  getAllUsers(): Observable<User[]> {
    return of([...this.mockUsers]).pipe(delay(300));
  }
}