import { rightsMapperData, adminPagesPath } from "../../utils";
import CreateUpdateForm from "./create-update-form";

export const path: string = adminPagesPath.translatesNew;
export const viewPagePermission: string = rightsMapperData.translateCreate;

const CreateNew = () => {
  return <CreateUpdateForm />;
}

export default CreateNew;
