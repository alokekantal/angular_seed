export class ProjectJobCostLineitem {
    public id: number = 0;
	public orgid: number = 0;
	public shipid: number = 0;
	public projectid: number = 0;
	public jobid: number = 0;
    public lineitem: string = '';
	
	public createid: number = 0;
	public createdate: any = null;
	public updateid: number = 0;
	public updatedate: any = null;
	public isactive: number = 0;
	
    public detailsList: any = [];
    
    constructor(shipid, projectid, jobid){
        this.shipid = shipid;
        this.projectid = projectid;
        this.jobid = jobid;
    }
}