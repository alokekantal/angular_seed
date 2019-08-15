import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserCreationService {
    constructor(private http: HttpClient) {

    }
    
    saveOrUpdate (userModel: any): Observable<any> {
        return this.http.post<any>('rest/core/saveUser ', userModel, httpOptions);
    }

    getUserDetail (user_id): Observable<any> {
        return this.http.post<any>('rest/core/loadUser?userId='+user_id, httpOptions);
    }

    checkLoginCodeExists (userCode): Observable<any> {
        return this.http.post<any>('rest/core/checkLoginCodeExists?userCode='+userCode, httpOptions);
    }

    updateUserCurrentShipEntry(shipId) : Observable<any> {
        return this.http.post<any>('rest/core/updateUserCurrentShipEntry?shipId='+shipId, httpOptions);
    }
}