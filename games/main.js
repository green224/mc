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

		// 言語バーを生成
		let langBarHtml = "";
		if (lang == "jp") {
			langBarHtml =
				'Japanese / <a href="' +
				location.href.replace(/\?.*$/,"") + '?lang=en' +
				'">English</a>';
		} else {
			langBarHtml =
				'<a href="' +
				location.href.replace(/\?.*$/,"") + '?lang=jp' +
				'">日本語</a> / English';
		}
		$("#langSwitch")[0].innerHTML = langBarHtml;


		// rootDataを読み込み
		const rootData = await this.loadFile("root.json");
		this._rootData = rootData;

		// ページを生成
		let elemsHtml = '<div class="divLine"></div>';
		for (let page of rootData.pages) {

			const locDataName = "loc_" + lang + "_" + page.id + ".json";
			const locData = await this.loadFile(locDataName);
			if (locData == null) continue;

			elemsHtml +=
				'<div class="elemBox">' +
					'<div class="detailTextArea">' +
						'<div style="margin:14px; font-weight: bold; font-size: large;">' +
							'☆　' + locData.name + '　☆' +
						'</div>' +
						locData.desc +
					'</div>' +
					'<div style="width: 100%; display: flex; align-items: stretch;">' +
						'<div style="width: 50%; text-align: left; display: flex; align-items: flex-end; font-size: smaller;">' +
							(lang=="jp" ? "プラットフォーム" : "Platform") + '：' + page.platform + '　' +
							(lang=="jp" ? "プレイ時間" : "Game Time") + '：' + page.game_time +
						'</div>' +
						'<div style="width: 50%; text-align: right;">' +
							(locData.dl_url=="" ? (
								'<span class="downloadLinkClosed">' +
									(lang=="jp" ? "公開終了" : "closed") +
								'</span>'
							) : (
								'<a class="downloadLink" href="'+locData.dl_url+'">' +
									(locData.dl_type=="download"
										? (lang=="jp" ? "ダウンロード" : "DOWNLOAD")
										: (lang=="jp" ? "ブラウザでプレイ" : "PLAY in Browser")
									) +
								'</a>'
							) ) +
							'<div style="font-size: smaller;">' +
								(lang=="jp" ? "更新日" : "Update Date") + '：' + page.date +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="mainSSCtnr">' +
						(page.ss_type=="image"
							? '<img class="mainSS" src="'+page.ss+'">'
							: '<video class="mainSS" width="650" width="500" controls loop preload="metadata" playsinline src="'+page.ss+'">'
						) +
					'</div>' +
				'</div>' +
				'<div class="divLine"></div>';
		};
		$("#elemsRoot")[0].innerHTML = elemsHtml;
	},

	// ファイルを読み込む
	async loadFile(filename) {
		return await new Promise( (resolve, reject) => {
			$.ajax({
				url: filename,
				type: "GET",
				async: true,
			}).done(	// 正常終了
				(result) => {
					resolve(result);
				}
			).fail(		// エラー
				() => {
					resolve(null);
				}
			)
		} );
	}	

};
