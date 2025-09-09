import { useParams } from "react-router-dom";
import { rightsMapperData, adminPagesPath } from "../../utils";
import CreateUpdateForm from "./create-update-form";

export const path: string = adminPagesPath.translatesDetailsId;
export const viewPagePermission: string = rightsMapperData.translateReadDetails;

const UpdateExists = () => {
  const params = useParams();
  return <CreateUpdateForm id={params.id} />;
}

export default UpdateExists;
