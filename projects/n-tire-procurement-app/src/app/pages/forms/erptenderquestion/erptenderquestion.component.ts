import { erptenderquestionService } from './../../../service/erptenderquestion.service';
import { erptenderquestion } from './../../../model/erptenderquestion.model';
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
import { erptendermaster} from './../../../model/erptendermaster.model';
import { erptendermasterComponent } from './../../../pages/forms/erptendermaster/erptendermaster.component';
import { erptendermasterService } from './../../../service/erptendermaster.service';
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
selector: 'app-erptenderquestion',
templateUrl: './erptenderquestion.component.html',
styles: [],
providers: [ KeyboardShortcutsService ]
})



export class erptenderquestionComponent implements OnInit {
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
bfilterPopulateerptenderquestions:boolean=false;
dataerptenderquestionstenderid3:any=[];
 erptenderquestionForm: FormGroup;
tenderidList: erptendermaster[];
tenderidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
tenderid_erptendermastersForm: FormGroup;//autocomplete
tenderid_erptendermastersoptions:any;//autocomplete
tenderid_erptendermastersformatter:any;//autocomplete
private exportTime= { hour: 7, minute: 15, meriden: 'PM', format: 24 };
showformtype:any;
formid:any;
pkcol:any;
SESSIONUSERID:any;//current user
erptenderquestionshowOption:boolean;
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
private erptenderquestionservice: erptenderquestionService,
private fb: FormBuilder,
private sharedService: SharedService,
private sessionService: SessionService,
private toastr: ToastService,
//private dialog: NbDialogService,
private configservice:boconfigvalueService,
private erptendermasterservice:erptendermasterService,
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
this.erptenderquestionForm  = this.fb.group({
pk:[null],
tenderid: [null],
tenderiddesc: [null],
questionid: [null],
question: [null],
status: [null],
statusdesc: [null],
});
}

get f() { return this.erptenderquestionForm.controls; }


//when child screens are clicked - it will be made invisible
ToolBar(prop)
{
this.toolbarvisible=prop;
}

//function called when we navigate to other page.defined in routing
canDeactivate(): Observable<boolean> | boolean {
debugger;
if (this.erptenderquestionForm.dirty && this.erptenderquestionForm.touched ) {
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
  let pos = this.pkList.map(function(e:any) { return e.questionid.toString(); }).indexOf(this.formid.toString());
  if(pos>0) this.PopulateScreen(this.pkList[pos-1].pkcol);
}

next()
{
  debugger;
let pos = this.pkList.map(function(e:any) { return e.questionid.toString(); }).indexOf(this.formid.toString());
  if(pos>=0 && pos!=this.pkList.length) this.PopulateScreen(this.pkList[pos+1].pkcol);
}

//on searching in pk autocomplete
  onSelectedpk(pkDetail: any) {
    if (pkDetail.questionid && pkDetail) {
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
let erptenderquestionid = null;

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
this.formid=erptenderquestionid;
//this.sharedService.alert(erptenderquestionid);

//if pk is empty - go to resetting form.fill default values.otherwise, fetch records
if (this.pkcol == null){
this.resetForm();
}
else {
if (this.maindata == undefined || this.maindata == null || this.maindata.save == true)await this.PopulateScreen(this.pkcol);
//get the record from api
//foreign keys 
}
this.erptendermasterservice.geterptendermastersList().then(res => 
{
this.tenderidList = res as erptendermaster[];
if(this.erptenderquestionservice.formData && this.erptenderquestionservice.formData.tenderid){
this.tenderidoptionsEvent.emit(this.tenderidList);
this.erptenderquestionForm.patchValue({
    tenderid: this.erptenderquestionservice.formData.tenderid,
    tenderiddesc: this.erptenderquestionservice.formData.tenderiddesc,
});
}
{
let arrtenderid = this.tenderidList.filter(v => v.tenderid == this.erptenderquestionForm.get('tenderid').value);
let objtenderid;
if (arrtenderid.length > 0) objtenderid = arrtenderid[0];
if (objtenderid)
{
}
}
}
).catch((err) => {console.log(err);});
this.tenderid_erptendermastersoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.tenderidList.filter(v => v.title.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.tenderid_erptendermastersformatter = (result: any) => result.title;

//autocomplete
    this.erptenderquestionservice.geterptenderquestionsList().then(res => {
      this.pkList = res as erptenderquestion[];
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
this.erptenderquestionForm.markAsUntouched();
this.erptenderquestionForm.markAsPristine();
}
onSelectedtenderid(tenderidDetail: any) {
if (tenderidDetail.tenderid && tenderidDetail) {
this.erptenderquestionForm.patchValue({
tenderid: tenderidDetail.tenderid,
tenderiddesc: tenderidDetail.title,

});

}
}




resetForm() {
if (this.erptenderquestionForm != null)
this.erptenderquestionForm.reset();
this.erptenderquestionForm.patchValue({
});
this.PopulateFromMainScreen(this.data,false);
this.PopulateFromMainScreen(this.dynamicconfig.data,true);
}

    onDelete() {
        let questionid = this.erptenderquestionForm.get('questionid').value;
        if(questionid!=null)
        {
        if (confirm('Are you sure to delete this record ?')) {
            this.erptenderquestionservice.deleteerptenderquestion(questionid).then(res =>
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
    this.erptenderquestionForm.patchValue({
        questionid: null
    });
    if(this.erptenderquestionservice.formData.questionid!=null)this.erptenderquestionservice.formData.questionid=null;
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
this.erptenderquestionForm.patchValue({[key]:  mainscreendata[key] } );
}
        else
{
this.erptenderquestionForm.patchValue({[key]:  mainscreendata[key] } );
}
{
{
         if(bdisable && this.erptenderquestionForm.controls[key]!=undefined)
{
this.erptenderquestionForm.controls[key].disable({onlySelf: true});
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
tenderidonChange(evt:any){
let e=evt.value;
}
questionidonChange(evt:any){
let e=evt.value;
}
questiononChange(evt:any){
let e=evt.value;
}
statusonChange(evt:any){
let e=evt.value;
}

editerptenderquestions() {
this.showview=false;
return false;
}



async PopulateScreen(pkcol:any){
this.erptenderquestionservice.geterptenderquestionsByEID(pkcol).then(res => {

this.erptenderquestionservice.formData=res.erptenderquestion;
let formproperty=res.erptenderquestion.formproperty;
if(formproperty && formproperty.edit==false)this.showview=true;
this.pkcol=res.erptenderquestion.pkcol;
this.formid=res.erptenderquestion.questionid;
this.FillData(res);
}).catch((err) => {console.log(err);});
}

FillData(res:any)
{
this.formid=res.erptenderquestion.questionid;
console.log(res);
//console.log(res.order);
//console.log(res.orderDetails);
this.erptenderquestionForm.patchValue({
tenderid: res.erptenderquestion.tenderid,
tenderiddesc: res.erptenderquestion.tenderiddesc,
questionid: res.erptenderquestion.questionid,
question: res.erptenderquestion.question,
status: res.erptenderquestion.status,
statusdesc: res.erptenderquestion.statusdesc,
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
  for (let key in this.erptenderquestionForm.controls) {
    if (this.erptenderquestionForm.controls[key] != null) {
if(false)
{
if(this.erptenderquestionservice.formData!=null && this.erptenderquestionservice.formData[key]!=null  && this.erptenderquestionservice.formData[key]!='[]' && this.erptenderquestionservice.formData[key]!=undefined && this.erptenderquestionservice.formData[key].length>0)ret = ret.replace(new RegExp('##' + key + '##', 'g'),"http://localhost:5002/"+ JSON.parse(this.erptenderquestionservice.formData[key])[0]["name"]);
}
else if(false)
{
if(this.erptenderquestionservice.formData!=null && this.erptenderquestionservice.formData[key]!=null   && this.erptenderquestionservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='Stars' style='--rating:"+ this.erptenderquestionservice.formData[key]+"></div>");
}
else if(false)
{
if(this.erptenderquestionservice.formData!=null && this.erptenderquestionservice.formData[key]!=null   && this.erptenderquestionservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='progress--circle progress--"+this.erptenderquestionservice.formData[key]+"'><div class='progress__number'>"+this.erptenderquestionservice.formData[key]+"%</div></div>");
}
else
      ret = ret.replace(new RegExp('##' + key + '##', 'g'), this.erptenderquestionForm.controls[key].value);
    }
  }
  return ret;
}

async onSubmitDataDlg(bclear:any) {
this.isSubmitted = true;
if(!this.erptenderquestionForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
var obj=this.erptenderquestionForm.value;
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

private erptenderquestiontoggleOption(){
this.erptenderquestionshowOption = this.erptenderquestionshowOption === true ? false : true;
}



async onSubmitData(bclear:any) {
debugger;
this.isSubmitted = true;
let strError="";
Object.keys(this.erptenderquestionForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.erptenderquestionForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            strError+='control: ' + key + ', Error: ' + keyError + '<BR>';
          });
        }
      });
if(strError!="")return this.sharedService.alert(strError);


if(!this.erptenderquestionForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
if(!this.validate())
{
return;
}
this.erptenderquestionservice.formData=this.erptenderquestionForm.value;
if (this.dynamicconfig.data != null)
{
for (let key in this.dynamicconfig.data)
{
if(key!='visiblelist' && key!='hidelist'){
    if (this.erptenderquestionForm.controls[key] != null)
    {
        this.erptenderquestionservice.formData[key] = this.erptenderquestionForm.controls[key].value;
    }
}
}
}
console.log(this.erptenderquestionservice.formData);
this.erptenderquestionservice.formData=this.erptenderquestionForm.value;
this.erptenderquestionservice.saveOrUpdateerptenderquestions().subscribe(
async res => {
debugger;
this.toastr.addSingle("success","","Successfully saved");
this.showview=true;
document.getElementById("contentArea1").scrollTop = 0;
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).erptenderquestion);
    return;
}
else
{
document.getElementById("contentArea1").scrollTop = 0;
}
this.erptenderquestionservice.clearList();
if(bclear){
this.resetForm();
}
else{
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).erptenderquestion);
}
else
{
this.FillData(res);
}
}
this.erptenderquestionForm.markAsUntouched();
this.erptenderquestionForm.markAsPristine();
},
err => {
debugger;
this.toastr.addSingle("error","",err.error);
console.log(err);
}
)
}




//dropdown edit from the screen itself -> One screen like Reportviewer

AddOrEdittenderid( tenderid) {
/*let ScreenType='2';
this.dialog.open(erptendermasterComponent, 
{
data: {tenderid:this.erptenderquestionForm.get('tenderid').value, ScreenType:2 }
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



