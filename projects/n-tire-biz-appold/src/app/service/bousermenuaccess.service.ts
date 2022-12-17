import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { bousermenuaccess } from '../model/bousermenuaccess.model';
import { environment } from '../../environments/environment';
import { IbousermenuaccessResponse } from '../model/bousermenuaccess.model';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppConstants, DropDownValues } from '../../../../n-tire-biz-app/src/app/shared/helper'
import { SessionService } from '../../../../n-tire-biz-app/src/app/pages/core/services/session.service';
@Injectable({
  providedIn: 'root'
})
export class bousermenuaccessService {
  readonly rootURL = AppConstants.baseURL;

  constructor(private http: HttpClient, private sessionService: SessionService) { }

  valid() {
    return true;

  }
  saveOrUpdate_bousermenuaccesses(formData): any {
    if (this.valid()) {
      var body = {
        ...formData,
      };
      return this.http.post(AppConstants.ntirebizURL + '/bousermenuaccess', body);
    }
  }

  getDefaultData(): any {
    if (this.valid()) {
      return this.http.get(AppConstants.ntirebizURL + '/bousermenuaccess' + '/getdefaultdata').toPromise();
    }
  }
  get_bousermenuaccesses_List(): any {
    if (this.valid()) {
      return this.http.get(AppConstants.ntirebizURL + '/bousermenuaccess').toPromise();
    }
  }
  getListBy_usermenuaccessid(usermenuaccessid: number): any {
    if (this.valid()) {
      return this.http.get(AppConstants.ntirebizURL + '/bousermenuaccess' + '/usermenuaccessid/' + usermenuaccessid).toPromise();
    }
  }

  getList(key: string): any {
    if (this.valid()) {
      return this.http.get(AppConstants.ntirebizURL + '/bousermenuaccess' + '/param/' + key).toPromise();
    }
  }


  get_bousermenuaccesses_ByEID(id: any): any {
    if (this.valid()) {
      return this.http.get(AppConstants.ntirebizURL + '/bousermenuaccess' + '/e/' + id).toPromise();
    }
  }
  get_bousermenuaccesses_ByID(id: number): any {
    if (this.valid()) {
      return this.http.get(AppConstants.ntirebizURL + '/bousermenuaccess' + '/' + id).toPromise();
    }
  }

  delete_bousermenuaccess(id: number): any {
    if (this.valid()) {
      return this.http.delete(AppConstants.ntirebizURL + '/bousermenuaccess' + '/' + id).toPromise();
    }
  }
  search(filter: { name: string } = { name: '' }, page = 1): Observable<IbousermenuaccessResponse> {
    return this.http.get<IbousermenuaccessResponse>(AppConstants.ntirebizURL + '/bousermenuaccess')
      .pipe(
        tap((response: IbousermenuaccessResponse) => {
          console.log(response);
          //debugger;
          var response1;
          response1 = response;
          response.results = response1.map(bousermenuaccess => new bousermenuaccess(bousermenuaccess.usermenuaccessid, bousermenuaccess.userid, bousermenuaccess.menuid, bousermenuaccess.status))
            // Not filtering in the server since in-memory-web-api has somewhat restricted api
            .filter(bousermenuaccess => bousermenuaccess.menudescription.includes(filter.name))

          return response;
        })
      );
  }



}

