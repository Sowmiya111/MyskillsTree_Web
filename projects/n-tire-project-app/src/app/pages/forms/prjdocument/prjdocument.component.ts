import { prjdocumentService } from './../../../service/prjdocument.service';
import { prjdocument } from './../../../model/prjdocument.model';
import { ElementRef, Component, OnInit, Inject, Optional, ViewChild, EventEmitter } from '@angular/core';
import { ToastService } from '../../../../../../n-tire-bo-app/src/app/pages/core/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
//Dropdown - nvarchar(5) - Backoffice -> Fixed Values menu
import { boconfigvalue } from '../../../../../../n-tire-bo-app/src/app/model/boconfigvalue.model';
import { boconfigvalueService } from '../../../../../../n-tire-bo-app/src/app/service/boconfigvalue.service';

//Custom error functions
import { KeyValuePair, MustMatch, DateCompare, MustEnable, MustDisable, Time } from '../../../../../../n-tire-bo-app/src/app/shared/general.validator';

//child table
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from '../../../../../../n-tire-bo-app/src/app/custom/smart-table-datepicker.component';
import { SmartTablepopupselectComponent, SmartTablepopupselectRenderComponent } from '../../../../../../n-tire-bo-app/src/app/custom/smart-table-popupselect.component';

//Custom control
import { durationComponent } from '../../../../../../n-tire-bo-app/src/app/custom/duration.component';
import { LocalDataSource } from 'ng2-smart-table';
import {Ng2SmartTableComponent} from 'ng2-smart-table';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ShortcutInput, ShortcutEventOutput } from "ng-keyboard-shortcuts";
//Shortcuts
import { KeyboardShortcutsService } from "ng-keyboard-shortcuts";
//translator
import { TranslateService } from "@ngx-translate/core";
//FK field services
import { prjprojectmaster } from './../../../model/prjprojectmaster.model';
import { prjprojectmasterService } from './../../../service/prjprojectmaster.service';
//import { prjprojectmasterComponent } from '../prjprojectmaster/prjprojectmaster.component';
//popups
//detail table services
import { switchMap, map, debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, EmailValidator, ValidationErrors } from '@angular/forms';
//primeng services
import { DynamicDialogRef } from 'primeng/dynamicDialog';
import { DynamicDialogConfig } from 'primeng/dynamicDialog';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { DialogService } from 'primeng/dynamicDialog';
//session,application constants
import { SharedService } from '../../../../../../n-tire-bo-app/src/app/service/shared.service';
import { SessionService } from '../../../../../../n-tire-bo-app/src/app/pages/core/services/session.service';
//custom fields & attachments
import { AppConstants } from '../../../../../../n-tire-bo-app/src/app/shared/helper';
import { Subject } from 'rxjs/Subject';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { createWorker, RecognizeResult } from 'tesseract.js';
import { AttachmentComponent } from '../../../../../../n-tire-bo-app/src/app/custom/attachment/attachment.component';
import { customfieldconfigurationService } from '../../../../../../n-tire-bo-app/src/app/service/customfieldconfiguration.service';
import { customfieldconfiguration } from '../../../../../../n-tire-bo-app/src/app/model/customfieldconfiguration.model';
import { DynamicFormBuilderComponent } from '../../../../../../n-tire-bo-app/src/app/custom/dynamic-form-builder/dynamic-form-builder.component';

@Component({
  selector: 'app-prjdocument',
  templateUrl: './prjdocument.component.html',
  styles: [],
  providers: [KeyboardShortcutsService]
})



export class prjdocumentComponent implements OnInit {
  viewhtml: any = '';//stores html view of the screen
  showview: boolean = false;//view or edit mode
  theme: string = "";//current theme
  formdata: any;//current form data
  shortcuts: ShortcutInput[] = [];//keyboard keys
  showsubmit: boolean = true;//button to show
  showGoWorkFlow: boolean = false;
  pkList: any;//stores values - used in search, prev, next
  pkoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete of pk
  pk_tblForm: FormGroup;//pk - autocomplete
  pk_tbloptions: any;//pk - autocomplete
  pk_tblformatter: any;//pk - autocomplete
  toolbarvisible: boolean = true;
  customfieldservicelist: any;
  @ViewChild('customform', { static: false }) customform: DynamicFormBuilderComponent;
  CustomFormName: string = "";
  CustomFormField: string = "";
  CustomFormFieldValue: string = "";
  pmenuid: any;
  pcurrenturl: any;
  isSubmitted: boolean = false;
  ShowTableslist: string[] = [];
  data: any;
  data3: any = [];
  bfilterPopulateprjdocuments: boolean = false;
  dataprjdocumentsprojectid3: any = [];
  dataprjdocumentscategory3: any = [];
  prjdocumentForm: FormGroup;
  projectidList: prjprojectmaster[];//dropdown
  projectidoptionsEvent: EventEmitter<any> = new EventEmitter<any>();//autocomplete
  projectid_prjprojectmastersForm: FormGroup;//autocomplete
  projectid_prjprojectmastersoptions: any;//autocomplete
  projectid_prjprojectmastersformatter: any;//autocomplete
  categoryList: boconfigvalue[]=[];//dropdown
  private exportTime = { hour: 7, minute: 15, meriden: 'PM', format: 24 };
  showformtype: any;
  formid: any;
  pkcol: any;
  customfieldjson: any;
  customfieldvisible: boolean = true;
  readonly AttachmentURL = AppConstants.AttachmentURL;
  readonly URL = AppConstants.UploadURL; attachmentlist: any[] = []; fileattachmentlist: any[] = [];
  @ViewChild('fileattachment', { static: false }) fileattachment: AttachmentComponent;
  attachmentfieldjson: any[] = [];
  attachmentvisible: boolean = true;
  SESSIONUSERID: any;//current user
  sessiondata: any;






  constructor(
    private translate: TranslateService,
    private keyboard: KeyboardShortcutsService, private router: Router,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    public dialogRef: DynamicDialogRef,
    public dynamicconfig: DynamicDialogConfig,
    public dialog: DialogService,
    private prjdocumentservice: prjdocumentService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    public sessionService: SessionService,
    private toastr: ToastService,
    //private dialog: NbDialogService,
    private configservice: boconfigvalueService,
    private prjprojectmasterservice: prjprojectmasterService,
    private customfieldservice: customfieldconfigurationService,
    private currentRoute: ActivatedRoute) {
    this.translate = this.sharedService.translate;
    this.data = dynamicconfig;
    this.pmenuid = sharedService.menuid;
    this.pcurrenturl = sharedService.currenturl;
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
    this.prjdocumentForm = this.fb.group({
      pk: [null], ImageName: [null],
      documentid: [null],
      projectid: [null],
      projectiddesc: [null],
      documentname: [null],
      description: [null],
      category: [null],
      categorydesc: [null],
      preparedby: [null],
      docaccess: [null],
      url: [null],
      customfield: [null],
      attachment: [null],
      status: [null],
      statusdesc: [null],
    });
  }

  get f() { return this.prjdocumentForm.controls; }


  //when child screens are clicked - it will be made invisible
  ToolBar(prop:any) {
    this.toolbarvisible = prop;
  }

  //function called when we navigate to other page.defined in routing
  canDeactivate(): Observable<boolean> | boolean {
    debugger;
    if (this.prjdocumentForm.dirty && this.prjdocumentForm.touched) {
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
  first() {
    if (this.pkList.length > 0) this.PopulateScreen(this.pkList[0].pkcol);
  }

  last() {
    if (this.pkList.length > 0) this.PopulateScreen(this.pkList[this.pkList.length - 1].pkcol);
  }

  prev() {
    debugger;
    let pos = this.pkList.map(function (e:any) { return e.documentid.toString(); }).indexOf(this.formid.toString());
    if (pos > 0) this.PopulateScreen(this.pkList[pos - 1].pkcol);
  }

  next() {
    debugger;
    let pos = this.pkList.map(function (e:any) { return e.documentid.toString(); }).indexOf(this.formid.toString());
    if (pos >= 0 && pos != this.pkList.length) this.PopulateScreen(this.pkList[pos + 1].pkcol);
  }

  //on searching in pk autocomplete
  onSelectedpk(pkDetail: any) {
    if (pkDetail.documentid && pkDetail) {
      this.PopulateScreen(pkDetail.pkcol);
    }
  }

  // initialize
  async ngOnInit() {
    //session & theme
    this.sessiondata = this.sessionService.getSession();
    if (this.sessiondata != null) {
      this.SESSIONUSERID = this.sessiondata.userid;
    }

    this.theme = this.sessionService.getItem('selected-theme');

    debugger;
    let prjdocumentid = null;

    //getting data - from list page, from other screen through dialog
    if (this.data != null && this.data.data != null) this.data = this.data.data;
    if (this.data != null && this.data.showview != undefined && this.data.showview != null) this.showview = this.data.showview;
    if (this.data != null && this.data.event != null && this.data.event.data != null) this.data = this.data.event.data;
    //if view button(eye) is clicked
    if (this.currentRoute.snapshot.paramMap.get('viewid') != null) {
      this.pkcol = this.currentRoute.snapshot.paramMap.get('viewid');
      this.showview = true;
      this.viewhtml = this.sessionService.getViewHtml();
    }
    else if (this.data != null && this.data.pkcol != null) {
      this.pkcol = this.data.pkcol;
    }
    else {
      this.pkcol = this.currentRoute.snapshot.paramMap.get('id');
      this.showformtype = this.currentRoute.snapshot.paramMap.get('showformtype');
    }
    //copy the data from previous dialog 
    this.PopulateFromMainScreen(this.data, false);
    this.PopulateFromMainScreen(this.dynamicconfig.data, true);
    if (this.currentRoute.snapshot.paramMap.get('tableid') != null) {
      this.ShowTableslist = this.currentRoute.snapshot.paramMap.get('tableid')!.split(',');
    }
    this.formid = prjdocumentid;
    //this.sharedService.alert(prjdocumentid);

    //if pk is empty - go to resetting form.fill default values.otherwise, fetch records
    if (this.pkcol == null) {
      this.FillCustomField();
      this.resetForm();
    }
    else {
      await this.PopulateScreen(this.pkcol);
      //get the record from api
      //foreign keys 
    }
    this.prjprojectmasterservice.getprjprojectmastersList().then((res:any) => {
      this.projectidList = res as prjprojectmaster[];
      if (this.formdata && this.formdata.prjdocument && this.formdata.prjdocument.projectid) {
        this.projectidoptionsEvent.emit(this.projectidList);
        this.prjdocumentForm.patchValue({
          projectid: this.formdata.prjdocument.projectid,
          projectiddesc: this.formdata.prjdocument.projectiddesc,
        });
      }
    }
    );
    this.projectid_prjprojectmastersoptions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map(value => value.length < 2 ? []
          : this.projectidList.filter(v => v.projectname.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
      );
    this.projectid_prjprojectmastersformatter = (result: any) => result.projectname;
    this.configservice.getList("doccategory").then((res:any) => this.categoryList = res as boconfigvalue[]);

    //autocomplete
    this.prjdocumentservice.getprjdocumentsList().then((res:any) => {
      this.pkList = res as prjdocument[];
      this.pkoptionsEvent.emit(this.pkList);
    }
    );
    this.pk_tbloptions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map(value => value.length < 2 ? []
          : this.pkList.filter(v => v.pkcol.toString().toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
      );
    this.pk_tblformatter = (result: any) => result.pkcol;

    //setting the flag that the screen is not touched 
    this.prjdocumentForm.markAsUntouched();
    this.prjdocumentForm.markAsPristine();
  }
  onSelectedprojectid(projectidDetail: any) {
    if (projectidDetail.projectid && projectidDetail) {
      this.prjdocumentForm.patchValue({
        projectid: projectidDetail.projectid,
        projectiddesc: projectidDetail.projectname,

      });

    }
  }




  resetForm() {
    if (this.prjdocumentForm != null)
      this.prjdocumentForm.reset();
    this.prjdocumentForm.patchValue({
    });
    this.customfieldservice.reset(document);
    this.PopulateFromMainScreen(this.data, false);
    this.PopulateFromMainScreen(this.dynamicconfig.data, true);
  }

  onDelete() {
    let documentid = this.prjdocumentForm.get('documentid')!.value;
    if (documentid != null) {
      if (confirm('Are you sure to delete this record ?')) {
        this.prjdocumentservice.deleteprjdocument(documentid).then((res:any) => {
          this.resetForm();
        }
        );
      }
    }
    else {
      this.toastr.addSingle("error", "", "select a record");
    }
  }
  onCopy() {
    this.prjdocumentForm.patchValue({
      documentid: null
    });
    if (this.prjdocumentservice.formData.documentid != null) this.prjdocumentservice.formData.documentid = null;
  }
  PopulateFromMainScreen(mainscreendata:any, bdisable:any) {
    if (mainscreendata != null) {
      for (let key in mainscreendata) {
        if (key != 'visiblelist' && key != 'hidelist' && key != 'event') {

          let jsonstring = "";
          let json = null;
          let ctrltype = typeof (mainscreendata[key]);
          if (false)
            json = "";
          else if (key == "preparedby")
            json = '{"' + key + '": ' + mainscreendata[key] + ' }';
          else if (key == "docaccess")
            json = '{"' + key + '": ' + mainscreendata[key] + ' }';
          else if (ctrltype == "string") {
            jsonstring = '{"' + key + '": "' + mainscreendata[key] + '" }';
            json = JSON.parse(jsonstring);
          }
          else {
            jsonstring = '{"' + key + '": ' + mainscreendata[key] + ' }';
            json = JSON.parse(jsonstring);
          }
          {
            if (this.prjdocumentForm.controls[key] != null) {
              this.prjdocumentForm.patchValue(json);
              if (bdisable) this.prjdocumentForm.controls[key].disable({ onlySelf: true });
            }
          }
        }
      }
    }
  }
  async FillCustomField() {
    return this.customfieldservice.getcustomfieldconfigurationsByTable("prjdocuments", this.CustomFormName, "", "", this.customfieldjson).then((res:any) => {
      this.customfieldservicelist = res;
      return res;
    });


  }
  onClose() {
    this.dialogRef.close();
  }

  onSubmitAndWait() {
    if (this.data.save == true) {
      this.onSubmitData(false);
    }
    else if (this.data != null && (this.data.ScreenType == 1 || this.data.ScreenType == 2)) {
      this.onSubmitDataDlg(false);
    }
    else {
      this.onSubmitData(false);
    }
  }
  onSubmit() {
    if (this.data != null && (this.data.ScreenType == 1 || this.data.ScreenType == 2)) {
      this.onSubmitDataDlg(true);
    }
    else {
      this.onSubmitData(true);
    }
  }
  projectidonChange(evt:any) {
    let e = evt!.value;
  }
  categoryonChange(evt:any) {
    let e = evt!.value;
    this.prjdocumentForm.patchValue({ categorydesc: evt.options[evt.options.selectedIndex].text });
  }
  attachmentuploader(e:any) {
    for (let i = 0; i < e.files.length; i++) {
      this.fileattachmentlist.push(e.files[i]);
      let max = 0;
      let attachmentobj = null;
      if (this.attachmentfieldjson == null) this.attachmentfieldjson = [];
      max = Array.of(this.attachmentfieldjson).length; attachmentobj = new KeyValuePair((this.attachmentfieldjson.length + 1 + max).toString(), e.files[i].name);
      this.attachmentfieldjson.push(attachmentobj);
      max = 0;
      if (this.attachmentlist != null) max = Array.of(this.attachmentlist).length; attachmentobj = new KeyValuePair((this.attachmentlist.length + 1 + max).toString(), e.files[i].name);
      this.attachmentlist.push(attachmentobj);
    }
  }



  async PopulateScreen(pkcol: any) {
    this.prjdocumentservice.getprjdocumentsByEID(pkcol).then((res:any) => {

      this.formdata = res;
      let formproperty = res.formproperty;
      if (formproperty && formproperty.edit == false) this.showview = true;
      this.pkcol = res.pkcol;
      this.formid = res.prjdocument.documentid;
      this.FillData(res);
    });
  }

  FillData(res: any) {
    this.formid = res.prjdocument.documentid;
    console.log(res);
    //console.log(res.order);
    //console.log(res.orderDetails);
    this.prjdocumentForm.patchValue({
      documentid: res.prjdocument.documentid,
      projectid: res.prjdocument.projectid,
      projectiddesc: res.prjdocument.projectiddesc,
      documentname: res.prjdocument.documentname,
      description: res.prjdocument.description,
      category: res.prjdocument.category,
      categorydesc: res.prjdocument.categorydesc,
      preparedby: JSON.parse(res.prjdocument.preparedby),
      docaccess: JSON.parse(res.prjdocument.docaccess),
      url: res.prjdocument.url,
      customfield: res.prjdocument.customfield,
      attachment: res.prjdocument.attachment,
      status: res.prjdocument.status,
      statusdesc: res.prjdocument.statusdesc,
    });
    if (this.prjdocumentForm.get('customfield')!.value != null && this.prjdocumentForm.get('customfield')!.value != "") this.customfieldjson = JSON.parse(this.prjdocumentForm.get('customfield')!.value);
    this.FillCustomField();
    if (this.prjdocumentForm.get('attachment')!.value != null && this.prjdocumentForm.get('attachment')!.value != "" && this.fileattachment != null && this.fileattachment != undefined) this.fileattachment.setattachmentlist(JSON.parse(this.prjdocumentForm.get('attachment')!.value));
    //Child Tables if any
  }

  validate() {
    let ret = true;
    return ret;
  }

  getHtml(html:any) {
    let ret = "";
    ret = html;
    for (let key in this.prjdocumentForm.controls) {
      if (this.prjdocumentForm.controls[key] != null) {
        ret = ret.replace(new RegExp('##' + key + '##', 'g'), this.prjdocumentForm.controls[key]!.value);
      }
    }
    return ret;
  }

  async onSubmitDataDlg(bclear:any) {
    this.isSubmitted = true;
    if (!this.prjdocumentForm.valid || (this.customform != undefined && this.customform.form != undefined && !this.customform.form.valid)) {
      this.toastr.addSingle("error", "", "Enter the required fields");
      return;
    }
    var customfields = this.customfieldservice.getCustomValues(document);
    var obj = this.prjdocumentForm!.value;
    obj.preparedby = JSON.stringify(this.prjdocumentForm.get('preparedby')!.value);
    obj.docaccess = JSON.stringify(this.prjdocumentForm.get('docaccess')!.value);
    obj.customfield = JSON.stringify(customfields);
    obj.attachment = JSON.stringify(this.fileattachment.getattachmentlist());
    obj.fileattachmentlist = this.fileattachment.getAllFiles();
    console.log(obj);
    await this.sharedService.upload(this.fileattachmentlist);
    this.attachmentlist = [];
    if (this.fileattachment) this.fileattachment.clear();
    this.dialogRef.close(obj);
  }

  //This has to come from bomenuactions & procedures
  afteraction(mode: any) {
    let formname = "";
    let query = "";
    if (mode == "new")
      this.router.navigate(['/home/' + formname + '/' + formname + query]);
    else if (mode == "refresh")
      this.router.navigate(['/home/' + formname + '/' + formname + '/edit/' + this.formid + query]);
  }

  async onSubmitData(bclear:any) {
    debugger;
    this.isSubmitted = true;
    let strError = "";
    Object.keys(this.prjdocumentForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.prjdocumentForm.get(key)!.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          strError += 'control: ' + key + ', Error: ' + keyError + '<BR>';
        });
      }
    });
    if (strError != "") return this.sharedService.alert(strError);


    if (!this.prjdocumentForm.valid || (this.customform != undefined && this.customform.form != undefined && !this.customform.form.valid)) {
      this.toastr.addSingle("error", "", "Enter the required fields");
      return;
    }
    if (!this.validate()) {
      return;
    }
    this.prjdocumentservice.formData = this.prjdocumentForm!.value;
    if (this.dynamicconfig.data != null) {
      for (let key in this.dynamicconfig.data) {
        if (key != 'visiblelist' && key != 'hidelist') {
          if (this.prjdocumentForm.controls[key] != null) {
            this.prjdocumentservice.formData[key] = this.prjdocumentForm.controls[key]!.value;
          }
        }
      }
    }
    var customfields = this.customfieldservice.getCustomValues(document);
    this.prjdocumentservice.formData.preparedby = JSON.stringify(this.prjdocumentForm.get('preparedby')!.value);
    this.prjdocumentservice.formData.docaccess = JSON.stringify(this.prjdocumentForm.get('docaccess')!.value);
    this.prjdocumentservice.formData.customfield = JSON.stringify(customfields);
    this.prjdocumentservice.formData.attachment = JSON.stringify(this.fileattachment.getattachmentlist());
    this.fileattachmentlist = this.fileattachment.getAllFiles();
    console.log(this.prjdocumentservice.formData);
    this.prjdocumentservice.saveOrUpdateprjdocuments().subscribe(
      async (res:any) => {
        await this.sharedService.upload(this.fileattachmentlist);
        this.attachmentlist = [];
        if (this.fileattachment) this.fileattachment.clear();
        debugger;
        this.toastr.addSingle("success", "", "Successfully saved");
        document.getElementById("contentArea1").scrollTop = 0;
        if (this.dynamicconfig.data != undefined && this.dynamicconfig.data.save) {
          this.dialogRef.close((res as any).result!.value.prjdocument);
          return;
        }
        else {
          document.getElementById("contentArea1").scrollTop = 0;
        }
        this.prjdocumentservice.clearList();
        if (bclear) {
          this.resetForm();
        }
        else {
          if (this.data != null && (this.data.ScreenType == 1 || this.data.ScreenType == 2)) {
            this.dialogRef.close((res as any).result!.value.prjdocument);
          }
          else {
            this.FillData((res as any).result!.value);
          }
        }
        this.prjdocumentForm.markAsUntouched();
        this.prjdocumentForm.markAsPristine();
      },
      (err:any) => {
        debugger;
        this.toastr.addSingle("error", "", err.error);
        console.log(err);
      }
    )
  }




  //dropdown edit from the screen itself -> One screen like Reportviewer

  AddOrEditprojectid(projectid) {
    /*let ScreenType='2';
    this.dialog.open(prjprojectmasterComponent, 
    {
    data: {projectid:this.prjdocumentForm.get('projectid')!.value, ScreenType:2 }
    } 
    ).onClose.subscribe((res:any) => {
    });*/
  }


  PrevForm() {
    let formid = this.sessionService.getItem("key");
    let prevform = this.sessionService.getItem("prevform");
    this.router.navigate(["/home/" + prevform + "/" + prevform + "/edit/" + formid]);
  }

}



