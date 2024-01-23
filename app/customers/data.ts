import { useMutation, useQuery } from "react-query";
import { CustomerForm, ProductForm } from "../Types";
import { get, put } from "../app_packages/http-client";

export const useGetCustomer = (id: string) => {
    return useQuery<CustomerForm>(["CustData"], () =>
      get(`/Ledger/${id}`),
    );
  };
  export const useEditCustomer = (id: string) => {
    return useMutation(
      ["Customer"],
      (data: CustomerForm) => put(`/Ledger/${id}`, data),
    );
  };