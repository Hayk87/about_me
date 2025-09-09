import { rightsMapperData, adminPagesPath } from "../../utils";
import CreateUpdateForm from "./create-update-form";

export const path: string = adminPagesPath.productCategoriesNew;
export const viewPagePermission: string = rightsMapperData.measurementCreate;

const CreateNew = () => {
  return <CreateUpdateForm />;
}

export default CreateNew;
