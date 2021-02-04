import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'

import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')
const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJO/j7tP0V+b09MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi0tY24zNXMwOS51cy5hdXRoMC5jb20wHhcNMjEwMjA0MDUzNDIzWhcN
MzQxMDE0MDUzNDIzWjAkMSIwIAYDVQQDExlkZXYtLWNuMzVzMDkudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxX7EJv8I+2NddFs7
C5DF98p/pp+TwnKIihsvwnnE7KwNozEmVv/hiJ57xLLxV+8hOzF+j+gvoAR/E3Ny
OPAXuRe1KQcmhb//RyOoodU/LF7ViCliuYL6jN0viezbsKY5je8mTKuaebv/+8UP
NdemUjdBkIv84X2KQXdP9AeuSifORUqxAjfXPgRiJc75P12t7xMwn7Juadflqb7O
yDv56SCAAgQtKlRu4rwcpODsq+8oUyXxXs3dJZqm61HF7lUie7ERf3C+Epqsd6aB
QtcZoWT7yeenFbaeKHhHj0BFIZUnGT5B5ns4BFbrTsQUE2ti8LFZ0wxeV3sFkwis
auWaBQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRVGJBGSiHY
QoesnFgogdd9H97v2TAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
ABUnZY0GXtQ9mKiY3IUTfjeVdgSqMSAMI9DL7P8nbK2hTbKm2vn+UrWvzJbKW/WO
soW7a8sOCLLDhWco/CF2QhadSq7BBGQ2MzdEd5MZ/ZporCAG0YUqZ/L9I+E/Wkl9
USssFiNaG4Xj/oHifFbFHfYUQ0tCrMTCw990xCOYQHtce7po4XfEdj8C3BfU7nJL
nkKdGHQ+MjaOjNPGZ/8hWJ0e+EHOThjFTTW54LwkFZDX22YZzrjVbgUo3VDjUFZR
2PV6MvB0WzLgkKJTl6LodEs+5ASwQj9sJLB9xmbC7a30GbvnbfQNXZEFCGfmZCoH
w7Bx3w0PDFaNUks0h2NHPik=
-----END CERTIFICATE-----`


export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  console.log(token);
  //const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
