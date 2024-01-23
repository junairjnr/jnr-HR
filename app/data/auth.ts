import { useMutation } from "react-query";
import { post } from "../app_packages/http-client";
import { CustomerForm, LoginFormValues, LoginResponse } from "../Types";


export const useLogin = () =>
  useMutation("Login", (data: LoginFormValues) =>
    post<LoginResponse>("/Login", data)
  );

