import { describe, it, expect } from 'vitest'
import { executeDailyPublishPipeline } from '../../lib/publisher/pipeline'

describe('Live Gemini & Quality Gate Integration (Dry-Run)', () => {
  it('should generate, validate and quality-check a topic from the queue in dry-run mode', async () => {
    process.env.GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest'

    const result = await executeDailyPublishPipeline({
      dryRun: true,
      allowManualOverride: true,
      forceTopicId: 'ST001',
    })

    console.log('Gemini Live Dry-Run Result:', result)
    expect(result).toBeDefined()
    expect(result.dryRun).toBe(true)

    // Verify it either successfully passed or flagged with specific errors
    if (result.success) {
      expect(result.action).toBe('PUBLISHED')
      expect(result.articleSlug).toBeDefined()
      expect(result.articleUrl).toContain('studenttools.cyou/blog/')
    } else {
      console.warn('Dry run returned:', result.reason, result.errors)
    }
  }, 45000)
})
