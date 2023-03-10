import { any, object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import FormInput from "../components/FormInput";
import { LoadingButton } from "../components/LoadingButton";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import useStore from "../store";
import { GenericResponse } from "../api/types";




const listProductPage = () => {
  const navigate = useNavigate();
  const store = useStore();


  const [products,setProduct] = useState([]);
  
 const deleteProduct = async (id:any) => {
    try {
        store.setRequestLoading(true);
        const response = await authApi.delete<GenericResponse>(
          "/products/"+id,
        );
        getProductLists();
        store.setRequestLoading(false);
       
      } catch (error: any) {
        store.setRequestLoading(false);
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.response.data.detail ||
          error.message ||
          error.toString();
        toast.error(resMessage, {
          position: "top-right",
        });
      }
 }  
 const getProductLists = async () => {
    try {
      store.setRequestLoading(true);
      const response = await authApi.get<GenericResponse>(
        "/products",
      );
      setProduct(response.data);
      store.setRequestLoading(false);
     
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }

    
  };
  useEffect(() => {
    
  
      getProductLists();
    
}, []);
console.log(products);
  return (
    <section className="py-8 bg-ct-blue-600 min-h-screen grid place-items-center">
      <div className="w-full">
        <h1 className="text-4xl xl:text-6xl text-center font-[600] text-ct-yellow-600 mb-4">
           Product list
        </h1>
        <div className="max-w-4xl p-12 mx-auto bg-ct-dark-100 rounded-md  flex gap-20 justify-center items-start">
            
            <table className="table w-full text-center">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Product Name</th>
      <th scope="col">Product details</th>
      <th scope="col">Brand Name</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>
  {products &&
            products.map((product, index) => (
                <tr>
                <th scope="row">{index+1}</th>
                <td>{product.product_name}</td>
                <td>{product.product_details}</td>
                <td>{product.brand_name}</td>
                <td>
                <Link
              to={"/editProduct/" + product.id}
              className="badge badge-warning"
            >
                <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
               
              >
                Edit
              </button>
              </Link>
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                onClick={()=>deleteProduct(product.id)}
              >
                Delete
              </button>
                </td>
              </tr>
            ))}

  </tbody>
</table>


        </div>
        
      </div>
    </section>
  );
};

export default listProductPage;
