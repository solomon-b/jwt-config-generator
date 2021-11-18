const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const R = require('ramda')

// TODO: Use an actual parsing library
const parseArgs = (args) => {
    const argObj = R.fromPairs(R.splitEvery(2, args))

    if ('--help' in argObj) {
	const privateKey = "--private-key    String. The path to the SSL private key."
	const algorithm = "--algorithm Optional String. The signing algorithm for tokens. Default is 'RS256'."
	const token = "--token Optional Boolean. Generate a signed token instead of a JWTConfig Object. Default is 'false'"
	const payload = "--payload    String. The path to the payload json. Only required whengenerating a signd token."
	const configFields = "--config-fields Optional String. Path to a JSON Object with additional metadata to include in a JWTCOnfig"

	const help = R.reduce((a, b) => a + "\n" + b, "", [privateKey, algorithm, token, payload, configFields])
	console.log(help)

	process.exit(0)
    }
    if (!('--token' in argObj)) {
	argObj['--token'] = false
    }

    if (!('--private-key' in argObj)) {
    	console.log("Missing flag --private-key.")
	process.exit(0)
    }

    if (!('--payload' in argObj) && argObj['--token']) {
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

    if (!args['--token']) {
	const configFieldsPath = args['--config-fields']
	const configFields = configFieldsPath ? JSON.parse(fs.readFileSync(configFieldsPath)) : {}
	
	const publicKey = crypto.createPublicKey(privateKey).export({type:'pkcs1', format:'pem'})
	return console.log(createConfig(publicKey, algorithm, configFields))
    }

    const payloadPath = args['--payload']
    const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'))

    console.log(createToken(privateKey, payload, algorithm))
}

main()
