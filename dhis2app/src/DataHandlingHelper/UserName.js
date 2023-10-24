import { useDataQuery } from '@dhis2/app-runtime';

//GET username logged in with username:admin
export function getUserName(){
  const usernameQuery = {
    user: {
      resource: "users",
      params: {
        fields: 'displayName',
        filter: 'userCredentials.username:eq:admin',
      },
    },
  };
  const { data } = useDataQuery(usernameQuery);
  let username;
  if (data){
    username = data.user.users[0].displayName;
    return username;
  }
  return null;
}