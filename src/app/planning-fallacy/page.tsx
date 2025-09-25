export default function PlanningFallacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            プランニングファラシー
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            時間を過小評価してしまう人間の心理的傾向を理解しよう
          </p>
        </div>

        {/* What is Planning Fallacy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                プランニングファラシーとは？
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
                プランニングファラシーとは、タスクにかかる時間を実際よりも短く見積もってしまう認知バイアスのことです。
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                「1時間で終わると思ったのに3時間かかった」「明日までに終わると思ったのに1週間かかった」といった経験は、このファラシーの典型例です。
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 border-8 border-red-500 dark:border-red-400 rounded-full relative flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">予想: 1時間</div>
                    <div className="text-xl text-gray-500 dark:text-gray-400">↓</div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">実際: 3時間</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why it happens */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
            なぜ起こるのか
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                楽観的バイアス
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                最良のシナリオに焦点を当て、問題やトラブルを考慮しない傾向
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                経験の軽視
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                過去の経験よりも現在の計画を重視してしまう心理的傾向
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                複雑さの無視
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                タスクの複雑さや依存関係を十分に考慮せずに見積もる
              </p>
            </div>
          </div>
        </div>

        {/* Effects */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-xl shadow-lg p-8 text-white mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            プランニングファラシーの影響
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">😰</div>
              <h3 className="text-lg font-bold mb-2">ストレス増加</h3>
              <p className="text-red-100">
                予定通りに進まないことでストレスが蓄積
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📉</div>
              <h3 className="text-lg font-bold mb-2">品質低下</h3>
              <p className="text-red-100">
                時間不足により作業の品質が犠牲になる
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-lg font-bold mb-2">信頼失墜</h3>
              <p className="text-red-100">
                約束した期限を守れず信頼を失う
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="text-lg font-bold mb-2">悪循環</h3>
              <p className="text-red-100">
                失敗を繰り返し学習しない状態が続く
              </p>
            </div>
          </div>
        </div>

        {/* Solutions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
            対策方法
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                📊 参考クラス予測
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                似たようなタスクの過去の実績データを参考にして見積もりを行う
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• 過去の類似プロジェクトの記録を確認</li>
                <li>• 他の人の経験を聞く</li>
                <li>• 業界平均や統計データを参考にする</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                🧮 タスク分解
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                大きなタスクを小さな単位に分割して、それぞれを個別に見積もる
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• 作業を具体的なステップに分ける</li>
                <li>• 各ステップの所要時間を見積もる</li>
                <li>• バッファー時間を追加する</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
            改善プロセス
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">
                過去を<br/>振り返る
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 dark:text-gray-200">記録分析</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">実績データ収集</div>
              </div>
            </div>
            <div className="text-3xl text-gray-400 dark:text-gray-600">→</div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">
                計画を<br/>立てる
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 dark:text-gray-200">現実的見積</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">バッファー追加</div>
              </div>
            </div>
            <div className="text-3xl text-gray-400 dark:text-gray-600">→</div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">
                実行と<br/>記録
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 dark:text-gray-200">進捗追跡</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">実時間記録</div>
              </div>
            </div>
            <div className="text-3xl text-gray-400 dark:text-gray-600">→</div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">
                学習と<br/>改善
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 dark:text-gray-200">反省点整理</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">次回に活用</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}