import { erprfqsupplierService } from './../../../service/erprfqsupplier.service';
import { erprfqsupplier } from './../../../model/erprfqsupplier.model';
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
import { erprfqmaster} from './../../../model/erprfqmaster.model';
import { erprfqmasterComponent } from './../../../pages/forms/erprfqmaster/erprfqmaster.component';
import { erprfqmasterService } from './../../../service/erprfqmaster.service';
//popups
import { erppurchaserequestdetail} from './../../../model/erppurchaserequestdetail.model';
import { erppurchaserequestdetailComponent } from './../../../pages/forms/erppurchaserequestdetail/erppurchaserequestdetail.component';
import { erppurchaserequestdetailService } from './../../../service/erppurchaserequestdetail.service';
//popups
import { erpsuppliermaster} from './../../../model/erpsuppliermaster.model';
import { erpsuppliermasterComponent } from './../../../pages/forms/erpsuppliermaster/erpsuppliermaster.component';
import { erpsuppliermasterService } from './../../../service/erpsuppliermaster.service';
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
selector: 'app-erprfqsupplier',
templateUrl: './erprfqsupplier.component.html',
styles: [],
providers: [ KeyboardShortcutsService ]
})



export class erprfqsupplierComponent implements OnInit {
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
bfilterPopulateerprfqsuppliers:boolean=false;
dataerprfqsuppliersrfqid3:any=[];
dataerprfqsuppliersrfqdetailid3:any=[];
dataerprfqsupplierssupplierid3:any=[];
 erprfqsupplierForm: FormGroup;
rfqidList: erprfqmaster[];
rfqidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
rfqid_erprfqmastersForm: FormGroup;//autocomplete
rfqid_erprfqmastersoptions:any;//autocomplete
rfqid_erprfqmastersformatter:any;//autocomplete
rfqdetailidList: erppurchaserequestdetail[];
rfqdetailidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
rfqdetailid_erppurchaserequestdetailsForm: FormGroup;//autocomplete
rfqdetailid_erppurchaserequestdetailsoptions:any;//autocomplete
rfqdetailid_erppurchaserequestdetailsformatter:any;//autocomplete
supplieridList: erpsuppliermaster[];
supplieridoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
supplierid_erpsuppliermastersForm: FormGroup;//autocomplete
supplierid_erpsuppliermastersoptions:any;//autocomplete
supplierid_erpsuppliermastersformatter:any;//autocomplete
private exportTime= { hour: 7, minute: 15, meriden: 'PM', format: 24 };
showformtype:any;
formid:any;
pkcol:any;
SESSIONUSERID:any;//current user
erprfqsuppliershowOption:boolean;
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
private erprfqsupplierservice: erprfqsupplierService,
private fb: FormBuilder,
private sharedService: SharedService,
private sessionService: SessionService,
private toastr: ToastService,
//private dialog: NbDialogService,
private configservice:boconfigvalueService,
private erprfqmasterservice:erprfqmasterService,
private erppurchaserequestdetailservice:erppurchaserequestdetailService,
private erpsuppliermasterservice:erpsuppliermasterService,
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
this.erprfqsupplierForm  = this.fb.group({
pk:[null],
rfqitemsupplierid: [null],
rfqid: [null],
rfqiddesc: [null],
rfqdetailid: [null],
rfqdetailiddesc: [null],
itemid: [null],
itemdescription: [null],
uom: [null],
quantity: [null],
requiredbefore: [null],
supplierid: [null],
supplieriddesc: [null],
contact: [null],
notes: [null],
supplierquoteid: [null],
status: [null],
statusdesc: [null],
});
}

get f() { return this.erprfqsupplierForm.controls; }


//when child screens are clicked - it will be made invisible
ToolBar(prop)
{
this.toolbarvisible=prop;
}

//function called when we navigate to other page.defined in routing
canDeactivate(): Observable<boolean> | boolean {
debugger;
if (this.erprfqsupplierForm.dirty && this.erprfqsupplierForm.touched ) {
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
  let pos = this.pkList.map(function(e:any) { return e.rfqitemsupplierid.toString(); }).indexOf(this.formid.toString());
  if(pos>0) this.PopulateScreen(this.pkList[pos-1].pkcol);
}

next()
{
  debugger;
let pos = this.pkList.map(function(e:any) { return e.rfqitemsupplierid.toString(); }).indexOf(this.formid.toString());
  if(pos>=0 && pos!=this.pkList.length) this.PopulateScreen(this.pkList[pos+1].pkcol);
}

//on searching in pk autocomplete
  onSelectedpk(pkDetail: any) {
    if (pkDetail.rfqitemsupplierid && pkDetail) {
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
let erprfqsupplierid = null;

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
this.formid=erprfqsupplierid;
//this.sharedService.alert(erprfqsupplierid);

//if pk is empty - go to resetting form.fill default values.otherwise, fetch records
if (this.pkcol == null){
this.resetForm();
}
else {
if (this.maindata == undefined || this.maindata == null || this.maindata.save == true)await this.PopulateScreen(this.pkcol);
//get the record from api
//foreign keys 
}
this.erprfqmasterservice.geterprfqmastersList().then(res => 
{
this.rfqidList = res as erprfqmaster[];
if(this.erprfqsupplierservice.formData && this.erprfqsupplierservice.formData.rfqid){
this.rfqidoptionsEvent.emit(this.rfqidList);
this.erprfqsupplierForm.patchValue({
    rfqid: this.erprfqsupplierservice.formData.rfqid,
    rfqiddesc: this.erprfqsupplierservice.formData.rfqiddesc,
});
}
{
let arrrfqid = this.rfqidList.filter(v => v.rfqid == this.erprfqsupplierForm.get('rfqid').value);
let objrfqid;
if (arrrfqid.length > 0) objrfqid = arrrfqid[0];
if (objrfqid)
{
}
}
}
).catch((err) => {console.log(err);});
this.rfqid_erprfqmastersoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.rfqidList.filter(v => v.rfqcode.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.rfqid_erprfqmastersformatter = (result: any) => result.rfqcode;
this.erppurchaserequestdetailservice.geterppurchaserequestdetailsList().then(res => 
{
this.rfqdetailidList = res as erppurchaserequestdetail[];
if(this.erprfqsupplierservice.formData && this.erprfqsupplierservice.formData.rfqdetailid){
this.rfqdetailidoptionsEvent.emit(this.rfqdetailidList);
this.erprfqsupplierForm.patchValue({
    rfqdetailid: this.erprfqsupplierservice.formData.rfqdetailid,
    rfqdetailiddesc: this.erprfqsupplierservice.formData.rfqdetailiddesc,
});
}
{
let arrrfqdetailid = this.rfqdetailidList.filter(v => v.prsdetailid == this.erprfqsupplierForm.get('rfqdetailid').value);
let objrfqdetailid;
if (arrrfqdetailid.length > 0) objrfqdetailid = arrrfqdetailid[0];
if (objrfqdetailid)
{
}
}
}
).catch((err) => {console.log(err);});
this.rfqdetailid_erppurchaserequestdetailsoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.rfqdetailidList.filter(v => v.itemdescription.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.rfqdetailid_erppurchaserequestdetailsformatter = (result: any) => result.itemdescription;
this.erpsuppliermasterservice.geterpsuppliermastersList().then(res => 
{
this.supplieridList = res as erpsuppliermaster[];
if(this.erprfqsupplierservice.formData && this.erprfqsupplierservice.formData.supplierid){
this.supplieridoptionsEvent.emit(this.supplieridList);
this.erprfqsupplierForm.patchValue({
    supplierid: this.erprfqsupplierservice.formData.supplierid,
    supplieriddesc: this.erprfqsupplierservice.formData.supplieriddesc,
});
}
{
let arrsupplierid = this.supplieridList.filter(v => v.supplierid == this.erprfqsupplierForm.get('supplierid').value);
let objsupplierid;
if (arrsupplierid.length > 0) objsupplierid = arrsupplierid[0];
if (objsupplierid)
{
}
}
}
).catch((err) => {console.log(err);});
this.supplierid_erpsuppliermastersoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.supplieridList.filter(v => v.suppliercode.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.supplierid_erpsuppliermastersformatter = (result: any) => result.suppliercode;

//autocomplete
    this.erprfqsupplierservice.geterprfqsuppliersList().then(res => {
      this.pkList = res as erprfqsupplier[];
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
this.erprfqsupplierForm.markAsUntouched();
this.erprfqsupplierForm.markAsPristine();
}
onSelectedrfqid(rfqidDetail: any) {
if (rfqidDetail.rfqid && rfqidDetail) {
this.erprfqsupplierForm.patchValue({
rfqid: rfqidDetail.rfqid,
rfqiddesc: rfqidDetail.rfqcode,

});

}
}

onSelectedrfqdetailid(rfqdetailidDetail: any) {
if (rfqdetailidDetail.prsdetailid && rfqdetailidDetail) {
this.erprfqsupplierForm.patchValue({
rfqdetailid: rfqdetailidDetail.prsdetailid,
rfqdetailiddesc: rfqdetailidDetail.itemdescription,

});

}
}

onSelectedsupplierid(supplieridDetail: any) {
if (supplieridDetail.supplierid && supplieridDetail) {
this.erprfqsupplierForm.patchValue({
supplierid: supplieridDetail.supplierid,
supplieriddesc: supplieridDetail.suppliercode,

});

}
}




resetForm() {
if (this.erprfqsupplierForm != null)
this.erprfqsupplierForm.reset();
this.erprfqsupplierForm.patchValue({
});
this.PopulateFromMainScreen(this.data,false);
this.PopulateFromMainScreen(this.dynamicconfig.data,true);
}

    onDelete() {
        let rfqitemsupplierid = this.erprfqsupplierForm.get('rfqitemsupplierid').value;
        if(rfqitemsupplierid!=null)
        {
        if (confirm('Are you sure to delete this record ?')) {
            this.erprfqsupplierservice.deleteerprfqsupplier(rfqitemsupplierid).then(res =>
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
    this.erprfqsupplierForm.patchValue({
        rfqitemsupplierid: null
    });
    if(this.erprfqsupplierservice.formData.rfqitemsupplierid!=null)this.erprfqsupplierservice.formData.rfqitemsupplierid=null;
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
        else if(key=="requiredbefore")
this.erprfqsupplierForm.patchValue({"requiredbefore":this.ngbDateParserFormatter.parse(mainscreendata[key]) });
        else if(ctrltype=="string")
{
this.erprfqsupplierForm.patchValue({[key]:  mainscreendata[key] } );
}
        else
{
this.erprfqsupplierForm.patchValue({[key]:  mainscreendata[key] } );
}
{
{
         if(bdisable && this.erprfqsupplierForm.controls[key]!=undefined)
{
this.erprfqsupplierForm.controls[key].disable({onlySelf: true});
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
rfqitemsupplieridonChange(evt:any){
let e=evt.value;
}
rfqidonChange(evt:any){
let e=evt.value;
}
rfqdetailidonChange(evt:any){
let e=evt.value;
}
itemidonChange(evt:any){
let e=evt.value;
}
itemdescriptiononChange(evt:any){
let e=evt.value;
}
uomonChange(evt:any){
let e=evt.value;
}
quantityonChange(evt:any){
let e=evt.value;
}
requiredbeforeonChange(evt:any){
let e=evt.value;
}
supplieridonChange(evt:any){
let e=evt.value;
}
contactonChange(evt:any){
let e=evt.value;
}
notesonChange(evt:any){
let e=evt.value;
}
supplierquoteidonChange(evt:any){
let e=evt.value;
}
statusonChange(evt:any){
let e=evt.value;
}

editerprfqsuppliers() {
this.showview=false;
return false;
}



async PopulateScreen(pkcol:any){
this.erprfqsupplierservice.geterprfqsuppliersByEID(pkcol).then(res => {

this.erprfqsupplierservice.formData=res.erprfqsupplier;
let formproperty=res.erprfqsupplier.formproperty;
if(formproperty && formproperty.edit==false)this.showview=true;
this.pkcol=res.erprfqsupplier.pkcol;
this.formid=res.erprfqsupplier.rfqitemsupplierid;
this.FillData(res);
}).catch((err) => {console.log(err);});
}

FillData(res:any)
{
this.formid=res.erprfqsupplier.rfqitemsupplierid;
console.log(res);
//console.log(res.order);
//console.log(res.orderDetails);
this.erprfqsupplierForm.patchValue({
rfqitemsupplierid: res.erprfqsupplier.rfqitemsupplierid,
rfqid: res.erprfqsupplier.rfqid,
rfqiddesc: res.erprfqsupplier.rfqiddesc,
rfqdetailid: res.erprfqsupplier.rfqdetailid,
rfqdetailiddesc: res.erprfqsupplier.rfqdetailiddesc,
itemid: res.erprfqsupplier.itemid,
itemdescription: res.erprfqsupplier.itemdescription,
uom: res.erprfqsupplier.uom,
quantity: res.erprfqsupplier.quantity,
requiredbefore: this.ngbDateParserFormatter.parse(res.erprfqsupplier.requiredbefore),
supplierid: res.erprfqsupplier.supplierid,
supplieriddesc: res.erprfqsupplier.supplieriddesc,
contact: res.erprfqsupplier.contact,
notes: res.erprfqsupplier.notes,
supplierquoteid: res.erprfqsupplier.supplierquoteid,
status: res.erprfqsupplier.status,
statusdesc: res.erprfqsupplier.statusdesc,
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
  for (let key in this.erprfqsupplierForm.controls) {
    if (this.erprfqsupplierForm.controls[key] != null) {
if(false)
{
if(this.erprfqsupplierservice.formData!=null && this.erprfqsupplierservice.formData[key]!=null  && this.erprfqsupplierservice.formData[key]!='[]' && this.erprfqsupplierservice.formData[key]!=undefined && this.erprfqsupplierservice.formData[key].length>0)ret = ret.replace(new RegExp('##' + key + '##', 'g'),"http://localhost:5002/"+ JSON.parse(this.erprfqsupplierservice.formData[key])[0]["name"]);
}
else if(false)
{
if(this.erprfqsupplierservice.formData!=null && this.erprfqsupplierservice.formData[key]!=null   && this.erprfqsupplierservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='Stars' style='--rating:"+ this.erprfqsupplierservice.formData[key]+"></div>");
}
else if(false)
{
if(this.erprfqsupplierservice.formData!=null && this.erprfqsupplierservice.formData[key]!=null   && this.erprfqsupplierservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='progress--circle progress--"+this.erprfqsupplierservice.formData[key]+"'><div class='progress__number'>"+this.erprfqsupplierservice.formData[key]+"%</div></div>");
}
else
      ret = ret.replace(new RegExp('##' + key + '##', 'g'), this.erprfqsupplierForm.controls[key].value);
    }
  }
  return ret;
}

async onSubmitDataDlg(bclear:any) {
this.isSubmitted = true;
if(!this.erprfqsupplierForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
var obj=this.erprfqsupplierForm.value;
obj.requiredbefore=new Date(this.erprfqsupplierForm.get('requiredbefore').value ? this.ngbDateParserFormatter.format(this.erprfqsupplierForm.get('requiredbefore').value)+'  UTC' :null);
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

private erprfqsuppliertoggleOption(){
this.erprfqsuppliershowOption = this.erprfqsuppliershowOption === true ? false : true;
}



async onSubmitData(bclear:any) {
debugger;
this.isSubmitted = true;
let strError="";
Object.keys(this.erprfqsupplierForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.erprfqsupplierForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            strError+='control: ' + key + ', Error: ' + keyError + '<BR>';
          });
        }
      });
if(strError!="")return this.sharedService.alert(strError);


if(!this.erprfqsupplierForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
if(!this.validate())
{
return;
}
this.erprfqsupplierservice.formData=this.erprfqsupplierForm.value;
if (this.dynamicconfig.data != null)
{
for (let key in this.dynamicconfig.data)
{
if(key!='visiblelist' && key!='hidelist'){
    if (this.erprfqsupplierForm.controls[key] != null)
    {
        this.erprfqsupplierservice.formData[key] = this.erprfqsupplierForm.controls[key].value;
    }
}
}
}
this.erprfqsupplierservice.formData.requiredbefore=new Date(this.erprfqsupplierForm.get('requiredbefore').value ? this.ngbDateParserFormatter.format(this.erprfqsupplierForm.get('requiredbefore').value)+'  UTC' :null);
console.log(this.erprfqsupplierservice.formData);
this.erprfqsupplierservice.formData=this.erprfqsupplierForm.value;
this.erprfqsupplierservice.saveOrUpdateerprfqsuppliers().subscribe(
async res => {
debugger;
this.toastr.addSingle("success","","Successfully saved");
this.showview=true;
document.getElementById("contentArea1").scrollTop = 0;
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).erprfqsupplier);
    return;
}
else
{
document.getElementById("contentArea1").scrollTop = 0;
}
this.erprfqsupplierservice.clearList();
if(bclear){
this.resetForm();
}
else{
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).erprfqsupplier);
}
else
{
this.FillData(res);
}
}
this.erprfqsupplierForm.markAsUntouched();
this.erprfqsupplierForm.markAsPristine();
},
err => {
debugger;
this.toastr.addSingle("error","",err.error);
console.log(err);
}
)
}




//dropdown edit from the screen itself -> One screen like Reportviewer

AddOrEditrfqid( rfqid) {
/*let ScreenType='2';
this.dialog.open(erprfqmasterComponent, 
{
data: {rfqid:this.erprfqsupplierForm.get('rfqid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEditrfqdetailid( prsdetailid) {
/*let ScreenType='2';
this.dialog.open(erppurchaserequestdetailComponent, 
{
data: {prsdetailid:this.erprfqsupplierForm.get('rfqdetailid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEditsupplierid( supplierid) {
/*let ScreenType='2';
this.dialog.open(erpsuppliermasterComponent, 
{
data: {supplierid:this.erprfqsupplierForm.get('supplierid').value, ScreenType:2 }
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



