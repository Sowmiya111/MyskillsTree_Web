export class crmindexmaster {
    public indexiddesc: string; public indexid: number; public indexname: string; public valuenode: string; public valuenodedesc: string; public parentindex: number; public value: string; public mandatory: boolean; public status: string; public Deleted_crmindexdetail_IDs: string;
    constructor() { }
}
export interface IcrmindexmasterResponse {
    total: number;
    results: crmindexmaster[];
}

