export default {
	install(Vue, options) {
		Vue.prototype.removeAllSpace = function(str) {
			return str.replace(/\s+/g, '');
		}
	}
}