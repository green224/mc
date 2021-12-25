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
		let version = QueryParam.get("ver");
		let lang = QueryParam.get("lang");
		let pagename = QueryParam.get("page");

		// rootDataを読み込み
		const rootData = JSON.parse( await this.loadFileText("root.json") );
		this._rootData = rootData;

		// フッターの初期化
		$("#footer")[0].innerHTML = "Copyright © 2021 " + rootData.author;

		// バージョンを読み込み
		if ( rootData.versions.find(i=>i===version) === undefined ) {
			version = rootData.versions[0];
		}
		await this.loadVersion(version);

		// ローカライズの読み込み
		await this.loadLocalize(lang);

		// ページ本体を読み込み
		if ( !this._pageMap.has(pagename) ) {
			pagename = this._pageMap.keys().next().value;
		}
		this._pagename = pagename;
		await this.loadBody(pagename);

		// 左のメニューを初期化
		await this.rebuildLeftMenu();
	},


	// 指定バージョンの読み込み処理
	async loadVersion(version) {
		this._version = version;

		// contentDataを読み込み
		const contentData = JSON.parse( await this.loadFileText(version+"/content.json") );
		this._contentData = contentData;
		this._pageMap = new Map(this._contentData.PageMap);

		// タイトルバーの更新
		document.title = this._rootData.productName + " ver." + version;
	},

	// 指定ローカライズの読み込み処理
	async loadLocalize(lang) {

		// ローカライズデータを読み込み
		const locLst = this._contentData.LocalizeList;
		if ( locLst.find(i=>i===lang) === undefined ) {
			lang = locLst[0];
		}
		this._lang = lang;

		const locDataText = await this.loadFileText(this._version+"/localize_"+lang+".json");
		const localizeData = new Map(JSON.parse( locDataText ));
		this._localizeData = localizeData;

		// ローカライズ変更ボタンを初期化
//		let locMode2Str = mode => this._localizeData["LocalizeTitle_" + mode];
		let lang2Str = l => localizeData.get("LocalizeTitle_" + l);
		$("#headerLocalize")[0].innerHTML = 
			'<i class="world icon"></i><span class="text">' + lang2Str(lang) + '</span>' +
			'<div class="menu">' +
			locLst.map( i =>
				'	<div class="' + (i==lang?'active item':'item') +
				'">' + lang2Str(i) + '</div>'
			) +
			'</div>';
		$("#headerLocalize").dropdown({
			onChange: (value, text) => {
				let newLang = locLst.find(i => lang2Str(i)==text);
				this.reloadLocalize(newLang);
				QueryParam.set("lang", newLang);
			}
		});
	},
	async reloadLocalize(lang) {
		this._beginLoad();
		await this.loadLocalize(lang);
		await this.loadBody(this._pagename);
		await this.rebuildLeftMenu();
		this._endLoad();
	},

	// 本体部分を読み込む処理
	async loadBody(pagename) {
		this._pagename = pagename;

		// 本体部分を更新
		const data = await this.loadFileText(this._version+"/bodies/"+pagename+"_"+this._lang+".md");
		const contentBody = $("#contentBody");
		contentBody[0].innerHTML = marked.parse(data);

		// 見出し部分の情報をキャッシュして、見出しの表示も整える
		const rawSections = contentBody.find("h1");
		this._sections = [];
		rawSections.each( (idx, sec) => {
			this._sections.push({
				name: sec.innerHTML,
				offset: $(sec).offset().top,
			});
			sec.innerHTML =
				'<i class="paragraph icon" style="color: #aaa"></i> '
				+ sec.innerHTML;
		} );

		// ヘッダーのページ名の更新
		const pagenameText = this._localizeData.get("PageTitle_" + pagename);
		$("#headerPageName")[0].innerHTML = pagenameText;
		contentBody[0].innerHTML =
			"<h1>" + pagenameText + "</h1>"
			+ "<hr>"
			+ contentBody[0].innerHTML;

	},
	scrollBody(ofs) {
//		const ofs = $('span[id="section_' + sectionName + '"]').offset().top - 10;
//		$(window).scrollTop( ofs );
		$('html,body').animate({scrollTop: ofs}, 140);
	},

	// 左のメニューバーを再構築する
	async rebuildLeftMenu() {

		// タイトルを更新
		$("#leftMenuHeader_ProductName")[0].innerHTML = this._rootData.productName;
		$("#leftMenuHeader_SubHeader")[0].innerHTML = this._localizeData.get("LeftMenu_SubHeader");

		// バージョン選択を更新
		$("#leftMenuHeader_Version")[0].innerHTML =
			'<div class="text">ver. ' + this._version + '</div>' +
			'<i class="dropdown icon"></i>' +
			'<div class="menu">' +
			'	<div class="header">Versions</div>' +
			this._rootData.versions.map( i =>
				'	<div class="' + (i==this._version?'active item':'item') +
				'" data-text="ver. ' + i + '">' + i + '</div>'
			) +
			'</div>';
		$("#leftMenuHeader_Version").dropdown({
			onChange: (value, text) => {
				// TODO : ここ複数バージョンが必要になった際にテストすること
console(value);
				this.reloadVersion(value);
				QueryParam.set("ver", value);
			}
		});

		// 選択セクション一覧のHTMLを生成する処理
		const genSectionsHTMl = () => {
			let retHtml = "";
			this._sections.forEach( sec => {
				retHtml +=
					'	<a class="ui item" onclick="'
					+ 'Loader.scrollBody(' + sec.offset + ');">'
					+ sec.name
					+ '</a>';
			} );
			return retHtml;
		};

		// ページ一覧のタイトルを作成
		let menuItemsHtml = "";
		let pageArray = [];
		for (let [key, value] of this._pageMap) {
			pageArray.push( {key:key, value:value} );
			const activeMk = this._pagename==key ? "active " : "";
//			const canSelCls = this._pagename==key ? "" : "canSelect ";
			const canSelCls = "";
			menuItemsHtml +=
				'<a class="ui '+activeMk+canSelCls+'title leftMenuTitle item">' +
				'	<i class="dropdown icon"></i>' +
				this._localizeData.get("PageTitle_" + key) +
				'</a>' +
				'<div class="'+activeMk+'content leftMenuContent" style="padding: 0 0 0 20px;">';
			if (this._pagename==key) menuItemsHtml += genSectionsHTMl();
			menuItemsHtml +=
				'</div>';
		}

		// ページタイトル押下時の処理を設定
		const leftMenuItems = $("#leftMenuItems");
		leftMenuItems[0].innerHTML = menuItemsHtml;
		leftMenuItems.find(".leftMenuTitle").each( (idx,a) => {
			a.onclick = () => {
				const pagename = pageArray[idx].key;
				if (this._pagename == pagename) return;
				this._beginLoad();
				Loader.loadBody( pagename ).then( () => {
					QueryParam.set('page', pagename);
					leftMenuItems.find(".leftMenuContent")[idx].innerHTML = genSectionsHTMl();
					leftMenuItems.accordion('refresh').accordion('open', idx);
					this._endLoad();
				} );
			};
		} );

		// ページ一覧のAccordionを初期化
		leftMenuItems
			.accordion({
				selector: {
					trigger: '.title.canSelect'
				}
			});
	},
	async reloadVersion(version) {
		this._beginLoad();
		await this.loadVersion(version);
		await this.loadLocalize(this._lang);
		await this.loadBody(this._pagename);
		await this.rebuildLeftMenu();
		this._endLoad();
	},

	// 何らからのテキストファイルを読み込む処理
	async loadFileText(filename) {
		const res = await fetch(filename);
		const text = await res.text();
		return text;
	},

	_version : "",
	_lang : "",
	_pagename : "",
	_rootData : null,
	_contentData : null,
	_localizeData : null,
	_pageMap: null,
	_sections: null,

	_beginLoad() {
		$("#contentBody").addClass("hidden");
		$("#mainLoaderIcon").addClass("active");
	},
	_endLoad() {
		$("#mainLoaderIcon").removeClass("active");
		$("#contentBody").removeClass("hidden");
	},
};

