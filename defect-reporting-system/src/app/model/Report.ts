export class Report {
    public vesselParticulars: boolean = true;
    public shipno: boolean = true;
	public orgId: boolean = true;
	public name: boolean = true;
	public description: boolean = true;
	public vesselname: boolean = true;
	public v_imo_no: boolean = true;
	public mmsi_no: boolean = true;
	public call_sign: boolean = true;
	public official_no: boolean = true;
	public v_type: boolean = true;
	public owner_imo_no: boolean = true;
	public owner_name: boolean = true;
	public sat_f_77: boolean = true;
	public sat_c: boolean = true;
	public fleet_broadband: boolean = true;
	public sat_c_emailID: boolean = true;
	public emailID: boolean = true;
	public shipClass: boolean = true;
	public class_notations: boolean = true;
	public Classi_Id_No: boolean = true;
	public flag: boolean = true;
	public port_of_registry: boolean = true;
	public year_built: boolean = true;
	public keel_laying_date: boolean = true;
	public vessel_delivery_date: boolean = true;
	public hull_type: boolean = true;
	public length_overall: boolean = true;
	public breadth_MLD: boolean = true;
	public depth: boolean = true;
	public summer_draft_M: boolean = true;
	public summer_DWT_MT: boolean = true;
	public international_GRT: boolean = true;
	public international_NRT: boolean = true;
	public life_boat_cap: boolean = true;
	public v_short_name: boolean = true;
	public account_code_old: boolean = true;
	public account_code_new: boolean = true;
	public tel_fac_code: boolean = true;
	public maxEmailSizeInMB: boolean = true;
	public dailyDataLimitInMB: boolean = true;	
	public email1: boolean = true;
	public email2: boolean = true;
	public phoneNo: boolean = true;
	public phoneNo1: boolean = true;
    public phoneNo2: boolean = true;
    
	public projectDetail: boolean = true;
	public preamble: boolean = true;
	public projectAttachments: boolean = true;
	public ddParameter: boolean = true;
    
	public specificationOfRepairs: boolean =  true;
	public jobGeneralInfo = true;
	public jobno: boolean = true;
	public make: boolean = true;
	public model: boolean = true;
	public makeModelDescription: boolean = true;
	public externalReference: boolean = true;
	public component: boolean = true;
	public location: boolean = true;
	public equipment: boolean = true;
	public jobDescription: boolean = true;
	public jobDate: boolean =true;
	public jobSpecificationDetail: boolean = true;
    public jobSpecificationAttachment: boolean = true;
    
    public checkBox: boolean = true;
    public toBeInclude: boolean = true;
	public materials: boolean = true;
	public theWorkToBeSurveyedAlsoBy: boolean = true;
    
    public meterialDetail: boolean = true;
    public meterialDetailMake: boolean = true;
	public meterialDetailModel: boolean = true;
	public meterialDetailPartNo: boolean = true;
	public meterialDetailPartName: boolean = true;
	public meterialDetailQuantity: boolean = true;
	public meterialDetailUOM: boolean = true;
	public meterialDetailDrawingNo: boolean = true;
	public meterialDetailRemark: boolean = true;
    
    public progressReport: boolean = true;
    public progressReportReportingDate: boolean = true;
	public progressReportExecutionDate: boolean = true;
	public progressReportWorkDoneForTheDay: boolean = true;
	public progressReportAttachments: boolean = true;
	public selectedJobNo: string = '';
	public isCollapsed: boolean = true;
	public jobList: any = [];
	public projectAttachmentList: any = [];

	public execPhotosReps: boolean = true;
	public jobComment: boolean = true;

	public isAllJobSelected: boolean = true;


	public shortDescription: string = '';
    
}