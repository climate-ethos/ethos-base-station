/**
 * Convert string to hexadecimal representation
 * @param input The input string to be converted
 * @returns The hex string (e.g. '999' becomes '393939')
 */
function stringToHex(input: string) {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += input.charCodeAt(i).toString(16);
  }
  return result;
}

/**
 * Find the correct database name for a given user id
 * https://docs.couchdb.org/en/stable/config/couch-peruser.html
 * @param id The user ID
 * @returns The database name (e.g. userdb-3f)
 */
export function usernameToDbName(id: string) {
  return 'userdb-' + stringToHex(id);
}
