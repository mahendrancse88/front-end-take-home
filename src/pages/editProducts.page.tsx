import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useEffect, useState} from "react";
import FormInput from "../components/FormInput";
import { LoadingButton } from "../components/LoadingButton";
import { toast } from "react-toastify";
import { Link, useNavigate,useParams } from "react-router-dom";
import { authApi } from "../api/authApi";
import useStore from "../store";
import { GenericResponse } from "../api/types";

const registerSchema = object({
  product_name: string().min(1, "Product name is required").max(100),
  product_details: string()
    .min(1, "Product description address is required"),
 brand_name: string()
    .min(1, "Brand Name is required")
});

export type RegisterInput = TypeOf<typeof registerSchema>;

const editProductPage = () => {
    const { id }= useParams();
 const [products,setProduct] = useState({
    product_name:"RegisterInput",
    product_details:"",
    brand_name:""


 });
  const navigate = useNavigate();
  const store = useStore();

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });
  const getProductDetails = async () => {
    try {
      store.setRequestLoading(true);
      const response = await authApi.get<GenericResponse>(
        "/products/"+id,
      );
      console.log(response.data[0]);
      setProduct(response.data);
      useForm<RegisterInput>({
        resolver: zodResolver(response.data[0]),
      });
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
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    getProductDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const updateUser = async (data: RegisterInput) => {
    try {
      store.setRequestLoading(true);
      const response = await authApi.put<GenericResponse>(
        "/products/"+id,
        data
      );
      toast.success(response.data.message, {
        position: "top-right",
      });
      store.setRequestLoading(false);
      navigate("/listProducts");
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

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    updateUser(values);
  };
 
  console.log(products.length)
  return (
    <section className="py-8 bg-ct-blue-600 min-h-screen grid place-items-center">
      <div className="w-full">
        <h1 className="text-4xl xl:text-6xl text-center font-[600] text-ct-yellow-600 mb-4">
          Edit Product
        </h1>
        
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
          >
           <FormInput label="Product Name" name="product_name" value={products.length ==1 ? products[0].product_name : "" }/>
            <FormInput label="Product Description" name="product_details" type="text" value={products.length ==1 ? products[0].product_details : "" }  />
            <FormInput label="Brand Name" name="brand_name" type="text" value={products.length ==1 ? products[0].brand_name : "" } />
            

            
            <LoadingButton
              loading={store.requestLoading}
              textColor="text-ct-blue-600"
            >
              Update
            </LoadingButton>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default editProductPage;
