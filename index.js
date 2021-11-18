const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const R = require('ramda')

/*
This script will generate signed jwt tokens given an SSL private key
and a desired payload:

```
➜ npm run start -- --private-key ./examples/privatekey.pem --payload ./examples/payload.json

> test-action@0.3.0 start /home/solomon/Development/hasura/jwt-gen
> node index.js "--private-key" "./examples/privatekey.pem" "--payload" "./examples/payload.json"

eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiMDIzNDU2Nzg5MCIsIngtaGFzdXJhLW9yZy1pZCI6IjEyNCJ9LCJqdGkiOiJhNWYxZGI2ZC1iZmNkLTRiNjYtOWYyMC0wYWFhNzVkMWJmMDIiLCJpYXQiOjE2MzcyNjI4ODN9.BjfKAJZGBqWwuGilN1-PspE1eoOnny74su1kcHruVeqqJ_B4UlDKFi_i1OzEJbtbBJc5KNja3NV8uESWKDCVqqEuaEH-u3HFxstDiTwcf2g96yk0UHe-jekKU6We9S6blrjpUj52mzERuFmS0CbJ8tQvj90vfICj3ADBYKePE4jQ9M33Sx4Bx0u_ViEDESnDVMQWVRi4g7w8K2rF1tVrmqs5GjWmiXOYUrP7HiZ_fieQi8r_Ppm8PpIfDYN_rdr7w5xZftF1z3bkcKHcMgwB01jbYDsuUJ1_yJQT6Xg7bDDTDlAlsy8prvSb5CduzL5uWryGp90JFl3Do-bXtcfreQ
```

It can also geneate a JWTConfig given a private key:

```
➜ npm run start -- --private-key ./examples/privatekey.pem --config true

> test-action@0.3.0 start /home/solomon/Development/hasura/jwt-gen
> node index.js "--private-key" "./examples/privatekey.pem" "--config" "true"

{
  type: 'RS256',
  key: '-----BEGIN RSA PUBLIC KEY-----\n' +
    'MIIBCgKCAQEAvjNaKdOQDz3uPWCCz+EIksmeAZVUZNb9/mGfa9Ty9cXAlt00lUJK\n' +
    'U/Om7iJWMTLzBFGh9dz7OjLP3LOnW5mg8Zn1VjKcRCUHiPmEWNHv6EHz0ZNwMef2\n' +
    'a9g2qNxyFbYQO4OGBU1aDYXUJ5KQTFrdYYPW3TXL29Lhsng51NwcYnO6yiHuO0bZ\n' +
    'uHqPTw0xiNhIe6dW3+hJuS1V/UQDTFWLiDPGNMsMXM5Msr2qMnRQ29diyZ/mGsWr\n' +
    '0zIcvpXluDIGGBpzOEPgWwXlOPIPUbNJ46zuKb7d+UzAxdjOOV/ozXmg/txXZTYm\n' +
    '+SYaohIKD3LUFiyDBPc3xEgUU0AWQXh3gQIDAQAB\n' +
    '-----END RSA PUBLIC KEY-----\n'
}
```

NOTE: As you can see, the key in this JWTConfig is broken. I don't
understand why Node isn't full evaluating those string concatenations
before logging the output. For the moment you have to manually correct
the public key. :(

Lastly you can pass the `--help` flag to get an explanation of all the options.

*/

// TODO: Use an actual parsing library
const parseArgs = (args) => {
    const argObj = R.fromPairs(R.splitEvery(2, args))

    if ('--help' in argObj) {
	const privateKey = "--private-key    String. The path to the SSL private key."
	const payload = "--payload    String. The path to the payload json. Not required when generating a JWTConfig"
	const algorithm = "--algorithm Optional String. The signing Algorthim. Default is 'RS256'."
	const config = "--config Optional Boolean. Generate a JWTConfig instead of a signed token. Defaut is 'false'"
	const configFields = "--config-fields Optional String. Path to a JSON Object with additional metadata to include in a JWTCOnfig"

	const help = R.reduce((a, b) => a + "\n" + b, "", [privateKey, payload, algorithm, config, configFields])
	console.log(help)

	process.exit(0)
    }
    if (!('--config' in argObj)) {
	argObj['--config'] = false
    }

    if (!('--private-key' in argObj)) {
    	console.log("Missing flag --private-key.")
	process.exit(0)
    }

    if (!('--payload' in argObj) && !argObj['--config']) {
    	console.log("--payload is required when generating a signed token.")
	process.exit(0)
    }

    if (!('--algorithm' in argObj)) {
	argObj['--algorithm'] = "RS256"
    }

    return argObj
}

const createToken = (privateKey, payload, algorithm) => {
    const jti = crypto.randomUUID()
    const iat = Math.floor(+new Date() / 1000)

    payload.jti = jti
    payload.iat = iat

    return jwt.sign(payload, privateKey, {"algorithm": algorithm});
}

const createConfig = (publicKey, algorithm, configFields) => {
    const baseConfig = {
        "type": algorithm,
	// TODO: Figure out why this string isn't evaluating completely
        "key": publicKey.toString("utf8")
    }

    if (configFields) {
	return R.merge(baseConfig, configFields)
    }

    return baseConfig
}

const main = () => {
    const args = parseArgs(process.argv.slice(2))

    const algorithm = args['--algorithm']

    const privateKeyPath = args['--private-key']
    const privateKey = fs.readFileSync(privateKeyPath)

    if (args['--config']) {
	const configFieldsPath = args['--config-fields']
	const configFields = JSON.parse(fs.readFileSync(configFieldsPath))
	
	const publicKey = crypto.createPublicKey(privateKey).export({type:'pkcs1', format:'pem'})
	return console.log(createConfig(publicKey, algorithm, configFields))
    }

    const payloadPath = args['--payload']
    const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'))

    console.log(createToken(privateKey, payload, algorithm))
}

main()
