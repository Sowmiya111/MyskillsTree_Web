import { erptenderquotationanswerService } from './../../../service/erptenderquotationanswer.service';
import { erptenderquotationanswer } from './../../../model/erptenderquotationanswer.model';
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
import { erpsupplierquotationmaster} from './../../../model/erpsupplierquotationmaster.model';
import { erpsupplierquotationmasterComponent } from './../../../pages/forms/erpsupplierquotationmaster/erpsupplierquotationmaster.component';
import { erpsupplierquotationmasterService } from './../../../service/erpsupplierquotationmaster.service';
//popups
import { erptenderquestion} from './../../../model/erptenderquestion.model';
import { erptenderquestionComponent } from './../../../pages/forms/erptenderquestion/erptenderquestion.component';
import { erptenderquestionService } from './../../../service/erptenderquestion.service';
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
selector: 'app-erptenderquotationanswer',
templateUrl: './erptenderquotationanswer.component.html',
styles: [],
providers: [ KeyboardShortcutsService ]
})



export class erptenderquotationanswerComponent implements OnInit {
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
bfilterPopulateerptenderquotationanswers:boolean=false;
dataerptenderquotationanswersquotationid3:any=[];
dataerptenderquotationanswersquestionid3:any=[];
 erptenderquotationanswerForm: FormGroup;
quotationidList: erpsupplierquotationmaster[];
quotationidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
quotationid_erpsupplierquotationmastersForm: FormGroup;//autocomplete
quotationid_erpsupplierquotationmastersoptions:any;//autocomplete
quotationid_erpsupplierquotationmastersformatter:any;//autocomplete
questionidList: erptenderquestion[];
private exportTime= { hour: 7, minute: 15, meriden: 'PM', format: 24 };
showformtype:any;
formid:any;
pkcol:any;
SESSIONUSERID:any;//current user
erptenderquotationanswershowOption:boolean;
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
private erptenderquotationanswerservice: erptenderquotationanswerService,
private fb: FormBuilder,
private sharedService: SharedService,
private sessionService: SessionService,
private toastr: ToastService,
//private dialog: NbDialogService,
private configservice:boconfigvalueService,
private erpsupplierquotationmasterservice:erpsupplierquotationmasterService,
private erptenderquestionservice:erptenderquestionService,
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
this.erptenderquotationanswerForm  = this.fb.group({
pk:[null],
tenderid: [null],
quotationid: [null],
quotationiddesc: [null],
answerid: [null],
questionid: [null],
questioniddesc: [null],
question: [null],
answer: [null],
status: [null],
statusdesc: [null],
});
}

get f() { return this.erptenderquotationanswerForm.controls; }


//when child screens are clicked - it will be made invisible
ToolBar(prop)
{
this.toolbarvisible=prop;
}

//function called when we navigate to other page.defined in routing
canDeactivate(): Observable<boolean> | boolean {
debugger;
if (this.erptenderquotationanswerForm.dirty && this.erptenderquotationanswerForm.touched ) {
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
  let pos = this.pkList.map(function(e:any) { return e.answerid.toString(); }).indexOf(this.formid.toString());
  if(pos>0) this.PopulateScreen(this.pkList[pos-1].pkcol);
}

next()
{
  debugger;
let pos = this.pkList.map(function(e:any) { return e.answerid.toString(); }).indexOf(this.formid.toString());
  if(pos>=0 && pos!=this.pkList.length) this.PopulateScreen(this.pkList[pos+1].pkcol);
}

//on searching in pk autocomplete
  onSelectedpk(pkDetail: any) {
    if (pkDetail.answerid && pkDetail) {
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
let erptenderquotationanswerid = null;

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
this.formid=erptenderquotationanswerid;
//this.sharedService.alert(erptenderquotationanswerid);

//if pk is empty - go to resetting form.fill default values.otherwise, fetch records
if (this.pkcol == null){
this.resetForm();
}
else {
if (this.maindata == undefined || this.maindata == null || this.maindata.save == true)await this.PopulateScreen(this.pkcol);
//get the record from api
//foreign keys 
}
this.erpsupplierquotationmasterservice.geterpsupplierquotationmastersList().then(res => 
{
this.quotationidList = res as erpsupplierquotationmaster[];
if(this.erptenderquotationanswerservice.formData && this.erptenderquotationanswerservice.formData.quotationid){
this.quotationidoptionsEvent.emit(this.quotationidList);
this.erptenderquotationanswerForm.patchValue({
    quotationid: this.erptenderquotationanswerservice.formData.quotationid,
    quotationiddesc: this.erptenderquotationanswerservice.formData.quotationiddesc,
});
}
{
let arrquotationid = this.quotationidList.filter(v => v.quotationid == this.erptenderquotationanswerForm.get('quotationid').value);
let objquotationid;
if (arrquotationid.length > 0) objquotationid = arrquotationid[0];
if (objquotationid)
{
}
}
}
).catch((err) => {console.log(err);});
this.quotationid_erpsupplierquotationmastersoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.quotationidList.filter(v => v.quotationreference.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.quotationid_erpsupplierquotationmastersformatter = (result: any) => result.quotationreference;
this.erptenderquestionservice.geterptenderquestionsList().then(res => 
{
this.questionidList = res as erptenderquestion[];
}
).catch((err) => {console.log(err);});

//autocomplete
    this.erptenderquotationanswerservice.geterptenderquotationanswersList().then(res => {
      this.pkList = res as erptenderquotationanswer[];
        this.pkoptionsEvent.emit(this.pkList);
    }
    ).catch((err) => {console.log(err);});
    this.pk_tbloptions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map(value => value.length < 2 ? []
          : this.pkList.filter(v => v.answer.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
      );
    this.pk_tblformatter = (result: any) => result.answer;

//setting the flag that the screen is not touched 
this.erptenderquotationanswerForm.markAsUntouched();
this.erptenderquotationanswerForm.markAsPristine();
}
onSelectedquotationid(quotationidDetail: any) {
if (quotationidDetail.quotationid && quotationidDetail) {
this.erptenderquotationanswerForm.patchValue({
quotationid: quotationidDetail.quotationid,
quotationiddesc: quotationidDetail.quotationreference,

});

}
}




resetForm() {
if (this.erptenderquotationanswerForm != null)
this.erptenderquotationanswerForm.reset();
this.erptenderquotationanswerForm.patchValue({
});
this.PopulateFromMainScreen(this.data,false);
this.PopulateFromMainScreen(this.dynamicconfig.data,true);
}

    onDelete() {
        let answerid = this.erptenderquotationanswerForm.get('answerid').value;
        if(answerid!=null)
        {
        if (confirm('Are you sure to delete this record ?')) {
            this.erptenderquotationanswerservice.deleteerptenderquotationanswer(answerid).then(res =>
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
    this.erptenderquotationanswerForm.patchValue({
        answerid: null
    });
    if(this.erptenderquotationanswerservice.formData.answerid!=null)this.erptenderquotationanswerservice.formData.answerid=null;
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
this.erptenderquotationanswerForm.patchValue({[key]:  mainscreendata[key] } );
}
        else
{
this.erptenderquotationanswerForm.patchValue({[key]:  mainscreendata[key] } );
}
{
{
         if(bdisable && this.erptenderquotationanswerForm.controls[key]!=undefined)
{
this.erptenderquotationanswerForm.controls[key].disable({onlySelf: true});
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
if(this.maindata==undefined || this.maindata.save==true  || this.erptenderquotationanswerservice.formData.answer!=null )
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
quotationidonChange(evt:any){
let e=evt.value;
}
answeridonChange(evt:any){
let e=evt.value;
}
questionidonChange(evt:any){
let e=evt.value;
this.erptenderquotationanswerForm.patchValue({questioniddesc:evt.options[evt.options.selectedIndex].text});
}
questiononChange(evt:any){
let e=evt.value;
}
answeronChange(evt:any){
let e=evt.value;
}
statusonChange(evt:any){
let e=evt.value;
}

editerptenderquotationanswers() {
this.showview=false;
return false;
}



async PopulateScreen(pkcol:any){
this.erptenderquotationanswerservice.geterptenderquotationanswersByEID(pkcol).then(res => {

this.erptenderquotationanswerservice.formData=res.erptenderquotationanswer;
let formproperty=res.erptenderquotationanswer.formproperty;
if(formproperty && formproperty.edit==false)this.showview=true;
this.pkcol=res.erptenderquotationanswer.pkcol;
this.formid=res.erptenderquotationanswer.answerid;
this.FillData(res);
}).catch((err) => {console.log(err);});
}

FillData(res:any)
{
this.formid=res.erptenderquotationanswer.answerid;
console.log(res);
//console.log(res.order);
//console.log(res.orderDetails);
this.erptenderquotationanswerForm.patchValue({
tenderid: res.erptenderquotationanswer.tenderid,
quotationid: res.erptenderquotationanswer.quotationid,
quotationiddesc: res.erptenderquotationanswer.quotationiddesc,
answerid: res.erptenderquotationanswer.answerid,
questionid: res.erptenderquotationanswer.questionid,
questioniddesc: res.erptenderquotationanswer.questioniddesc,
question: res.erptenderquotationanswer.question,
answer: res.erptenderquotationanswer.answer,
status: res.erptenderquotationanswer.status,
statusdesc: res.erptenderquotationanswer.statusdesc,
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
  for (let key in this.erptenderquotationanswerForm.controls) {
    if (this.erptenderquotationanswerForm.controls[key] != null) {
if(false)
{
if(this.erptenderquotationanswerservice.formData!=null && this.erptenderquotationanswerservice.formData[key]!=null  && this.erptenderquotationanswerservice.formData[key]!='[]' && this.erptenderquotationanswerservice.formData[key]!=undefined && this.erptenderquotationanswerservice.formData[key].length>0)ret = ret.replace(new RegExp('##' + key + '##', 'g'),"http://localhost:5002/"+ JSON.parse(this.erptenderquotationanswerservice.formData[key])[0]["name"]);
}
else if(false)
{
if(this.erptenderquotationanswerservice.formData!=null && this.erptenderquotationanswerservice.formData[key]!=null   && this.erptenderquotationanswerservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='Stars' style='--rating:"+ this.erptenderquotationanswerservice.formData[key]+"></div>");
}
else if(false)
{
if(this.erptenderquotationanswerservice.formData!=null && this.erptenderquotationanswerservice.formData[key]!=null   && this.erptenderquotationanswerservice.formData[key]!=undefined )ret = ret.replace(new RegExp('##' + key + '##', 'g'),"<div class='progress--circle progress--"+this.erptenderquotationanswerservice.formData[key]+"'><div class='progress__number'>"+this.erptenderquotationanswerservice.formData[key]+"%</div></div>");
}
else
      ret = ret.replace(new RegExp('##' + key + '##', 'g'), this.erptenderquotationanswerForm.controls[key].value);
    }
  }
  return ret;
}

async onSubmitDataDlg(bclear:any) {
this.isSubmitted = true;
if(!this.erptenderquotationanswerForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
var obj=this.erptenderquotationanswerForm.value;
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

private erptenderquotationanswertoggleOption(){
this.erptenderquotationanswershowOption = this.erptenderquotationanswershowOption === true ? false : true;
}



async onSubmitData(bclear:any) {
debugger;
this.isSubmitted = true;
let strError="";
Object.keys(this.erptenderquotationanswerForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.erptenderquotationanswerForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            strError+='control: ' + key + ', Error: ' + keyError + '<BR>';
          });
        }
      });
if(strError!="")return this.sharedService.alert(strError);


if(!this.erptenderquotationanswerForm.valid)
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
if(!this.validate())
{
return;
}
this.erptenderquotationanswerservice.formData=this.erptenderquotationanswerForm.value;
if (this.dynamicconfig.data != null)
{
for (let key in this.dynamicconfig.data)
{
if(key!='visiblelist' && key!='hidelist'){
    if (this.erptenderquotationanswerForm.controls[key] != null)
    {
        this.erptenderquotationanswerservice.formData[key] = this.erptenderquotationanswerForm.controls[key].value;
    }
}
}
}
console.log(this.erptenderquotationanswerservice.formData);
this.erptenderquotationanswerservice.formData=this.erptenderquotationanswerForm.value;
this.erptenderquotationanswerservice.saveOrUpdateerptenderquotationanswers().subscribe(
async res => {
debugger;
this.toastr.addSingle("success","","Successfully saved");
this.showview=true;
document.getElementById("contentArea1").scrollTop = 0;
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).erptenderquotationanswer);
    return;
}
else
{
document.getElementById("contentArea1").scrollTop = 0;
}
this.erptenderquotationanswerservice.clearList();
if(bclear){
this.resetForm();
}
else{
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).erptenderquotationanswer);
}
else
{
this.FillData(res);
}
}
this.erptenderquotationanswerForm.markAsUntouched();
this.erptenderquotationanswerForm.markAsPristine();
},
err => {
debugger;
this.toastr.addSingle("error","",err.error);
console.log(err);
}
)
}




//dropdown edit from the screen itself -> One screen like Reportviewer

AddOrEditquotationid( quotationid) {
/*let ScreenType='2';
this.dialog.open(erpsupplierquotationmasterComponent, 
{
data: {quotationid:this.erptenderquotationanswerForm.get('quotationid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEditquestionid( questionid) {
/*let ScreenType='2';
this.dialog.open(erptenderquestionComponent, 
{
data: {questionid:this.erptenderquotationanswerForm.get('questionid').value, ScreenType:2 }
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



