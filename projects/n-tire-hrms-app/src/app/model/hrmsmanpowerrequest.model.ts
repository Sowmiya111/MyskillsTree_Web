export class hrmsmanpowerrequest {
public mpriddesc :string;public mprid :number;public mprreference :string;public mprdate :Date;public branch :number;public branchdesc :string;public department :number;public departmentdesc :string;public jobrole :number;public jobroledesc :string;public title :string;public jobdescription :string;public vacancycount :number;public requestedby :number;public requestedbydesc :string;public hiringreason :string;public hiringreasondesc :string;public vacancyreason :string;public vacancyreasondesc :string;public positionlastheldby :number;public positionlastheldbydesc :string;public jobtype :number;public jobtypedesc :string;public priority :string;public prioritydesc :string;public probationperiod :number;public pensionable :boolean;public pfapplicable :boolean;public requiredfrom :Date;public requiredbefore :Date;public budgetedstatus :string;public budgetedstatusdesc :string;public minimumexperience :number;public ctccurrency :string;public ctccurrencydesc :string;public ctcamount :number;public minimumeducation :string;public minimumeducationdesc :string;public lastposition :string;public lastpositiondesc :string;public lastdrawnsalarycurrency :string;public lastdrawnsalarycurrencydesc :string;public lastdrawnsalary :number;public skillrequired1 :number;public skillrequired1desc :string;public skillrequired2 :number;public skillrequired2desc :string;public gender :string;public genderdesc :string;public designationid :number;public designationiddesc :string;public gradeid :string;public gradeiddesc :string;public classid :string;public classiddesc :string;public permanentvacancies :number;public temporaryvacancies :number;public reservationapplicable :boolean;public reservationposition :string;public reservationpositiondesc :string;public agelimit :number;public applicableruledetails :string;public boardreferenceno :string;public boardreferencedate :Date;public notes :string;public remarks :string;public currentstatus :string;public currentstatusdesc :string;public customfield :string;public attachment :string;public status :string;public DeletedhrmsmprassignIDs :string;public DeletedhrmsmprapplicantIDs :string;public DeletedhrmsinterviewscheduleIDs :string;public DeletedhrmsmpragencyIDs :string;
constructor() {}
}
export interface IhrmsmanpowerrequestResponse {
total: number;
results: hrmsmanpowerrequest[];
}

