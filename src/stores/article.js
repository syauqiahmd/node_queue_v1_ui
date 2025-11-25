import { defineStore } from 'pinia'
import request from '../helpers/request'
import { API_PATHS } from '../helpers/constants'
const DEFAULT_PAGE_SIZE = 10;


export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [],
    popularArticles: [],
    headlineArticle: {},
    article: null,
    loading: false,
    nextCursor: null,
    prevCursor: null,
  }),
  actions: {
    async fetchPublicArticles(params = {}) {
      this.loading = true
      try {
        const searchParams = new URLSearchParams(params)
        if (!searchParams.has('take')) {
          searchParams.append('take', DEFAULT_PAGE_SIZE)
        }
        const { data } = await request.get(`${API_PATHS.ARTICLES.GET_ALL_PUBLIC}?${searchParams.toString()}`)
        this.articles = data.data
        this.nextCursor = data.meta.nextCursor
        this.prevCursor = data.meta.prevCursor
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchPublicPopularArticles() {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.ARTICLES.GET_POPULAR_PUBLIC)
        this.popularArticles = data.data
      } catch (error) {
        console.error('Error fetching popular articles:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchPublicHeadlineArticles() {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.ARTICLES.GET_HEADLINE_PUBLIC)
        this.headlineArticle = data.data
      } catch (error) {
        console.error('Error fetching headline articles:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchArticles({ cursor = null, search = '', searchBy = 'title', sortBy = 'publishAt', sortOrder = 'desc' } = {}) {
      this.loading = true
      try {
        const params = new URLSearchParams()
        if (cursor) {
          params.append('cursor', cursor)
        }
        if (search && searchBy) {
          params.append(searchBy, search)
        }
        if (sortBy) {
          params.append('sortBy', sortBy)
        }
        if (sortOrder) {
          params.append('sortOrder', sortOrder)
        }
        params.append('take', DEFAULT_PAGE_SIZE)
        const { data } = await request.get(`${API_PATHS.ARTICLES.GET_ALL}?${params.toString()}`)
        this.articles = data.data
        this.nextCursor = data.meta.nextCursor
        this.prevCursor = data.meta.prevCursor
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchArticle(id) {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.ARTICLES.GET_DETAIL_BY_ID(id))
        this.article = data.data
      } catch (error) {
        console.error(`Error fetching article with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async fetchPublicArticleBySlug(slug) {
      this.loading = true
      try {
        const { data } = await request.get(API_PATHS.ARTICLES.GET_DETAIL_BY_SLUG(slug))
        this.article = data.data
      } catch (error) {
        console.error(`Error fetching article with slug ${slug}:`, error)
      } finally {
        this.loading = false
      }
    },
    async createArticle(article) {
      this.loading = true
      try {
        await request.post(API_PATHS.ARTICLES.CREATE, article)
        await this.fetchArticles()
      } catch (error) {
        console.error('Error creating article:', error)
      } finally {
        this.loading = false
      }
    },
    async updateArticle(article, id) {
      this.loading = true
      try {
        await request.put(API_PATHS.ARTICLES.UPDATE(id), article)
        await this.fetchArticles()
      } catch (error) {
        console.error(`Error updating article with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async deleteArticle(id) {
      this.loading = true
      try {
        await request.delete(API_PATHS.ARTICLES.DELETE(id))
        await this.fetchArticles()
      } catch (error) {
        console.error(`Error deleting article with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    },
    async setHeadlineArticle(id) {
      this.loading = true
      try {
        await request.post(API_PATHS.ARTICLES.SET_HEADLINE, { id })
        await this.fetchArticles()
      } catch (error) {
        console.error(`Error setting headline article with id ${id}:`, error)
      } finally {
        this.loading = false
      }
    }
  }
})
