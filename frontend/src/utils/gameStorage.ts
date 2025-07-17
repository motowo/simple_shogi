import type { GameInfo } from '../types/shogi'

const STORAGE_KEY = 'shogi_game_history'

/**
 * ゲーム履歴をローカルストレージに保存
 */
export function saveGameToHistory(gameInfo: GameInfo): void {
  try {
    const existingHistory = getGameHistory()
    const newHistory = [gameInfo, ...existingHistory]
    
    // 最新の100件のみ保持
    const limitedHistory = newHistory.slice(0, 100)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory))
  } catch (error) {
    console.error('Failed to save game to history:', error)
  }
}

/**
 * ゲーム履歴をローカルストレージから取得
 */
export function getGameHistory(): GameInfo[] {
  try {
    const historyData = localStorage.getItem(STORAGE_KEY)
    if (!historyData) return []
    
    const parsed = JSON.parse(historyData) as GameInfo[]
    
    // 日付文字列をDateオブジェクトに変換
    return parsed.map(game => ({
      ...game,
      startTime: new Date(game.startTime),
      endTime: game.endTime ? new Date(game.endTime) : undefined
    }))
  } catch (error) {
    console.error('Failed to load game history:', error)
    return []
  }
}

/**
 * ゲーム履歴をクリア
 */
export function clearGameHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear game history:', error)
  }
}

/**
 * 統計情報を計算
 */
export function calculateStats(history: GameInfo[]): {
  totalGames: number
  senteWins: number
  goteWins: number
  senteWinRate: number
  goteWinRate: number
  averageGameTime: number
  averageMoves: number
  checkmateWins: number
  resignWins: number
} {
  const totalGames = history.length
  const senteWins = history.filter(game => game.winner === 'sente').length
  const goteWins = history.filter(game => game.winner === 'gote').length
  
  const senteWinRate = totalGames > 0 ? (senteWins / totalGames) * 100 : 0
  const goteWinRate = totalGames > 0 ? (goteWins / totalGames) * 100 : 0
  
  const averageGameTime = totalGames > 0 
    ? history.reduce((sum, game) => sum + game.gameElapsedTime, 0) / totalGames
    : 0
  
  const averageMoves = totalGames > 0
    ? history.reduce((sum, game) => sum + game.totalMoves, 0) / totalGames
    : 0
  
  const checkmateWins = history.filter(game => game.gameEndReason === 'checkmate').length
  const resignWins = history.filter(game => game.gameEndReason === 'resign').length
  
  return {
    totalGames,
    senteWins,
    goteWins,
    senteWinRate,
    goteWinRate,
    averageGameTime,
    averageMoves,
    checkmateWins,
    resignWins
  }
}

/**
 * 特定のゲームを履歴から削除
 */
export function removeGameFromHistory(gameId: string): void {
  try {
    const history = getGameHistory()
    const filteredHistory = history.filter(game => game.id !== gameId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory))
  } catch (error) {
    console.error('Failed to remove game from history:', error)
  }
}

/**
 * 時間フォーマット用ユーティリティ
 */
export function formatGameTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}

/**
 * 日付フォーマット用ユーティリティ
 */
export function formatGameDate(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}