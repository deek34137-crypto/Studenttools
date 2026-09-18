import { describe, it, expect } from 'vitest'
import { getAllTopics, getTopicQueueStats, getNextReadyTopic } from '../../lib/sheets/topicQueue'

describe('Topic Queue & Selection Engine', () => {
  it('should load topics from the queue database', async () => {
    const topics = await getAllTopics()
    expect(topics.length).toBeGreaterThan(100)
    expect(topics[0]).toHaveProperty('topic_id')
    expect(topics[0]).toHaveProperty('topic')
    expect(topics[0]).toHaveProperty('status')
  })

  it('should accurately calculate queue statistics', async () => {
    const stats = await getTopicQueueStats()
    expect(stats.total).toBeGreaterThan(100)
    expect(stats.ready + stats.processing + stats.published + stats.reviewRequired + stats.failed + stats.skipped).toBe(
      stats.total
    )
    expect(Object.keys(stats.byCategory).length).toBeGreaterThan(0)
  })

  it('should select a high priority READY topic', async () => {
    const nextTopic = await getNextReadyTopic()
    expect(nextTopic).not.toBeNull()
    if (nextTopic) {
      expect(nextTopic.status).toBe('READY')
      expect(['HIGH', 'MEDIUM', 'LOW']).toContain(nextTopic.priority)
    }
  })
})
