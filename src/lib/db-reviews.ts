import { prisma } from './prisma'

export interface FeaturedReview {
  id: string
  name: string
  rating: number
  comment: string
}

export async function getFeaturedReviews(take = 3): Promise<FeaturedReview[]> {
  const rows = await prisma.review.findMany({
    where: { approved: true, rating: { gte: 4 } },
    orderBy: { createdAt: 'desc' },
    take,
  })
  return rows.map(r => ({ id: r.id, name: r.name, rating: r.rating, comment: r.comment }))
}
