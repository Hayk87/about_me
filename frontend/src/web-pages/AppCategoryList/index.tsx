import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import WebLayout from "../../Layouts/WebLayout";
import { webPagesPath } from "../../utils";
import { getProductsListByCategoryCode } from "../../api/requests";

export const path: string = `${webPagesPath.buyApp}/:code`;

const AppCategoryList = () => {
  const params = useParams();

  useEffect(() => {
    getProductsListByCategoryCode(params.code!)
      .then((res) => {
        console.log('res >>>>>>>>>>>>>>', res);
      })
      .catch(err => {
        console.log(err);
      });
  }, [params.code]);

  return (
    <WebLayout>
      <h1>{params.code}</h1>
    </WebLayout>
  );
}

export default AppCategoryList;
