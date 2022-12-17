import { legalfreenoteService } from './../../../service/legalfreenote.service';
import { legalfreenote } from './../../../model/legalfreenote.model';
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
import { bousermasterComponent } from '../../../../../../n-tire-bo-app/src/app/pages/forms/bousermaster/bousermaster.component';
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
import {AppConstants} from '../../../../../../n-tire-bo-app/src/app/shared/helper';
import { Subject } from 'rxjs/Subject';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import {createWorker, RecognizeResult} from 'tesseract.js';
import {AttachmentComponent} from '../../../../../../n-tire-bo-app/src/app/custom/attachment/attachment.component';

@Component({
selector: 'app-legalfreenote',
templateUrl: './legalfreenote.component.html',
styles: [],
providers: [ KeyboardShortcutsService ]
})



export class legalfreenoteComponent implements OnInit {
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
bfilterPopulatelegalfreenotes:boolean=false;
datalegalfreenotesenteredby3:any=[];
 legalfreenoteForm: FormGroup;
enteredbyList: bousermaster[];
enteredbyoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
enteredby_bousermastersForm: FormGroup;//autocomplete
enteredby_bousermastersoptions:any;//autocomplete
enteredby_bousermastersformatter:any;//autocomplete
private exportTime= { hour: 7, minute: 15, meriden: 'PM', format: 24 };
showformtype:any;
formid:any;
pkcol:any;
readonly AttachmentURL = AppConstants.AttachmentURL;
readonly URL = AppConstants.UploadURL;attachmentlist: any[]=[];fileattachmentlist: any[]=[];
@ViewChild('fileattachment',{static:false}) fileattachment: AttachmentComponent;
attachmentfieldjson: any[]=[];
attachmentvisible:boolean=true;
SESSIONUSERID:any;//current user
legalfreenoteshowOption:boolean;
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
private legalfreenoteservice: legalfreenoteService,
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
this.legalfreenoteForm  = this.fb.group({
pk:[null],
ImageName: [null],
freenotesid: [null],
entrydate: [null],
enteredby: [null, Validators.required],
enteredbydesc: [null],
subject: [null, Validators.required],
freenotes: [null],
caseid: [null],
attachment: [null],
status: [null],
statusdesc: [null],
});
}

get f() { return this.legalfreenoteForm.controls; }


//when child screens are clicked - it will be made invisible
ToolBar(prop)
{
this.toolbarvisible=prop;
}

//function called when we navigate to other page.defined in routing
canDeactivate(): Observable<boolean> | boolean {
debugger;
if (this.legalfreenoteForm.dirty && this.legalfreenoteForm.touched ) {
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
  let pos = this.pkList.map(function(e:any) { return e.freenotesid.toString(); }).indexOf(this.formid.toString());
  if(pos>0) this.PopulateScreen(this.pkList[pos-1].pkcol);
}

next()
{
  debugger;
let pos = this.pkList.map(function(e:any) { return e.freenotesid.toString(); }).indexOf(this.formid.toString());
  if(pos>=0 && pos!=this.pkList.length) this.PopulateScreen(this.pkList[pos+1].pkcol);
}

//on searching in pk autocomplete
  onSelectedpk(pkDetail: any) {
    if (pkDetail.freenotesid && pkDetail) {
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
let legalfreenoteid = null;

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
this.formid=legalfreenoteid;
//this.sharedService.alert(legalfreenoteid);

//if pk is empty - go to resetting form.fill default values.otherwise, fetch records
if (this.pkcol == null){
this.resetForm();
}
else {
if (this.maindata == undefined || this.maindata == null || this.maindata.save == true)await this.PopulateScreen(this.pkcol);
//get the record from api
//foreign keys 
}
this.bousermasterservice.getbousermastersList().then(res => 
{
this.enteredbyList = res as bousermaster[];
if(this.legalfreenoteservice.formData && this.legalfreenoteservice.formData.enteredby){
this.enteredbyoptionsEvent.emit(this.enteredbyList);
this.legalfreenoteForm.patchValue({
    enteredby: this.legalfreenoteservice.formData.enteredby,
    enteredbydesc: this.legalfreenoteservice.formData.enteredbydesc,
});
}
{
let arrenteredby = this.enteredbyList.filter(v => v.userid == this.legalfreenoteForm.get('enteredby').value);
let objenteredby;
if (arrenteredby.length > 0) objenteredby = arrenteredby[0];
if (objenteredby)
{
}
}
}
).catch((err) => {console.log(err);});
this.enteredby_bousermastersoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.enteredbyList.filter(v => v.username.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.enteredby_bousermastersformatter = (result: any) => result.username;

//autocomplete
    this.legalfreenoteservice.getlegalfreenotesList().then(res => {
      this.pkList = res as legalfreenote[];
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
this.legalfreenoteForm.markAsUntouched();
this.legalfreenoteForm.markAsPristine();
}
onSelectedenteredby(enteredbyDetail: any) {
if (enteredbyDetail.userid && enteredbyDetail) {
this.legalfreenoteForm.patchValue({
enteredby: enteredbyDetail.userid,
enteredbydesc: enteredbyDetail.username,

});

}
}




resetForm() {
if (this.legalfreenoteForm != null)
this.legalfreenoteForm.reset();
this.legalfreenoteForm.patchValue({
enteredby: this.sessiondata.userid,
enteredbydesc: this.sessiondata.username,
});
this.legalfreenoteForm.patchValue({
entrydate: this.ngbDateParserFormatter.parse(new Date().toISOString()),
enteredby: this.sessiondata.userid,
});
this.PopulateFromMainScreen(this.data,false);
this.PopulateFromMainScreen(this.dynamicconfig.data,true);
}

    onDelete() {
        let freenotesid = this.legalfreenoteForm.get('freenotesid').value;
        if(freenotesid!=null)
        {
        if (confirm('Are you sure to delete this record ?')) {
            this.legalfreenoteservice.deletelegalfreenote(freenotesid).then(res =>
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
    this.legalfreenoteForm.patchValue({
        freenotesid: null
    });
    if(this.legalfreenoteservice.formData.freenotesid!=null)this.legalfreenoteservice.formData.freenotesid=null;
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
        else if(key=="entrydate")
this.legalfreenoteForm.patchValue({"entrydate":this.ngbDateParserFormatter.parse(mainscreendata[key]) });
        else if(key=="freenotes")
this.legalfreenoteForm.patchValue({"freenotes":  mainscreendata[key] } );
        else if(ctrltype=="string")
{
this.legalfreenoteForm.patchValue({[key]:  mainscreendata[key] } );
}
        else
{
this.legalfreenoteForm.patchValue({[key]:  mainscreendata[key] } );
}
{
{
         if(bdisable && this.legalfreenoteForm.controls[key]!=undefined)
{
this.legalfreenoteForm.controls[key].disable({onlySelf: true});
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
freenotesidonChange(evt:any){
let e=evt.value;
}
entrydateonChange(evt:any){
let e=evt.value;
}
enteredbyonChange(evt:any){
let e=evt.value;
}
subjectonChange(evt:any){
let e=evt.value;
}
freenotesonChange(evt:any){
let e=evt.value;
}
caseidonChange(evt:any){
let e=evt.value;
}
attachmentonChange(evt:any){
let e=evt.value;
}
statusonChange(evt:any){
let e=evt.value;
}
attachmentuploader(e:any) { 
for (let i = 0; i < e.files.length; i++) {
this.fileattachmentlist.push(e.files[i]);
let max=0;
let attachmentobj =null;
if(this.attachmentfieldjson==null)this.attachmentfieldjson=[];
max=Array.of(this.attachmentfieldjson).length;attachmentobj =new KeyValuePair((this.attachmentfieldjson.length + 1+ max).toString(),e.files[i].name);
this.attachmentfieldjson.push(attachmentobj);
max=0;
if(this.attachmentlist!=null)max=Array.of(this.attachmentlist).length;  attachmentobj =new KeyValuePair((this.attachmentlist.length + 1+ max).toString(),e.files[i].name);
this.attachmentlist.push(attachmentobj);
}}
  


editlegalfreenotes() {
this.showview=false;
return false;
}



async PopulateScreen(pkcol:any){
this.legalfreenoteservice.getlegalfreenotesByEID(pkcol).then(res => {

this.legalfreenoteservice.formData=res.legalfreenote;
let formproperty=res.legalfreenote.formproperty;
if(formproperty && formproperty.edit==false)this.showview=true;
this.pkcol=res.legalfreenote.pkcol;
this.formid=res.legalfreenote.freenotesid;
this.FillData(res);
}).catch((err) => {console.log(err);});
}

FillData(res:any)
{
this.legalfreenoteservice.formData=res.legalfreenote;
this.formid=res.legalfreenote.freenotesid;
console.log(res);
//console.log(res.order);
//console.log(res.orderDetails);
this.legalfreenoteForm.patchValue({
freenotesid: res.legalfreenote.freenotesid,
entrydate: this.ngbDateParserFormatter.parse(res.legalfreenote.entrydate),
enteredby: res.legalfreenote.enteredby,
enteredbydesc: res.legalfreenote.enteredbydesc,
subject: res.legalfreenote.subject,
freenotes: JSON.parse(res.legalfreenote.freenotes),
caseid: res.legalfreenote.caseid,
attachment: JSON.parse(res.legalfreenote.attachment),
status: res.legalfreenote.status,
statusdesc: res.legalfreenote.statusdesc,
});
if(this.legalfreenoteForm.get('attachment').value!=null && this.legalfreenoteForm.get('attachment').value!="" && this.fileattachment!=null && this.fileattachment!=undefined)this.fileattachment.setattachmentlist(this.legalfreenoteForm.get('attachment').value);
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
  for (let key in this.legalfreenoteForm.controls) {
    if (this.legalfreenoteForm.controls[key] != null) {
if(false)
{
if(this.legalfreenoteservice.formData!=null && this.legalfreenoteservice.formData[key]!=null  && this.legalfreenoteservice.formData[key]!='[]' && this.legalfreenoteservice.formData[key]!=undefined && this.legalfreenoteservice.formData[key].length>0)ret = ret.replace(new RegExp('##' + key + '##', 'g'),"http://localhost:5002/"+ JSON.parse(this.legalfreenoteservice.formData[key])[0]["name"]);
}
else if(false)
{
if(this.legalfreenoteservice.formData!=null && this.legalfreenoteservice.formData[key]!=null   && this.legalfreenoteservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='Stars' style='--rating:"+ this.legalfreenoteservice.formData[key]+"></div>");
}
else if(false)
{
if(this.legalfreenoteservice.formData!=null && this.legalfreenoteservice.formData[key]!=null   && this.legalfreenoteservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='progress--circle progress--"+this.legalfreenoteservice.formData[key]+"'><div class='progress__number'>"+this.legalfreenoteservice.formData[key]+"%</div></div>");
}
else
      ret = ret.replace(new RegExp('##' + key + '##', 'g'), this.legalfreenoteForm.controls[key].value);
    }
  }
  return ret;
}

async onSubmitDataDlg(bclear:any) {
this.isSubmitted = true;
if(!this.legalfreenoteForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
var obj=this.legalfreenoteForm.value;
obj.entrydate=new Date(this.legalfreenoteForm.get('entrydate').value ? this.ngbDateParserFormatter.format(this.legalfreenoteForm.get('entrydate').value)+'  UTC' :null);
if(this.legalfreenoteForm.get('freenotes').value!=null)obj.freenotes=JSON.stringify(this.legalfreenoteForm.get('freenotes').value);
if(this.fileattachment.getattachmentlist()!=null)obj.attachment=JSON.stringify(this.fileattachment.getattachmentlist());
obj.fileattachmentlist=this.fileattachment.getAllFiles();
console.log(obj);
await this.sharedService.upload(this.fileattachmentlist);
this.attachmentlist=[];
if(this.fileattachment)this.fileattachment.clear();
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

private legalfreenotetoggleOption(){
this.legalfreenoteshowOption = this.legalfreenoteshowOption === true ? false : true;
}



async onSubmitData(bclear:any) {
debugger;
this.isSubmitted = true;
let strError="";
Object.keys(this.legalfreenoteForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.legalfreenoteForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            strError+='control: ' + key + ', Error: ' + keyError + '<BR>';
          });
        }
      });
if(strError!="")return this.sharedService.alert(strError);


if(!this.legalfreenoteForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
if(!this.validate())
{
return;
}
this.legalfreenoteservice.formData=this.legalfreenoteForm.value;
if (this.dynamicconfig.data != null)
{
for (let key in this.dynamicconfig.data)
{
if(key!='visiblelist' && key!='hidelist'){
    if (this.legalfreenoteForm.controls[key] != null)
    {
        this.legalfreenoteservice.formData[key] = this.legalfreenoteForm.controls[key].value;
    }
}
}
}
this.legalfreenoteservice.formData.entrydate=new Date(this.legalfreenoteForm.get('entrydate').value ? this.ngbDateParserFormatter.format(this.legalfreenoteForm.get('entrydate').value)+'  UTC' :null);
if(this.legalfreenoteForm.get('freenotes').value!=null)this.legalfreenoteservice.formData.freenotes=JSON.stringify(this.legalfreenoteForm.get('freenotes').value);
if(this.fileattachment.getattachmentlist()!=null)this.legalfreenoteservice.formData.attachment=JSON.stringify(this.fileattachment.getattachmentlist());
this.fileattachmentlist=this.fileattachment.getAllFiles();
console.log(this.legalfreenoteservice.formData);
this.legalfreenoteservice.formData=this.legalfreenoteForm.value;
this.legalfreenoteservice.saveOrUpdatelegalfreenotes().subscribe(
async res => {
await this.sharedService.upload(this.fileattachmentlist);
this.attachmentlist=[];
if(this.fileattachment)this.fileattachment.clear();
debugger;
this.toastr.addSingle("success","","Successfully saved");
this.showview=true;
document.getElementById("contentArea1").scrollTop = 0;
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).legalfreenote);
    return;
}
else
{
document.getElementById("contentArea1").scrollTop = 0;
}
this.legalfreenoteservice.clearList();
if(bclear){
this.resetForm();
}
else{
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).legalfreenote);
}
else
{
this.FillData(res);
}
}
this.legalfreenoteForm.markAsUntouched();
this.legalfreenoteForm.markAsPristine();
},
err => {
debugger;
this.toastr.addSingle("error","",err.error);
console.log(err);
}
)
}




//dropdown edit from the screen itself -> One screen like Reportviewer

AddOrEditenteredby( userid) {
/*let ScreenType='2';
this.dialog.open(bousermasterComponent, 
{
data: {userid:this.legalfreenoteForm.get('enteredby').value, ScreenType:2 }
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



