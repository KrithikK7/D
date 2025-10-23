import { 
  type User, 
  type InsertUser,
  type Chapter,
  type InsertChapter,
  type Section,
  type InsertSection,
  type Page,
  type InsertPage,
  type ReadingProgress,
  type InsertReadingProgress,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  users,
  chapters,
  sections,
  pages,
  readingProgress,
  analyticsEvents,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, isNull, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chapter methods
  getChapters(): Promise<Chapter[]>;
  getChapter(id: string): Promise<Chapter | undefined>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;
  updateChapter(id: string, chapter: Partial<InsertChapter>): Promise<Chapter | undefined>;
  deleteChapter(id: string): Promise<void>;
  
  // Section methods
  getSectionsByChapter(chapterId: string): Promise<Section[]>;
  getSection(id: string): Promise<Section | undefined>;
  createSection(section: InsertSection): Promise<Section>;
  updateSection(id: string, section: Partial<InsertSection>): Promise<Section | undefined>;
  deleteSection(id: string): Promise<void>;
  
  // Page methods
  getPagesBySection(sectionId: string): Promise<Page[]>;
  getPage(id: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: string, page: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: string): Promise<void>;
  
  // Reading progress methods
  getReadingProgress(userId: string, sectionId: string): Promise<ReadingProgress | undefined>;
  getUserReadingProgress(userId: string): Promise<ReadingProgress[]>;
  upsertReadingProgress(progress: InsertReadingProgress): Promise<ReadingProgress>;
  getLastReadSection(userId: string): Promise<ReadingProgress | undefined>;
  
  // Analytics methods
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsByUser(userId: string): Promise<AnalyticsEvent[]>;
  getAnalyticsByPage(pageId: string): Promise<AnalyticsEvent[]>;
  getAnalyticsBySection(sectionId: string): Promise<AnalyticsEvent[]>;
  getAnalyticsByChapter(chapterId: string): Promise<AnalyticsEvent[]>;
  getAllAnalytics(): Promise<AnalyticsEvent[]>;
  getAnalyticsSummary(): Promise<any>;
}

export class DBStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Chapter methods
  async getChapters(): Promise<Chapter[]> {
    return db.select().from(chapters).orderBy(chapters.order);
  }

  async getChapter(id: string): Promise<Chapter | undefined> {
    const result = await db.select().from(chapters).where(eq(chapters.id, id)).limit(1);
    return result[0];
  }

  async createChapter(chapter: InsertChapter): Promise<Chapter> {
    const result = await db.insert(chapters).values(chapter).returning();
    return result[0];
  }

  async updateChapter(id: string, chapter: Partial<InsertChapter>): Promise<Chapter | undefined> {
    const result = await db.update(chapters).set(chapter).where(eq(chapters.id, id)).returning();
    return result[0];
  }

  async deleteChapter(id: string): Promise<void> {
    await db.delete(chapters).where(eq(chapters.id, id));
  }

  // Section methods
  async getSectionsByChapter(chapterId: string): Promise<Section[]> {
    return db.select().from(sections).where(eq(sections.chapterId, chapterId)).orderBy(sections.order);
  }

  async getSection(id: string): Promise<Section | undefined> {
    const result = await db.select().from(sections).where(eq(sections.id, id)).limit(1);
    return result[0];
  }

  async createSection(section: InsertSection): Promise<Section> {
    const result = await db.insert(sections).values(section).returning();
    return result[0];
  }

  async updateSection(id: string, section: Partial<InsertSection>): Promise<Section | undefined> {
    const result = await db.update(sections).set(section).where(eq(sections.id, id)).returning();
    return result[0];
  }

  async deleteSection(id: string): Promise<void> {
    await db.delete(sections).where(eq(sections.id, id));
  }

  // Page methods
  async getPagesBySection(sectionId: string): Promise<Page[]> {
    return db.select().from(pages).where(eq(pages.sectionId, sectionId)).orderBy(pages.pageNumber);
  }

  async getPage(id: string): Promise<Page | undefined> {
    const result = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
    return result[0];
  }

  async createPage(page: InsertPage): Promise<Page> {
    const result = await db.insert(pages).values(page).returning();
    return result[0];
  }

  async updatePage(id: string, page: Partial<InsertPage>): Promise<Page | undefined> {
    const result = await db.update(pages).set(page).where(eq(pages.id, id)).returning();
    return result[0];
  }

  async deletePage(id: string): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  // Reading progress methods
  async getReadingProgress(userId: string, sectionId: string): Promise<ReadingProgress | undefined> {
    const result = await db.select()
      .from(readingProgress)
      .where(and(eq(readingProgress.userId, userId), eq(readingProgress.sectionId, sectionId)))
      .limit(1);
    return result[0];
  }

  async getUserReadingProgress(userId: string): Promise<ReadingProgress[]> {
    return db.select().from(readingProgress).where(eq(readingProgress.userId, userId)).orderBy(desc(readingProgress.lastReadAt));
  }

  async upsertReadingProgress(progress: InsertReadingProgress): Promise<ReadingProgress> {
    const existing = await this.getReadingProgress(progress.userId, progress.sectionId);
    
    if (existing) {
      const result = await db
        .update(readingProgress)
        .set({ ...progress, lastReadAt: new Date() })
        .where(eq(readingProgress.id, existing.id))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(readingProgress).values(progress).returning();
      return result[0];
    }
  }

  async getLastReadSection(userId: string): Promise<ReadingProgress | undefined> {
    const result = await db
      .select()
      .from(readingProgress)
      .where(eq(readingProgress.userId, userId))
      .orderBy(desc(readingProgress.lastReadAt))
      .limit(1);
    return result[0];
  }

  // Analytics methods
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const result = await db.insert(analyticsEvents).values(event).returning();
    return result[0];
  }

  async getAnalyticsByUser(userId: string): Promise<AnalyticsEvent[]> {
    return db.select().from(analyticsEvents).where(eq(analyticsEvents.userId, userId)).orderBy(desc(analyticsEvents.timestamp));
  }

  async getAnalyticsByPage(pageId: string): Promise<AnalyticsEvent[]> {
    return db.select().from(analyticsEvents).where(eq(analyticsEvents.pageId, pageId)).orderBy(desc(analyticsEvents.timestamp));
  }

  async getAnalyticsBySection(sectionId: string): Promise<AnalyticsEvent[]> {
    return db.select().from(analyticsEvents).where(eq(analyticsEvents.sectionId, sectionId)).orderBy(desc(analyticsEvents.timestamp));
  }

  async getAnalyticsByChapter(chapterId: string): Promise<AnalyticsEvent[]> {
    return db.select().from(analyticsEvents).where(eq(analyticsEvents.chapterId, chapterId)).orderBy(desc(analyticsEvents.timestamp));
  }

  async getAllAnalytics(): Promise<AnalyticsEvent[]> {
    return db.select().from(analyticsEvents).orderBy(desc(analyticsEvents.timestamp));
  }

  async getAnalyticsSummary(): Promise<any> {
    const result = await db.execute(sql`
      SELECT 
        ae.page_id,
        ae.section_id,
        ae.chapter_id,
        p.page_number,
        s.title as section_title,
        c.title as chapter_title,
        COUNT(DISTINCT ae.user_id) as unique_viewers,
        COUNT(*) as total_views,
        AVG(ae.duration) as avg_duration,
        MAX(ae.timestamp) as last_accessed
      FROM analytics_events ae
      JOIN pages p ON ae.page_id = p.id
      JOIN sections s ON ae.section_id = s.id
      JOIN chapters c ON ae.chapter_id = c.id
      GROUP BY ae.page_id, ae.section_id, ae.chapter_id, p.page_number, s.title, c.title
      ORDER BY total_views DESC
    `);
    return result.rows;
  }
}

export const storage = new DBStorage();
