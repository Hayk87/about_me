import { rightsMapperData, adminPagesPath } from "../../utils";
import CreateUpdateForm from "./create-update-form";

export const path: string = adminPagesPath.staffsNew;
export const viewPagePermission: string = rightsMapperData.staffCreate;

const CreateNew = () => {
  return <CreateUpdateForm />;
}

export default CreateNew;
