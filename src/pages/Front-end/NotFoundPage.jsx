import { Link } from "react-router-dom"
import ReactHelmetAsync from "../../plugins/ReactHelmetAsync"

export default function NotFoundPage(){
  return(
   <>
   < ReactHelmetAsync title=" ˋ404 NotFound " />
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mt-5 text-center text-secondary"> 404 此頁面不存在 </h1>
      <Link to='/' className="btn btn-outline-primary mt-3" > 返回首頁 </Link>
    </div>
   </>
  )
}