export type LoginResponse = {
  financialYear: FinancialYear;
  branchId: number;
  companyId: number;
  message: string;
  token: string;
  refreshtoken: string;
  date: string;
  sundryDebtor: number;
  billBookId: number;
  warehouseId: number;
  vatOrGst: string;
};

export type FinancialYear = {
  id: number;
  name: string;
  startingDate: string;
  endingDate: string;
};

export type LoginFormValues = {
  username: string;
  password: string;
  date: string;
};

export type CustomerForm = {
  id?:number;
  ledgerCode?: string;
  ledgerGroupId?: number;
  name?: string;
  mobile?: string;
  gstin?: string;
  branchId?: number;
  openingBal?: number;
  drOrCr?: number;
};

export type ProductForm = {
  id?:number;
  itemCode?: string;
  itemName?: string;
  secondName?: string;
  purchaseRate?: number;
  salesRate?: number;
  itemGroupId?: number;
  taxScheduleId?: number;
  mrp?: number;
  wholesaleRate?: number;
  costRate?: number;
  hsnCode?: string;
  barcode?: string;
  maintainStock?: boolean;
  reOrderLevel?: number;
  //   supplierId:number;
  notes?: string;
  images?: string;
  taxMode?: number;
  //   cessScheduleId:number;
  bulkUnits?: Array<{}>;
  warehouseId?: number;
  //   openingStock:number;
};

export type SalesForm = {
  itemId: number;
  billBookId: number;
  customer: { id: number };
  ledgerId: number;
  date: string;
  dueDate: string;
  invoiceNo: number;
  billAmount: number;
  discount: number;
  roundOff: number;
  cgst: number;
  sgst: number;
  igst: number;
  vat: number;
  cess: number;
  itemList: Array<{}>;
  payments: Array<{}>;
};
export type ItemState = {
  id: number;
  qty: number;
  // price: number;
  wareHouseId: number;
  itemId: number;
  narration: string;
  batchId: number;
  amount: number;
  total: number;
  discount: number;
  costPrice: number;
  salesRate: number;
  mrp: number;
  wholesaleRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  vat: number;
  cess: number;
  unitId: number;
  serials: Array<"">;

  inclusiveRate:number;
};
