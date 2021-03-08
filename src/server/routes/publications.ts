import { Router } from 'express'
import logger from '../logger'
import { PostgresMeta } from '../../lib'

const router = Router()

router.get('/', async (req, res) => {
  const connectionString = req.headers?.pg?.toString() ?? ''

  const pgMeta = new PostgresMeta({ connectionString, max: 1 })
  const { data, error } = await pgMeta.publications.list()
  await pgMeta.end()
  if (error) {
    logger.error({ error, req: req.body })
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json(data)
})

router.get('/:id', async (req, res) => {
  const connectionString = req.headers?.pg?.toString() ?? ''
  const id = Number(req.params.id)
  if (!Number.isSafeInteger(id) || id < 0) {
    const error = {
      message: `Invalid format for ID: ${req.params.id}`,
    }
    logger.error({ error, req: req.body })
    return res.status(400).json({ error: error.message })
  }

  const pgMeta = new PostgresMeta({ connectionString, max: 1 })
  const { data, error } = await pgMeta.publications.retrieve({ id })
  await pgMeta.end()
  if (error) {
    logger.error({ error, req: req.body })
    return res.status(404).json({ error: error.message })
  }

  return res.status(200).json(data)
})

router.post('/', async (req, res) => {
  const connectionString = req.headers?.pg?.toString() ?? ''

  const pgMeta = new PostgresMeta({ connectionString, max: 1 })
  const { data, error } = await pgMeta.publications.create(req.body)
  await pgMeta.end()
  if (error) {
    logger.error({ error, req: req.body })
    return res.status(400).json({ error: error.message })
  }

  return res.status(200).json(data)
})

router.patch('/:id', async (req, res) => {
  const connectionString = req.headers?.pg?.toString() ?? ''
  const id = Number(req.params.id)
  if (!Number.isSafeInteger(id) || id < 0) {
    const error = {
      message: `Invalid format for ID: ${req.params.id}`,
    }
    logger.error({ error, req: req.body })
    return res.status(400).json({ error: error.message })
  }

  const pgMeta = new PostgresMeta({ connectionString, max: 1 })
  const { data, error } = await pgMeta.publications.update(id, req.body)
  await pgMeta.end()
  if (error) {
    logger.error({ error, req: req.body })
    let statusCode = 400
    if (error.message.startsWith('Cannot find')) statusCode = 404
    return res.status(statusCode).json({ error: error.message })
  }

  return res.status(200).json(data)
})

router.delete('/:id', async (req, res) => {
  const connectionString = req.headers?.pg?.toString() ?? ''
  const id = Number(req.params.id)
  if (!Number.isSafeInteger(id) || id < 0) {
    const error = {
      message: `Invalid format for ID: ${req.params.id}`,
    }
    logger.error({ error, req: req.body })
    return res.status(400).json({ error: error.message })
  }

  const pgMeta = new PostgresMeta({ connectionString, max: 1 })
  const { data, error } = await pgMeta.publications.remove(id)
  await pgMeta.end()
  if (error) {
    logger.error({ error, req: req.body })
    let statusCode = 400
    if (error.message.startsWith('Cannot find')) statusCode = 404
    return res.status(statusCode).json({ error: error.message })
  }

  return res.status(200).json(data)
})

export = router
