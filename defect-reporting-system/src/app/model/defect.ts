
export class Defect{
    public id: number = null;
    public shipName: string = '';
    public defId: string = '';
    public component: string = '';
    public raisedOn: any = null;
    public severity: string = '';
    public defectDetail: string = '';
    public raisedBy: number = null;
    public CorrectiveAction: any = null;
    public CorrectiveActionList: any = [];

    public system: string = '';
    public repairCriteria: string = '';
    public status: string = '';
    public targetDate: any = null;
    public commentList: any = [];
    public comment: any = null;

    public createid: number = null;
	public createdate: string = '';
	public updateid: number = null;
	public updatedate: string = '';
	public isactive: number = null;
}