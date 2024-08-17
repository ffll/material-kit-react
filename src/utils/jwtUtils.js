import { decodeJwt } from 'jose';

const verifyToken = (token) => decodeJwt(token);

export default verifyToken;




