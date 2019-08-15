export class JobProgressReport {
    public id: number = 0;
    public jobid: number = null;
    public reportingDate: any = new Date();
    public executionDate: any = null;
    public workDone: string = '';
    public relativepath: string = '';
    public jobAttachmentIds: string = '';
    public jobAttachmentList: any = [];
    
    public isOpen: any = false;

    public createid: number = null;
	public createdate: string = '';
	public updateid: number = null;
	public updatedate: string = '';
    public isactive: number = null;
}