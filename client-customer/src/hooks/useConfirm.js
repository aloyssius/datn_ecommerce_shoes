import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2'
import { PATH_PAGE } from '../routes/path';

const useConfirm = () => {

  document.addEventListener('keydown', (event) => {
    if (Swal.isVisible && event.key === 'Enter') {
      event.preventDefault();
    }
  });

  const history = useHistory();

  const showModal = (title, path, type = 'success') => {

    Swal.fire({
      title: title || "Xác nhận?",
      icon: type,
      // showCancelButton: true,
      confirmButtonColor: "#3085d6",
      // focusCancel: false,
      focusConfirm: false,
      // cancelButtonColor: "#d33",
      confirmButtonText: "Đóng!",
      // cancelButtonText: "Hủy bỏ",

    }).then((result) => {
      if (result.isConfirmed) {
        path && history.push(path);
      }
      else {
        path && history.push(path);
      }
    });
  };

  const showSuccess = (title, text, type = 'success') => {

    Swal.fire({
      title: title || "Xác nhận?",
      text: text || "",
      icon: type,
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      focusCancel: false,
      focusConfirm: false,
      confirmButtonText: "Đóng!",
    });
  };

  return { showModal, showSuccess };
}
export default useConfirm;
