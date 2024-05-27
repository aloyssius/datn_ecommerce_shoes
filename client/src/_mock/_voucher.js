import { add } from 'date-fns';
import _mock from './_mock';
import { randomInArray, randomNumberRange } from './funcs';

// ----------------------------------------------------------------------

// export const _vouchers = [...Array(20)].map((_, index) => ({
//   id: _mock.id(index),
//   code: `DKN-${17048 + index}`,
//   name: 'ABC',
//   // value: randomNumberRange(100000, 500000),
//   // type: randomInArray(['Công khai, Cá nhân']),
//   // typeDiscount: randomInArray(['percent', 'vnd']),
//   // quantity: randomNumberRange(1,100),
//   // totalPrice: _mock.number.price(index + 1),
//   // createDate: add(new Date(), { days: index, hours: index }),
//   // dueDate: add(new Date(), { days: index + 15, hours: index }),
//   // status: randomInArray(['Đang diễn ra', 'Ngừng áp dụng', 'Hết hạn', 'Nháp']),
// }));
//
//
export const _vouchers = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  invoiceNumber: `INV-${17048 + index}`,
  taxes: 5,
  discount: 10,
  sent: randomNumberRange(1, 10),
  subTotalPrice: _mock.number.price(index + 1),
  totalPrice: _mock.number.price(index + 1),
  createDate: add(new Date(), { days: index, hours: index }),
  dueDate: add(new Date(), { days: index + 15, hours: index }),
  status: randomInArray(['paid', 'unpaid', 'overdue', 'draft']),
  invoiceFrom: {
    id: _mock.id(index),
    name: _mock.name.fullName(index),
    address: _mock.address.fullAddress(index),
    company: _mock.company(index),
    email: _mock.email(index),
    phone: _mock.phoneNumber(index),
  },
  invoiceTo: {
    id: _mock.id(index + 1),
    name: _mock.name.fullName(index + 1),
    address: _mock.address.fullAddress(index + 1),
    company: _mock.company(index + 1),
    email: _mock.email(index + 1),
    phone: _mock.phoneNumber(index + 1),
  },
  items: [...Array(3)].map((_, index) => ({
    id: _mock.id(index),
    title: _mock.text.title(index),
    description: _mock.text.description(index),
    quantity: 5,
    price: _mock.number.price(index),
    total: _mock.number.price(index),
    service: randomInArray([
      'Tất cả',
      'Công khai',
      'Cá nhân',
    ]),
  })),
}));

