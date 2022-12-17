import { bobranchmasterService } from './../../../service/bobranchmaster.service';
import { bobranchmaster } from './../../../model/bobranchmaster.model';
import { ElementRef,Component, OnInit,Inject,Optional,ViewChild,EventEmitter  } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
//Dropdown - nvarchar(5) - Backoffice -> Fixed Values menu
import { boconfigvalue } from './../../../model/boconfigvalue.model';
import { boconfigvalueService } from './../../../service/boconfigvalue.service';

//Custom error functions
import { KeyValuePair,MustMatch, DateCompare,MustEnable,MustDisable,Time } from '../../../shared/general.validator';

//child table
import {SmartTableDatepickerComponent,SmartTableDatepickerRenderComponent} from '../../../custom/smart-table-datepicker.component';
import {SmartTablepopupselectComponent,SmartTablepopupselectRenderComponent} from '../../../custom/smart-table-popupselect.component';
import {SmartTableFileRenderComponent} from '../../../../../../n-tire-bo-app/src/app/custom/smart-table-filerender.component';

//Custom control
import { durationComponent } from '../../../custom/duration.component';
import { LocalDataSource } from 'ng2-smart-table';
import {Ng2SmartTableComponent} from 'ng2-smart-table';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ShortcutInput, ShortcutEventOutput  } from "ng-keyboard-shortcuts";
//Shortcuts
import { KeyboardShortcutsService } from "ng-keyboard-shortcuts";
//translator
import { TranslateService } from "@ngx-translate/core";
//FK field services
import { bocountry} from './../../../model/bocountry.model';
import { bocountryService } from './../../../service/bocountry.service';
//popups
import { bostate} from './../../../model/bostate.model';
import { bostateService } from './../../../service/bostate.service';
//popups
import { bocity} from './../../../model/bocity.model';
import { bocityService } from './../../../service/bocity.service';
//popups
import { bolocation} from './../../../model/bolocation.model';
import { bolocationService } from './../../../service/bolocation.service';
//popups
import { bousermaster} from './../../../model/bousermaster.model';
import { bousermasterService } from './../../../service/bousermaster.service';
//popups
//detail table services
import { bobranchholiday } from './../../../model/bobranchholiday.model';
//FK services
import { bobranchholidayComponent } from '../../../../../../n-tire-bo-app/src/app/pages/forms/bobranchholiday/bobranchholiday.component';
import { switchMap,map, debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, EmailValidator,ValidationErrors } from '@angular/forms';
//primeng services
import { DynamicDialogRef } from 'primeng/dynamicDialog';
import { DynamicDialogConfig } from 'primeng/dynamicDialog';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import {DialogService} from 'primeng/dynamicDialog';
//session,application constants
import { SharedService } from '../../../service/shared.service';
import { SessionService } from '../../core/services/session.service';
//custom fields & attachments
import {AppConstants} from '../../../shared/helper';
import { Subject } from 'rxjs/Subject';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import {createWorker, RecognizeResult} from 'tesseract.js';
import {AttachmentComponent} from '../../../custom/attachment/attachment.component';
import { customfieldconfigurationService } from './../../../service/customfieldconfiguration.service';
import { customfieldconfiguration } from './../../../model/customfieldconfiguration.model';
import { DynamicFormBuilderComponent } from '../dynamic-form-builder/dynamic-form-builder.component';

@Component({
selector: 'app-bobranchmaster',
templateUrl: './bobranchmaster.component.html',
styles: [],
providers: [ KeyboardShortcutsService ]
})



export class bobranchmasterComponent implements OnInit {
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
@ViewChild('customform',{static:false}) customform: DynamicFormBuilderComponent;
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
bfilterPopulatebobranchmasters:boolean=false;
databobranchmasterscountryid3:any=[];
databobranchmastersstateid3:any=[];
databobranchmasterscityid3:any=[];
databobranchmasterslocationid3:any=[];
databobranchmastersweekoff13:any=[];
databobranchmastersweekoff23:any=[];
databobranchmastersresourceallocation3:any=[];
databobranchmastersgrowthopportunity3:any=[];
databobranchmasterscustomersuccessdirector3:any=[];
bfilterPopulatebobranchholidays:boolean=false;
@ViewChild('tblbobranchholidayssource',{static:false}) tblbobranchholidayssource: Ng2SmartTableComponent;
 bobranchmasterForm: FormGroup;
countryidList: bocountry[];
countryidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
countryid_bocountriesForm: FormGroup;//autocomplete
countryid_bocountriesoptions:any;//autocomplete
countryid_bocountriesformatter:any;//autocomplete
stateidList: bostate[];
stateidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
stateid_bostatesForm: FormGroup;//autocomplete
stateid_bostatesoptions:any;//autocomplete
stateid_bostatesformatter:any;//autocomplete
cityidList: bocity[];
cityidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
cityid_bocitiesForm: FormGroup;//autocomplete
cityid_bocitiesoptions:any;//autocomplete
cityid_bocitiesformatter:any;//autocomplete
locationidList: bolocation[];
locationidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
locationid_bolocationsForm: FormGroup;//autocomplete
locationid_bolocationsoptions:any;//autocomplete
locationid_bolocationsformatter:any;//autocomplete
weekoff1List: boconfigvalue[];
weekoff2List: boconfigvalue[];
resourceallocationList: boconfigvalue[];
growthopportunityList: boconfigvalue[];
customersuccessdirectorList: bousermaster[];
customersuccessdirectoroptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
customersuccessdirector_bousermastersForm: FormGroup;//autocomplete
customersuccessdirector_bousermastersoptions:any;//autocomplete
customersuccessdirector_bousermastersformatter:any;//autocomplete
private exportTime= { hour: 7, minute: 15, meriden: 'PM', format: 24 };
showformtype:any;
formid:any;
pkcol:any;
customfieldjson: any;
customfieldvisible:boolean=true;
readonly AttachmentURL = AppConstants.AttachmentURL;
readonly URL = AppConstants.UploadURL;attachmentlist: any[]=[];fileattachmentlist: any[]=[];
@ViewChild('fileattachment',{static:false}) fileattachment: AttachmentComponent;
attachmentfieldjson: any[]=[];
attachmentvisible:boolean=true;
SESSIONUSERID:any;//current user
sessiondata:any;



bobranchholidaysvisiblelist:any;
bobranchholidayshidelist:any;

DeletedbobranchholidayIDs: string="";
bobranchholidaysID: string = "1";
bobranchholidaysselectedindex:any;


constructor(
private translate: TranslateService,
private keyboard: KeyboardShortcutsService,private router: Router,
private ngbDateParserFormatter: NgbDateParserFormatter,
public dialogRef: DynamicDialogRef,
public dynamicconfig: DynamicDialogConfig,
public dialog: DialogService,
private bobranchmasterservice: bobranchmasterService,
private fb: FormBuilder,
private sharedService: SharedService,
private sessionService: SessionService,
private toastr: ToastService,
//private dialog: NbDialogService,
private configservice:boconfigvalueService,
private bocountryservice:bocountryService,
private bostateservice:bostateService,
private bocityservice:bocityService,
private bolocationservice:bolocationService,
private bousermasterservice:bousermasterService,
private customfieldservice: customfieldconfigurationService,
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
this.bobranchmasterForm  = this.fb.group({pk:[null],ImageName: [null],
branchid: [null],
branchcode: [null, Validators.required],
branchname: [null, Validators.required],
thumbnail: [null],
address1: [null, Validators.required],
address2: [null],
countryid: [null],
countryiddesc: [null],
stateid: [null],
stateiddesc: [null],
cityid: [null],
cityiddesc: [null],
locationid: [null],
locationiddesc: [null],
pin: [null],
latlong: [null],
starttime: [null, Validators.required],
endtime: [null, Validators.required],
weekoff1: [null],
weekoff1desc: [null],
weekoff2: [null],
weekoff2desc: [null],
remarks: [null],
totalregions: [null],
accounts: [null],
salespeople: [null],
resourceallocation: [null],
resourceallocationdesc: [null],
growthopportunity: [null],
growthopportunitydesc: [null],
salesdirector: [null],
customersuccessdirector: [null],
customersuccessdirectordesc: [null],
customfield: [null],
attachment: [null],
status: [null],
statusdesc: [null],
});
}

get f() { return this.bobranchmasterForm.controls; }


//when child screens are clicked - it will be made invisible
ToolBar(prop)
{
this.toolbarvisible=prop;
}

//function called when we navigate to other page.defined in routing
canDeactivate(): Observable<boolean> | boolean {
debugger;
if (this.bobranchmasterForm.dirty && this.bobranchmasterForm.touched ) {
if (confirm('Do you want to exit the page?')) {
return Observable.of(true).delay(1000);
} else {
return Observable.of(false);
}
}
return Observable.of(true);
}

//check Unique fields
branchcodeexists(e:any)
{
  debugger;
  let pos = this.pkList.map(function(e:any) { return e.branchcode.toString().toLowerCase(); }).indexOf(e.target.value.toString().toLowerCase());
  
  if(pos>=0 && this.pkList[pos].branchid.toString()!=this.formid.toString()) 
  {
    if(confirm("This Branch Code value exists in the database.Do you want to display the record ? "))
    {
      this.PopulateScreen(this.pkList[pos].pkcol);
      return true;
    }
    else
    {
      e.stopPropagation();
      e.preventDefault();
      e.target.focus();
      e.target.markAsDirty();
      return false;
    }
  }
  return true;
}
branchnameexists(e:any)
{
  debugger;
  let pos = this.pkList.map(function(e:any) { return e.branchname.toString().toLowerCase(); }).indexOf(e.target.value.toString().toLowerCase());
  
  if(pos>=0 && this.pkList[pos].branchid.toString()!=this.formid.toString()) 
  {
    if(confirm("This Branch Name value exists in the database.Do you want to display the record ? "))
    {
      this.PopulateScreen(this.pkList[pos].pkcol);
      return true;
    }
    else
    {
      e.stopPropagation();
      e.preventDefault();
      e.target.focus();
      e.target.markAsDirty();
      return false;
    }
  }
  return true;
}

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
  let pos = this.pkList.map(function(e:any) { return e.branchid.toString(); }).indexOf(this.formid.toString());
  if(pos>0) this.PopulateScreen(this.pkList[pos-1].pkcol);
}

next()
{
  debugger;
let pos = this.pkList.map(function(e:any) { return e.branchid.toString(); }).indexOf(this.formid.toString());
  if(pos>=0 && pos!=this.pkList.length) this.PopulateScreen(this.pkList[pos+1].pkcol);
}

//on searching in pk autocomplete
  onSelectedpk(pkDetail: any) {
    if (pkDetail.branchid && pkDetail) {
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

debugger;
let bobranchmasterid = null;

//getting data - from list page, from other screen through dialog
if(this.data!=null && this.data.data!=null)
 {
this.data=this.data.data;
this.maindata = this.data;
}
if(this.maindata!=null && this.maindata.showview!=undefined  && this.maindata.showview!=null)this.showview=this.maindata.showview;
if (this.data != null &&  this.data.event != null && this.data.event.data != null) this.data = this.data.event.data;
 //if view button(eye) is clicked
if ( this.currentRoute.snapshot.paramMap.get('viewid') != null) 
{
this.pkcol=this.currentRoute.snapshot.paramMap.get('viewid');
this.showview=true;
this.viewhtml=this.sessionService.getViewHtml();
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
this.formid=bobranchmasterid;
//this.sharedService.alert(bobranchmasterid);

//if pk is empty - go to resetting form.fill default values.otherwise, fetch records
if (this.pkcol == null){
this.SetbobranchholidaysTableConfig();
  setTimeout(() => {
  this.SetbobranchholidaysTableddConfig();
  });

this.FillCustomField();
this.resetForm();
}
else {
if (this.maindata == undefined || this.maindata == null)await this.PopulateScreen(this.pkcol);
//get the record from api
//foreign keys 
}
this.bocountryservice.getbocountriesList().then(res => 
{
this.countryidList = res as bocountry[];
if(this.bobranchmasterservice.formData && this.bobranchmasterservice.formData.countryid){
this.countryidoptionsEvent.emit(this.countryidList);
this.bobranchmasterForm.patchValue({
    countryid: this.bobranchmasterservice.formData.countryid,
    countryiddesc: this.bobranchmasterservice.formData.countryiddesc,
});
}
{
let arrcountryid = this.countryidList.filter(v => v.countryid == this.bobranchmasterForm.get('countryid').value);
let objcountryid;
if (arrcountryid.length > 0) objcountryid = arrcountryid[0];
if (objcountryid)
{
}
}
}
).catch((err) => {console.log(err);});
this.countryid_bocountriesoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.countryidList.filter(v => v.name.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.countryid_bocountriesformatter = (result: any) => result.name;
setTimeout(() => {
if(this.f.countryid.value && this.f.countryid.value!="" && this.f.countryid.value!=null)this.bostateservice.getListBycountryid(this.f.countryid.value).then(res =>{
this.stateidList = res as bostate[];
if(this.bobranchmasterservice.formData && this.bobranchmasterservice.formData.stateid){this.bobranchmasterForm.patchValue({
    stateid: this.bobranchmasterservice.formData.stateid,
    stateiddesc: this.bobranchmasterservice.formData.stateiddesc,
});
}
}).catch((err) => {console.log(err);});
});
this.stateid_bostatesoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.stateidList.filter(v => v.name.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.stateid_bostatesformatter = (result: any) => result.name;
setTimeout(() => {
if(this.f.stateid.value && this.f.stateid.value!="" && this.f.stateid.value!=null)this.bocityservice.getListBystateid(this.f.stateid.value).then(res =>{
this.cityidList = res as bocity[];
if(this.bobranchmasterservice.formData && this.bobranchmasterservice.formData.cityid){this.bobranchmasterForm.patchValue({
    cityid: this.bobranchmasterservice.formData.cityid,
    cityiddesc: this.bobranchmasterservice.formData.cityiddesc,
});
}
}).catch((err) => {console.log(err);});
});
this.cityid_bocitiesoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.cityidList.filter(v => v.name.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.cityid_bocitiesformatter = (result: any) => result.name;
setTimeout(() => {
if(this.f.cityid.value && this.f.cityid.value!="" && this.f.cityid.value!=null)this.bolocationservice.getListBycityid(this.f.cityid.value).then(res =>{
this.locationidList = res as bolocation[];
if(this.bobranchmasterservice.formData && this.bobranchmasterservice.formData.locationid){this.bobranchmasterForm.patchValue({
    locationid: this.bobranchmasterservice.formData.locationid,
    locationiddesc: this.bobranchmasterservice.formData.locationiddesc,
});
}
}).catch((err) => {console.log(err);});
});
this.locationid_bolocationsoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.locationidList.filter(v => v.name.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.locationid_bolocationsformatter = (result: any) => result.name;
this.configservice.getList("weekday").then(res => this.weekoff1List = res as boconfigvalue[]);
this.configservice.getList("weekday").then(res => this.weekoff2List = res as boconfigvalue[]);
this.configservice.getList("resourceallocation").then(res => this.resourceallocationList = res as boconfigvalue[]);
this.configservice.getList("growthopportunity").then(res => this.growthopportunityList = res as boconfigvalue[]);
this.bousermasterservice.getbousermastersList().then(res => 
{
this.customersuccessdirectorList = res as bousermaster[];
if(this.bobranchmasterservice.formData && this.bobranchmasterservice.formData.customersuccessdirector){
this.customersuccessdirectoroptionsEvent.emit(this.customersuccessdirectorList);
this.bobranchmasterForm.patchValue({
    customersuccessdirector: this.bobranchmasterservice.formData.customersuccessdirector,
    customersuccessdirectordesc: this.bobranchmasterservice.formData.customersuccessdirectordesc,
});
}
{
let arrcustomersuccessdirector = this.customersuccessdirectorList.filter(v => v.userid == this.bobranchmasterForm.get('customersuccessdirector').value);
let objcustomersuccessdirector;
if (arrcustomersuccessdirector.length > 0) objcustomersuccessdirector = arrcustomersuccessdirector[0];
if (objcustomersuccessdirector)
{
}
}
}
).catch((err) => {console.log(err);});
this.customersuccessdirector_bousermastersoptions = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(value => value.length < 2 ? []
: this.customersuccessdirectorList.filter(v => v.username.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
);
this.customersuccessdirector_bousermastersformatter = (result: any) => result.username;

//autocomplete
    this.bobranchmasterservice.getbobranchmastersList().then(res => {
      this.pkList = res as bobranchmaster[];
        this.pkoptionsEvent.emit(this.pkList);
    }
    ).catch((err) => {console.log(err);});
    this.pk_tbloptions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map(value => value.length < 2 ? []
          : this.pkList.filter(v => v.branchname.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
      );
    this.pk_tblformatter = (result: any) => result.branchname;

//setting the flag that the screen is not touched 
this.bobranchmasterForm.markAsUntouched();
this.bobranchmasterForm.markAsPristine();
}
onSelectedcountryid(countryidDetail: any) {
if (countryidDetail.countryid && countryidDetail) {
this.bobranchmasterForm.patchValue({
countryid: countryidDetail.countryid,
countryiddesc: countryidDetail.name,

});
this.bostateservice.getListBycountryid(countryidDetail.countryid).then(res => {
 this.stateidList = res as bostate[]
}).catch((err) => {console.log(err);});

}
}

onSelectedstateid(stateidDetail: any) {
if (stateidDetail.stateid && stateidDetail) {
this.bobranchmasterForm.patchValue({
stateid: stateidDetail.stateid,
stateiddesc: stateidDetail.name,

});
this.bocityservice.getListBystateid(stateidDetail.stateid).then(res => {
 this.cityidList = res as bocity[]
}).catch((err) => {console.log(err);});

}
}

onSelectedcityid(cityidDetail: any) {
if (cityidDetail.cityid && cityidDetail) {
this.bobranchmasterForm.patchValue({
cityid: cityidDetail.cityid,
cityiddesc: cityidDetail.name,

});
this.bolocationservice.getListBycityid(cityidDetail.cityid).then(res => {
 this.locationidList = res as bolocation[]
}).catch((err) => {console.log(err);});

}
}

onSelectedlocationid(locationidDetail: any) {
if (locationidDetail.locationid && locationidDetail) {
this.bobranchmasterForm.patchValue({
locationid: locationidDetail.locationid,
locationiddesc: locationidDetail.name,

});

}
}

onSelectedcustomersuccessdirector(customersuccessdirectorDetail: any) {
if (customersuccessdirectorDetail.customersuccessdirector && customersuccessdirectorDetail) {
this.bobranchmasterForm.patchValue({
customersuccessdirector: customersuccessdirectorDetail.customersuccessdirector,
customersuccessdirectordesc: customersuccessdirectorDetail.username,

});

}
}




resetForm() {
if (this.bobranchmasterForm != null)
this.bobranchmasterForm.reset();
this.bobranchmasterForm.patchValue({
customersuccessdirector: this.sessiondata.userid,
customersuccessdirectordesc: this.sessiondata.username,
});
setTimeout(() => {
this.bobranchmasterservice.bobranchholidays=[];
this.bobranchholidaysLoadTable();
});
this.customfieldservice.reset(document);
this.PopulateFromMainScreen(this.data,false);
this.PopulateFromMainScreen(this.dynamicconfig.data,true);
}

    onDelete() {
        let branchid = this.bobranchmasterForm.get('branchid').value;
        if(branchid!=null)
        {
        if (confirm('Are you sure to delete this record ?')) {
            this.bobranchmasterservice.deletebobranchmaster(branchid).then(res =>
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
    this.bobranchmasterForm.patchValue({
        branchid: null
    });
    if(this.bobranchmasterservice.formData.branchid!=null)this.bobranchmasterservice.formData.branchid=null;
for (let i=0;i<this.bobranchmasterservice.bobranchholidays.length;i++) {
this.bobranchmasterservice.bobranchholidays[i].branchholidayid=null;
}
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
        else if(key=="starttime")
this.bobranchmasterForm.patchValue({"starttime":new Time(mainscreendata[key]) });
        else if(key=="endtime")
this.bobranchmasterForm.patchValue({"endtime":new Time(mainscreendata[key]) });
        else if(ctrltype=="string")
{
this.bobranchmasterForm.patchValue({[key]:  mainscreendata[key] } );
}
        else
{
this.bobranchmasterForm.patchValue({[key]:  mainscreendata[key] } );
}
{
{
         if(bdisable && this.bobranchmasterForm.controls[key]!=undefined)this.bobranchmasterForm.controls[key].disable({onlySelf: true});
}
      }
      }
      }
    }
    }
async FillCustomField()
{
return this.customfieldservice.getcustomfieldconfigurationsByTable("bobranchmasters",this.CustomFormName,"","",this.customfieldjson).then(res=>{
this.customfieldservicelist = res;
if(this.customfieldservicelist!=undefined)this.customfieldvisible=(this.customfieldservicelist.fields.length>0)?true:false;
      return res;
});


}
onClose() {
this.dialogRef.close();
}

onSubmitAndWait() {
if(this.maindata==undefined || this.maindata.save==true)
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
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.onSubmitDataDlg(true);
}
else
{
this.onSubmitData(true);
}
}
branchidonChange(evt:any){
let e=evt.value;
}
branchcodeonChange(evt:any){
let e=evt.value;
}
branchnameonChange(evt:any){
let e=evt.value;
}
thumbnailonChange(evt:any){
let e=evt.value;
}
address1onChange(evt:any){
let e=evt.value;
}
address2onChange(evt:any){
let e=evt.value;
}
countryidonChange(evt:any){
let e=evt.value;
}
stateidonChange(evt:any){
let e=evt.value;
}
cityidonChange(evt:any){
let e=evt.value;
}
locationidonChange(evt:any){
let e=evt.value;
}
pinonChange(evt:any){
let e=evt.value;
}
latlongonChange(evt:any){
let e=evt.value;
}
starttimeonChange(evt:any){
let e=evt.value;
}
endtimeonChange(evt:any){
let e=evt.value;
}
weekoff1onChange(evt:any){
let e=this.f.weekoff1.value as any;
this.bobranchmasterForm.patchValue({weekoff1desc:evt.options[evt.options.selectedIndex].text});
}
weekoff2onChange(evt:any){
let e=this.f.weekoff2.value as any;
this.bobranchmasterForm.patchValue({weekoff2desc:evt.options[evt.options.selectedIndex].text});
}
remarksonChange(evt:any){
let e=evt.value;
}
totalregionsonChange(evt:any){
let e=evt.value;
}
accountsonChange(evt:any){
let e=evt.value;
}
salespeopleonChange(evt:any){
let e=evt.value;
}
resourceallocationonChange(evt:any){
let e=this.f.resourceallocation.value as any;
this.bobranchmasterForm.patchValue({resourceallocationdesc:evt.options[evt.options.selectedIndex].text});
}
growthopportunityonChange(evt:any){
let e=this.f.growthopportunity.value as any;
this.bobranchmasterForm.patchValue({growthopportunitydesc:evt.options[evt.options.selectedIndex].text});
}
salesdirectoronChange(evt:any){
let e=evt.value;
}
customersuccessdirectoronChange(evt:any){
let e=evt.value;
}
customfieldonChange(evt:any){
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
  


async PopulateScreen(pkcol:any){
this.bobranchmasterservice.getbobranchmastersByEID(pkcol).then(res => {

this.bobranchmasterservice.formData=res;
let formproperty=res.formproperty;
if(formproperty && formproperty.edit==false)this.showview=true;
this.pkcol=res.pkcol;
this.formid=res.bobranchmaster.branchid;
this.FillData(res);
}).catch((err) => {console.log(err);});
}

FillData(res:any)
{
this.formid=res.bobranchmaster.branchid;
var starttimeTime=new Time( res.bobranchmaster.starttime);
var endtimeTime=new Time( res.bobranchmaster.endtime);
console.log(res);
//console.log(res.order);
//console.log(res.orderDetails);
this.bobranchmasterForm.patchValue({
branchid: res.bobranchmaster.branchid,
branchcode: res.bobranchmaster.branchcode,
branchname: res.bobranchmaster.branchname,
thumbnail: res.bobranchmaster.thumbnail,
address1: res.bobranchmaster.address1,
address2: res.bobranchmaster.address2,
countryid: res.bobranchmaster.countryid,
countryiddesc: res.bobranchmaster.countryiddesc,
stateid: res.bobranchmaster.stateid,
stateiddesc: res.bobranchmaster.stateiddesc,
cityid: res.bobranchmaster.cityid,
cityiddesc: res.bobranchmaster.cityiddesc,
locationid: res.bobranchmaster.locationid,
locationiddesc: res.bobranchmaster.locationiddesc,
pin: res.bobranchmaster.pin,
latlong: res.bobranchmaster.latlong,
starttime: starttimeTime,
endtime: endtimeTime,
weekoff1: res.bobranchmaster.weekoff1,
weekoff1desc: res.bobranchmaster.weekoff1desc,
weekoff2: res.bobranchmaster.weekoff2,
weekoff2desc: res.bobranchmaster.weekoff2desc,
remarks: res.bobranchmaster.remarks,
totalregions: res.bobranchmaster.totalregions,
accounts: res.bobranchmaster.accounts,
salespeople: res.bobranchmaster.salespeople,
resourceallocation: res.bobranchmaster.resourceallocation,
resourceallocationdesc: res.bobranchmaster.resourceallocationdesc,
growthopportunity: res.bobranchmaster.growthopportunity,
growthopportunitydesc: res.bobranchmaster.growthopportunitydesc,
salesdirector: res.bobranchmaster.salesdirector,
customersuccessdirector: res.bobranchmaster.customersuccessdirector,
customersuccessdirectordesc: res.bobranchmaster.customersuccessdirectordesc,
customfield: res.bobranchmaster.customfield,
attachment: res.bobranchmaster.attachment,
status: res.bobranchmaster.status,
statusdesc: res.bobranchmaster.statusdesc,
});
this.bobranchholidaysvisiblelist=res.bobranchholidaysvisiblelist;
if(this.bobranchmasterForm.get('customfield').value!=null && this.bobranchmasterForm.get('customfield').value!="")this.customfieldjson=JSON.parse(this.bobranchmasterForm.get('customfield').value);
this.FillCustomField();
if(this.bobranchmasterForm.get('attachment').value!=null && this.bobranchmasterForm.get('attachment').value!="" && this.fileattachment!=null && this.fileattachment!=undefined)this.fileattachment.setattachmentlist(JSON.parse(this.bobranchmasterForm.get('attachment').value));
setTimeout(() => {
if(this.f.countryid.value && this.f.countryid.value!="" && this.f.countryid.value!=null)this.bostateservice.getListBycountryid(this.f.countryid.value).then(res =>{
this.stateidList = res as bostate[];
}).catch((err) => {console.log(err);});
});
setTimeout(() => {
if(this.f.stateid.value && this.f.stateid.value!="" && this.f.stateid.value!=null)this.bocityservice.getListBystateid(this.f.stateid.value).then(res =>{
this.cityidList = res as bocity[];
}).catch((err) => {console.log(err);});
});
setTimeout(() => {
if(this.f.cityid.value && this.f.cityid.value!="" && this.f.cityid.value!=null)this.bolocationservice.getListBycityid(this.f.cityid.value).then(res =>{
this.locationidList = res as bolocation[];
}).catch((err) => {console.log(err);});
});
//Child Tables if any
this.bobranchmasterservice.bobranchholidays = res.bobranchholidays;
this.SetbobranchholidaysTableConfig();
this.bobranchholidaysLoadTable();
  setTimeout(() => {
  this.SetbobranchholidaysTableddConfig();
  });
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
  for (let key in this.bobranchmasterForm.controls) {
    if (this.bobranchmasterForm.controls[key] != null) {
      ret = ret.replace(new RegExp('##' + key + '##', 'g'), this.bobranchmasterForm.controls[key].value);
    }
  }
  return ret;
}

async onSubmitDataDlg(bclear:any) {
this.isSubmitted = true;
if(!this.bobranchmasterForm.valid  || (this.customform!=undefined &&  this.customform.form!=undefined &&  !this.customform.form.valid))
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
var customfields=this.customfieldservice.getCustomValues(document);
var obj=this.bobranchmasterForm.value;
obj.starttime=(this.bobranchmasterForm.get('starttime').value==null?0:this.bobranchmasterForm.get('starttime').value.hour)+':'+(this.bobranchmasterForm.get('starttime').value==null?0:this.bobranchmasterForm.get('starttime').value.minute+":00");
obj.endtime=(this.bobranchmasterForm.get('endtime').value==null?0:this.bobranchmasterForm.get('endtime').value.hour)+':'+(this.bobranchmasterForm.get('endtime').value==null?0:this.bobranchmasterForm.get('endtime').value.minute+":00");
obj.customfield=JSON.stringify(customfields);
obj.attachment=JSON.stringify(this.fileattachment.getattachmentlist());
obj.fileattachmentlist=this.fileattachment.getAllFiles();
console.log(obj);
if (!confirm('Do you want to want to save?')) {
return;
}
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

async onSubmitData(bclear:any) {
debugger;
this.isSubmitted = true;
let strError="";
Object.keys(this.bobranchmasterForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.bobranchmasterForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            strError+='control: ' + key + ', Error: ' + keyError + '<BR>';
          });
        }
      });
if(strError!="")return this.sharedService.alert(strError);


if(!this.bobranchmasterForm.valid || (this.customform!=undefined && this.customform.form!=undefined &&  !this.customform.form.valid))
{
this.toastr.addSingle("error", "", "Enter the required fields");
return; 
}
if(!this.validate())
{
return;
}
this.bobranchmasterservice.formData=this.bobranchmasterForm.value;
if (this.dynamicconfig.data != null)
{
for (let key in this.dynamicconfig.data)
{
if(key!='visiblelist' && key!='hidelist'){
    if (this.bobranchmasterForm.controls[key] != null)
    {
        this.bobranchmasterservice.formData[key] = this.bobranchmasterForm.controls[key].value;
    }
}
}
}
var customfields=this.customfieldservice.getCustomValues(document);
this.bobranchmasterservice.formData.starttime=(this.bobranchmasterForm.get('starttime').value==null?0:this.bobranchmasterForm.get('starttime').value.hour)+':'+(this.bobranchmasterForm.get('starttime').value==null?0:this.bobranchmasterForm.get('starttime').value.minute+":00");
this.bobranchmasterservice.formData.endtime=(this.bobranchmasterForm.get('endtime').value==null?0:this.bobranchmasterForm.get('endtime').value.hour)+':'+(this.bobranchmasterForm.get('endtime').value==null?0:this.bobranchmasterForm.get('endtime').value.minute+":00");
this.bobranchmasterservice.formData.customfield=JSON.stringify(customfields);
this.bobranchmasterservice.formData.attachment=JSON.stringify(this.fileattachment.getattachmentlist());
this.bobranchmasterservice.formData.DeletedbobranchholidayIDs = this.DeletedbobranchholidayIDs;
this.fileattachmentlist=this.fileattachment.getAllFiles();
console.log(this.bobranchmasterservice.formData);
this.bobranchmasterservice.formData=this.bobranchmasterForm.value;
this.bobranchmasterservice.saveOrUpdatebobranchmasters().subscribe(
async res => {
await this.sharedService.upload(this.fileattachmentlist);
this.attachmentlist=[];
if(this.fileattachment)this.fileattachment.clear();
if (this.bobranchholidayssource.data)
{
    for (let i = 0; i < this.bobranchholidayssource.data.length; i++)
    {
        if (this.bobranchholidayssource.data[i].fileattachmentlist)await this.sharedService.upload(this.bobranchholidayssource.data[i].fileattachmentlist);
    }
}
debugger;
this.toastr.addSingle("success","","Successfully saved");
document.getElementById("contentArea1").scrollTop = 0;
if(this.dynamicconfig.data!=undefined && this.dynamicconfig.data.save)
{
this.dialogRef.close((res as any).result.value.bobranchmaster);
    return;
}
else
{
document.getElementById("contentArea1").scrollTop = 0;
}
this.bobranchmasterservice.clearList();
if(bclear){
this.resetForm();
}
else{
if(this.maindata!=null && (this.maindata.ScreenType==1 || this.maindata.ScreenType==2))
{
this.dialogRef.close((res as any).result.value.bobranchmaster);
}
else
{
this.FillData(res);
}
}
this.bobranchmasterForm.markAsUntouched();
this.bobranchmasterForm.markAsPristine();
},
err => {
debugger;
this.toastr.addSingle("error","",err.error);
console.log(err);
}
)
}




//dropdown edit from the screen itself -> One screen like Reportviewer

AddOrEditcountryid( countryid) {
/*let ScreenType='2';
this.dialog.open(bocountryComponent, 
{
data: {countryid:this.bobranchmasterForm.get('countryid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEditstateid( stateid) {
/*let ScreenType='2';
this.dialog.open(bostateComponent, 
{
data: {stateid:this.bobranchmasterForm.get('stateid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEditcityid( cityid) {
/*let ScreenType='2';
this.dialog.open(bocityComponent, 
{
data: {cityid:this.bobranchmasterForm.get('cityid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEditlocationid( locationid) {
/*let ScreenType='2';
this.dialog.open(bolocationComponent, 
{
data: {locationid:this.bobranchmasterForm.get('locationid').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEditcustomersuccessdirector( userid) {
/*let ScreenType='2';
this.dialog.open(bousermasterComponent, 
{
data: {userid:this.bobranchmasterForm.get('customersuccessdirector').value, ScreenType:2 }
} 
).onClose.subscribe(res => {
});*/
}


AddOrEditbobranchholiday(event:any,branchholidayid:any, branchid:any) {
let add=false;
if(event==null)add=true;
this.dialog.open(bobranchholidayComponent, 
{
data:  {  showview:this.showview,save:false,event,branchholidayid, branchid,visiblelist:this.bobranchholidaysvisiblelist,  hidelist:this.bobranchholidayshidelist,ScreenType:2  },
header: 'Branch Holidays'
} 
).onClose.subscribe(res => {
if(res)
{
if(add)
{
this.bobranchholidayssource.add(res);
this.bobranchholidayssource.refresh();
}
else
{
this.bobranchholidayssource.update(event.data, res);
}
}
});
}

onDeletebobranchholiday(event:any,childID: number, i: number) {
if (childID != null)
this.DeletedbobranchholidayIDs += childID + ",";
this.bobranchmasterservice.bobranchholidays.splice(i, 1);
//this.updateGrandTotal();
}

PrevForm() {
let formid=this.sessionService.getItem("key");
let prevform=this.sessionService.getItem("prevform");
this.router.navigate(["/home/"+ prevform + "/"+prevform+"/edit/" + formid]);
}
//start of Grid Codes bobranchholidays
bobranchholidayssettings:any;
bobranchholidayssource: any;

showbobranchholidaysCheckbox()
{
debugger;
if(this.tblbobranchholidayssource.settings['selectMode']== 'multi')this.tblbobranchholidayssource.settings['selectMode']= 'single';
else
this.tblbobranchholidayssource.settings['selectMode']= 'multi';
this.tblbobranchholidayssource.initGrid();
}
deletebobranchholidaysAll()
{
this.tblbobranchholidayssource.settings['selectMode'] = 'single';
}
showbobranchholidaysFilter()
{
  setTimeout(() => {
  this.SetbobranchholidaysTableddConfig();
  });
      if(this.tblbobranchholidayssource.settings!=null)this.tblbobranchholidayssource.settings['hideSubHeader'] =!this.tblbobranchholidayssource.settings['hideSubHeader'];
this.tblbobranchholidayssource.initGrid();
}
showbobranchholidaysInActive()
{
}
enablebobranchholidaysInActive()
{
}
async SetbobranchholidaysTableddConfig()
{
if(!this.bfilterPopulatebobranchholidays){
}
this.bfilterPopulatebobranchholidays=true;
}
async bobranchholidaysbeforesave(event:any){
event.confirm.resolve(event.newData);



}
SetbobranchholidaysTableConfig()
{
this.bobranchholidayssettings = {
hideSubHeader: true,
mode: 'external',
selectMode: 'single',
actions: {
width:'300px',
columnTitle: 'Actions',
add: !this.showview,
edit: true, // true,
delete:!this.showview,
custom: [
// { name: 'viewrecord',type:'html', title: '<i style="width:10px" class="fa fa-eye"></i>'},
// { name: 'editrecord',type:'html', title: '<i style="width:10px" class="nb-edit"></i>' }
]
},
add: {
addButtonContent: '<i class="nb-plus"></i>',
createButtonContent: '<i class="nb-checkmark"></i>',
cancelButtonContent: '<i class="nb-close"></i>',
confirmCreate:true,},
edit: {
editButtonContent: '<i class="nb-edit"></i>',
saveButtonContent: '<i class="nb-checkmark"></i>',
cancelButtonContent: '<i class="nb-close"></i>',
confirmSave:true,},
delete: {
deleteButtonContent: '<i class="nb-trash"></i>',
confirmDelete: true,
},
columns: {
financialyearid: {
title: 'Financial Year',
type: 'number',
filter:true,
valuePrepareFunction: (cell,row) => {
  if(cell=="")
  {
    var sessionuser = JSON.parse(this.sessionService.getItem("currentUser"));
    cell=sessionuser["finyearid"];
  }}, 
},
holidaydate: {
title: 'Holiday Date',
type: 'custom',
renderComponent: SmartTableDatepickerRenderComponent,
editor: {
type: 'custom',
component: SmartTableDatepickerComponent,
},
},
holidayday: {
title: 'Holiday Day',
type: '',
filter:true,
valuePrepareFunction: (cell,row) => {
var d = new Date(row["holidaydate"]);
              cell = +d.getDay() + 1;
              row["holidayday"]=cell;}, 
},
reason: {
title: 'Reason',
type: '',
filter:true,
},
},
};
}
bobranchholidaysLoadTable(){
if(this.ShowTableslist==null || this.ShowTableslist.length==0 || this.ShowTableslist.indexOf(this.bobranchholidaysID)>=0)
{
this.bobranchholidayssource=new LocalDataSource();
this.bobranchholidayssource.load(this.bobranchmasterservice.bobranchholidays as  any as LocalDataSource);
this.bobranchholidayssource.setPaging(1, 20, true);
}
}

//external to inline
/*
bobranchholidaysroute(event:any,action:any) {
switch ( action) {
case 'create':
if (this.bobranchmasterservice.bobranchholidays.length == 0)
{
    this.tblbobranchholidayssource.grid.createFormShown = true;
}
else
{
    let obj = new bobranchholiday();
    this.bobranchmasterservice.bobranchholidays.push(obj);
    this.bobranchholidayssource.refresh();
    if ((this.bobranchmasterservice.bobranchholidays.length / this.bobranchholidayssource.getPaging().perPage).toFixed(0) + 1 != this.bobranchholidayssource.getPaging().page)
    {
        this.bobranchholidayssource.setPage((this.bobranchmasterservice.bobranchholidays.length / this.bobranchholidayssource.getPaging().perPage).toFixed(0) + 1);
    }
    setTimeout(() => {
        this.tblbobranchholidayssource.grid.edit(this.tblbobranchholidayssource.grid.getLastRow());
    });
}
break;
case 'delete':
let index = this.bobranchholidayssource.data.indexOf(event.data);
this.onDeletebobranchholiday(event,event.data.branchholidayid,((this.bobranchholidayssource.getPaging().page-1) *this.bobranchholidayssource.getPaging().perPage)+index);
this.bobranchholidayssource.refresh();
break;
}
}

*/
bobranchholidaysroute(event:any,action:any) {
    var addparam="";
    if(this.currentRoute.snapshot.paramMap.get('tableid')!=null)
    {
      addparam="/show/"+this.currentRoute.snapshot.paramMap.get('tableid');
    }

switch ( action) {
case 'create':
this.AddOrEditbobranchholiday(event,null, this.formid);
break;
case 'view':
break;
case 'edit':
this.AddOrEditbobranchholiday(event,event.data.branchholidayid,this.formid);
break;
case 'delete':
this.onDeletebobranchholiday(event,event.data.branchholidayid,((this.bobranchholidayssource.getPaging().page-1) *this.bobranchholidayssource.getPaging().perPage)+event.index);
this.bobranchholidayssource.refresh();
break;
}
}
bobranchholidaysonDelete(obj) {
let branchholidayid=obj.data.branchholidayid;
if (confirm('Are you sure to delete this record ?')) {
this.bobranchmasterservice.deletebobranchmaster(branchholidayid).then(res=>
this.bobranchholidaysLoadTable()
);
}
}
bobranchholidaysPaging(val)
{
debugger;
this.bobranchholidayssource.setPaging(1, val, true);
}

handlebobranchholidaysGridSelected(event:any) {
this.bobranchholidaysselectedindex=this.bobranchmasterservice.bobranchholidays.findIndex(i => i.branchholidayid === event.data.branchholidayid);
}
IsbobranchholidaysVisible()
{
if(this.ShowTableslist==null || this.ShowTableslist.length==0 || this.ShowTableslist.indexOf(this.bobranchholidaysID)>=0)
{
return "tbl smart-table-container";
}
else
{
return "hide";
}
}
//end of Grid Codes bobranchholidays

}



