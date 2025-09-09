import { rightsMapperData, adminPagesPath } from "../../utils";
import CreateUpdateForm from "./create-update-form";

export const path: string = adminPagesPath.transactionImportsNew;
export const viewPagePermission: string = rightsMapperData.transactionImportCreate;

const CreateNew = () => {
  return <CreateUpdateForm />;
}

export default CreateNew;
