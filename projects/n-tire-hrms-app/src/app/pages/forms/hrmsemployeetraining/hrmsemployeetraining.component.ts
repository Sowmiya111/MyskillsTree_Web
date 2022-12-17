import { hrmsemployeetrainingService } from './../../../service/hrmsemployeetraining.service';
import { hrmsemployeetraining } from './../../../model/hrmsemployeetraining.model';
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
import { hrmstraining} from './../../../model/hrmstraining.model';
import { hrmstrainingService } from './../../../service/hrmstraining.service';
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
selector: 'app-hrmsemployeetraining',
templateUrl: './hrmsemployeetraining.component.html',
styles: [],
providers: [ KeyboardShortcutsService ]
})



export class hrmsemployeetrainingComponent implements OnInit {
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
bfilterPopulatehrmsemployeetrainings:boolean=false;
datahrmsemployeetrainingsemployeeid3:any=[];
datahrmsemployeetrainingstrainingid3:any=[];
datahrmsemployeetrainingsskill3:any=[];
 hrmsemployeetrainingForm: FormGroup;
employeeidList: bousermaster[];
employeeidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
employeeid_bousermastersForm: FormGroup;//autocomplete
employeeid_bousermastersoptions:any;//autocomplete
employeeid_bousermastersformatter:any;//autocomplete
trainingidList: hrmstraining[];
trainingidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
trainingid_hrmstrainingsForm: FormGroup;//autocomplete
trainingid_hrmstrainingsoptions:any;//autocomplete
trainingid_hrmstrainingsformatter:any;//autocomplete
skillList: boconfigvalue[];
private exportTime= { hour: 7, minute: 15, meriden: 'PM', format: 24 };
showformtype:any;
formid:any;
pkcol:any;
SESSIONUSERID:any;//current user
hrmsemployeetrainingshowOption:boolean;
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
private hrmsemployeetrainingservice: hrmsemployeetrainingService,
private fb: FormBuilder,
private sharedService: SharedService,
private sessionService: SessionService,
private toastr: ToastService,
//private dialog: NbDialogService,
private configservice:boconfigvalueService,
private bousermasterservice:bousermasterService,
private hrmstrainingservice:hrmstrainingService,
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
this.hrmsemployeetrainingForm  = this.fb.group({
pk:[null],
emptrainingid: [null],
employeeid: [null],
employeeiddesc: [null],
trainingid: [null],
trainingiddesc: [null],
skill: [null],
skilldesc: [null],
trainerfeedback: [null],
coursefeedback: [null],
status: [null],
statusdesc: [null],
});
}

get f() { return this.hrmsemployeetrainingForm.controls; }


//when child screens are clicked - it will be made invisible
ToolBar(prop)
{
this.toolbarvisible=prop;
}

//function called when we navigate to other page.defined in routing
canDeactivate(): Observable<boolean> | boolean {
debugger;
if (this.hrmsemployeetrainingForm.dirty && this.hrmsemployeetrainingForm.touched ) {
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
  let pos = this.pkList.map(function(e:any) { return e.emptrainingid.toString(); }).indexOf(this.formid.toString());
  if(pos>0) this.PopulateScreen(this.pkList[pos-1].pkcol);
}

next()
{
  debugger;
let pos = this.pkList.map(function(e:any) { return e.emptrainingid.toString(); }).indexOf(this.formid.toString());
  if(pos>=0 && pos!=this.pkList.length) this.PopulateScreen(this.pkList[pos+1].pkcol);
}

//on searching in pk autocomplete
  onSelectedpk(pkDetail: any) {
    if (pkDetail.emptrainingid && pkDetail) {
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
let hrmsemployeetrainingid = null;

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
this.formid=hrmsemployeetrainingid;
//this.sharedService.alert(hrmsemployeetrainingid);

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
if(this.hrmsemployeetrainingservice.formData && this.hrmsemployeetrainingservice.formData.employeeid){
this.employeeidoptionsEvent.emit(this.employeeidList);
this.hrmsemployeetrainingForm.patchValue({
    employeeid: this.hrmsemployeetrainingservice.formData.employeeid,
    employeeiddesc: this.hrmsemployeetrainingservice.formData.employeeiddesc,
});
}
{
let arremployeeid = this.employeeidList.filter(v => v.userid == this.hrmsemployeetrainingForm.get('employeeid').value);
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
this.hrmstrainingservice.gethrmstrainingsList().then(res => 
{
this.trainingidList = res as hrmstraining[];
if(this.hrmsemployeetrainingservice.formData && this.hrmsemployeetrainingservice.formData.trainingid){
this.trainingidoptionsEvent.emit(this.trainingidList);
this.hrmsemployeetrainingForm.patchValue({
    trainingid: this.hrmsemployeetrainingservice.formData.trainingid,
    trainingiddesc: this.hrmsemployeetrainingservice.formData.trainingiddesc,
});
}
{
let arrtrainingid = this.trainingidList.filter(v => v.trainingid == this.hrmsemployeetrainingForm.get('trainingid').value);
let objtrainingid;
if (arrtrainingid.length > 0) objtrainingid = arrtrainingid[0];
if (objtrainingid)
{
}
}
}
).catch((err) => {console.log(err);});
this.trainingid_hrmstrainingsoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.trainingidList.filter(v => v.trainingtitle.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.trainingid_hrmstrainingsformatter = (result: any) => result.trainingtitle;
this.configservice.getList("employeeskill").then(res => this.skillList = res as boconfigvalue[]);

//autocomplete
    this.hrmsemployeetrainingservice.gethrmsemployeetrainingsList().then(res => {
      this.pkList = res as hrmsemployeetraining[];
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
this.hrmsemployeetrainingForm.markAsUntouched();
this.hrmsemployeetrainingForm.markAsPristine();
}
onSelectedemployeeid(employeeidDetail: any) {
if (employeeidDetail.userid && employeeidDetail) {
this.hrmsemployeetrainingForm.patchValue({
employeeid: employeeidDetail.userid,
employeeiddesc: employeeidDetail.username,

});

}
}

onSelectedtrainingid(trainingidDetail: any) {
if (trainingidDetail.trainingid && trainingidDetail) {
this.hrmsemployeetrainingForm.patchValue({
trainingid: trainingidDetail.trainingid,
trainingiddesc: trainingidDetail.trainingtitle,

});

}
}




resetForm() {
if (this.hrmsemployeetrainingForm != null)
this.hrmsemployeetrainingForm.reset();
this.hrmsemployeetrainingForm.patchValue({
employeeid: this.sessiondata.userid,
employeeiddesc: this.sessiondata.username,
});
this.PopulateFromMainScreen(this.data,false);
this.PopulateFromMainScreen(this.dynamicconfig.data,true);
}

    onDelete() {
        let emptrainingid = this.hrmsemployeetrainingForm.get('emptrainingid').value;
        if(emptrainingid!=null)
        {
        if (confirm('Are you sure to delete this record ?')) {
            this.hrmsemployeetrainingservice.deletehrmsemployeetraining(emptrainingid).then(res =>
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
    this.hrmsemployeetrainingForm.patchValue({
        emptrainingid: null
    });
    if(this.hrmsemployeetrainingservice.formData.emptrainingid!=null)this.hrmsemployeetrainingservice.formData.emptrainingid=null;
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
this.hrmsemployeetrainingForm.patchValue({[key]:  mainscreendata[key] } );
}
        else
{
this.hrmsemployeetrainingForm.patchValue({[key]:  mainscreendata[key] } );
}
{
{
         if(bdisable && this.hrmsemployeetrainingForm.controls[key]!=undefined)
{
this.hrmsemployeetrainingForm.controls[key].disable({onlySelf: true});
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
emptrainingidonChange(evt:any){
let e=evt.value;
}
employeeidonChange(evt:any){
let e=evt.value;
}
trainingidonChange(evt:any){
let e=evt.value;
}
skillonChange(evt:any){
let e=this.f.skill.value as any;
this.hrmsemployeetrainingForm.patchValue({skilldesc:evt.options[evt.options.selectedIndex].text});
}
trainerfeedbackonChange(evt:any){
let e=evt.value;
}
coursefeedbackonChange(evt:any){
let e=evt.value;
}
statusonChange(evt:any){
let e=evt.value;
}

edithrmsemployeetrainings() {
this.showview=false;
return false;
}



async PopulateScreen(pkcol:any){
this.hrmsemployeetrainingservice.gethrmsemployeetrainingsByEID(pkcol).then(res => {

this.hrmsemployeetrainingservice.formData=res.hrmsemployeetraining;
let formproperty=res.hrmsemployeetraining.formproperty;
if(formproperty && formproperty.edit==false)this.showview=true;
this.pkcol=res.hrmsemployeetraining.pkcol;
this.formid=res.hrmsemployeetraining.emptrainingid;
this.FillData(res);
}).catch((err) => {console.log(err);});
}

FillData(res:any)
{
this.formid=res.hrmsemployeetraining.emptrainingid;
console.log(res);
//console.log(res.order);
//console.log(res.orderDetails);
this.hrmsemployeetrainingForm.patchValue({
emptrainingid: res.hrmsemployeetraining.emptrainingid,
employeeid: res.hrmsemployeetraining.employeeid,
employeeiddesc: res.hrmsemployeetraining.employeeiddesc,
trainingid: res.hrmsemployeetraining.trainingid,
trainingiddesc: res.hrmsemployeetraining.trainingiddesc,
skill: res.hrmsemployeetraining.skill,
skilldesc: res.hrmsemployeetraining.skilldesc,
trainerfeedback: res.hrmsemployeetraining.trainerfeedback,
coursefeedback: res.hrmsemployeetraining.coursefeedback,
status: res.hrmsemployeetraining.status,
statusdesc: res.hrmsemployeetraining.statusdesc,
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
  for (let key in this.hrmsemployeetrainingForm.controls) {
    if (this.hrmsemployeetrainingForm.controls[key] != null) {
if(false)
{
if(this.hrmsemployeetrainingservice.formData!=null && this.hrmsemployeetrainingservice.formData[key]!=null  && this.hrmsemployeetrainingservice.formData[key]!='[]' && this.hrmsemployeetrainingservice.formData[key]!=undefined && this.hrmsemployeetrainingservice.formData[key].length>0)ret = ret.replace(new RegExp('##' + key + '##', 'g'),"http://localhost:5002/"+ JSON.parse(this.hrmsemployeetrainingservice.formData[key])[0]["name"]);
}
else if(false)
{
if(this.hrmsemployeetrainingservice.formData!=null && this.hrmsemployeetrainingservice.formData[key]!=null   && this.hrmsemployeetrainingservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='Stars' style='--rating:"+ this.hrmsemployeetrainingservice.formData[key]+"></div>");
}
else if(false)
{
if(this.hrmsemployeetrainingservice.formData!=null && this.hrmsemployeetrainingservice.formData[key]!=null   && this.hrmsemployeetrainingservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='progress--circle progress--"+this.hrmsemployeetrainingservice.formData[key]+"'><div class='progress__number'>"+this.hrmsemployeetrainingservice.formData[key]+"%</div></div>");
}
else
      ret = ret.replace(new RegExp('##' + key + '##', 'g'), this.hrmsemployeetrainingForm.controls[key].value);
    }
  }
  return ret;
}

async onSubmitDataDlg(bclear:any) {
this.isSubmitted = true;
if(!this.hrmsemployeetrainingForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
var obj=this.hrmsemployeetrainingForm.value;
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

private hrmsemployeetrainingtoggleOption(){
this.hrmsemployeetrainingshowOption = this.hrmsemployeetrainingshowOption === true ? false : true;
}



async onSubmitData(bclear:any) {
debugger;
this.isSubmitted = true;
let strError="";
Object.keys(this.hrmsemployeetrainingForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.hrmsemployeetrainingForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            strError+='control: ' + key + ', Error: ' + keyError + '<BR>';
          });
        }
      });
if(strError!="")return this.sharedService.alert(strError);


if(!this.hrmsemployeetrainingForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
if(!this.validate())
{
return;
}
this.hrmsemployeetrainingservice.formData=this.hrmsemployeetrainingForm.value;
if (this.dynamicconfig.data != null)
{
for (let key in this.dynamicconfig.data)
{
if(key!='visiblelist' && key!='hidelist'){
    if (this.hrmsemployeetrainingForm.controls[key] != null)
    {
        this.hrmsemployeetrainingservice.formData[key] = this.hrmsemployeetrainingForm.controls[key].value;
    }
}
}
}
console.log(this.hrmsemployeetrainingservice.formData);
this.hrmsemployeetrainingservice.formData=this.hrmsemployeetrainingForm.value;
this.hrmsemployeetrainingservice.saveOrUpdatehrmsemployeetrainings().subscribe(
async res => {
debugger;
this.toastr.addSingle("success","","Successfully saved");
this.showview=true;
document.getElementById("contentArea1").scrollTop = 0;
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).hrmsemployeetraining);
    return;
}
else
{
document.getElementById("contentArea1").scrollTop = 0;
}
this.hrmsemployeetrainingservice.clearList();
if(bclear){
this.resetForm();
}
else{
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).hrmsemployeetraining);
}
else
{
this.FillData(res);
}
}
this.hrmsemployeetrainingForm.markAsUntouched();
this.hrmsemployeetrainingForm.markAsPristine();
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
data: {userid:this.hrmsemployeetrainingForm.get('employeeid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEdittrainingid( trainingid) {
/*let ScreenType='2';
this.dialog.open(hrmstrainingComponent, 
{
data: {trainingid:this.hrmsemployeetrainingForm.get('trainingid').value, ScreenType:2 }
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



