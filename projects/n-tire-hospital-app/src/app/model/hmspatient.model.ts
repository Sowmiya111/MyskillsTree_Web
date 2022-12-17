export class hmspatient {
    public patientid: number; public patientcode: string; public aadhaarno: string; public firstname: string; public middlename: string; public lastname: string; public imageurl: string; public gender: string; public genderdesc: string; public dateofbirth: Date; public referredby: string; public address1: string; public address2: string; public countryid: number; public countryiddesc: string; public stateid: number; public stateiddesc: string; public cityid: number; public cityiddesc: string; public location: string; public pincode: string; public mobile: string; public contactnoh: string; public contactnoo: string; public email: string; public height: number; public weight: number; public bloodgroup: string; public bloodgroupdesc: string; public occupation: string; public occupationdesc: string; public maritialstatus: string; public maritialstatusdesc: string; public allergydetails: string; public notes: string; public contactperson: string; public cpaddress1: string; public cpaddress2: string; public cpcountryid: number; public cpcountryiddesc: string; public cpstateid: number; public cpstateiddesc: string; public cpcityid: number; public cpcityiddesc: string; public cplocation: string; public cppincode: string; public cpmobile: string; public cpcontactnoh: string; public cpcontactnoo: string; public cpemail: string; public customfield: string; public attachment: string; public status: string; public DeletedhmsinsuranceIDs: string; public DeletedhmsoperationIDs: string; public DeletedhmslabresultIDs: string; public DeletedhmspatientdischargeIDs: string; public DeletedhmspatientfollowupIDs: string; public DeletedhmspatientpaymentmasterIDs: string; public DeletedhmsreceiptIDs: string; public DeletedhmstreatmentIDs: string; public DeletedhmspatientvisitIDs: string; public DeletedhmsadmissionIDs: string; public DeletedhmspatientvaccinationIDs: string; public DeletedhmsappointmentIDs: string; public DeletedhmsconsentIDs: string;
    constructor() { }
}
export interface IhmspatientResponse {
    total: number;
    results: hmspatient[];
}

