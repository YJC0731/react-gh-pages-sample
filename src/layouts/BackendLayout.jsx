import { Outlet } from 'react-router-dom';
import AutoScrollToTop from '../plugins/AutoScrollToTop';
import BackendHeader from '../layouts/BackendHeader'
import Toast from '../components/Toast';


export default function BackendLayout(){
    return (
      <>
        <AutoScrollToTop />
        <BackendHeader />

      <div className="container mt-5">
        <Outlet />
      </div>
      
      <Toast />
      </>
  );
}