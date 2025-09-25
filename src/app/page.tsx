export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            タイムボックス法
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            時間を区切って集中力を最大化する、効果的な時間管理手法
          </p>
        </div>

        {/* What is Timeboxing */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                タイムボックス法とは？
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
                タイムボックス法は、あらかじめ決めた時間枠（タイムボックス）の中で作業を行う時間管理手法です。
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                例えば「このタスクは30分だけ集中して取り組む」といったように、作業時間を区切ることで集中力を高めたり、無駄な作業を減らす効果があります。
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 border-8 border-blue-500 rounded-full relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">25分</div>
                      <div className="text-sm text-gray-500">集中作業</div>
                    </div>
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                    <div className="w-1 h-8 bg-blue-500 origin-bottom transform rotate-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
            どのように機能するのか
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                1. 時間を設定
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                タスクに適した時間枠を決めます（例：25分、50分）
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                2. 集中して作業
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                設定した時間内は他のことを考えずに一つのタスクに集中
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">☕</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                3. 休憩を取る
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                時間が終わったら短い休憩を取り、次のボックスに備える
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            タイムボックス法の効果
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-lg font-bold mb-2">集中力向上</h3>
              <p className="text-blue-100">
                限られた時間で最大のパフォーマンスを発揮
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-bold mb-2">生産性アップ</h3>
              <p className="text-blue-100">
                無駄な時間を削減し効率的に作業
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold mb-2">明確な目標</h3>
              <p className="text-blue-100">
                短期的な目標設定で達成感を実感
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💪</div>
              <h3 className="text-lg font-bold mb-2">継続しやすい</h3>
              <p className="text-blue-100">
                小さな時間枠で負担を軽減
              </p>
            </div>
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
            タイムボックスの流れ
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                25分
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 dark:text-gray-200">作業</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">集中タイム</div>
              </div>
            </div>
            <div className="text-3xl text-gray-400 dark:text-gray-600">→</div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                5分
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 dark:text-gray-200">休憩</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">リフレッシュ</div>
              </div>
            </div>
            <div className="text-3xl text-gray-400 dark:text-gray-600">→</div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                25分
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 dark:text-gray-200">作業</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">次のタスク</div>
              </div>
            </div>
            <div className="text-3xl text-gray-400 dark:text-gray-600">→</div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                15分
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 dark:text-gray-200">長い休憩</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">4回目の後</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
