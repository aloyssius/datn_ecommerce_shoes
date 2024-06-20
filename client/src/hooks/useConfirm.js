import { useState } from 'react';
import Swal from 'sweetalert2'
import axios from 'axios';

const useConfirm = () => {

  document.addEventListener('keydown', (event) => {
    if (Swal.isVisible && event.key === 'Enter') {
      event.preventDefault();
    }
  });

  const showConfirm = (title, api, onCancel) => {

    Swal.fire({
      title: title || "Xác nhận?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      focusCancel: false,
      focusConfirm: false,
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý!",
      cancelButtonText: "Hủy bỏ",
      customClass: {
        container: 'my-swal'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowEscapeKey: false,
          allowOutsideClick: false,
          icon: "info",
          iconColor: '#C9DAE1',
          title: "Đang xử lý, vui lòng chờ!",
          customClass: {
            container: 'my-swal'
          },
          didOpen: () => {
            Swal.showLoading();
            api();
          },
        });
      } else {
        onCancel?.();
      }
    });
  };


  return { showConfirm };
}
export default useConfirm;
