export class Job {
    public id: number = 0;
    public orgid: number = 0;
    public shipid: number = null;
    public projectid: number = null;
    public description: string = '';
    public shipcomponentid: number = null;
    public status: string = '';
    public equipment: string ='';

    public createid: number = null;
	public createdate: any = '';
	public updateid: number = null;
	public updatedate: string = '';
    public isactive: number = null;

    public jobdate: any = null;
    public jobno: string = '';
    public accountno: string = '';
    public specification: string ='';
    public location: string ='';
    public detailedSpecification: string ='';
    public totalArea: string ='';
    public checkboxes: string ='';
    public estimatedBudget: number = null;
    public currency: string = '';
    public jobAttachmentList: any = [];
    public jobComment: any = null;    
    public jobCommentList: any = [];
    public jobMaterialDetailsList: any = [];
    public jobProgressReportList: any = [];
    public jobProgressReport: any = null;
   
    public make : string = '';
    public model : string = '';
    public makeModelDescription : string = '';
    public externalReference: string = '';

    public previousJobId: number = null;
    public nextJobId: number = null;

    public vesselType: any = [];
    public vesselAge: string = null;
}