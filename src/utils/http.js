import 'isomorphic-fetch';

const API_BASE = 'https://kitchen.kanttiinit.fi'

export default {
	get(url) {
			return fetch(API_BASE + url)
			.then(r => r.json())
		}
}
