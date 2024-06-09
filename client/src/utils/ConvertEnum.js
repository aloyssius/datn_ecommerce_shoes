import { All, AccountStatusTab, DiscountStatusTab, BillStatusTab, VoucherTypeOption, ProductStockOption, ProductStatusTab } from '../constants/enum'

export const convertProductStatus = (status) => {
  let statusConverted = "";
  switch (status) {
    case ProductStatusTab.en.IS_ACTIVE:
      statusConverted = ProductStatusTab.vi.IS_ACTIVE;
      break;
    default:
      statusConverted = ProductStatusTab.vi.UN_ACTIVE;
      break;
  }

  return statusConverted;
}

export const convertAccountStatus = (status) => {
  let statusConverted = "";
  switch (status) {
    case AccountStatusTab.en.IS_ACTIVE:
      statusConverted = AccountStatusTab.vi.IS_ACTIVE;
      break;
    default:
      statusConverted = AccountStatusTab.vi.UN_ACTIVE;
      break;
  }

  return statusConverted;
}
export const getQuantityInStock = (stockOption) => {
  let quantityInStock = 0;
  switch (stockOption) {
    case ProductStockOption.OUT_OF_STOCK:
      quantityInStock = 0;
      break;
    case ProductStockOption.LOW_STOCK:
      quantityInStock = 5;
      break;
    default:
      quantityInStock = 20;
      break;
  }
  return quantityInStock;

};

export const convertVoucherType = (type) => {
  let typeConverted = "";
  switch (type) {
    case VoucherTypeOption.en.PUBLIC:
      typeConverted = VoucherTypeOption.vi.PUBLIC;
      break;
    case VoucherTypeOption.en.PRIVATE:
      typeConverted = VoucherTypeOption.vi.PRIVATE;
      break;
    default:
      typeConverted = All.VI;
      break;
  }

  return typeConverted;
}

export const convertDiscountStatus = (status) => {
  let statusConverted = "";
  switch (status) {
    case DiscountStatusTab.en.ON_GOING:
      statusConverted = DiscountStatusTab.vi.ON_GOING;
      break;
    case DiscountStatusTab.en.UP_COMMING:
      statusConverted = DiscountStatusTab.vi.UP_COMMING;
      break;
    default:
      statusConverted = DiscountStatusTab.vi.FINISHED;
      break;
  }

  return statusConverted;
}

export const convertOrderStatus = (status) => {
  let statusConverted = "";
  switch (status) {
    case BillStatusTab.en.PENDING_CONFIRM:
      statusConverted = BillStatusTab.vi.PENDING_CONFIRM;
      break;
    case BillStatusTab.en.WAITTING_DELIVERY:
      statusConverted = BillStatusTab.vi.WAITTING_DELIVERY;
      break;
    case BillStatusTab.en.DELIVERING:
      statusConverted = BillStatusTab.vi.DELIVERING;
      break;
    case BillStatusTab.en.COMPLETED:
      statusConverted = BillStatusTab.vi.COMPLETED;
      break;
    default:
      statusConverted = BillStatusTab.vi.CANCELED;
      break;
  }

  return statusConverted;
}

