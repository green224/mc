
# IZTEXとは

滑らかな陰影を持つテクスチャを簡単に、非依存的・非破壊的に作成できます。

## 滑らかな陰影

陰影はベイクしたAOをベースに作成されるのが主流ですが、
AOベイクで作成された陰影にはいくつかの問題があります。

* 出力できるのはあくまで物理的遮蔽によるものであるため、高さによる陰影や、向きによるステレオタイプな陰影を追加することはできない
* 物理的遮蔽のみで全て均一に計算されてしまうため、陰影を細かくコントロールできない。例えばこのパーツの遮蔽部分は陰影を薄く・広くなど
* レイトレースの精度に限界があるため、どうしてもノイズが発生する
* 基本的にノイズ除去は2D空間でのブラー処理となるため、UV境界が見えてしまう
* 交差があると原理的に綺麗にベイクできない
* 物理的凹凸のみで計算されるため、ローポリゴンにおいてはエッジ部分に歓迎されないアーティファクトが発生する。このためSubdivideが必要となるが、本来の凹凸とは異なる形状で計算することは他の多くの問題の原因となる。
* 以上から、乗ってほしいところ、要らないところをコントロールするのが難しい
* また画像加工ソフトでの手作業での後処理が必須

IZTEXでは全ての陰影を完全にコントロール可能で、画像加工ソフトでの後処理が不要です。
※ マスク付きでPSD出力できるので、後処理をすることも可能です。

## 非依存・非破壊

たとえばAOベイクで作成した陰影を使用する場合、画像加工ソフトでの編集が必要になりますが、この加工を行ったあとでMeshを変形したりUVを変更した場合、再度ゼロから加工をやり直す事になります。このように2Dでのテクスチャ編集には、前段階の作業をやり直す（手戻りが起きた）ことで行った作業が消えてしまうという性質があります。

これに対してIZTEXでの編集は、Meshの変形やUV変種などの手戻りが発生しても、作業のやり直しが発生しません。DCCツール上のあらゆる編集に非依存で、モデルへの操作を行わない非破壊編集です。

モデリングのどの段階からでもテクスチャリングを開始することができ、たとえモーション作成後の最終工程で粗が見つかった場合でも、修正をあきらめる必要がありません。

## 簡単で高速なイテレーション

編集結果はリアルタイムでテクスチャに反映されます。ベイクボタンを押して長時間待機する必要はありません。

ノードの操作は直感的で、視線操作・移動回転拡縮などはBlnderと同一のショートカットキーで行えます。
学習コストが低く、非常に簡単です<span style="font-size:x-small">（個人差があります）</span>

## つまり

特に単純なモデルや有機的キャラクターの場合、陰影は物理的正しさよりもステレオタイプ的な表現が好ましい事が多々あります。

例えば人型キャラクターであれば、高さ方向に陰影グラデーションを付ける・足側面、特に内側を暗く・胴体側面を暗く・腕の側面胴体部分は暗く・頭部と首周りを暗く・おでこや顔側面を暗く・胸の陰影をいい感じに・肘や膝の関節に陰影をいれる・服との接触部分にいい感じに陰影をいれる、などなど…

こういったアーティスティックな陰影は従来基本的に手書きに頼ることになります。ところが手書きでの滑らかな陰影はとても難しく、時間もかかり、やり直しもききません。

IZTEXではこのような陰影を簡単に、綺麗に作成でき、また何度でもメッシュやUV編集をやり直すことが可能です。

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
		<a class="ui blue button" style="border-radius: 0 20px 20px 0;">
			<div class="ui icon header" style="height: auto;">
				<i class="download icon"></i>
				Exe版
			</div>
		</a>
	</div>
</div>


ブラウザ版とExe版があります。全機能が使用できますがブラウザ版はフリーウェアです。

TODO : Exe版の配布ページを作る

※ ブラウザ版はWebGLの制約上、いくつかの機能に相違があります

|    |  相違点  |
| :----: | ---- |
|  保存機能  |  ブラウザ設定により、ファイル名変更ダイアログが出ない場合がある（FAQ参照）  |
|  カーソル挙動  |  G/R/SキーでのTransform変更時に、カーソルがループしない  |
|  IME  |  機能しない（修正予定）  |
|  コピー＆ペースト  |  使用できるが、クリップボードとは同期しない  |
