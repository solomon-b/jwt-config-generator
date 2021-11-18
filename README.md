# Hasura JWT Config Generator

This script will generate a [JWTConfig Object](https://hasura.io/docs/latest/graphql/core/auth/authentication/jwt.html#auth-jwt)
for use with Hasura. It will also generate signed JWT tokens given an
SSL private key and a desired payload:

## Genearting a JWTConfig

```
➜ npm run start -- --private-key ./examples/privatekey.pem --config-fields ./examples/config-fields.json

> hasura-jwt-config-generator@0.1.0 start /home/solomon/Development/hasura/jwt-gen
> node index.js "--private-key" "./examples/privatekey.pem" "--config-fields" "./examples/config-fields.json"

{
  type: 'RS256',
  key: '-----BEGIN RSA PUBLIC KEY-----\n' +
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
    '-----END RSA PUBLIC KEY-----\n',
  issuer: 'solomon'
}
```

NOTE: As you can see, the key in this JWTConfig is broken. I don't
understand why Node isn't full evaluating those string concatenations
before logging the output. For the moment you have to manually correct
the public key. :(

## Generating a Signed Token

```
➜ npm run start -- --private-key ./examples/privatekey.pem --payload ./examples/payload.json

> test-action@0.3.0 start /home/solomon/Development/hasura/jwt-gen
> node index.js "--private-key" "./examples/privatekey.pem" "--payload" "./examples/payload.json"

eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiMDIzNDU2Nzg5MCIsIngtaGFzdXJhLW9yZy1pZCI6IjEyNCJ9LCJqdGkiOiJhNWYxZGI2ZC1iZmNkLTRiNjYtOWYyMC0wYWFhNzVkMWJmMDIiLCJpYXQiOjE2MzcyNjI4ODN9.BjfKAJZGBqWwuGilN1-PspE1eoOnny74su1kcHruVeqqJ_B4UlDKFi_i1OzEJbtbBJc5KNja3NV8uESWKDCVqqEuaEH-u3HFxstDiTwcf2g96yk0UHe-jekKU6We9S6blrjpUj52mzERuFmS0CbJ8tQvj90vfICj3ADBYKePE4jQ9M33Sx4Bx0u_ViEDESnDVMQWVRi4g7w8K2rF1tVrmqs5GjWmiXOYUrP7HiZ_fieQi8r_Ppm8PpIfDYN_rdr7w5xZftF1z3bkcKHcMgwB01jbYDsuUJ1_yJQT6Xg7bDDTDlAlsy8prvSb5CduzL5uWryGp90JFl3Do-bXtcfreQ
```

Lastly you can pass the `--help` flag to get an explanation of all the options.
