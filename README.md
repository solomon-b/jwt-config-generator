# Hasura JWT Config Generator

This script will generate a [JWTConfig
Object](https://hasura.io/docs/latest/graphql/core/auth/authentication/jwt.html#auth-jwt)
for use with Hasura. It will also generate signed JWT tokens given an
SSL private key and a desired payload:

## Genearting a JWTConfig

Provide a SSL private key via `--private-key` and optionally provide
`JWTConfig` fields via `--config-fields`. The `type` defaults to
whatever algorithm is provided with `--algorithm` and the `key` to a
public key generated from the provided private key. If `config-fields`
contains a `type` or `key` are provided in `--config-fields` then they
will overwrite the defaults.

```
➜ ./bin/jwt-config --private-key ./examples/privatekey.pem --config-fields ./examples/config-fields.json
{
  type: 'RS256',
  key: [String: '-----BEGIN RSA PUBLIC KEY-----\n' +
    'MIICCgKCAgEA6IAaQxyeEfMR9l9kxNI2rtHa7EEct7BqWFTnSZvBrhpbMyOTJ4oi\n' +
    'qBYEFTulDT1s9Irn+Ub0jWFq3RuFvDvoYY1PFApOGohvXiitTRsUI+3pPofP727D\n' +
    'MZGszAHSug+mK6wKnXLxnuEJ1rFjRXESwZUAZGR2doQX3X9xwX+PTkR9djnNuUSG\n' +
    'TOz63jdOJiR7HM/qcJOyMKKskl33auYYi0ZOdxatCM53uVPbHrjyswlOeY+8fJ/Q\n' +
    'BaKb34dcZKydIlUj85JBJYxbUPGSwgV710ywKI6ywDqC0AErGTgVbvoJ/YzvjED2\n' +
    '3Yr8jg8WAQKeDsJOgTf//D+XiYiKiRvgbwfBq+6hhtiKi3pA5XooKuxbicfvORWL\n' +
    'NDeEtEJp4fKGc1Pdb33lG4gAcwHs1Q6ari+4WkvpnoEvLXXr42LIBk0SBTnHBfy1\n' +
    '3llByFwBZ2VtXEC2FfD3ZZ2acUJV30RS6T2YDIUFBTED/M2V/2TV/VvaqxIv6dCX\n' +
    'ce1Zin9/cDfutGNi9VNZzUP+Em1KteNjaIk/hClmLOCapifIN1i5q0qy7lX8NNp5\n' +
    '6XLnNU7S/U5tCssINWDCmIX6YNAI2IVqNaQkZxSNCFJDDf4nhWFt9YqNJOqOmRC7\n' +
    '4PWyqDioggEDvMlMEjjoQGXAKGRWRstY7ppdH8fDiXo/1eng+kGCOV0CAwEAAQ==\n' +
    '-----END RSA PUBLIC KEY-----\n'],
  issuer: 'solomon'
}
```

NOTE: As you can see, the key in this JWTConfig is broken. I don't
understand why Node isn't full evaluating those string concatenations
before logging the output. For the moment you have to manually correct
the public key. :(

## Generating a Signed Token

Pass the `--token true` flag and optionally provide a payload via `--payload`:

```
➜ ./bin/jwt-config --private-key ./examples/privatekey.pem --payload ./examples/payload.json --token true

eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiMDIzNDU2Nzg5MCIsIngtaGFzdXJhLW9yZy1pZCI6IjEyNCJ9LCJqdGkiOiJiNzNjMjE3MS1hODkxLTQ0NzctYWRmMi04ZTk2NzJiY2U2Y2UiLCJpYXQiOjE2MzcyNzE1ODZ9.a3uTBKcOEzvWCbEH093hrp1EXyU5XO-BM7ohn17A7vJcfgaPug6BG4ipYcCrI5Ne4zCwXTOFyAiLQLDaMoBUIq3J09dkkpGhqJKbhoCaIi4jbav7p37gtz3ggmvCvwAqgXqsBVmY260MU13h1laHPXe1mTCdQmnGGg5Srh0gMSGoCIDHbDAv62X5jEx33IvHlev2thl6zK-DchBGYt7ZP1iIv_BinQ4zbiQFP7_XE96R-LMKjfpY_rLwEq8u4eSl9XqO3sKNnjC8NKyQCMLiEwt8icBnA14ZvYJG7UwrpbVFdY4WNf0lVX2aumkLJB8f0GKGQHlfz1oB5v0i6v-PpigHmTB3jzveek-CF5e3x3BWWV6QbVQbRDxnbzajHTDl5RA9y0Nloxv6TyAR68jleG2pszVNXMqZHOgcvZC6nbD74l1qd8GgX7QQiI0OYM-DFxrwl5B302rRiv2h7AenN5tsyk9296Xa09rH-Kxfep6GX8YB3a1_9frFWSnrej3YHfqg1jS73Vdj-_9Az-35bPx3TIediwUDS_0lxY5uzRaxdfLrAWBOF9ylZNBKPHl--ed4Nb2FmnqjmJgBOXoEip0X65saRr76YgDyj_f9HTYAIotwJ6uNY4yAj4uC2WtR36mxLvR4WtbPsDiAaiZR9pLa4vrouW8KT-Sf-RMbtW0
```

## Options

You can pass the `--help` flag to get an explanation of all the options:

```
➜ ./bin/jwt-config --help

USAGE:
npm run start -- --private-key ./examples/privatekey.pem --config-fields ./examples/config-fields.json
npm run start -- --private-key ./examples/privatekey.pem --payload ./examples/payload.json --token true

OPTIONS:
--private-key    String. The path to the SSL private key.
--algorithm      Optional String. The signing algorithm for tokens. Default is 'RS256'.
--token          Optional Boolean. Generate a signed token instead of a JWTConfig Object. Default is 'false'
--payload        String. The path to the json file containing a payload for signd tokens.
--config-fields  Optional String. Path to a JSON Object with additional metadata to include in a JWTCOnfig
```
