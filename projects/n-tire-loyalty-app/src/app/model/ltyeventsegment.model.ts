export class ltyeventsegment {
public segmentiddesc :string;public segmentid :number;public name :string;public description :string;public type :string;public typedesc :string;public rank :number;public condition :string;public status :string;
constructor() {}
}
export interface IltyeventsegmentResponse {
total: number;
results: ltyeventsegment[];
}

