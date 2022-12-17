import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dmsdownloadqueue } from '../model/dmsdownloadqueue.model';
import { environment } from '../../environments/environment';
import { IdmsdownloadqueueResponse } from '../model/dmsdownloadqueue.model';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {AppConstants} from '../../../../n-tire-bo-app/src/app/shared/helper'
import { SessionService } from '../../../../n-tire-bo-app/src/app/pages/core/services/session.service';
@Injectable({
  providedIn: 'root'
})
export class dmsdownloadqueueService {
  formData: dmsdownloadqueue;
  readonly rootURL = AppConstants.baseURL;
  list: dmsdownloadqueue[];

  constructor(private http: HttpClient,private sessionService: SessionService) { }

valid()
{
return true;

}
  saveOrUpdatedmsdownloadqueues():any {
  if (this.valid()){ 
    var body = {
      ...this.formData,
    };
    return this.http.post(AppConstants.ntiredmsURL + '/dmsdownloadqueue', body);
  }
  }

  saveOrUpdatedmsdownloadqueuesList():any {
  if (this.valid()){ 
    var body = {
    list:this.list,
    };
    return this.http.post(AppConstants.ntiredmsURL + '/dmsdownloadqueue', body);
  }
  }

  getdmsdownloadqueuesList():any {
  if (this.valid()){ 
    return this.http.get(AppConstants.ntiredmsURL + '/dmsdownloadqueue').toPromise();
  }
  }
  getListByqueueid(queueid:number):any {
  if (this.valid()){ 
    return this.http.get(AppConstants.ntiredmsURL + '/dmsdownloadqueue'+'/queueid/'+queueid).toPromise();
  }
  }

  getList(key:string):any {
  if (this.valid()){ 
    return this.http.get(AppConstants.ntiredmsURL + '/dmsdownloadqueue'+'/param/'+key).toPromise();
  }
  }


  getdmsdownloadqueuesByEID(id:any):any {
  if (this.valid()){ 
    return this.http.get(AppConstants.ntiredmsURL + '/dmsdownloadqueue'+'/e/'+id).toPromise();
  }
  }
  getdmsdownloadqueuesByID(id:number):any {
  if (this.valid()){ 
    return this.http.get(AppConstants.ntiredmsURL + '/dmsdownloadqueue'+'/'+id).toPromise();
  }
  }

  deletedmsdownloadqueue(id:number):any {
  if (this.valid()){ 
    return this.http.delete(AppConstants.ntiredmsURL + '/dmsdownloadqueue'+'/'+id).toPromise();
  }
  }
clearList(){
}
refreshList():any{
  if (this.valid()){ 
this.http.get(AppConstants.ntiredmsURL + '/dmsdownloadqueue')
.toPromise()
.then(res => this.list = res as any[]);
}
}


}

