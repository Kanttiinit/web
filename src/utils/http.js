import 'isomorphic-fetch';

const API_BASE = 'https://kitchen.kanttiinit.fi'

export default {
	get(url, lang) {
			return fetch(API_BASE + url + '?&lang=' + lang)
			.then(r => r.json())
		}
}
