export class erpcontractordermaster {
public contractiddesc :string;public contractid :number;public branchid :number;public branchiddesc :string;public contractname :string;public contractnumber :string;public versionnumber :number;public contractdate :Date;public contracttype :string;public contracttypedesc :string;public contractstage :string;public departmentid :number;public departmentiddesc :string;public templatetype :string;public templatetypedesc :string;public details :string;public supportdetails :string;public parentid :number;public parentiddesc :string;public deliverables :string;public contractvalue :number;public priority :string;public prioritydesc :string;public contracthealth :string;public contracthealthdesc :string;public assignedto :string;public owner :number;public ownerdesc :string;public sourcefield :string;public sourcereference :number;public sourcereferencedesc :string;public contactid :number;public contactiddesc :string;public effectivedate :Date;public expirationdate :Date;public extensionoptions :string;public extensionoptionsdesc :string;public terminationoption :boolean;public automaticrenewal :boolean;public automaticexpiration :boolean;public renewalreminderdate :Date;public contracttemplateid :number;public terms :string;public totallistprice :number;public discount :number;public total :number;public shippingcharges :number;public shippingtax :number;public shippingtaxamount :number;public tax :number;public finalamount :number;public projectid :number;public projectiddesc :string;public liabilitycap :string;public governinglaw :string;public terminationforconvenience :boolean;public closedsamemonth :boolean;public notes :string;public authorizedby :string;public overdue :boolean;public expirynotification :boolean;public alarm :string;public alarmdesc :string;public signername :string;public signeremail :string;public supplierid :number;public supplieriddesc :string;public customfield :string;public attachment :string;public status :string;public DeletederpcontractordertermIDs :string;public DeletederpcontractorderdetailIDs :string;public DeletederpcontractorderclauseIDs :string;
constructor() {}
}
export interface IerpcontractordermasterResponse {
total: number;
results: erpcontractordermaster[];
}

