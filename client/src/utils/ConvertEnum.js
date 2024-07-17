import { All, AccountStatusTab, DiscountStatusTab, BillStatusTab, VoucherTypeOption, VoucherTypeDiscount, ProductStockOption, ProductStatusTab, AccountGenderOption } from '../constants/enum'

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

export const convertToEnumVoucherTypeDiscount = (typeDiscount) => {
  let typeDiscountConverted = VoucherTypeDiscount.vi.VND;
  switch (typeDiscount) {
    case VoucherTypeDiscount.en.PERCENT:
      typeDiscountConverted = VoucherTypeDiscount.vi.PERCENT;
      break;
    default:
      typeDiscountConverted = VoucherTypeDiscount.vi.VND;
      break;
  }

  return typeDiscountConverted;
}

export const convertVoucherTypeDiscount = (typeDiscount) => {
  let typeDiscountConverted = null;
  switch (typeDiscount) {
    case VoucherTypeDiscount.vi.VND:
      typeDiscountConverted = VoucherTypeDiscount.en.VND;
      break;
    case VoucherTypeDiscount.vi.PERCENT:
      typeDiscountConverted = VoucherTypeDiscount.en.PERCENT;
      break;
    default:
      typeDiscountConverted = null;
      break;
  }

  return typeDiscountConverted;
}

export const convertToEnumAccountGender = (gender) => {
  let genderConverted = AccountGenderOption.vi.MEN;
  switch (gender) {
    case 0:
      genderConverted = AccountGenderOption.vi.MEN;
      break;
    case 1:
      genderConverted = AccountGenderOption.vi.WOMEN;
      break;
    case true:
      genderConverted = AccountGenderOption.vi.MEN;
      break;
    case false:
      genderConverted = AccountGenderOption.vi.WOMEN;
      break;
    default:
      genderConverted = AccountGenderOption.vi.MEN;
      break;
  }

  return genderConverted;
}

export const convertAccountGender = (gender) => {
  let genderConverted = null;
  switch (gender) {
    case AccountGenderOption.vi.MEN:
      genderConverted = 0;
      break;
    case AccountGenderOption.vi.WOMEN:
      genderConverted = 1;
      break;
    default:
      genderConverted = null;
      break;
  }

  return genderConverted;
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

