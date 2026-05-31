/** 一行要素の種別 */
export type ManLine =
  | { kind: 'dt'; text: string }        // セクションヘッダ <dt>
  | { kind: 'dd'; text: string }        // 段落 <dd>
  | { kind: 'dd-tab'; text: string }    // インデント段落 <dd class="tab">
  | { kind: 'dd-skip' }                 // スキップ行 <dd><span class="skip"> </span></dd>
  | { kind: 'dd-blank' };               // 空行（入力不要） <dd class="blank"></dd>

/** お題エントリ */
export type ManEntry = {
  command: string;
  displayName?: string;  // ホームページ表示名（省略時は command を使用）
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
