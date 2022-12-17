import { hrmsemployeecareerService } from './../../../service/hrmsemployeecareer.service';
import { hrmsemployeecareer } from '../../../../../../n-tire-hrms-app/src/app/model/hrmsemployeecareer.model';
import { ElementRef, Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { ToastService } from '../../../../../../n-tire-bo-app/src/app/pages/core/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { boconfigvalue } from '../../../../../../n-tire-bo-app/src/app/model/boconfigvalue.model';
import { boconfigvalueService } from '../../../../../../n-tire-bo-app/src/app/service/boconfigvalue.service';
import { KeyValuePair, MustMatch, DateCompare, MustEnable, MustDisable, Time } from '../../../../../../n-tire-bo-app/src/app/shared/general.validator';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from '../../../../../../n-tire-bo-app/src/app/custom/smart-table-datepicker.component';
import { LocalDataSource } from 'ng2-smart-table';
import {Ng2SmartTableComponent} from 'ng2-smart-table';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import currencyToSymbolMap from 'currency-symbol-map/map'
import { hrmsemployee } from '../../../../../../n-tire-hrms-app/src/app/model/hrmsemployee.model';
import { hrmsemployeeService } from './../../../service/hrmsemployee.service';
import { bouserrolemaster } from '../../../../../../n-tire-bo-app/src/app/model/bouserrolemaster.model';
import { bouserrolemasterService } from '../../../../../../n-tire-bo-app/src/app/service/bouserrolemaster.service';
import { switchMap, map, debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators, EmailValidator } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicDialog';
import { DynamicDialogConfig } from 'primeng/dynamicDialog';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { DialogService } from 'primeng/dynamicDialog';
import { SharedService } from '../../../../../../n-tire-bo-app/src/app/service/shared.service';
import { AppConstants } from '../../../../../../n-tire-bo-app/src/app/shared/helper';
@Component({
    selector: 'app-hrmsemployeecareer',
    templateUrl: './hrmsemployeecareer.component.html',
    styles: []
})



export class hrmsemployeecareerComponent implements OnInit {
    customfieldservicelist: any;
    CustomFormName: string = "";
    CustomFormField: string = "";
    CustomFormFieldValue: string = "";
    pmenuid: any;
    pcurrenturl: any;
    isSubmitted: boolean = false;
    ShowTableslist: string[] = [];
    data: any;
    currencyToSymbolMap1: any;
    data3: any = [];
    bfilterPopulatehrmsemployeecareers: boolean = false;
    datahrmsemployeecareersemployeeid3: any = [];
    datahrmsemployeecareersmappedtoourrole3: any = [];
    hrmsemployeecareerForm: FormGroup;
    employeeidList: hrmsemployee[];
    employeeid_hrmsemployeesForm: FormGroup;
    employeeid_hrmsemployeesoptions: any;
    employeeid_hrmsemployeesformatter: any;
    mappedtoourroleList: bouserrolemaster[];
    private exportTime = { hour: 7, minute: 15, meriden: 'PM', format: 24 };
    formid: any;
    readonly URL = AppConstants.UploadURL; attachmentlist: any[] = []; fileattachmentlist: any[] = []; @ViewChild('fileattachment', { static: false }) fileattachment: FileUpload; attachmentfieldjson: any[] = [];


    constructor(
        private router: Router,
        public ngbDateParserFormatter: NgbDateParserFormatter,
        public dialogRef: DynamicDialogRef,
        public dynamicconfig: DynamicDialogConfig,
        public dialog: DialogService,
        private hrmsemployeecareerservice: hrmsemployeecareerService,
        private fb: FormBuilder,
        private sharedService: SharedService,
        private toastr: ToastService,
        //private dialog: NbDialogService,
        private configservice: boconfigvalueService,
        private hrmsemployeeservice: hrmsemployeeService,
        private bouserrolemasterservice: bouserrolemasterService,
        private currentRoute: ActivatedRoute) {
        this.data = dynamicconfig;
        this.pmenuid = sharedService.menuid;
        this.pcurrenturl = sharedService.currenturl;
        this.hrmsemployeecareerForm = this.fb.group({
            employeeid: [null],
            employeeiddesc: [null],
            hacid: [null],
            employer: [null],
            fromdate: [null],
            todate: [null],
            totalmonths: [null],
            designation: [null],
            mappedtoourrole: [null],
            mappedtoourroledesc: [null],
            ctccurrency: [null],
            ctcamount: [null],
            remarks: [null],
            attachment: [null],
            status: [null],
            statusdesc: [null],
        });
    }
    get f() { return this.hrmsemployeecareerForm.controls; }

    clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
    ngOnInit() {
        this.currencyToSymbolMap1 = (Object.entries(currencyToSymbolMap));
        //debugger;
        let hrmsemployeecareer = null;

        if (this.data != null && this.data.data != null) this.data = this.data.data;
        if (this.data != null && this.data.hacid != null) {
            hrmsemployeecareer = this.data.hacid;
        }
        else
            hrmsemployeecareer = this.currentRoute.snapshot.paramMap.get('id');
        if (this.currentRoute.snapshot.paramMap.get('tableid') != null) {
            this.ShowTableslist = this.currentRoute.snapshot.paramMap.get('tableid')!.split(',');
        }
        this.formid = hrmsemployeecareer;
        //this.sharedService.alert(hrmsemployeecareer);
        if (hrmsemployeecareer == null) {
            this.resetForm();
        }
        else {
            this.hrmsemployeecareerservice.gethrmsemployeecareersByID(parseInt(hrmsemployeecareer)).then((res:any) => {
                console.log(res);
                //console.log(res.order);
                //console.log(res.orderDetails);
                this.hrmsemployeecareerForm.patchValue({
                    employeeid: res.hrmsemployeecareer.employeeid,
                    employeeiddesc: res.hrmsemployeecareer.employeeiddesc,
                    hacid: res.hrmsemployeecareer.hacid,
                    employer: res.hrmsemployeecareer.employer,
                    fromdate: this.ngbDateParserFormatter.parse(res.hrmsemployeecareer.fromdate),
                    todate: this.ngbDateParserFormatter.parse(res.hrmsemployeecareer.todate),
                    totalmonths: res.hrmsemployeecareer.totalmonths,
                    designation: res.hrmsemployeecareer.designation,
                    mappedtoourrole: res.hrmsemployeecareer.mappedtoourrole,
                    mappedtoourroledesc: res.hrmsemployeecareer.mappedtoourroledesc,
                    ctccurrency: res.hrmsemployeecareer.ctccurrency,
                    ctcamount: res.hrmsemployeecareer.ctcamount,
                    remarks: res.hrmsemployeecareer.remarks,
                    attachment: res.hrmsemployeecareer.attachment,
                    status: res.hrmsemployeecareer.status,
                    statusdesc: res.hrmsemployeecareer.statusdesc,
                });
                if (this.hrmsemployeecareerForm.get('attachment')!.value != null && this.hrmsemployeecareerForm.get('attachment')!.value != "") this.attachmentfieldjson = JSON.parse(this.hrmsemployeecareerForm.get('attachment')!.value);
            });
        }
        this.hrmsemployeeservice.gethrmsemployeesList().then((res:any) => this.employeeidList = res as hrmsemployee[]);
        this.employeeid_hrmsemployeesoptions = (text$: Observable<string>) =>
            text$.pipe(
                debounceTime(200),
                map(value => value.length < 2 ? []
                    : this.employeeidList.filter(v => v.employeename.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10))
            );
        this.employeeid_hrmsemployeesformatter = (result: any) => result.employeename;
        this.bouserrolemasterservice.getbouserrolemastersList().then((res:any) => this.mappedtoourroleList = res as bouserrolemaster[]);
    }
    onSelectedemployeeid(employeeidDetail: any) {
        if (employeeidDetail) {
            this.hrmsemployeecareerForm.patchValue({ employeeid: employeeidDetail.item.employeeid });
            this.hrmsemployeecareerForm.patchValue({ employeeiddesc: employeeidDetail.item.employeename });
            employeeidDetail.preventDefault();

        }
    }




    resetForm() {
        if (this.hrmsemployeecareerForm != null)
            this.hrmsemployeecareerForm.reset();
        if (this.data != null) {
            for (let key in this.data) {

                let json = JSON.parse('{"' + key + '": "' + this.data[key] + '" }');
                if (this.hrmsemployeecareerForm.controls[key] != null) {
                    this.hrmsemployeecareerForm.patchValue(json);
                    this.hrmsemployeecareerForm.controls[key].disable({ onlySelf: true });
                }
            }
        }
    }

    onDelete() {
        let hacid = this.hrmsemployeecareerForm.get('hacid')!.value;
        if (hacid != null) {
            if (confirm('Are you sure to delete this record ?')) {
                this.hrmsemployeecareerservice.deletehrmsemployeecareer(hacid).then((res:any) => {
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
        this.hrmsemployeecareerForm.patchValue({
            hacid: null
        });
        this.hrmsemployeecareerservice.formData.hacid = null;
    }
    onSubmitAndWait() {
        this.onSubmitData(false);
    }
    onSubmit() {
        this.onSubmitData(true);
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
    onSubmitData(bclear:any) {
        //debugger;
        this.isSubmitted = true;
        if (!this.hrmsemployeecareerForm.valid) {
            this.toastr.addSingle("error", "", "Enter the required fields");
            return;
        }
        this.hrmsemployeecareerservice.formData = this.hrmsemployeecareerForm!.value;
        this.hrmsemployeecareerservice.formData.fromdate = new Date(this.ngbDateParserFormatter.format(this.hrmsemployeecareerForm.get('fromdate')!.value) + '  UTC');
        this.hrmsemployeecareerservice.formData.todate = new Date(this.ngbDateParserFormatter.format(this.hrmsemployeecareerForm.get('todate')!.value) + '  UTC');
        this.hrmsemployeecareerservice.formData.attachment = JSON.stringify(this.attachmentfieldjson);
        console.log(this.hrmsemployeecareerservice.formData);
        if (this.hrmsemployeecareerForm.get('hacid')!.value == null || this.hrmsemployeecareerForm.get('hacid')!.value == '' || this.hrmsemployeecareerForm.get('hacid')!.value == 0)
            this.insertRecord(bclear);
        else
            this.updateRecord(bclear);
        this.sharedService.upload(this.fileattachmentlist);
        this.attachmentlist = [];
        this.fileattachment.clear();
        if (this.data != null && (this.data.ScreenType == 1 || this.data.ScreenType == 2)) {
            this.dialogRef.close();
        }
    }



    insertRecord(bclear:any) {
        this.hrmsemployeecareerservice.saveOrUpdatehrmsemployeecareers().subscribe(
            (res:any) => {
                //debugger;
                this.toastr.addSingle("success", "", "Successfully saved");
                if (bclear) {
                    this.hrmsemployeecareerservice.clearList();
                    this.resetForm();
                }
            },
            (err:any) => {
                //debugger;
                this.toastr.addSingle("error", "", err.error);
                console.log(err);
            }
        )
    }
    updateRecord(bclear:any) {
        this.hrmsemployeecareerservice.saveOrUpdatehrmsemployeecareers().subscribe(
            (res:any) => {
                this.toastr.addSingle("success", "", "Successfully saved");
                if (bclear) {
                    this.hrmsemployeecareerservice.clearList();
                    this.resetForm();
                }
            },
            (err:any) => {
                this.toastr.addSingle("error", "", err.error);
                console.log(err);
            }
        )
    }
    AddOrEditemployeeid(employeeid) {
        let ScreenType = '2';
        /*this.dialog.open(hrmsemployeeComponent, 
        {
        data: { ScreenType }
        } 
        ).onClose.subscribe((res:any) => {
        this.hrmsemployeeservice.gethrmsemployeesList().then((res:any) => this.employeeidList = res as hrmsemployee[]);
        });*/
    }

    AddOrEditmappedtoourrole(userroleid) {
        let ScreenType = '2';
        /*this.dialog.open(bouserrolemasterComponent, 
        {
        data: { ScreenType }
        } 
        ).onClose.subscribe((res:any) => {
        this.bouserrolemasterservice.getbouserrolemastersList().then((res:any) => this.mappedtoourroleList = res as bouserrolemaster[]);
        });*/
    }


}



