export class Project {
    public id: number = 0;
    public description: string = '';
    public orgid: number = 0;
    public shipid: number = 0;
    public status: string = '';
    public startdate: any = null;
    public enddate: any = null;
    public dockyard: string = '';

	public createid: number = null;
	public createdate: string = '';
	public updateid: number = null;
	public updatedate: string = '';
    public isactive: number = null;

    // new
    public preamble:string = '';
    public estimatedStart: any = null;
    public estimatedfinish: any = null;
    public actualStart: any = null;
    public actualfinish: any = null;
    public currencyMasterId: string = '';
    public closerComment: string = '';

    public projectAttachmentList: any = [];
    public projectDockyardList:any = [];
    public projectCurrencyConversionList:any = [];
    public projectJobList:any = [];

    public lineitemList:any = [];



}