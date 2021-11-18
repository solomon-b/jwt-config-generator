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

Pass the `--token true` flag and optionally provide a payload via `--payload`:

```
➜ npm run start -- --private-key ./examples/privatekey.pem --payload ./examples/payload.json --token true

> hasura-jwt-config-generator@0.1.0 start /home/solomon/Development/hasura/jwt-gen
> node index.js "--private-key" "./examples/privatekey.pem" "--payload" "./examples/payload.json" "--token" "true"

eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiMDIzNDU2Nzg5MCIsIngtaGFzdXJhLW9yZy1pZCI6IjEyNCJ9LCJqdGkiOiIwNDk4NGEwOS1lNzI5LTQ4NzktOGQxYS0wNzg4M2M3M2U1ZWIiLCJpYXQiOjE2MzcyNjg0MDl9.4OXQfqDfzVnvurNprro1Wf5JN436UokmjdlW-coPqnU1U8F_1UoNgZhmtp2c5CSmxzFjBr2ZdACWIoW8CPgRoqpHj7NZNYZkO9qPMeEwwh6fdiCLcQHdnm6gJoG9OYVxsg2NwM70gOztcnnWV4BFlXgu46r67lY6SMwB6IfLq9HEZ_j6Swq6HeXdTFIYKG4H6_xzVbru0FCKzmdZHqkSSHnz5FreaVGgW0DH5JxmUFzkMfip2good_Vy2DFMeBhSp3uKqXyKWYwdpb_lSIf-NhBIAksPyVVM6o4SsBhx3OgftM-Aq-DginC6DLg2KqbQZcTwR-Ux7_hWMiP7QByycq-t3_hAG5AxEiG6LoBk5NF19kmvGQ4p6Ha2DdYaCza9wA4TosZQlmvQUUCrNxlBb29nduSQR11CWtzhkONewmq0-g6MbGlQScyJmEVUt5j1tfZsv15MMD2ugPJO4OG4COPNI1kGN_QmI10mkGqL8XuDKV2XG-x3eLN0fwCE6-hE_J9y9vsQ9B7-z7Bu_Glu0bZAtoK6p2jSZKRH-PGn3Nzx-nr1RrT9PBj-W1GZWE_oJ708s0zv-1KhfXX1BZk_eCKdROLLgSHKRc0swM8FnTz1-6QCmYelXDYyRH4EqG9uaHw2lJ8Q78V4ByFJPedk24UoGWMZrjKIV_5_gJ30Dd8
```

## Options

You can pass the `--help` flag to get an explanation of all the options:

```
➜ npm run start -- --help

> hasura-jwt-config-generator@0.1.0 start /home/solomon/Development/hasura/jwt-gen
> node index.js "--help"


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
