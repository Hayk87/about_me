import { rightsMapperData, adminPagesPath } from "../../utils";
import CreateUpdateForm from "./create-update-form";

export const path: string = adminPagesPath.transactionExportsNew;
export const viewPagePermission: string = rightsMapperData.transactionExportCreate;

const CreateNew = () => {
  return <CreateUpdateForm />;
}

export default CreateNew;
