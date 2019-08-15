export class ProjectJobCostLineitemDetails{
    public id: number = 0;
	public orgid: number = 0;
	public shipid: number = 0;
	public projectid: number = 0;
	public jobid: number = 0;
    public lineitemid: number = 0;
    public quoteCurrencyid: number = null;
    public dockyardId: number = 0;
	public unit: string = '';
	public unitPrice: number = null;
	public unitQuantity: number = null;
	public costQuoteCurrency: number = null;
    public costProjectCurrency: number = null;
    
    // for project cost
    public total: number = 0;
	
	public createid: number = 0;
	public createdate: any = null;
	public updateid: number = 0;
	public updatedate: any = null;
    public isactive: number = 0;
    
    constructor(shipid, projectid, jobid, dockyardId, lineitemid){
        this.shipid = shipid;
        this.projectid = projectid;
        this.jobid = jobid;
        this.dockyardId = dockyardId;
        this.lineitemid = lineitemid;
    }
}