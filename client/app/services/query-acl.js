import { axios } from "@/services/axios";

const QueryAcl = {
  getAcl: () => axios.get("api/query_acl"),
  getAclPermission: () => axios.get("api/query_acl/permission"),
  get: (groupId, dataSourceId) => axios.get(`api/groups/${groupId}/data_sources/${dataSourceId}/query_acl`),
  save: (groupId, dataSourceId, data) => axios.post(`api/groups/${groupId}/data_sources/${dataSourceId}/query_acl`, data),
};

export default QueryAcl;
