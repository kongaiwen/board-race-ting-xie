module.exports = {
	apps: [{
		name: "board-race-ting-xie",
		script: "./index.js",
		env: {
			GOOGLE_APPLICATION_CREDENTIALS: "/home/ubuntu/api_keys/service_account_key.json"
		}
	}
	]
}
