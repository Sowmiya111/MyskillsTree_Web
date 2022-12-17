import { hrmsemployeenomineeService } from './../../../service/hrmsemployeenominee.service';
import { hrmsemployeenominee } from './../../../model/hrmsemployeenominee.model';
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
import { bousermaster} from '../../../../../../n-tire-bo-app/src/app/model/bousermaster.model';
import { bousermasterService } from '../../../../../../n-tire-bo-app/src/app/service/bousermaster.service';
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
selector: 'app-hrmsemployeenominee',
templateUrl: './hrmsemployeenominee.component.html',
styles: [],
providers: [ KeyboardShortcutsService ]
})



export class hrmsemployeenomineeComponent implements OnInit {
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
bfilterPopulatehrmsemployeenominees:boolean=false;
datahrmsemployeenomineesemployeeid3:any=[];
datahrmsemployeenomineesrelationship3:any=[];
datahrmsemployeenomineesbenefittype3:any=[];
datahrmsemployeenomineesnominationendreason3:any=[];
 hrmsemployeenomineeForm: FormGroup;
employeeidList: bousermaster[];
employeeidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
employeeid_bousermastersForm: FormGroup;//autocomplete
employeeid_bousermastersoptions:any;//autocomplete
employeeid_bousermastersformatter:any;//autocomplete
relationshipList: boconfigvalue[];
benefittypeList: boconfigvalue[];
nominationendreasonList: boconfigvalue[];
private exportTime= { hour: 7, minute: 15, meriden: 'PM', format: 24 };
showformtype:any;
formid:any;
pkcol:any;
SESSIONUSERID:any;//current user
hrmsemployeenomineeshowOption:boolean;
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
private hrmsemployeenomineeservice: hrmsemployeenomineeService,
private fb: FormBuilder,
private sharedService: SharedService,
private sessionService: SessionService,
private toastr: ToastService,
//private dialog: NbDialogService,
private configservice:boconfigvalueService,
private bousermasterservice:bousermasterService,
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
this.hrmsemployeenomineeForm  = this.fb.group({
pk:[null],
nomineeid: [null],
employeeid: [null],
employeeiddesc: [null],
relationship: [null],
relationshipdesc: [null],
firstname: [null],
lastname: [null],
fromdate: [null],
todate: [null],
phone: [null],
email: [null],
details: [null],
benefittype: [null],
benefittypedesc: [null],
percentshare: [null],
nominationendreason: [null],
nominationendreasondesc: [null],
status: [null],
statusdesc: [null],
});
}

get f() { return this.hrmsemployeenomineeForm.controls; }


//when child screens are clicked - it will be made invisible
ToolBar(prop)
{
this.toolbarvisible=prop;
}

//function called when we navigate to other page.defined in routing
canDeactivate(): Observable<boolean> | boolean {
debugger;
if (this.hrmsemployeenomineeForm.dirty && this.hrmsemployeenomineeForm.touched ) {
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
  let pos = this.pkList.map(function(e:any) { return e.nomineeid.toString(); }).indexOf(this.formid.toString());
  if(pos>0) this.PopulateScreen(this.pkList[pos-1].pkcol);
}

next()
{
  debugger;
let pos = this.pkList.map(function(e:any) { return e.nomineeid.toString(); }).indexOf(this.formid.toString());
  if(pos>=0 && pos!=this.pkList.length) this.PopulateScreen(this.pkList[pos+1].pkcol);
}

//on searching in pk autocomplete
  onSelectedpk(pkDetail: any) {
    if (pkDetail.nomineeid && pkDetail) {
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
let hrmsemployeenomineeid = null;

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
this.formid=hrmsemployeenomineeid;
//this.sharedService.alert(hrmsemployeenomineeid);

//if pk is empty - go to resetting form.fill default values.otherwise, fetch records
if (this.pkcol == null){
this.resetForm();
}
else {
if (this.maindata == undefined || this.maindata == null)await this.PopulateScreen(this.pkcol);
//get the record from api
//foreign keys 
}
this.bousermasterservice.getbousermastersList().then(res => 
{
this.employeeidList = res as bousermaster[];
if(this.hrmsemployeenomineeservice.formData && this.hrmsemployeenomineeservice.formData.employeeid){
this.employeeidoptionsEvent.emit(this.employeeidList);
this.hrmsemployeenomineeForm.patchValue({
    employeeid: this.hrmsemployeenomineeservice.formData.employeeid,
    employeeiddesc: this.hrmsemployeenomineeservice.formData.employeeiddesc,
});
}
{
let arremployeeid = this.employeeidList.filter(v => v.userid == this.hrmsemployeenomineeForm.get('employeeid').value);
let objemployeeid;
if (arremployeeid.length > 0) objemployeeid = arremployeeid[0];
if (objemployeeid)
{
}
}
}
).catch((err) => {console.log(err);});
this.employeeid_bousermastersoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.employeeidList.filter(v => v.username.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.employeeid_bousermastersformatter = (result: any) => result.username;
this.configservice.getList("relationship").then(res => this.relationshipList = res as boconfigvalue[]);
this.configservice.getList("benefittype").then(res => this.benefittypeList = res as boconfigvalue[]);
this.configservice.getList("nominationendreason").then(res => this.nominationendreasonList = res as boconfigvalue[]);

//autocomplete
    this.hrmsemployeenomineeservice.gethrmsemployeenomineesList().then(res => {
      this.pkList = res as hrmsemployeenominee[];
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
this.hrmsemployeenomineeForm.markAsUntouched();
this.hrmsemployeenomineeForm.markAsPristine();
}
onSelectedemployeeid(employeeidDetail: any) {
if (employeeidDetail.userid && employeeidDetail) {
this.hrmsemployeenomineeForm.patchValue({
employeeid: employeeidDetail.userid,
employeeiddesc: employeeidDetail.username,

});

}
}




resetForm() {
if (this.hrmsemployeenomineeForm != null)
this.hrmsemployeenomineeForm.reset();
this.hrmsemployeenomineeForm.patchValue({
employeeid: this.sessiondata.userid,
employeeiddesc: this.sessiondata.username,
});
this.PopulateFromMainScreen(this.data,false);
this.PopulateFromMainScreen(this.dynamicconfig.data,true);
}

    onDelete() {
        let nomineeid = this.hrmsemployeenomineeForm.get('nomineeid').value;
        if(nomineeid!=null)
        {
        if (confirm('Are you sure to delete this record ?')) {
            this.hrmsemployeenomineeservice.deletehrmsemployeenominee(nomineeid).then(res =>
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
    this.hrmsemployeenomineeForm.patchValue({
        nomineeid: null
    });
    if(this.hrmsemployeenomineeservice.formData.nomineeid!=null)this.hrmsemployeenomineeservice.formData.nomineeid=null;
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
        else if(key=="fromdate")
this.hrmsemployeenomineeForm.patchValue({"fromdate":this.ngbDateParserFormatter.parse(mainscreendata[key]) });
        else if(key=="todate")
this.hrmsemployeenomineeForm.patchValue({"todate":this.ngbDateParserFormatter.parse(mainscreendata[key]) });
        else if(ctrltype=="string")
{
this.hrmsemployeenomineeForm.patchValue({[key]:  mainscreendata[key] } );
}
        else
{
this.hrmsemployeenomineeForm.patchValue({[key]:  mainscreendata[key] } );
}
{
{
         if(bdisable && this.hrmsemployeenomineeForm.controls[key]!=undefined)
{
this.hrmsemployeenomineeForm.controls[key].disable({onlySelf: true});
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
nomineeidonChange(evt:any){
let e=evt.value;
}
employeeidonChange(evt:any){
let e=evt.value;
}
relationshiponChange(evt:any){
let e=this.f.relationship.value as any;
this.hrmsemployeenomineeForm.patchValue({relationshipdesc:evt.options[evt.options.selectedIndex].text});
}
firstnameonChange(evt:any){
let e=evt.value;
}
lastnameonChange(evt:any){
let e=evt.value;
}
fromdateonChange(evt:any){
let e=evt.value;
}
todateonChange(evt:any){
let e=evt.value;
}
phoneonChange(evt:any){
let e=evt.value;
}
emailonChange(evt:any){
let e=evt.value;
}
detailsonChange(evt:any){
let e=evt.value;
}
benefittypeonChange(evt:any){
let e=this.f.benefittype.value as any;
this.hrmsemployeenomineeForm.patchValue({benefittypedesc:evt.options[evt.options.selectedIndex].text});
}
percentshareonChange(evt:any){
let e=evt.value;
}
nominationendreasononChange(evt:any){
let e=this.f.nominationendreason.value as any;
this.hrmsemployeenomineeForm.patchValue({nominationendreasondesc:evt.options[evt.options.selectedIndex].text});
}
statusonChange(evt:any){
let e=evt.value;
}

edithrmsemployeenominees() {
this.showview=false;
return false;
}



async PopulateScreen(pkcol:any){
this.hrmsemployeenomineeservice.gethrmsemployeenomineesByEID(pkcol).then(res => {

this.hrmsemployeenomineeservice.formData=res.hrmsemployeenominee;
let formproperty=res.hrmsemployeenominee.formproperty;
if(formproperty && formproperty.edit==false)this.showview=true;
this.pkcol=res.hrmsemployeenominee.pkcol;
this.formid=res.hrmsemployeenominee.nomineeid;
this.FillData(res);
}).catch((err) => {console.log(err);});
}

FillData(res:any)
{
this.formid=res.hrmsemployeenominee.nomineeid;
console.log(res);
//console.log(res.order);
//console.log(res.orderDetails);
this.hrmsemployeenomineeForm.patchValue({
nomineeid: res.hrmsemployeenominee.nomineeid,
employeeid: res.hrmsemployeenominee.employeeid,
employeeiddesc: res.hrmsemployeenominee.employeeiddesc,
relationship: res.hrmsemployeenominee.relationship,
relationshipdesc: res.hrmsemployeenominee.relationshipdesc,
firstname: res.hrmsemployeenominee.firstname,
lastname: res.hrmsemployeenominee.lastname,
fromdate: this.ngbDateParserFormatter.parse(res.hrmsemployeenominee.fromdate),
todate: this.ngbDateParserFormatter.parse(res.hrmsemployeenominee.todate),
phone: res.hrmsemployeenominee.phone,
email: res.hrmsemployeenominee.email,
details: res.hrmsemployeenominee.details,
benefittype: res.hrmsemployeenominee.benefittype,
benefittypedesc: res.hrmsemployeenominee.benefittypedesc,
percentshare: res.hrmsemployeenominee.percentshare,
nominationendreason: res.hrmsemployeenominee.nominationendreason,
nominationendreasondesc: res.hrmsemployeenominee.nominationendreasondesc,
status: res.hrmsemployeenominee.status,
statusdesc: res.hrmsemployeenominee.statusdesc,
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
  for (let key in this.hrmsemployeenomineeForm.controls) {
    if (this.hrmsemployeenomineeForm.controls[key] != null) {
if(false)
{
if(this.hrmsemployeenomineeservice.formData!=null && this.hrmsemployeenomineeservice.formData[key]!=null  && this.hrmsemployeenomineeservice.formData[key]!='[]' && this.hrmsemployeenomineeservice.formData[key]!=undefined && this.hrmsemployeenomineeservice.formData[key].length>0)ret = ret.replace(new RegExp('##' + key + '##', 'g'),"http://localhost:5002/"+ JSON.parse(this.hrmsemployeenomineeservice.formData[key])[0]["name"]);
}
else if(false)
{
if(this.hrmsemployeenomineeservice.formData!=null && this.hrmsemployeenomineeservice.formData[key]!=null   && this.hrmsemployeenomineeservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='Stars' style='--rating:"+ this.hrmsemployeenomineeservice.formData[key]+"></div>");
}
else if(false)
{
if(this.hrmsemployeenomineeservice.formData!=null && this.hrmsemployeenomineeservice.formData[key]!=null   && this.hrmsemployeenomineeservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='progress--circle progress--"+this.hrmsemployeenomineeservice.formData[key]+"'><div class='progress__number'>"+this.hrmsemployeenomineeservice.formData[key]+"%</div></div>");
}
else
      ret = ret.replace(new RegExp('##' + key + '##', 'g'), this.hrmsemployeenomineeForm.controls[key].value);
    }
  }
  return ret;
}

async onSubmitDataDlg(bclear:any) {
this.isSubmitted = true;
if(!this.hrmsemployeenomineeForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
var obj=this.hrmsemployeenomineeForm.value;
obj.fromdate=new Date(this.hrmsemployeenomineeForm.get('fromdate').value ? this.ngbDateParserFormatter.format(this.hrmsemployeenomineeForm.get('fromdate').value)+'  UTC' :null);
obj.todate=new Date(this.hrmsemployeenomineeForm.get('todate').value ? this.ngbDateParserFormatter.format(this.hrmsemployeenomineeForm.get('todate').value)+'  UTC' :null);
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

private hrmsemployeenomineetoggleOption(){
this.hrmsemployeenomineeshowOption = this.hrmsemployeenomineeshowOption === true ? false : true;
}



async onSubmitData(bclear:any) {
debugger;
this.isSubmitted = true;
let strError="";
Object.keys(this.hrmsemployeenomineeForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.hrmsemployeenomineeForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            strError+='control: ' + key + ', Error: ' + keyError + '<BR>';
          });
        }
      });
if(strError!="")return this.sharedService.alert(strError);


if(!this.hrmsemployeenomineeForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
if(!this.validate())
{
return;
}
this.hrmsemployeenomineeservice.formData=this.hrmsemployeenomineeForm.value;
if (this.dynamicconfig.data != null)
{
for (let key in this.dynamicconfig.data)
{
if(key!='visiblelist' && key!='hidelist'){
    if (this.hrmsemployeenomineeForm.controls[key] != null)
    {
        this.hrmsemployeenomineeservice.formData[key] = this.hrmsemployeenomineeForm.controls[key].value;
    }
}
}
}
this.hrmsemployeenomineeservice.formData.fromdate=new Date(this.hrmsemployeenomineeForm.get('fromdate').value ? this.ngbDateParserFormatter.format(this.hrmsemployeenomineeForm.get('fromdate').value)+'  UTC' :null);
this.hrmsemployeenomineeservice.formData.todate=new Date(this.hrmsemployeenomineeForm.get('todate').value ? this.ngbDateParserFormatter.format(this.hrmsemployeenomineeForm.get('todate').value)+'  UTC' :null);
console.log(this.hrmsemployeenomineeservice.formData);
this.hrmsemployeenomineeservice.formData=this.hrmsemployeenomineeForm.value;
this.hrmsemployeenomineeservice.saveOrUpdatehrmsemployeenominees().subscribe(
async res => {
debugger;
this.toastr.addSingle("success","","Successfully saved");
this.showview=true;
document.getElementById("contentArea1").scrollTop = 0;
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).hrmsemployeenominee);
    return;
}
else
{
document.getElementById("contentArea1").scrollTop = 0;
}
this.hrmsemployeenomineeservice.clearList();
if(bclear){
this.resetForm();
}
else{
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).hrmsemployeenominee);
}
else
{
this.FillData(res);
}
}
this.hrmsemployeenomineeForm.markAsUntouched();
this.hrmsemployeenomineeForm.markAsPristine();
},
err => {
debugger;
this.toastr.addSingle("error","",err.error);
console.log(err);
}
)
}




//dropdown edit from the screen itself -> One screen like Reportviewer

AddOrEditemployeeid( userid) {
/*let ScreenType='2';
this.dialog.open(bousermasterComponent, 
{
data: {userid:this.hrmsemployeenomineeForm.get('employeeid').value, ScreenType:2 }
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



