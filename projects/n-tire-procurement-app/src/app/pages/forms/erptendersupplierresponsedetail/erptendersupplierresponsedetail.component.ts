import { erptendersupplierresponsedetailService } from './../../../service/erptendersupplierresponsedetail.service';
import { erptendersupplierresponsedetail } from './../../../model/erptendersupplierresponsedetail.model';
import { ElementRef,Component, OnInit,Inject,Optional,ViewChild,EventEmitter  } from '@angular/core';
import { ToastService } from '../../../../../../n-tire-bo-app/src/app/pages/core/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
//Dropdown - nvarchar(5) - Backoffice -> Fixed Values menu
import { boconfigvalue } from '../../../../../../n-tire-bo-app/src/app/model/boconfigvalue.model';
import { boconfigvalueService } from '../../../../../../n-tire-bo-app/src/app/service/boconfigvalue.service';

//Custom error functions
import { KeyValuePair,MustMatch, DateCompare,MustEnable,MustDisable,Time } from '../../../../../../n-tire-bo-app/src/app/shared/general.validator';

//child table
import {SmartTableDatepickerComponent,SmartTableDatepickerRenderComponent} from '../../../../../../n-tire-bo-app/src/app/custom/smart-table-datepicker.component';
import {SmartTablepopupselectComponent,SmartTablepopupselectRenderComponent} from '../../../../../../n-tire-bo-app/src/app/custom/smart-table-popupselect.component';
import {SmartTableFileRenderComponent} from '../../../../../../n-tire-bo-app/src/app/custom/smart-table-filerender.component';

//Custom control
import { durationComponent } from '../../../../../../n-tire-bo-app/src/app/custom/duration.component';
import { LocalDataSource } from 'ng2-smart-table';
import {Ng2SmartTableComponent} from 'ng2-smart-table';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ShortcutInput, ShortcutEventOutput  } from "ng-keyboard-shortcuts";
//Shortcuts
import { KeyboardShortcutsService } from "ng-keyboard-shortcuts";
//translator
import { TranslateService } from "@ngx-translate/core";
//FK field services
import { erptendersupplierresponse} from './../../../model/erptendersupplierresponse.model';
import { erptendersupplierresponseComponent } from './../../../pages/forms/erptendersupplierresponse/erptendersupplierresponse.component';
import { erptendersupplierresponseService } from './../../../service/erptendersupplierresponse.service';
//popups
import { erptenderdetail} from './../../../model/erptenderdetail.model';
import { erptenderdetailComponent } from './../../../pages/forms/erptenderdetail/erptenderdetail.component';
import { erptenderdetailService } from './../../../service/erptenderdetail.service';
//popups
import { erpitemmaster} from './../../../model/erpitemmaster.model';
import { erpitemmasterComponent } from './../../../pages/forms/erpitemmaster/erpitemmaster.component';
import { erpitemmasterService } from './../../../service/erpitemmaster.service';
//popups
//detail table services
import { switchMap,map, debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, EmailValidator,ValidationErrors } from '@angular/forms';
//primeng services
import { DynamicDialogRef } from 'primeng/dynamicDialog';
import { DynamicDialogConfig } from 'primeng/dynamicDialog';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import {DialogService} from 'primeng/dynamicDialog';
//session,application constants
import { SharedService } from '../../../../../../n-tire-bo-app/src/app/service/shared.service';
import { SessionService } from '../../../../../../n-tire-bo-app/src/app/pages/core/services/session.service';
//custom fields & attachments

@Component({
selector: 'app-erptendersupplierresponsedetail',
templateUrl: './erptendersupplierresponsedetail.component.html',
styles: [],
providers: [ KeyboardShortcutsService ]
})



export class erptendersupplierresponsedetailComponent implements OnInit {
hidelist:any=[];
viewhtml:any='';//stores html view of the screen
showview:boolean=false;//view or edit mode
theme:string="";//current theme
//formdata: any;//current form data
shortcuts: ShortcutInput[] = [];//keyboard keys
showsubmit: boolean = true;//button to show
showGoWorkFlow: boolean = false;
pkList:any;//stores values - used in search, prev, next
pkoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete of pk
pk_tblForm: FormGroup;//pk - autocomplete
pk_tbloptions: any;//pk - autocomplete
pk_tblformatter: any;//pk - autocomplete
toolbarvisible:boolean=true;
customfieldservicelist:any;
CustomFormName:string="";
CustomFormField:string="";
CustomFormFieldValue:string="";
pmenuid:any;
pcurrenturl:any;
isSubmitted:boolean=false;
ShowTableslist:string[]=[];
data:any;
maindata:any;
data3:any=[];
bfilterPopulateerptendersupplierresponsedetails:boolean=false;
dataerptendersupplierresponsedetailsresponseid3:any=[];
dataerptendersupplierresponsedetailstenderdetailid3:any=[];
dataerptendersupplierresponsedetailsitemid3:any=[];
dataerptendersupplierresponsedetailsuom3:any=[];
dataerptendersupplierresponsedetailscurrency3:any=[];
 erptendersupplierresponsedetailForm: FormGroup;
responseidList: erptendersupplierresponse[];
responseidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
responseid_erptendersupplierresponsesForm: FormGroup;//autocomplete
responseid_erptendersupplierresponsesoptions:any;//autocomplete
responseid_erptendersupplierresponsesformatter:any;//autocomplete
tenderdetailidList: erptenderdetail[];
tenderdetailidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
tenderdetailid_erptenderdetailsForm: FormGroup;//autocomplete
tenderdetailid_erptenderdetailsoptions:any;//autocomplete
tenderdetailid_erptenderdetailsformatter:any;//autocomplete
itemidList: erpitemmaster[];
itemidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
itemid_erpitemmastersForm: FormGroup;//autocomplete
itemid_erpitemmastersoptions:any;//autocomplete
itemid_erpitemmastersformatter:any;//autocomplete
uomList: boconfigvalue[];
currencyList: boconfigvalue[];
private exportTime= { hour: 7, minute: 15, meriden: 'PM', format: 24 };
showformtype:any;
formid:any;
pkcol:any;
SESSIONUSERID:any;//current user
erptendersupplierresponsedetailshowOption:boolean;
sessiondata:any;
sourcekey:any;






constructor(
private nav: Location,
private translate: TranslateService,
private keyboard: KeyboardShortcutsService,private router: Router,
private ngbDateParserFormatter: NgbDateParserFormatter,
public dialogRef: DynamicDialogRef,
public dynamicconfig: DynamicDialogConfig,
public dialog: DialogService,
private erptendersupplierresponsedetailservice: erptendersupplierresponsedetailService,
private fb: FormBuilder,
private sharedService: SharedService,
private sessionService: SessionService,
private toastr: ToastService,
//private dialog: NbDialogService,
private configservice:boconfigvalueService,
private erptendersupplierresponseservice:erptendersupplierresponseService,
private erptenderdetailservice:erptenderdetailService,
private erpitemmasterservice:erpitemmasterService,
private currentRoute: ActivatedRoute) { 
this.translate=this.sharedService.translate;
this.data = dynamicconfig;
this.pmenuid=sharedService.menuid;
this.pcurrenturl=sharedService.currenturl;
this.keyboard.add([
{
        key: 'cmd l',
    command: () => this.router.navigate(["/home/" + this.pcurrenturl]),
    preventDefault: true
},
{
        key: 'cmd s',
    command: () => this.onSubmitData(false),
    preventDefault: true
},
{
        key: 'cmd f',
    command: () => this.resetForm(),
    preventDefault: true
}
]);
this.erptendersupplierresponsedetailForm  = this.fb.group({
pk:[null],
responsedetailid: [null],
responseid: [null],
responseiddesc: [null],
tenderdetailid: [null],
tenderdetailiddesc: [null],
tenderid: [null],
itemid: [null],
itemiddesc: [null],
description: [null],
quantity: [null],
uom: [null],
uomdesc: [null],
currency: [null],
currencydesc: [null],
unitprice: [null],
cost: [null],
totalvalue: [null],
status: [null],
statusdesc: [null],
});
}

get f() { return this.erptendersupplierresponsedetailForm.controls; }


//when child screens are clicked - it will be made invisible
ToolBar(prop)
{
this.toolbarvisible=prop;
}

//function called when we navigate to other page.defined in routing
canDeactivate(): Observable<boolean> | boolean {
debugger;
if (this.erptendersupplierresponsedetailForm.dirty && this.erptendersupplierresponsedetailForm.touched ) {
if (confirm('Do you want to exit the page?')) {
return Observable.of(true).delay(1000);
} else {
return Observable.of(false);
}
}
return Observable.of(true);
}

//check Unique fields

//navigation buttons
first()
{
  if(this.pkList.length>0) this.PopulateScreen(this.pkList[0].pkcol);
}

last()
{
 if(this.pkList.length>0) this.PopulateScreen(this.pkList[this.pkList.length-1].pkcol);
}

prev()
{
  debugger;
  let pos = this.pkList.map(function(e:any) { return e.responsedetailid.toString(); }).indexOf(this.formid.toString());
  if(pos>0) this.PopulateScreen(this.pkList[pos-1].pkcol);
}

next()
{
  debugger;
let pos = this.pkList.map(function(e:any) { return e.responsedetailid.toString(); }).indexOf(this.formid.toString());
  if(pos>=0 && pos!=this.pkList.length) this.PopulateScreen(this.pkList[pos+1].pkcol);
}

//on searching in pk autocomplete
  onSelectedpk(pkDetail: any) {
    if (pkDetail.responsedetailid && pkDetail) {
        this.PopulateScreen(pkDetail.pkcol);
    }
  }

// initialize
async ngOnInit() {
//session & theme
this.sessiondata = this.sessionService.getSession();
if (this.sessiondata != null) {
    this.SESSIONUSERID=this.sessiondata.userid;
}

this.theme=this.sessionService.getItem('selected-theme');
this.viewhtml=this.sessionService.getViewHtml();

debugger;
//getting data - from list page, from other screen through dialog
if(this.data!=null && this.data.data!=null)
 {
this.data=this.data.data;
this.maindata = this.data;
}
if(this.maindata!=null && this.maindata.showview!=undefined  && this.maindata.showview!=null)this.showview=this.maindata.showview;
if (this.data != null &&  this.data.event != null && this.data.event.data != null) this.data = this.data.event.data;
 if (this.currentRoute.snapshot.paramMap.get('sourcekey') != null) {
    this.sourcekey= this.currentRoute.snapshot.paramMap.get('sourcekey');
}
let erptendersupplierresponsedetailid = null;

//if view button(eye) is clicked
if ( this.currentRoute.snapshot.paramMap.get('viewid') != null) 
{
this.pkcol=this.currentRoute.snapshot.paramMap.get('viewid');
this.showview=true;
//this.viewhtml=this.sessionService.getViewHtml();
}
else if(this.data!=null && this.data.pkcol!=null)
{
this.pkcol=this.data.pkcol;
}
else
{
this.pkcol=this.currentRoute.snapshot.paramMap.get('id');
this.showformtype  = this.currentRoute.snapshot.paramMap.get('showformtype');
}
//copy the data from previous dialog 
this.PopulateFromMainScreen(this.data,false);
this.PopulateFromMainScreen(this.dynamicconfig.data,true);
if(this.currentRoute.snapshot.paramMap.get('tableid')!=null)
{
this.ShowTableslist=this.currentRoute.snapshot.paramMap.get('tableid').split(',');
}
this.formid=erptendersupplierresponsedetailid;
//this.sharedService.alert(erptendersupplierresponsedetailid);

//if pk is empty - go to resetting form.fill default values.otherwise, fetch records
if (this.pkcol == null){
this.resetForm();
}
else {
if (this.maindata == undefined || this.maindata == null || this.maindata.save == true)await this.PopulateScreen(this.pkcol);
//get the record from api
//foreign keys 
}
this.erptendersupplierresponseservice.geterptendersupplierresponsesList().then(res => 
{
this.responseidList = res as erptendersupplierresponse[];
if(this.erptendersupplierresponsedetailservice.formData && this.erptendersupplierresponsedetailservice.formData.responseid){
this.responseidoptionsEvent.emit(this.responseidList);
this.erptendersupplierresponsedetailForm.patchValue({
    responseid: this.erptendersupplierresponsedetailservice.formData.responseid,
    responseiddesc: this.erptendersupplierresponsedetailservice.formData.responseiddesc,
});
}
{
let arrresponseid = this.responseidList.filter(v => v.responseid == this.erptendersupplierresponsedetailForm.get('responseid').value);
let objresponseid;
if (arrresponseid.length > 0) objresponseid = arrresponseid[0];
if (objresponseid)
{
}
}
}
).catch((err) => {console.log(err);});
this.responseid_erptendersupplierresponsesoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.responseidList.filter(v => v.supplierreference.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.responseid_erptendersupplierresponsesformatter = (result: any) => result.supplierreference;
this.erptenderdetailservice.geterptenderdetailsList().then(res => 
{
this.tenderdetailidList = res as erptenderdetail[];
if(this.erptendersupplierresponsedetailservice.formData && this.erptendersupplierresponsedetailservice.formData.tenderdetailid){
this.tenderdetailidoptionsEvent.emit(this.tenderdetailidList);
this.erptendersupplierresponsedetailForm.patchValue({
    tenderdetailid: this.erptendersupplierresponsedetailservice.formData.tenderdetailid,
    tenderdetailiddesc: this.erptendersupplierresponsedetailservice.formData.tenderdetailiddesc,
});
}
{
let arrtenderdetailid = this.tenderdetailidList.filter(v => v.tenderdetailid == this.erptendersupplierresponsedetailForm.get('tenderdetailid').value);
let objtenderdetailid;
if (arrtenderdetailid.length > 0) objtenderdetailid = arrtenderdetailid[0];
if (objtenderdetailid)
{
}
}
}
).catch((err) => {console.log(err);});
this.tenderdetailid_erptenderdetailsoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.tenderdetailidList.filter(v => v.details.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.tenderdetailid_erptenderdetailsformatter = (result: any) => result.details;
this.erpitemmasterservice.geterpitemmastersList().then(res => 
{
this.itemidList = res as erpitemmaster[];
if(this.erptendersupplierresponsedetailservice.formData && this.erptendersupplierresponsedetailservice.formData.itemid){
this.itemidoptionsEvent.emit(this.itemidList);
this.erptendersupplierresponsedetailForm.patchValue({
    itemid: this.erptendersupplierresponsedetailservice.formData.itemid,
    itemiddesc: this.erptendersupplierresponsedetailservice.formData.itemiddesc,
});
}
{
let arritemid = this.itemidList.filter(v => v.itemid == this.erptendersupplierresponsedetailForm.get('itemid').value);
let objitemid;
if (arritemid.length > 0) objitemid = arritemid[0];
if (objitemid)
{
}
}
}
).catch((err) => {console.log(err);});
this.itemid_erpitemmastersoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.itemidList.filter(v => v.itemcode.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.itemid_erpitemmastersformatter = (result: any) => result.itemcode;
this.configservice.getList("uom").then(res => this.uomList = res as boconfigvalue[]);
this.configservice.getList("currency").then(res => this.currencyList = res as boconfigvalue[]);

//autocomplete
    this.erptendersupplierresponsedetailservice.geterptendersupplierresponsedetailsList().then(res => {
      this.pkList = res as erptendersupplierresponsedetail[];
        this.pkoptionsEvent.emit(this.pkList);
    }
    ).catch((err) => {console.log(err);});
    this.pk_tbloptions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map(value => value.length < 2 ? []
          : this.pkList.filter(v => v.pkcol.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
      );
    this.pk_tblformatter = (result: any) => result.pkcol;

//setting the flag that the screen is not touched 
this.erptendersupplierresponsedetailForm.markAsUntouched();
this.erptendersupplierresponsedetailForm.markAsPristine();
}
onSelectedresponseid(responseidDetail: any) {
if (responseidDetail.responseid && responseidDetail) {
this.erptendersupplierresponsedetailForm.patchValue({
responseid: responseidDetail.responseid,
responseiddesc: responseidDetail.supplierreference,

});

}
}

onSelectedtenderdetailid(tenderdetailidDetail: any) {
if (tenderdetailidDetail.tenderdetailid && tenderdetailidDetail) {
this.erptendersupplierresponsedetailForm.patchValue({
tenderdetailid: tenderdetailidDetail.tenderdetailid,
tenderdetailiddesc: tenderdetailidDetail.details,

});

}
}

onSelecteditemid(itemidDetail: any) {
if (itemidDetail.itemid && itemidDetail) {
this.erptendersupplierresponsedetailForm.patchValue({
itemid: itemidDetail.itemid,
itemiddesc: itemidDetail.itemcode,

});

}
}




resetForm() {
if (this.erptendersupplierresponsedetailForm != null)
this.erptendersupplierresponsedetailForm.reset();
this.erptendersupplierresponsedetailForm.patchValue({
});
this.PopulateFromMainScreen(this.data,false);
this.PopulateFromMainScreen(this.dynamicconfig.data,true);
}

    onDelete() {
        let responsedetailid = this.erptendersupplierresponsedetailForm.get('responsedetailid').value;
        if(responsedetailid!=null)
        {
        if (confirm('Are you sure to delete this record ?')) {
            this.erptendersupplierresponsedetailservice.deleteerptendersupplierresponsedetail(responsedetailid).then(res =>
                {
                this.resetForm();
                }
            ).catch((err) => {console.log(err);});
        }
        }
        else
        {
            this.toastr.addSingle("error","","select a record");
        }
    }
    onCopy(){
    this.erptendersupplierresponsedetailForm.patchValue({
        responsedetailid: null
    });
    if(this.erptendersupplierresponsedetailservice.formData.responsedetailid!=null)this.erptendersupplierresponsedetailservice.formData.responsedetailid=null;
    }
    PopulateFromMainScreen(mainscreendata:any,bdisable:any)
    {
    if(mainscreendata!=null)
    {
      for (let key in mainscreendata) {
if(key!='visiblelist' && key!='hidelist' && key!='event'){
        
        let jsonstring="";
        let json=null;
let ctrltype=typeof (mainscreendata[key]);
if(false)
json="";
        else if(ctrltype=="string")
{
this.erptendersupplierresponsedetailForm.patchValue({[key]:  mainscreendata[key] } );
}
        else
{
this.erptendersupplierresponsedetailForm.patchValue({[key]:  mainscreendata[key] } );
}
{
{
         if(bdisable && this.erptendersupplierresponsedetailForm.controls[key]!=undefined)
{
this.erptendersupplierresponsedetailForm.controls[key].disable({onlySelf: true});
this.hidelist.push(key);
}
}
      }
      }
      }
    }
    }
onClose() {
this.dialogRef.close();
}

onSubmitAndWait() {
if(this.maindata==undefined || this.maindata.save==true  )
{
    this.onSubmitData(false);
}
else if(this.maindata!=null  && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.onSubmitDataDlg(false);
}
else
{
this.onSubmitData(false);
}
}
onSubmit() {
if(this.pkcol == null || (this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2)))
{
this.onSubmitDataDlg(true);
}
else
{
this.onSubmitData(true);
}
}
responsedetailidonChange(evt:any){
let e=evt.value;
}
responseidonChange(evt:any){
let e=evt.value;
}
tenderdetailidonChange(evt:any){
let e=evt.value;
}
tenderidonChange(evt:any){
let e=evt.value;
}
itemidonChange(evt:any){
let e=evt.value;
}
descriptiononChange(evt:any){
let e=evt.value;
}
quantityonChange(evt:any){
let e=evt.value;
}
uomonChange(evt:any){
let e=this.f.uom.value as any;
this.erptendersupplierresponsedetailForm.patchValue({uomdesc:evt.options[evt.options.selectedIndex].text});
}
currencyonChange(evt:any){
let e=this.f.currency.value as any;
this.erptendersupplierresponsedetailForm.patchValue({currencydesc:evt.options[evt.options.selectedIndex].text});
}
unitpriceonChange(evt:any){
let e=evt.value;
}
costonChange(evt:any){
let e=evt.value;
}
totalvalueonChange(evt:any){
let e=evt.value;
}
statusonChange(evt:any){
let e=evt.value;
}

editerptendersupplierresponsedetails() {
this.showview=false;
return false;
}



async PopulateScreen(pkcol:any){
this.erptendersupplierresponsedetailservice.geterptendersupplierresponsedetailsByEID(pkcol).then(res => {

this.erptendersupplierresponsedetailservice.formData=res.erptendersupplierresponsedetail;
let formproperty=res.erptendersupplierresponsedetail.formproperty;
if(formproperty && formproperty.edit==false)this.showview=true;
this.pkcol=res.erptendersupplierresponsedetail.pkcol;
this.formid=res.erptendersupplierresponsedetail.responsedetailid;
this.FillData(res);
}).catch((err) => {console.log(err);});
}

FillData(res:any)
{
this.formid=res.erptendersupplierresponsedetail.responsedetailid;
console.log(res);
//console.log(res.order);
//console.log(res.orderDetails);
this.erptendersupplierresponsedetailForm.patchValue({
responsedetailid: res.erptendersupplierresponsedetail.responsedetailid,
responseid: res.erptendersupplierresponsedetail.responseid,
responseiddesc: res.erptendersupplierresponsedetail.responseiddesc,
tenderdetailid: res.erptendersupplierresponsedetail.tenderdetailid,
tenderdetailiddesc: res.erptendersupplierresponsedetail.tenderdetailiddesc,
tenderid: res.erptendersupplierresponsedetail.tenderid,
itemid: res.erptendersupplierresponsedetail.itemid,
itemiddesc: res.erptendersupplierresponsedetail.itemiddesc,
description: res.erptendersupplierresponsedetail.description,
quantity: res.erptendersupplierresponsedetail.quantity,
uom: res.erptendersupplierresponsedetail.uom,
uomdesc: res.erptendersupplierresponsedetail.uomdesc,
currency: res.erptendersupplierresponsedetail.currency,
currencydesc: res.erptendersupplierresponsedetail.currencydesc,
unitprice: res.erptendersupplierresponsedetail.unitprice,
cost: res.erptendersupplierresponsedetail.cost,
totalvalue: res.erptendersupplierresponsedetail.totalvalue,
status: res.erptendersupplierresponsedetail.status,
statusdesc: res.erptendersupplierresponsedetail.statusdesc,
});
//Child Tables if any
}

validate()
{
let ret=true;
return ret;
}

getHtml(html:any)
{
  let ret = "";
  ret = html;
  for (let key in this.erptendersupplierresponsedetailForm.controls) {
    if (this.erptendersupplierresponsedetailForm.controls[key] != null) {
if(false)
{
if(this.erptendersupplierresponsedetailservice.formData!=null && this.erptendersupplierresponsedetailservice.formData[key]!=null  && this.erptendersupplierresponsedetailservice.formData[key]!='[]' && this.erptendersupplierresponsedetailservice.formData[key]!=undefined && this.erptendersupplierresponsedetailservice.formData[key].length>0)ret = ret.replace(new RegExp('##' + key + '##', 'g'),"http://localhost:5002/"+ JSON.parse(this.erptendersupplierresponsedetailservice.formData[key])[0]["name"]);
}
else if(false)
{
if(this.erptendersupplierresponsedetailservice.formData!=null && this.erptendersupplierresponsedetailservice.formData[key]!=null   && this.erptendersupplierresponsedetailservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='Stars' style='--rating:"+ this.erptendersupplierresponsedetailservice.formData[key]+"></div>");
}
else if(false)
{
if(this.erptendersupplierresponsedetailservice.formData!=null && this.erptendersupplierresponsedetailservice.formData[key]!=null   && this.erptendersupplierresponsedetailservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='progress--circle progress--"+this.erptendersupplierresponsedetailservice.formData[key]+"'><div class='progress__number'>"+this.erptendersupplierresponsedetailservice.formData[key]+"%</div></div>");
}
else
      ret = ret.replace(new RegExp('##' + key + '##', 'g'), this.erptendersupplierresponsedetailForm.controls[key].value);
    }
  }
  return ret;
}

async onSubmitDataDlg(bclear:any) {
this.isSubmitted = true;
if(!this.erptendersupplierresponsedetailForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
var obj=this.erptendersupplierresponsedetailForm.value;
console.log(obj);
this.dialogRef.close(obj);
setTimeout(() => {
//this.dialogRef.destroy();
},200);
}

//This has to come from bomenuactions & procedures
afteraction(mode:any)
{
    let formname="";
    let query="";
    if(mode=="new")
        this.router.navigate(['/home/' + formname + '/' + formname + query]);
    else if(mode=="refresh")
        this.router.navigate(['/home/' + formname + '/' + formname + '/edit/' + this.formid + query]);
}

private erptendersupplierresponsedetailtoggleOption(){
this.erptendersupplierresponsedetailshowOption = this.erptendersupplierresponsedetailshowOption === true ? false : true;
}



async onSubmitData(bclear:any) {
debugger;
this.isSubmitted = true;
let strError="";
Object.keys(this.erptendersupplierresponsedetailForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.erptendersupplierresponsedetailForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            strError+='control: ' + key + ', Error: ' + keyError + '<BR>';
          });
        }
      });
if(strError!="")return this.sharedService.alert(strError);


if(!this.erptendersupplierresponsedetailForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
if(!this.validate())
{
return;
}
this.erptendersupplierresponsedetailservice.formData=this.erptendersupplierresponsedetailForm.value;
if (this.dynamicconfig.data != null)
{
for (let key in this.dynamicconfig.data)
{
if(key!='visiblelist' && key!='hidelist'){
    if (this.erptendersupplierresponsedetailForm.controls[key] != null)
    {
        this.erptendersupplierresponsedetailservice.formData[key] = this.erptendersupplierresponsedetailForm.controls[key].value;
    }
}
}
}
console.log(this.erptendersupplierresponsedetailservice.formData);
this.erptendersupplierresponsedetailservice.formData=this.erptendersupplierresponsedetailForm.value;
this.erptendersupplierresponsedetailservice.saveOrUpdateerptendersupplierresponsedetails().subscribe(
async res => {
debugger;
this.toastr.addSingle("success","","Successfully saved");
this.showview=true;
document.getElementById("contentArea1").scrollTop = 0;
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).erptendersupplierresponsedetail);
    return;
}
else
{
document.getElementById("contentArea1").scrollTop = 0;
}
this.erptendersupplierresponsedetailservice.clearList();
if(bclear){
this.resetForm();
}
else{
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).erptendersupplierresponsedetail);
}
else
{
this.FillData(res);
}
}
this.erptendersupplierresponsedetailForm.markAsUntouched();
this.erptendersupplierresponsedetailForm.markAsPristine();
},
err => {
debugger;
this.toastr.addSingle("error","",err.error);
console.log(err);
}
)
}




//dropdown edit from the screen itself -> One screen like Reportviewer

AddOrEditresponseid( responseid) {
/*let ScreenType='2';
this.dialog.open(erptendersupplierresponseComponent, 
{
data: {responseid:this.erptendersupplierresponsedetailForm.get('responseid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEdittenderdetailid( tenderdetailid) {
/*let ScreenType='2';
this.dialog.open(erptenderdetailComponent, 
{
data: {tenderdetailid:this.erptendersupplierresponsedetailForm.get('tenderdetailid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEdititemid( itemid) {
/*let ScreenType='2';
this.dialog.open(erpitemmasterComponent, 
{
data: {itemid:this.erptendersupplierresponsedetailForm.get('itemid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}



PrevForm() {
let formid=this.sessionService.getItem("key");
let prevform=this.sessionService.getItem("prevform");
this.router.navigate(["/home/"+ prevform + "/"+prevform+"/edit/" + formid]);
}

}



