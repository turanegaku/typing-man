# typing-man
#### The man is typing a man!!!

typing-manはUNIXコマンドのmanをタイピングするタイピングゲームです．

## Description
![typing.gif](https://github.com/turanegaku/typing-man/wiki/images/image.gif)

- typing-manはUNIXコマンドのmanをタイピングすることで，コマンドの概要をなんとなく覚えることができるかもしれないタイピングゲームです
- 段落の終わりでは改行を，間違えたら削除を，それぞれする必要があります
- ゲーム中では，ミスをした回数`ERROR`とかかった時間`TIME`が記録されます
- それぞれの記録はサーバのデータベースに蓄積され，速くてミスが少ない順にランキングで表示されます
- はじめからを押すと最初からやりなおすことができます
- 打ち終わった後に，今のを再生すると，どこを間違ったのか実際に確認できます
- 更なる高速化のため，パソコンが`QWERTY`配列の人でも，`Dvorak`と`Colemak`を練習できます

[Game Page](http://typing-man.herokuapp.com)

----
開発者向け

## Requirements
### PostgreSQL
データベースにpostgreSQLを使用しています．
以下の形式で設定を保存して下さい．

`username`, `password`, `host`, `port`, `database`，`ssl`通信を行うか行わないかを設定して下さい．

##### config/local.json
```json
{
  "DATABASE_URL": "postgres://username:password@host:port/database",
  "ssl": false
}
```

## Versions
- Node
  - v6.3.0
- PostgreSQL
  - 9.5.4


## Install
```bash
$ git clone https://github.com/turanegaku/typing-man.git
$ cd typing-man && npm install
```


## Usage
### サーバーの起動
```bash
$ npm start
```


### manからページを生成
```
$ ruby man2pug.rb echo
$ ruby man2pug.rb echo > view/mans/echo.pug
```


## LICENCE
[MIT](https://github.com/turanegaku/typing-man/blob/master/LICENSE)
