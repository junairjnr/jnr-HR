import { useMutation, useQuery } from "react-query";
import { ProductForm } from "../Types";
import { get, put } from "../app_packages/http-client";

export const useGetItem = (id: string) => {
    return useQuery<ProductForm>(["ItemData"], () =>
      get(`/Item/${id}`),
    );
  };
  export const useEditItem = (id: string) => {
    return useMutation(
      ["Items"],
      (data: ProductForm) => put(`/Item/${id}`, data),
    );
  };