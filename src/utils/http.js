import 'isomorphic-fetch';

const API_BASE = 'https://kitchen.kanttiinit.fi'

export default {
	fetch(method, url) {
		const headers = {}
		if (this.token) {
			headers.Authorization = this.token
		}
		return fetch(API_BASE + url, {
			method: 'GET',
			headers
		})
		.then(r => r.json())
	},
	get(url, lang) {
		return this.fetch('GET', url + '?&lang=' + lang)
	},
	setToken(token) {
		this.token = token
	}
}
