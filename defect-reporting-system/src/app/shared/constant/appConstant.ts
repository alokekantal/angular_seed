export class AppConstant {
    public static APPLICATION_TYPE = JSON.parse(localStorage.getItem('loginInfo')) !== null ? JSON.parse(localStorage.getItem('loginInfo'))[1] : null;

    // organization
    public static BREADCRUMB_ORGANIZATION_LIST = [{
        text: 'Organization List',
        path: ''
    }];

    public static BREADCRUMB_ORGANIZATION_CREATION = [{
        text: 'Organization List',
        path: '/core/organization-list'
    }, {
        text: 'Organization Creation',
        path: ''
    }];

    // Department
    public static BREADCRUMB_DEPARTMENT_LIST = [{
        text: 'Department List',
        path: ''
    }];

    public static BREADCRUMB_DEPARTMENT_CREATION = [{
        text: 'Department List',
        path: '/core/department-list'
    }, {
        text: 'Department Creation',
        path: ''
    }];


    // Role
    public static BREADCRUMB_ROLE_LIST = [{
        text: 'Role List',
        path: ''
    }];

    public static BREADCRUMB_ROLE_CREATION = [{
        text: 'Role List',
        path: '/core/role-list'
    }, {
        text: 'Create Role Master',
        path: ''
    }];

    public static BREADCRUMB_ROLE_MAPPING = [{
        text: 'Role List',
        path: '/core/role-list'
    }, {
        text: 'Role-Function Mapping',
        path: ''
    }];


    // Designation
    public static BREADCRUMB_DESIGNATION_LIST = [{
        text: 'Designation List',
        path: ''
    }];

    public static BREADCRUMB_DESIGNATION_CREATION = [{
        text: 'Designation List',
        path: '/core/designation-list'
    }, {
        text: 'Designation Master',
        path: ''
    }];

    // User
    public static BREADCRUMB_USER_LIST = [{
        text: 'User List',
        path: ''
    }];

    public static BREADCRUMB_USER_CREATION = [{
        text: 'User List',
        path: '/core/user-list'
    }, {
        text: 'Create User',
        path: ''
    }];

    // Ship
    public static BREADCRUMB_SHIP_LIST = [{
        text: 'Ship List',
        path: ''
    }];

    public static BREADCRUMB_SHIP_CREATION = [{
        text: 'Ship List',
        path: '/core/ship-list'
    }, {
        text: 'Add New Ship',
        path: ''
    }];

    // Ship allotment
    public static BREADCRUMB_SHIP_ALLOTMENT_LIST = [{
        text: 'Ship Allotment List',
        path: ''
    }];

    public static BREADCRUMB_SHIP_ALLOTMENT = [{
        text: 'Ship Allotment List',
        path: '/core/ship-user-mapping-list'
    }, {
        text: 'Ship Allocation',
        path: ''
    }];

    public static BREADCRUMB_TREE = [{
        text: 'Component Master',
        path: ''
    }];

    public static BREADCRUMB_SHIP_COMPONENT_LIST = [{
        text: 'Ship List',
        path: ''
    }];

    public static BREADCRUMB_MANAGE_SHIP_COMPONENTS= [{
        text: 'Manage Ship Components',
        path: ''
    }];

    public static BREADCRUMB_JOB_LIST = [{
        text: 'Ship List',
        path: '/core/job-ship-list'
    }, {
        text: 'Job List',
        path: ''
    }];

    public static BREADCRUMB_PREVIOUS_JOB_LIST = [{
        text: 'Previous Job List',
        path: ''
    }];

    public static BREADCRUMB_PROJECT_LIST = [{
        text: 'Project List',
        path: ''
    }];

    public static BREADCRUMB_PROJECT_CREATION = [{
        text: 'Project LIst',
        path: '/core/project-list'
    }, {
        text: 'Project Update',
        path: ''
    }];

    public static BREADCRUMB_JOB_CREATION = [{
        text: 'Ship List',
        path: '/core/job-ship-list'
    }, {
        text: 'Job List',
        path: '/core/job-list/'
    }, {
        text: 'Specification Of Repairs ',
        path: ''
    }];

    // Department
    public static BREADCRUMB_JOB_LIBRARY_LIST = [{
        text: 'Job Library',
        path: ''
    }];

    public static BREADCRUMB_JOB_LIBRARY_CREATION = [{
        text: 'Job Library',
        path: '/core/job-library-list'
    }, {
        text: 'Job Creation',
        path: ''
    }];

    public static BREADCRUMB_ORGANIZATION_JOB_LIBRARY_CREATION = [{
        text: 'Job Library',
        path: '/core/organization-joblist-Component'
    }, {
        text: 'Job Creation',
        path: ''
    }];

        
    // Department
    public static BREADCRUMB_DOCKYARD_LIST = [{
        text: 'Dockyard List',
        path: ''
    }];
    //dockyard
    public static BREADCRUMB_DOCKYARD_CREATION = [{
        text: 'Dockyard List',
        path: '/core/dockyard-list'
    }, {
        text: 'Dockyard Creation',
        path: ''
    }];

    // Department
    public static BREADCRUMB_PROFILE = [{
        text: 'Profile',
        path: ''
    }];

    public static BREADCRUMB_SHIP_DASHBOARD = [{
        text: 'Ship Dashboard',
        path: ''
    }];

    
    // Vessel type list
    public static BREADCRUMB_VESSEL_DOC_TYPE_LIST = [{
        text: 'Vessel Doc Type List',
        path: ''
    }];

    public static BREADCRUMB_VESSEL_DOC_TYPE_CREATION = [{
        text: 'Vessel Doc Type List',
        path: '/core/vessel-doc-type-list'
    }, {
        text: 'Vessel Doc Type',
        path: ''
    }];

    
    // Ship
    public static BREADCRUMB_DEFECT_LIST = [{
        text: 'Defect List',
        path: ''
    }];

    public static BREADCRUMB_DEFECT_CREATION = [{
        text: 'Defect List',
        path: '/core/defect-list'
    }, {
        text: 'Defect Detail',
        path: ''
    }];

    public static COMPONENT_OPTIONS = {
                                        href: 'google.com', // item href for <a> , use if you set 'setItemsAsLinks: true' in config.
                                        hidden: false, // hide element without removing from data array.
                                        hideChildrens: true, // hide childrens of element.
                                        draggable: true, // allow block dragging single element if set 'enableDragging: true'
                                        position: 1,  // set position of item for sort tree.
                                        disabled: false, // disaled buttons and add opacity to element.
                                        // buttons
                                        showActionButtons: true, // show/hide  action buttons for element.
                                        showDeleteButton: true, // if 'false' element cannot be deleted.
                                        showExpandButton: true // show/hide expand buttons for element.
                                    };
    public static dateTimeFormat: any = 'yyyy-MM-dd HH:mm';
    public static dateFormat: any = 'yyyy-MM-dd';

    public static editorConfig = {
        toolbarGroups: [
          { name: 'styles', groups: [ 'styles' ] },
          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
          { name: 'colors', groups: [ 'colors' ] },
          { name: 'insert', groups: [ 'insert' ] },
          '/',
          { name: 'tools', groups: [ 'tools' ] },
          { name: 'document', groups: [ 'document', 'doctools', 'mode' ] },
          { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
          { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
          { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
          { name: 'links', groups: [ 'links' ] },
          { name: 'forms', groups: [ 'forms' ] },
          { name: 'others', groups: [ 'others' ] },
          { name: 'about', groups: [ 'about' ] }
      ], 
      removeButtons: 'Image,Source,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,HiddenField,CreateDiv,Blockquote,Language,BidiRtl,BidiLtr,Flash,Smiley,About,ImageButton,ShowBlocks,Cut,Copy,Paste'
      }

      public static searchDropdownConfig  = {
        displayKey:"description", //if objects array passed which key to be displayed defaults to description
        search:true, //true/false for the search functionlity defaults to false,
        height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
        placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
        customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
        moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
        noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
        searchPlaceholder:'Search', // label thats displayed in search input,
        }
}