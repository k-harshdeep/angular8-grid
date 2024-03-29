import { Component, OnInit, Input, Output, Directive, ViewChild, EventEmitter, AfterViewInit } from "@angular/core";
import { ItemsService } from "./items.service";
import { FieldService } from "../../fields/field.service";
import { AgGridComponent } from '../ag-grid/ag-grid.component';
import { ShowHideCheckboxComponent } from '../show-hide-checkbox/show-hide-checkbox.component';
import { EventEmitterService } from '../../event-emitter.service';
@Component({
  selector: "app-items-list",
  templateUrl: "./items-list.component.html",
  styleUrls: ["./items-list.component.scss"]
})
export class ItemsListComponent implements OnInit {
  @ViewChild('agGridComponent', { static: true }) agGridComponent: AgGridComponent;
  @ViewChild('showHideCheckboxComponent', { static: true }) showHideCheckboxComponent: ShowHideCheckboxComponent;  
  private rowData;
  itemCulomns = [];  itemFields;  items; 
  columnLoaded = false;  fieldName = [];  fieldType = [];  showAllCheckBox = false;  selectedRows = 0;  gridRows;  //gridApi;
  SelectedRowData = [];  noOfSelectedRows=0; 
  SelectedSingleRowData;  notreffress = false;  fields;  fieldTypeWithNo = [];  autoGroupColumnDef;  //sortingOrder
  pageNo = 1;  TotalItems;  
  celldbclicked;  oldArrow;  fieldslable = [];  sortOrder;  headerField;  totalPage;  @Input() projectId;
  itemFrom = 0;  ItemTO = 0; 
  searchedValue: any;  oldSearchId: string; 
  RowIndex = [];  agHeaderCheckbox = false;  agheader: boolean;  openedSearchedBoxId: any;  conditiononselect = false;  datainarry = false;  //public detector: any;
  CustomeHeaderField: any;  
  @Input() itemSelectionView;  itemSelectionViewI;  dragEnterRowOrder: any;
  constructor(private itemsService: ItemsService, private fieldService: FieldService, private eventEmitterService: EventEmitterService) {
   this.eventEmitterService.invokeOngetItemsByProjectWithPagination.subscribe((page:any) => { 
      this.pageNo = page   
      this.ongetItemsByProjectWithPagination(page);
    });    
  }
  onLoadCustonHtml() {
    this.showHideCheckboxComponent.onCustomHtmlLoad();
  }
  ngOnInit() {
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeItemListComponentFunction.subscribe((data:any) => {         
         this.filterGridbyApi(data);
      });    
    }
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      getLatetsItemEvents.subscribe((data:any) => {         
         this.sortGridbyApi(data);
      });    
    }
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      getItemsOfList.subscribe((data:any) => {  
        this.ongetItemsByProjectWithPagination(this.pageNo);
      });    
    }
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      onshortRowdata.subscribe((data:any) => {  
        this.ongetItemsByProjectWithPagination(this.pageNo);
      });    
    }
    
    this.ongetItemsByProjectWithPagination(this.pageNo);
    this.countItemsByProject();
    this.GetFields();    
    this.autoGroupColumnDef = {};
    localStorage.setItem('pdata', 'true')
  }
  GetFields(){
    this.fields =[]
    this.itemCulomns=[]
    this.fieldName=[]
    this.fieldType=[]
    this.fieldService.getFields().subscribe((fields: any) => {
      this.fields = fields
      this.agGridComponent.setItemColumns(fields);
      this.columnLoaded = this.agGridComponent.columnLoaded
      this.itemCulomns = this.agGridComponent.itemCulomns
      this.itemCulomns[0]["headerCheckboxSelection"] = true;
      this.itemCulomns[0]["checkboxSelection"] = true;
      this.itemCulomns[0]["rowDrag"] = true;
      for (let j = 1; j < this.itemCulomns.length; j++) {
        this.itemCulomns[j]["headerCheckboxSelection"] = false;
        this.itemCulomns[j]["checkboxSelection"] = false;
        this.itemCulomns[j]["rowDrag"] = false;
      }
    });
  }
  getItems() {
    this.itemsService.countItemsByProject(this.projectId).subscribe((count: any) => {
        this.TotalItems = count;
        this.totalPage = Math.ceil(this.TotalItems / 100);
        if (this.totalPage == 1) { this.pageNo = 1; }
        this.ongetItemsByProjectWithPagination(this.pageNo);
     });
  }
  countItemsByProject() {
    this.itemsService.countItemsByProject(this.projectId).subscribe((count: any) => {
        this.TotalItems = count;
        this.totalPage = Math.ceil(this.TotalItems / 100);
        if (this.totalPage == 1) { this.pageNo = 1; }
    });
  }
  ongetItemsByProjectWithPagination(pageNo) {
    console.log('dfshbfbdkjfbkdsbf')
    var data = {filter: [{ techName: "", value: "" }],sort: {techName: "", direction: ""}}
    this.itemsService.ongetItemsByProjectWithPagination(this.projectId, data, pageNo).subscribe((items: any) => {
         this.items = items;
         this.countPaginetionValues();
    });
  }  
  onSingleItemSelect(event) { this.SelectedSingleRowData = event.data; }
  countPaginetionValues() {
    this.itemFrom = this.ItemTO + 1;
    this.ItemTO = this.ItemTO + this.items.length
  }
  sortGridbyApi(values) {
    var data
    data = { filter: [{techName: "", value: "" }],
      sort: {techName: values[0].colId,direction: values[0].sort}}
    this.itemsService.ongetItemsByProjectWithPagination(this.projectId, data, this.pageNo).subscribe((items: any) => {
        setTimeout(() => {
          this.items = items;
        }, 500);
        this.agHeaderCheckbox = false;
    });
  }
  filterGridbyApi(vales) {
    var data = { filter: [{ techName: vales.tachname, value: vales.searchText }],
      sort: { techName: "", direction: "" }}
    this.itemsService.ongetItemsByProjectWithPagination(this.projectId, data, this.pageNo).subscribe((items: any) => {
        if (items.length > 0) { this.items = items;}
        else {
          this.items = [{ _id: '5e4e36fdd4c40b0cf12378f0', DATE0: 'No Data Found !!' }]
        }
     });
  }
  cleanCheckboxes(e) {
    this.gridRows.forEach((row, i) => {
      row.setSelected(false);
    })
  }
}
