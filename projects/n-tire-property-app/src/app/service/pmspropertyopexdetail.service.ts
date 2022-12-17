import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pmspropertyopexdetail } from '../model/pmspropertyopexdetail.model';
import { environment } from '../../environments/environment';
import { IpmspropertyopexdetailResponse } from '../model/pmspropertyopexdetail.model';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {AppConstants} from '../../../../n-tire-bo-app/src/app/shared/helper'
import { SessionService } from '../../../../n-tire-bo-app/src/app/pages/core/services/session.service';
@Injectable({
  providedIn: 'root'
})
export class pmspropertyopexdetailService {
  formData: pmspropertyopexdetail;
  readonly rootURL = AppConstants.baseURL;
  list: pmspropertyopexdetail[];

  constructor(private http: HttpClient,private sessionService: SessionService) { }

valid()
{
return true;

}
  saveOrUpdatepmspropertyopexdetails():any {
  if (this.valid()){ 
    var body = {
      ...this.formData,
    };
    return this.http.post(AppConstants.ntirepropertyURL + '/pmspropertyopexdetail', body);
  }
  }

  saveOrUpdatepmspropertyopexdetailsList():any {
  if (this.valid()){ 
    var body = {
    list:this.list,
    };
    return this.http.post(AppConstants.ntirepropertyURL + '/pmspropertyopexdetail', body);
  }
  }

  getpmspropertyopexdetailsList():any {
  if (this.valid()){ 
    return this.http.get(AppConstants.ntirepropertyURL + '/pmspropertyopexdetail').toPromise();
  }
  }
  getListByopexid(opexid:number):any {
  if (this.valid()){ 
    return this.http.get(AppConstants.ntirepropertyURL + '/pmspropertyopexdetail'+'/opexid/'+opexid).toPromise();
  }
  }

  getList(key:string):any {
  if (this.valid()){ 
    return this.http.get(AppConstants.ntirepropertyURL + '/pmspropertyopexdetail'+'/param/'+key).toPromise();
  }
  }


  getpmspropertyopexdetailsByEID(id:any):any {
  if (this.valid()){ 
    return this.http.get(AppConstants.ntirepropertyURL + '/pmspropertyopexdetail'+'/e/'+id).toPromise();
  }
  }
  getpmspropertyopexdetailsByID(id:number):any {
  if (this.valid()){ 
    return this.http.get(AppConstants.ntirepropertyURL + '/pmspropertyopexdetail'+'/'+id).toPromise();
  }
  }

  deletepmspropertyopexdetail(id:number):any {
  if (this.valid()){ 
    return this.http.delete(AppConstants.ntirepropertyURL + '/pmspropertyopexdetail'+'/'+id).toPromise();
  }
  }
clearList(){
}
refreshList():any{
  if (this.valid()){ 
this.http.get(AppConstants.ntirepropertyURL + '/pmspropertyopexdetail')
.toPromise()
.then(res => this.list = res as any[]);
}
}


}

