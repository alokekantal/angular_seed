export class MeterialDetail {
    public id: number = 0;
    public jobid: number = 0;
    public make: string = '';
    public model: string = ''; 
    public partNo: string = ''; 
    public partName: string = '';
    public quantity: string = '';    
    public remark: string = '';
    public uom: string = ''; 
    public drawingNo: string = ''; 
    
	public createid: number;
	public createdate: string;
	public updateid: number;
	public updatedate: string;
	public isactive: number = 1;    
}