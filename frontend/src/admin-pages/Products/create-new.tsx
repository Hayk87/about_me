import { rightsMapperData, adminPagesPath } from "../../utils";
import CreateUpdateForm from "./create-update-form";

export const path: string = adminPagesPath.productsNew;
export const viewPagePermission: string = rightsMapperData.productCreate;

const CreateNew = () => {
  return <CreateUpdateForm />;
}

export default CreateNew;
