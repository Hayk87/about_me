import React from "react";
import { useParams } from "react-router-dom";
import WebLayout from "../../Layouts/WebLayout";
import { webPagesPath } from "../../utils";

export const path: string = `${webPagesPath.buyApp}/:categoryCode/details/:appCode`;

const AppDetails = () => {
  const params = useParams();

  return (
    <WebLayout>
      <h1>{params.categoryCode} - {params.appCode}</h1>
    </WebLayout>
  );
}

export default AppDetails;
