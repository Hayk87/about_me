import { rightsMapperData, adminPagesPath } from "../../utils";
import CreateUpdateForm from "./create-update-form";

export const path: string = adminPagesPath.systemUsersNew;
export const viewPagePermission: string = rightsMapperData.systemUserCreate;

const CreateNew = () => {
  return <CreateUpdateForm />;
}

export default CreateNew;
