"use strict"

var QueryParam = {
	get(key) {
		this._checkInit();
		return this._searchParams.get(key);
	},
	set(key, value) {
		this._checkInit();
		this._searchParams.set(key, value)
		history.replaceState('','','?'+this._searchParams.toString());
	},

	_searchParams: null,
	_checkInit() {
		if (this._searchParams === null)
			this._searchParams = new URLSearchParams( window.location.search );
	}
};

var Loader = {

	// 全体の初期化処理
	async setup() {

		// 言語設定
		let lang = QueryParam.get("lang");
console.log(lang);
		if ( lang == undefined ) {
			// ブラウザのデフォルト言語を見て、初期値を決める
			var languageStr = (window.navigator.languages && window.navigator.languages[0]) ||
				window.navigator.language ||
				window.navigator.userLanguage ||
				window.navigator.browserLanguage;
			lang = languageStr == "ja" ? "jp" : "en";
		}

		// rootDataを読み込み
		const rootData = JSON.parse( await this.loadFileText("root.json") );
		this._rootData = rootData;

		// ページを生成
		let elemsHtml = "";
		for (let page of rootData.pages) {
			let locDataName = "loc_" + lang + "_" + page.id + ".json";
			const locData = JSON.parse( await this.loadFileText(locDataName) );

			elemsHtml +=
				'<div class="elemBox">' +
					'<div class="detailTextArea">' +
						'<div style="margin:4px; font-weight: bold; font-size: large;">' +
							'☆　' + locData.name + '　☆' +
						'</div>' +
						locData.desc +
					'</div>' +
					'<div style="width: 100%; display: flex; align-items: stretch;">' +
						'<div style="width: 50%; text-align: left; display: flex; align-items: flex-end; font-size: smaller;">' +
							(lang=="jp" ? "プラットフォーム" : "Platform") + '：' + page.platform + '　' +
							(lang=="jp" ? "プレイ時間" : "Game Time") + '：' + page.gameTime +
						'</div>' +
						'<div style="width: 50%; text-align: right;">' +
							'<a class="downloadLink" href="'+locData.dl_url+'">' +
								(lang=="jp" ? "ダウンロード" : "DOWNLOAD") +
							'</a>' +
							'<div style="font-size: smaller;">' +
								(lang=="jp" ? "更新日" : "Update Date") + '：' + page.date +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="mainSSCtnr"><img class="mainSS" src="'+page.ss+'"></div>' +
				'</div>';
		};
		$("#elemsRoot")[0].innerHTML = elemsHtml;
	},

	// 何らからのテキストファイルを読み込む処理
	async loadFileText(filename) {
		const res = await fetch(filename);
		const text = await res.text();
		return text;
	},

};
