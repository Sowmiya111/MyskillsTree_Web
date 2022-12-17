import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lmsquotedetail } from '../model/lmsquotedetail.model';
import { environment } from '../../environments/environment';
import { IlmsquotedetailResponse } from '../model/lmsquotedetail.model';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppConstants, DropDownValues } from '../../../../n-tire-biz-app/src/app/shared/helper'
import { SessionService } from '../../../../n-tire-biz-app/src/app/pages/core/services/session.service';
@Injectable({
  providedIn: 'root'
})
export class lmsquotedetailService {
  readonly rootURL = AppConstants.baseURL;

  constructor(private http: HttpClient, private sessionService: SessionService) { }

  valid() {
    return true;

  }
  saveOrUpdate_lmsquotedetails(formData): any {
    if (this.valid()) {
      var body = {
        ...formData,
      };
      return this.http.post(AppConstants.ntirebizURL + '/lmsquotedetail', body);
    }
  }

  getDefaultData(): any {
    if (this.valid()) {
      return this.http.get(AppConstants.ntirebizURL + '/lmsquotedetail' + '/getdefaultdata').toPromise();
    }
  }
  get_lmsquotedetails_List(): any {
    if (this.valid()) {
      return this.http.get(AppConstants.ntirebizURL + '/lmsquotedetail').toPromise();
    }
  }
  getListBy_quotedetailid(quotedetailid: number): any {
    if (this.valid()) {
      return this.http.get(AppConstants.ntirebizURL + '/lmsquotedetail' + '/quotedetailid/' + quotedetailid).toPromise();
    }
  }

  getList(key: string): any {
    if (this.valid()) {
      return this.http.get(AppConstants.ntirebizURL + '/lmsquotedetail' + '/param/' + key).toPromise();
    }
  }


  get_lmsquotedetails_ByEID(id: any): any {
    if (this.valid()) {
      return this.http.get(AppConstants.ntirebizURL + '/lmsquotedetail' + '/e/' + id).toPromise();
    }
  }
  get_lmsquotedetails_ByID(id: number): any {
    if (this.valid()) {
      return this.http.get(AppConstants.ntirebizURL + '/lmsquotedetail' + '/' + id).toPromise();
    }
  }

  delete_lmsquotedetail(id: number): any {
    if (this.valid()) {
      return this.http.delete(AppConstants.ntirebizURL + '/lmsquotedetail' + '/' + id).toPromise();
    }
  }

  getList_opportunityid(): any {
    return this.http.get(AppConstants.ntirecrmURL + '/lmsquotedetail' + '/getList_opportunityid').toPromise();
  }

  getList_productid(): any {
    return this.http.get(AppConstants.ntirecrmURL + '/lmsquotedetail' + '/getList_productid').toPromise();
  }

  getList_uom(): any {
    return this.http.get(AppConstants.ntirecrmURL + '/lmsquotedetail' + '/getList_uom/').toPromise();
  }


}

