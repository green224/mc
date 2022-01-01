
# IZTEXとは

![](media/ss_home02.gif)

テクスチャを作る際には、AOをベイクしたものをベースにすることがよくあります。

ところがこのAOベイクで作成された陰影には色々問題があって、ちょっと使いにくいですよね。

* あくまで物理的遮蔽によるもののみ
* 全て均一に計算されてしまうため、部分ごとに細かくコントロールできない
* レイトレースの精度に限界があるため、どうしてもノイズが発生する
* ノイズ除去により、UV境界が見えてしまう
* 交差がある部分は表現できない
* ポリゴンエッジ部分にアーティファクトが発生しやすい
* 画像加工ソフトでの手作業での加工が必須
* etc...

IZTEXではこの面倒な陰影ベースをいい感じに作成できます！

## 特徴

<details>
<summary><span style="font-size:larger;">非依存で非破壊</span></summary>
<div style="margin:10px 20px">
たとえばAOベイクで作成した陰影を使用する場合、画像加工ソフトでの編集が必要になりますが、この加工を行ったあとでMeshを変形したりUVを変更した場合、再度ベイクから加工をやり直す事になります。<br/><br/>
これに対してIZTEXでの編集は、Meshの変形やUV変種などの手戻りが発生しても、作業のやり直しがほとんど発生しません。DCCツール上のあらゆる編集に非依存で、モデルへの操作を行わない非破壊編集です。<br/><br/>
モデリングのどの段階からでもテクスチャリングを開始することができ、たとえモーション作成後の最終工程で粗が見つかった場合でも、修正をあきらめる必要がありません。
</div></details>

<br/>
<details>
<summary><span style="font-size:larger;">高速なイテレーション</span></summary>
<div style="margin:10px 20px">
陰影の配置から着色まで、編集結果はリアルタイムでテクスチャに反映されます。<br/>
ベイクボタンを押して長時間待機する必要はありません。
</div></details>

<br/>
<details>
<summary><span style="font-size:larger;">陰影の完全なコントロール</span></summary>
<div style="margin:10px 20px">
特に単純なモデルや有機的キャラクターの場合、陰影は物理的正しさよりもステレオタイプ的な表現が好ましい事が多々あります。<br/><br/>
例えば高さ方向に陰影グラデーションを付ける・側面部分や、おでこ、首周りを暗く・肘や膝の関節に陰影をいれる、胸の陰影をいい感じに、などなど…<br/><br/>
こういったアーティスティックな陰影は従来基本的に手書きに頼ることになります。ところが手書きでの滑らかな陰影はとても難しく、時間もかかり、やり直しもききません。<br/><br/>
IZTEXではこのような陰影を簡単に、綺麗に作成でき、また何度でもメッシュやUV編集をやり直すことが可能です。
</div></details>


# 使ってみる

<style>
.appBtn a {
	display: flex !important;
	justify-content: center;
	align-items: center;
	margin: 0 !important;
	font-size: 18px !important;
	height: 200px;
}
.appBtn a:hover {
	text-decoration: none;
	background-color: #bbbbbb;
}
.appBtn {
	display: flex;
	flex-direction: row;
	margin: 40px 40px;
	position: relative;
}
.appBtn .appColumn {
	width: 50%;
}
.appBtn .ui.vertical.divider::after, .appBtn .ui.vertical.divider::before {
	border-left-color: #f3f3f3;
}
.appBtn div {
	color: #f3f3f3 !important;
	opacity: 1 !important;
}
</style>
<div class="appBtn">
	<div class="ui vertical divider">Or</div>
	<div class="appColumn">
		<a class="ui blue button" style="border-radius: 20px 0 0 20px;" href="../" target="_blank">
			<div class="ui icon header" style="height: auto;">
				<i class="world icon"></i>
				ブラウザ版
			</div>
		</a>
	</div>
	<div class="appColumn">
		<a class="ui black disabled button" style="border-radius: 0 20px 20px 0;">
			<div class="ui icon header" style="height: auto;">
				<i class="download icon"></i>
				Exe版
			</div>
		</a>
	</div>
</div>


ブラウザ版とExe版があります。全機能が使用できますがブラウザ版はフリーウェアです。

TODO : Exe版の配布ページを作る


## サンプル

メニューの Help > Tutorial > Sample1 から、サンプルシーンを読み込めます。

中央のシーンビューを中ドラッグすることで、視線の回転が可能です。<br/>
Shift+Fでモデル全体にビューをフォーカスできます。<br/>
スクロールホイールで拡縮、Shift+中ドラッグで視線の平行移動が可能です。<br/>

![](media/ss_home01.gif)

メニューの Create > Node を選択すると、新規ノードを作成できます。<br/>
ノードは距離に比例した陰影を生成します。<br/>

ノードの中央に表示された移動ハンドルを操作することで、位置の編集ができます。<br/>
メニューバー右側のツールパネルから、移動以外のハンドルに切り替えることができます。<br/>

G / R / S キーからショートカットキーを使用したBlenderタイプの編集操作を行うこともできます。<br/>

