export class ltycampaign {
public campaigniddesc :string;public campaignid :number;public name :string;public campaigntype :number;public campaigntypedesc :string;public campaignsubtype :number;public campaignsubtypedesc :string;public campaigncategory :string;public campaigncategorydesc :string;public imageurl :string;public validity :string;public validitydesc :string;public startdate :Date;public enddate :Date;public applicabledays :string;public applicabledaysstring :string;public merchantid :number;public merchantiddesc :string;public storeid :number;public storeiddesc :string;public validdaysfrompublishdate :number;public displaycomingsoon :boolean;public displaycountdown :boolean;public publishdate :Date;public eventname :string;public eventnamedesc :string;public totallimit :number;public limitpercustomer :number;public referrerpoint :number;public usedbycustomers :number;public totalpointsearned :number;public totalproducts :number;public campaignstatus :string;public campaignstatusdesc :string;public rank :number;public rewardtype :string;public rewardtypedesc :string;public rewardmethod :string;public rewardmethoddesc :string;public rewardvalue :number;public coupontypeid :number;public coupontypeiddesc :string;public productid :number;public productiddesc :string;public rewardunit :string;public rewardunitdesc :string;public rewardlevel :number;public rewardleveldesc :string;public rewardprefix :string;public rewardprefixdesc :string;public rewardmultiplier :number;public claimbuttonlabel :string;public redeeminstructions :string;public terms :string;public status :string;public DeletedltycustomerrewardIDs :string;public DeletedltycampaigncriteriaIDs :string;
constructor() {}
}
export interface IltycampaignResponse {
total: number;
results: ltycampaign[];
}

