export class boreport {
public reportiddesc :string;public reportid :number;public reportcode :string;public reportcodedesc :string;public reportname :string;public reportmodule :string;public reportmoduledesc :string;public reporttype :string;public reporttypedesc :string;public columns :string;public sidefilter :boolean;public sidefilters :string;public maintablename :string;public maintablealias :string;public maintableidentityfield :string;public pk :string;public query :string;public wherecondition :string;public cardtype :boolean;public html :string;public calendar :boolean;public kanbanview :boolean;public kanbankey :string;public datefilter :boolean;public datefiltercolumnname :string;public datefiltertype :string;public datefiltertypedesc :string;public groupby :string;public groupbytext :string;public groupby2 :string;public groupby2text :string;public groupbyrelationship :string;public groupbyrelationshipdesc :string;public sortby1 :string;public sortby2 :string;public sortby3 :string;public parentid :string;public parentdescription :string;public detailtablename :string;public detailtablealias :string;public jointype :string;public jointypedesc :string;public detailtableidentityfield :string;public detailtablefk :string;public detailtableconcatenate :boolean;public detailtableheader :string;public detailtablefooter :string;public detailtablequery :string;public masterdetailwhere :string;public numrows :number;public reportoutputtype :string;public reportoutputtypedesc :string;public noheader :boolean;public header :string;public footer :string;public headerquery :string;public footerquery :string;public headerquery1 :string;public footerquery1 :string;public headerquery2 :string;public footerquery2 :string;public headerquery3 :string;public footerquery3 :string;public headerquery4 :string;public footerquery4 :string;public headerquery5 :string;public footerquery5 :string;public header1 :string;public footer1 :string;public header2 :string;public footer2 :string;public header3 :string;public footer3 :string;public header4 :string;public footer4 :string;public header5 :string;public footer5 :string;public status :string;public css :string;public viewhtmltype :string;public viewhtmltypedesc :string;public viewhtml :string;public viewcss :string;public reporthtml :string;public workflowhtmltype :string;public workflowhtmltypedesc :string;public workflowhtml :string;public component :string;public alternateview :string;public recordtype :string;public recordtypedesc :string;public userfield :string;public employeefield :string;public userfiltertype :string;public rolefield :string;public dashboardid :number;public dashboardiddesc :string;public tableheader :string;public reportjsondata :string;public helptext :string;public filters :string;public filtercolumns :string;public DeletedboreportdetailIDs :string;public DeletedboreportothertableIDs :string;public DeletedboreportcolumnIDs :string;
constructor() {}
}
export interface IboreportResponse {
total: number;
results: boreport[];
}

