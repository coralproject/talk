import './ToastContainer.css';
import { defaultProps } from 'recompose';
import { ToastContainer } from 'react-toastify';

export default defaultProps({
  autoClose: 5000,
})(ToastContainer);
