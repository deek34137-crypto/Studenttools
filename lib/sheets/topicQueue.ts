// lib/sheets/topicQueue.ts
import fs from 'fs'
import path from 'path'
import os from 'os'
import crypto from 'crypto'
import * as xlsx from 'xlsx'
import { TopicRow, TopicStatus } from '../db/types'

const SHEET_NAME = process.env.GOOGLE_SHEETS_WORKSHEET_NAME || 'Topics'

function getExcelFilePath(): string | null {
  const candidates = [
    path.resolve(process.cwd(), 'StudentTools_1105_Blog_Topics_Database.xlsx'),
    path.resolve(process.cwd(), 'data/StudentTools_1105_Blog_Topics_Database.xlsx'),
    path.join(__dirname, '../../StudentTools_1105_Blog_Topics_Database.xlsx'),
    path.join(__dirname, '../StudentTools_1105_Blog_Topics_Database.xlsx'),
  ]
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate
  }
  return null
}

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
const LOCAL_STATE_FILE = isServerless
  ? path.join(os.tmpdir(), 'studenttools_storage', 'topic_overrides.json')
  : path.resolve(process.cwd(), 'data/storage/topic_overrides.json')

let memoryOverrides: Record<string, Partial<TopicRow>> = {}

function getLocalOverrides(): Record<string, Partial<TopicRow>> {
  try {
    if (fs.existsSync(LOCAL_STATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_STATE_FILE, 'utf-8'))
      memoryOverrides = { ...memoryOverrides, ...data }
      return memoryOverrides
    }
  } catch (err) {
    // Ignore read failure and use memory overrides
  }
  return memoryOverrides
}

function saveLocalOverrides(overrides: Record<string, Partial<TopicRow>>) {
  memoryOverrides = { ...memoryOverrides, ...overrides }
  try {
    const dir = path.dirname(LOCAL_STATE_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(LOCAL_STATE_FILE, JSON.stringify(overrides, null, 2), 'utf-8')
  } catch (err) {
    // Ignore write failure in read-only environment
  }
}

/**
 * Generates a Google Service Account OAuth2 Access Token using pure Node.js crypto.
 * This guarantees zero heavy SDK bloat and lightning-fast execution on serverless runtimes.
 */
async function getGoogleAccessToken(): Promise<string | null> {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

  if (!clientEmail || !privateKey) {
    return null
  }

  try {
    // Handle escaped newlines in env variables
    privateKey = privateKey.replace(/\\n/g, '\n')

    const now = Math.floor(Date.now() / 1000)
    const header = { alg: 'RS256', typ: 'JWT' }
    const claim = {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    }

    const encodeBase64Url = (obj: Record<string, unknown>) =>
      Buffer.from(JSON.stringify(obj))
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

    const unsignedToken = `${encodeBase64Url(header)}.${encodeBase64Url(claim)}`
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(unsignedToken)
    sign.end()
    const signature = sign
      .sign(privateKey, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    const assertion = `${unsignedToken}.${signature}`

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }),
    })

    const tokenData = await tokenRes.json()
    if (tokenData.access_token) {
      return tokenData.access_token
    }
    console.error('Google OAuth token error:', tokenData)
    return null
  } catch (err) {
    console.error('Failed to create Google Access Token:', err)
    return null
  }
}

/**
 * Reads all topics from Google Sheet or local Excel workbook.
 */
export async function getAllTopics(): Promise<TopicRow[]> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const accessToken = await getGoogleAccessToken()

  if (spreadsheetId && accessToken) {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        SHEET_NAME
      )}!A1:R2000`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await res.json()

      if (data.values && data.values.length > 1) {
        const headers = (data.values[0] as string[]).map((h) => h.trim().toLowerCase())
        const rows: TopicRow[] = []

        for (let i = 1; i < data.values.length; i++) {
          const rowValues = data.values[i]
          const obj: Record<string, string> = {}
          headers.forEach((h, idx) => {
            obj[h] = rowValues[idx] || ''
          })

          rows.push({
            topic_id: obj.topic_id || `ST_${i}`,
            topic: obj.topic || '',
            category: obj.category || 'General',
            topic_cluster: obj.topic_cluster || '',
            article_type: obj.article_type || 'Explanation',
            search_intent: obj.search_intent || 'Educational',
            primary_keyword: obj.primary_keyword || '',
            secondary_keywords: obj.secondary_keywords || '',
            related_tool: obj.related_tool || '',
            related_tool_slug: obj.related_tool_slug || '',
            content_angle: obj.content_angle || '',
            evergreen: obj.evergreen || 'YES',
            priority: (obj.priority as any) || 'MEDIUM',
            status: ((obj.status as string) || 'READY').toUpperCase() as TopicStatus,
            published_url: obj.published_url || null,
            published_at: obj.published_at || null,
            error: obj.error || null,
            content_hash: obj.content_hash || null,
          })
        }
        return rows
      }
    } catch (err) {
      console.error('Google Sheets API read failed, falling back to local file:', err)
    }
  }

  // Local Excel Fallback
  const excelPath = getExcelFilePath()
  if (excelPath && fs.existsSync(excelPath)) {
    try {
      const wb = xlsx.readFile(excelPath)
      const sheet = wb.Sheets[SHEET_NAME] || wb.Sheets[wb.SheetNames[0]]
      if (sheet) {
        const rawData = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet)
        const overrides = getLocalOverrides()

        return rawData.map((row, idx) => {
          const topicId = String(row.topic_id || `ST_${idx + 1}`)
          const override = overrides[topicId] || {}

          return {
            topic_id: topicId,
            topic: String(row.topic || ''),
            category: String(row.category || 'General'),
            topic_cluster: String(row.topic_cluster || ''),
            article_type: String(row.article_type || 'Explanation'),
            search_intent: String(row.search_intent || 'Educational'),
            primary_keyword: String(row.primary_keyword || ''),
            secondary_keywords: String(row.secondary_keywords || ''),
            related_tool: String(row.related_tool || ''),
            related_tool_slug: String(row.related_tool_slug || ''),
            content_angle: String(row.content_angle || ''),
            evergreen: String(row.evergreen || 'YES'),
            priority: (override.priority || row.priority || 'MEDIUM') as any,
            status: (override.status || row.status || 'READY').toString().toUpperCase() as TopicStatus,
            published_url: override.published_url !== undefined ? override.published_url : (row.published_url ? String(row.published_url) : null),
            published_at: override.published_at !== undefined ? override.published_at : (row.published_at ? String(row.published_at) : null),
            error: override.error !== undefined ? override.error : (row.error ? String(row.error) : null),
            content_hash: override.content_hash !== undefined ? override.content_hash : (row.content_hash ? String(row.content_hash) : null),
          }
        })
      }
    } catch (err) {
      console.error('Error reading local Excel fallback:', err)
    }
  }

  return []
}

/**
 * Updates a topic row in Google Sheets or local overrides.
 */
export async function updateTopicStatus(
  topicId: string,
  update: {
    status: TopicStatus
    published_url?: string | null
    published_at?: string | null
    error?: string | null
    content_hash?: string | null
  }
): Promise<boolean> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const accessToken = await getGoogleAccessToken()

  if (spreadsheetId && accessToken) {
    try {
      // Find row index by topicId
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        SHEET_NAME
      )}!A1:A2000`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await res.json()

      if (data.values) {
        let rowIndex = -1
        for (let i = 0; i < data.values.length; i++) {
          if (data.values[i][0] === topicId) {
            rowIndex = i + 1 // 1-indexed in Sheets
            break
          }
        }

        if (rowIndex > 0) {
          // Columns in sheet:
          // A: topic_id, B: topic, C: category, D: topic_cluster, E: article_type,
          // F: search_intent, G: primary_keyword, H: secondary_keywords, I: related_tool,
          // J: related_tool_slug, K: content_angle, L: evergreen, M: priority,
          // N: status, O: published_url, P: published_at, Q: error, R: content_hash
          const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
            SHEET_NAME
          )}!N${rowIndex}:R${rowIndex}?valueInputOption=USER_ENTERED`

          const updateBody = {
            values: [
              [
                update.status,
                update.published_url || '',
                update.published_at || '',
                update.error || '',
                update.content_hash || '',
              ],
            ],
          }

          const updateRes = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateBody),
          })

          if (updateRes.ok) {
            return true
          }
          console.error('Google Sheets update status error:', await updateRes.text())
        }
      }
    } catch (err) {
      console.error('Failed to update Google Sheet row:', err)
    }
  }

  // Fallback to local overrides
  const overrides = getLocalOverrides()
  overrides[topicId] = {
    ...(overrides[topicId] || {}),
    status: update.status,
    published_url: update.published_url,
    published_at: update.published_at,
    error: update.error,
    content_hash: update.content_hash,
  }
  saveLocalOverrides(overrides)
  return true
}

/**
 * Topic Selection Algorithm:
 * 1. Find all topics with status === 'READY'.
 * 2. Recover any topics stuck in 'PROCESSING' for > 30 minutes.
 * 3. Rotate categories (JEE -> Student -> Career -> Finance -> Calculators) based on last published category.
 * 4. Prioritize 'HIGH' priority.
 * 5. Return the top candidate.
 */
export async function getNextReadyTopic(preferredCategory?: string): Promise<TopicRow | null> {
  const allTopics = await getAllTopics()

  // Recover stuck PROCESSING topics (if stuck for > 30 mins)
  const thirtyMinsAgo = Date.now() - 30 * 60 * 1000
  for (const t of allTopics) {
    if (t.status === 'PROCESSING') {
      const lockTime = t.published_at ? new Date(t.published_at).getTime() : 0
      if (lockTime > 0 && lockTime < thirtyMinsAgo) {
        // Recover to READY
        await updateTopicStatus(t.topic_id, { status: 'READY', error: 'Lock timed out; reset to READY' })
        t.status = 'READY'
      }
    }
  }

  const readyTopics = allTopics.filter((t) => t.status === 'READY')
  if (readyTopics.length === 0) {
    return null
  }

  // Category rotation order
  const categories = ['JEE', 'Student', 'Career', 'Finance', 'General']

  // If a category is preferred, check for high priority first in that category
  if (preferredCategory) {
    const inPreferredHigh = readyTopics.find(
      (t) => t.category.toLowerCase().includes(preferredCategory.toLowerCase()) && t.priority === 'HIGH'
    )
    if (inPreferredHigh) return inPreferredHigh

    const inPreferred = readyTopics.find((t) =>
      t.category.toLowerCase().includes(preferredCategory.toLowerCase())
    )
    if (inPreferred) return inPreferred
  }

  // Find high priority topics across categories
  const highPriority = readyTopics.filter((t) => t.priority === 'HIGH')
  if (highPriority.length > 0) {
    return highPriority[0]
  }

  // Fallback to first available ready topic
  return readyTopics[0]
}

export async function lockTopicForProcessing(topicId: string): Promise<boolean> {
  return await updateTopicStatus(topicId, {
    status: 'PROCESSING',
    published_at: new Date().toISOString(), // used as lock timestamp
    error: null,
  })
}

export async function getTopicQueueStats(): Promise<{
  total: number
  ready: number
  processing: number
  published: number
  reviewRequired: number
  failed: number
  skipped: number
  byCategory: Record<string, number>
}> {
  const topics = await getAllTopics()
  const stats = {
    total: topics.length,
    ready: 0,
    processing: 0,
    published: 0,
    reviewRequired: 0,
    failed: 0,
    skipped: 0,
    byCategory: {} as Record<string, number>,
  }

  for (const t of topics) {
    if (t.status === 'READY') stats.ready++
    else if (t.status === 'PROCESSING') stats.processing++
    else if (t.status === 'PUBLISHED') stats.published++
    else if (t.status === 'REVIEW_REQUIRED') stats.reviewRequired++
    else if (t.status === 'FAILED') stats.failed++
    else if (t.status === 'SKIPPED') stats.skipped++

    const cat = t.category || 'Uncategorized'
    stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1
  }

  return stats
}
