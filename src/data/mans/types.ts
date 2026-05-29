/** 一行要素の種別 */
export type ManLine =
  | { kind: 'dt'; text: string }        // セクションヘッダ <dt>
  | { kind: 'dd'; text: string }        // 段落 <dd>
  | { kind: 'dd-tab'; text: string }    // インデント段落 <dd class="tab">
  | { kind: 'dd-skip' };               // スキップ行 <dd><span class="skip"> </span></dd>

/** お題エントリ */
export type ManEntry = {
  command: string;
  lines: ManLine[];
};

/** ランキングレコード（KV に保存する JSON の型） */
export type RankRecord = {
  name: string;
  time: number;      // ミリ秒
  error: number;
  cpm: number;       // characters per minute (CPM)
  accuracy: number;  // 0–100
  date: number;      // unix timestamp (秒)
};
