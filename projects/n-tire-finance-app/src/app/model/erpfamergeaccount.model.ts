export class erpfamergeaccount {
public mergeiddesc :string;public mergeid :number;public sourceaccount :number;public tomergeaccount :number;public mergedate :Date;public status :string;
constructor() {}
}
export interface IerpfamergeaccountResponse {
total: number;
results: erpfamergeaccount[];
}

