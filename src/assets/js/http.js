import axios from 'axios'
import qs from 'qs'
//import Router from '@/router/routes'
import { MessageBox } from 'element-ui';
axios.defaults.withCredentials = true
axios.interceptors.request.use(config => {
	return config
}, error => {
	return Promise.reject(error)
})

axios.interceptors.response.use(response => {
	return response
}, error => {
	return Promise.resolve(error.response)
})

function errorState(response) {
	// 如果http状态码正常，则直接返回数据  
	if(response.status != undefined || response.status != null) {
		if(response && (response.status === 200 && response.status === 4)) {
			return response
			// 如果不需要除了data之外的数据，可以直接 return response.data  
		} else if(response.status === 403) {
			console.log(403);
		} else {
			MessageBox.alert('网络异常', '提示信息');
		}
	} else {
		MessageBox.alert('请求失败，请重新登录。', '提示信息', {
			confirmButtonText: '确定'
		}).then(() => {
			localStorage.removeItem('user');
			window.location.href = '/';
		});
	}

}

function successState(res) {
	//统一判断后端返回的错误码  
	if(res.data.code != undefined || res.data.code != null) {
		if(res.data.code == 1) {
			return res;
		} else if(res.data.code == 502 || res.data.code == 503) {
			MessageBox.alert(res.data.data || res.data.msg || '后台没有返回警告信息，请联系管理员。', '提示信息', {
				confirmButtonText: '确定'
			}).then(() => {
				localStorage.removeItem('user');
				window.location.href = '/';
			});
		} else if(res.data.data === "用户没有登录，请登录！") {
			MessageBox.alert(res.data.data || res.data.msg || '后台没有返回警告信息，请联系管理员。', '提示信息', {
				confirmButtonText: '确定'
			}).then(() => {
				localStorage.removeItem('user');
				window.location.href = '/';
			});
		} else {
			MessageBox.alert(res.data.data || res.data.msg || res.data.message, '提示信息');
		}
	}

}
const httpServer = (opts) => {
	let httpDefaultOpts = { //http默认配置  
		method: opts.method,
		//        baseURL,  
		url: opts.url,
		timeout: 10000,
		params: Object.assign({}, opts.data || {}),
		data: Object.assign({}, opts.data || {}),
		headers: opts.method == 'get' ? {
			'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		} : {
			'X-Requested-With': 'XMLHttpRequest',
			"Content-Type": "application/json; charset=UTF-8"
		}
	}
	if(opts.method == 'get') {
		delete httpDefaultOpts.data
	} else {
		delete httpDefaultOpts.params
	}
	let promise = new Promise(function(resolve, reject) {
		axios(httpDefaultOpts).then(
			(res) => {
				successState(res)
				resolve(res)
			}
		).catch(
			(response) => {
				errorState(response)
				reject(response)
			}
		)

	})
	return promise
}

export default httpServer