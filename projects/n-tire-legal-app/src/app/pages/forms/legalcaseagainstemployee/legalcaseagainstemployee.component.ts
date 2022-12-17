import { legalcaseagainstemployeeService } from './../../../service/legalcaseagainstemployee.service';
import { legalcaseagainstemployee } from './../../../model/legalcaseagainstemployee.model';
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
import { legalcase} from './../../../model/legalcase.model';
import { legalcaseComponent } from './../../../pages/forms/legalcase/legalcase.component';
import { legalcaseService } from './../../../service/legalcase.service';
//popups
import { bomasterdata} from '../../../../../../n-tire-bo-app/src/app/model/bomasterdata.model';
import { bomasterdataComponent } from '../../../../../../n-tire-bo-app/src/app/pages/forms/bomasterdata/bomasterdata.component';
import { bomasterdataService } from '../../../../../../n-tire-bo-app/src/app/service/bomasterdata.service';
//popups
import { hrmsemployee} from '../../../../../../n-tire-hrms-app/src/app/model/hrmsemployee.model';
import { hrmsemployeeComponent } from '../../../../../../n-tire-hrms-app/src/app/pages/forms/hrmsemployee/hrmsemployee.component';
import { hrmsemployeeService } from '../../../../../../n-tire-hrms-app/src/app/service/hrmsemployee.service';
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
selector: 'app-legalcaseagainstemployee',
templateUrl: './legalcaseagainstemployee.component.html',
styles: [],
providers: [ KeyboardShortcutsService ]
})



export class legalcaseagainstemployeeComponent implements OnInit {
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
bfilterPopulatelegalcaseagainstemployees:boolean=false;
datalegalcaseagainstemployeescaseid3:any=[];
datalegalcaseagainstemployeesdepartmentid3:any=[];
datalegalcaseagainstemployeesemployeeid3:any=[];
datalegalcaseagainstemployeesissuecategory3:any=[];
 legalcaseagainstemployeeForm: FormGroup;
caseidList: legalcase[];
caseidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
caseid_legalcasesForm: FormGroup;//autocomplete
caseid_legalcasesoptions:any;//autocomplete
caseid_legalcasesformatter:any;//autocomplete
departmentidList: bomasterdata[];
employeeidList: hrmsemployee[];
employeeidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
employeeid_hrmsemployeesForm: FormGroup;//autocomplete
employeeid_hrmsemployeesoptions:any;//autocomplete
employeeid_hrmsemployeesformatter:any;//autocomplete
issuecategoryList: boconfigvalue[];
private exportTime= { hour: 7, minute: 15, meriden: 'PM', format: 24 };
showformtype:any;
formid:any;
pkcol:any;
SESSIONUSERID:any;//current user
legalcaseagainstemployeeshowOption:boolean;
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
private legalcaseagainstemployeeservice: legalcaseagainstemployeeService,
private fb: FormBuilder,
private sharedService: SharedService,
private sessionService: SessionService,
private toastr: ToastService,
//private dialog: NbDialogService,
private configservice:boconfigvalueService,
private legalcaseservice:legalcaseService,
private bomasterdataservice:bomasterdataService,
private hrmsemployeeservice:hrmsemployeeService,
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
this.legalcaseagainstemployeeForm  = this.fb.group({
pk:[null],
caseagainstid: [null],
caseid: [null],
caseiddesc: [null],
departmentid: [null],
departmentiddesc: [null],
employeeid: [null],
employeeiddesc: [null],
issuecategory: [null],
issuecategorydesc: [null],
remarks: [null],
status: [null],
statusdesc: [null],
});
}

get f() { return this.legalcaseagainstemployeeForm.controls; }


//when child screens are clicked - it will be made invisible
ToolBar(prop)
{
this.toolbarvisible=prop;
}

//function called when we navigate to other page.defined in routing
canDeactivate(): Observable<boolean> | boolean {
debugger;
if (this.legalcaseagainstemployeeForm.dirty && this.legalcaseagainstemployeeForm.touched ) {
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
  let pos = this.pkList.map(function(e:any) { return e.caseagainstid.toString(); }).indexOf(this.formid.toString());
  if(pos>0) this.PopulateScreen(this.pkList[pos-1].pkcol);
}

next()
{
  debugger;
let pos = this.pkList.map(function(e:any) { return e.caseagainstid.toString(); }).indexOf(this.formid.toString());
  if(pos>=0 && pos!=this.pkList.length) this.PopulateScreen(this.pkList[pos+1].pkcol);
}

//on searching in pk autocomplete
  onSelectedpk(pkDetail: any) {
    if (pkDetail.caseagainstid && pkDetail) {
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
let legalcaseagainstemployeeid = null;

//if view button(eye) is clicked
if ( this.currentRoute.snapshot.paramMap.get('viewid') != null) 
{
this.pkcol=this.currentRoute.snapshot.paramMap.get('viewid');
this.showview=true;
//this.viewhtml=this.sessionService.getViewHtml();
}
else if (this.currentRoute.snapshot.paramMap.get('usersource') != null) {
  this.pkcol = this.sessionService.getItem('usersource');
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
this.formid=legalcaseagainstemployeeid;
//this.sharedService.alert(legalcaseagainstemployeeid);

//if pk is empty - go to resetting form.fill default values.otherwise, fetch records
if (this.pkcol == null){
this.resetForm();
}
else {
if (this.maindata == undefined || this.maindata == null || this.maindata.save == true)await this.PopulateScreen(this.pkcol);
//get the record from api
//foreign keys 
}
this.legalcaseservice.getlegalcasesList().then(res => 
{
this.caseidList = res as legalcase[];
if(this.legalcaseagainstemployeeservice.formData && this.legalcaseagainstemployeeservice.formData.caseid){
this.caseidoptionsEvent.emit(this.caseidList);
this.legalcaseagainstemployeeForm.patchValue({
    caseid: this.legalcaseagainstemployeeservice.formData.caseid,
    caseiddesc: this.legalcaseagainstemployeeservice.formData.caseiddesc,
});
}
{
let arrcaseid = this.caseidList.filter(v => v.caseid == this.legalcaseagainstemployeeForm.get('caseid').value);
let objcaseid;
if (arrcaseid.length > 0) objcaseid = arrcaseid[0];
if (objcaseid)
{
    this.legalcaseagainstemployeeForm.patchValue({ itemdescription: objcaseid.casenumber });
}
}
}
).catch((err) => {console.log(err);});
this.caseid_legalcasesoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.caseidList.filter(v => v.casenumber.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.caseid_legalcasesformatter = (result: any) => result.casenumber;
this.bomasterdataservice.getList("qghhe").then(res => {
this.departmentidList = res as bomasterdata[];
}).catch((err) => {console.log(err);});
this.hrmsemployeeservice.gethrmsemployeesList().then(res => 
{
this.employeeidList = res as hrmsemployee[];
if(this.legalcaseagainstemployeeservice.formData && this.legalcaseagainstemployeeservice.formData.employeeid){
this.employeeidoptionsEvent.emit(this.employeeidList);
this.legalcaseagainstemployeeForm.patchValue({
    employeeid: this.legalcaseagainstemployeeservice.formData.employeeid,
    employeeiddesc: this.legalcaseagainstemployeeservice.formData.employeeiddesc,
});
}
{
let arremployeeid = this.employeeidList.filter(v => v.employeeid == this.legalcaseagainstemployeeForm.get('employeeid').value);
let objemployeeid;
if (arremployeeid.length > 0) objemployeeid = arremployeeid[0];
if (objemployeeid)
{
}
}
}
).catch((err) => {console.log(err);});
this.employeeid_hrmsemployeesoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.employeeidList.filter(v => v.employeename.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.employeeid_hrmsemployeesformatter = (result: any) => result.employeename;
this.configservice.getList("legalissuecategory").then(res => this.issuecategoryList = res as boconfigvalue[]);

//autocomplete
    this.legalcaseagainstemployeeservice.getlegalcaseagainstemployeesList().then(res => {
      this.pkList = res as legalcaseagainstemployee[];
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
this.legalcaseagainstemployeeForm.markAsUntouched();
this.legalcaseagainstemployeeForm.markAsPristine();
}
onSelectedcaseid(caseidDetail: any) {
if (caseidDetail.caseid && caseidDetail) {
this.legalcaseagainstemployeeForm.patchValue({
caseid: caseidDetail.caseid,
caseiddesc: caseidDetail.casenumber,

});
this.legalcaseagainstemployeeForm.patchValue({itemdescription:caseidDetail.casenumber});

}
}

onSelectedemployeeid(employeeidDetail: any) {
if (employeeidDetail.employeeid && employeeidDetail) {
this.legalcaseagainstemployeeForm.patchValue({
employeeid: employeeidDetail.employeeid,
employeeiddesc: employeeidDetail.employeename,

});

}
}




resetForm() {
if (this.legalcaseagainstemployeeForm != null)
this.legalcaseagainstemployeeForm.reset();
this.legalcaseagainstemployeeForm.patchValue({
});
this.PopulateFromMainScreen(this.data,false);
this.PopulateFromMainScreen(this.dynamicconfig.data,true);
}

    onDelete() {
        let caseagainstid = this.legalcaseagainstemployeeForm.get('caseagainstid').value;
        if(caseagainstid!=null)
        {
        if (confirm('Are you sure to delete this record ?')) {
            this.legalcaseagainstemployeeservice.deletelegalcaseagainstemployee(caseagainstid).then(res =>
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
    this.legalcaseagainstemployeeForm.patchValue({
        caseagainstid: null
    });
    if(this.legalcaseagainstemployeeservice.formData.caseagainstid!=null)this.legalcaseagainstemployeeservice.formData.caseagainstid=null;
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
this.legalcaseagainstemployeeForm.patchValue({[key]:  mainscreendata[key] } );
}
        else
{
this.legalcaseagainstemployeeForm.patchValue({[key]:  mainscreendata[key] } );
}
{
{
         if(bdisable && this.legalcaseagainstemployeeForm.controls[key]!=undefined)
{
this.legalcaseagainstemployeeForm.controls[key].disable({onlySelf: true});
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
if(this.maindata==undefined || this.maindata.pkcol!='' || this.maindata.save==true  )
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
if(this.maindata==undefined || this.maindata.pkcol!='' || this.maindata.save==true  )
{
    this.onSubmitData(true);
}
else if( (this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2)))
{
this.onSubmitDataDlg(true);
}
else
{
this.onSubmitData(true);
}
}
caseagainstidonChange(evt:any){
let e=evt.value;
}
caseidonChange(evt:any){
let e=evt.value;
}
departmentidonChange(evt:any){
let e=evt.value;
this.legalcaseagainstemployeeForm.patchValue({departmentiddesc:evt.options[evt.options.selectedIndex].text});
}
employeeidonChange(evt:any){
let e=evt.value;
}
issuecategoryonChange(evt:any){
let e=this.f.issuecategory.value as any;
this.legalcaseagainstemployeeForm.patchValue({issuecategorydesc:evt.options[evt.options.selectedIndex].text});
}
remarksonChange(evt:any){
let e=evt.value;
}
statusonChange(evt:any){
let e=evt.value;
}

editlegalcaseagainstemployees() {
this.showview=false;
return false;
}



async PopulateScreen(pkcol:any){
this.legalcaseagainstemployeeservice.getlegalcaseagainstemployeesByEID(pkcol).then(res => {

this.legalcaseagainstemployeeservice.formData=res.legalcaseagainstemployee;
let formproperty=res.legalcaseagainstemployee.formproperty;
if(formproperty && formproperty.edit==false)this.showview=true;
this.pkcol=res.legalcaseagainstemployee.pkcol;
this.formid=res.legalcaseagainstemployee.caseagainstid;
this.FillData(res);
}).catch((err) => {console.log(err);});
}

FillData(res:any)
{
this.legalcaseagainstemployeeservice.formData=res.legalcaseagainstemployee;
this.formid=res.legalcaseagainstemployee.caseagainstid;
console.log(res);
//console.log(res.order);
//console.log(res.orderDetails);
this.legalcaseagainstemployeeForm.patchValue({
caseagainstid: res.legalcaseagainstemployee.caseagainstid,
caseid: res.legalcaseagainstemployee.caseid,
caseiddesc: res.legalcaseagainstemployee.caseiddesc,
departmentid: res.legalcaseagainstemployee.departmentid,
departmentiddesc: res.legalcaseagainstemployee.departmentiddesc,
employeeid: res.legalcaseagainstemployee.employeeid,
employeeiddesc: res.legalcaseagainstemployee.employeeiddesc,
issuecategory: res.legalcaseagainstemployee.issuecategory,
issuecategorydesc: res.legalcaseagainstemployee.issuecategorydesc,
remarks: res.legalcaseagainstemployee.remarks,
status: res.legalcaseagainstemployee.status,
statusdesc: res.legalcaseagainstemployee.statusdesc,
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
  for (let key in this.legalcaseagainstemployeeForm.controls) {
    if (this.legalcaseagainstemployeeForm.controls[key] != null) {
if(false)
{
if(this.legalcaseagainstemployeeservice.formData!=null && this.legalcaseagainstemployeeservice.formData[key]!=null  && this.legalcaseagainstemployeeservice.formData[key]!='[]' && this.legalcaseagainstemployeeservice.formData[key]!=undefined && this.legalcaseagainstemployeeservice.formData[key].length>0)ret = ret.replace(new RegExp('##' + key + '##', 'g'),"http://localhost:5002/"+ JSON.parse(this.legalcaseagainstemployeeservice.formData[key])[0]["name"]);
}
else if(false)
{
if(this.legalcaseagainstemployeeservice.formData!=null && this.legalcaseagainstemployeeservice.formData[key]!=null   && this.legalcaseagainstemployeeservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='Stars' style='--rating:"+ this.legalcaseagainstemployeeservice.formData[key]+"></div>");
}
else if(false)
{
if(this.legalcaseagainstemployeeservice.formData!=null && this.legalcaseagainstemployeeservice.formData[key]!=null   && this.legalcaseagainstemployeeservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='progress--circle progress--"+this.legalcaseagainstemployeeservice.formData[key]+"'><div class='progress__number'>"+this.legalcaseagainstemployeeservice.formData[key]+"%</div></div>");
}
else
      ret = ret.replace(new RegExp('##' + key + '##', 'g'), this.legalcaseagainstemployeeForm.controls[key].value);
    }
  }
  return ret;
}

async onSubmitDataDlg(bclear:any) {
this.isSubmitted = true;
if(!this.legalcaseagainstemployeeForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
var obj=this.legalcaseagainstemployeeForm.value;
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

private legalcaseagainstemployeetoggleOption(){
this.legalcaseagainstemployeeshowOption = this.legalcaseagainstemployeeshowOption === true ? false : true;
}



async onSubmitData(bclear:any) {
debugger;
this.isSubmitted = true;
let strError="";
Object.keys(this.legalcaseagainstemployeeForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.legalcaseagainstemployeeForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            strError+='control: ' + key + ', Error: ' + keyError + '<BR>';
          });
        }
      });
if(strError!="")return this.sharedService.alert(strError);


if(!this.legalcaseagainstemployeeForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
if(!this.validate())
{
return;
}
this.legalcaseagainstemployeeservice.formData=this.legalcaseagainstemployeeForm.value;
if (this.dynamicconfig.data != null)
{
for (let key in this.dynamicconfig.data)
{
if(key!='visiblelist' && key!='hidelist'){
    if (this.legalcaseagainstemployeeForm.controls[key] != null)
    {
        this.legalcaseagainstemployeeservice.formData[key] = this.legalcaseagainstemployeeForm.controls[key].value;
    }
}
}
}
console.log(this.legalcaseagainstemployeeservice.formData);
this.legalcaseagainstemployeeservice.formData=this.legalcaseagainstemployeeForm.value;
this.legalcaseagainstemployeeservice.saveOrUpdatelegalcaseagainstemployees().subscribe(
async res => {
debugger;
this.toastr.addSingle("success","","Successfully saved");
this.showview=true;
document.getElementById("contentArea1").scrollTop = 0;
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).legalcaseagainstemployee);
    return;
}
else
{
document.getElementById("contentArea1").scrollTop = 0;
}
this.legalcaseagainstemployeeservice.clearList();
if(bclear){
this.resetForm();
}
else{
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).legalcaseagainstemployee);
}
else
{
this.FillData(res);
}
}
this.legalcaseagainstemployeeForm.markAsUntouched();
this.legalcaseagainstemployeeForm.markAsPristine();
},
err => {
debugger;
this.toastr.addSingle("error","",err.error);
console.log(err);
}
)
}




//dropdown edit from the screen itself -> One screen like Reportviewer

AddOrEditcaseid( caseid) {
/*let ScreenType='2';
this.dialog.open(legalcaseComponent, 
{
data: {caseid:this.legalcaseagainstemployeeForm.get('caseid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEditdepartmentid( masterdataid) {
/*let ScreenType='2';
this.dialog.open(bomasterdataComponent, 
{
data: {masterdataid:this.legalcaseagainstemployeeForm.get('departmentid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEditemployeeid( employeeid) {
/*let ScreenType='2';
this.dialog.open(hrmsemployeeComponent, 
{
data: {employeeid:this.legalcaseagainstemployeeForm.get('employeeid').value, ScreenType:2 }
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



