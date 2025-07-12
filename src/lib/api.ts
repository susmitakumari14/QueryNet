const API_BASE_URL = 'http://localhost:3001/api';

// Types for API responses
export interface User {
  id: string; // Backend sends 'id', not '_id'
  username: string;
  email: string;
  avatar?: string;
  reputation: number;
  role: 'user' | 'moderator' | 'admin';
  isVerified?: boolean;
  createdAt?: string;
}

export interface Question {
  _id: string;
  title: string;
  body: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
    reputation: number;
  };
  tags: string[];
  votes: string[]; // Array of user IDs who voted
  views: number;
  answers?: Answer[]; // May not be included in list view
  status: 'open' | 'closed';
  isPinned: boolean;
  isFeatured: boolean;
  lastActivity: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Answer {
  _id: string;
  body: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
    reputation: number;
  };
  question: string;
  votes: string[]; // Array of user IDs who voted (like Question)
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  meta?: {
    unreadCount: number;
  };
  error?: string;
  message?: string;
}

// Notification types
export interface Notification {
  _id: string;
  recipient: string;
  type: 'answer' | 'comment' | 'question' | 'badge' | 'mention' | 'vote' | 'accept';
  title: string;
  message: string;
  isRead: boolean;
  data?: {
    questionId?: string;
    answerId?: string;
    userId?: string;
    badgeId?: string;
    url?: string;
  };
  createdBy?: {
    _id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  readAt?: string;
}

export interface NotificationPreferences {
  emailQuestions: boolean;
  emailAnswers: boolean;
  emailComments: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  promotionalEmails: boolean;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  badges: Array<{
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
  }>;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  stats: {
    questionsAsked: number;
    answersGiven: number;
    commentsPosted: number;
    upvotesReceived: number;
    downvotesReceived: number;
    acceptedAnswers: number;
  };
  lastActive: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'Something went wrong'
        };
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(username: string, email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Questions endpoints
  async getQuestions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
    sort?: 'newest' | 'active' | 'votes' | 'unanswered';
  }): Promise<ApiResponse<Question[]>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.tags?.length) searchParams.append('tags', params.tags.join(','));
    if (params?.sort) searchParams.append('sort', params.sort);

    return this.request<Question[]>(`/questions?${searchParams.toString()}`);
  }

  async getQuestion(id: string): Promise<ApiResponse<{ question: Question; answers: Answer[] }>> {
    return this.request<{ question: Question; answers: Answer[] }>(`/questions/${id}`);
  }

  async createQuestion(data: {
    title: string;
    body: string;
    tags: string[];
  }): Promise<ApiResponse<Question>> {
    return this.request<Question>('/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateQuestion(id: string, data: {
    title?: string;
    body?: string;
    tags?: string[];
  }): Promise<ApiResponse<Question>> {
    return this.request<Question>(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteQuestion(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/questions/${id}`, {
      method: 'DELETE',
    });
  }

  async voteQuestion(id: string, type: 'up' | 'down'): Promise<ApiResponse<{ votes: number }>> {
    return this.request<{ votes: number }>(`/questions/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  // Answers endpoints
  async getAnswers(questionId: string): Promise<ApiResponse<Answer[]>> {
    return this.request<Answer[]>(`/answers/question/${questionId}`);
  }

  async createAnswer(data: {
    questionId: string;
    body: string;
  }): Promise<ApiResponse<Answer>> {
    return this.request<Answer>('/answers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAnswer(id: string, body: string): Promise<ApiResponse<Answer>> {
    return this.request<Answer>(`/answers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ body }),
    });
  }

  async deleteAnswer(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/answers/${id}`, {
      method: 'DELETE',
    });
  }

  async voteAnswer(id: string, type: 'up' | 'down'): Promise<ApiResponse<{ votes: number }>> {
    return this.request<{ votes: number }>(`/answers/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  async acceptAnswer(id: string): Promise<ApiResponse<Answer>> {
    return this.request<Answer>(`/answers/${id}/accept`, {
      method: 'POST',
    });
  }

  // Tags endpoints
  async getTags(search?: string): Promise<ApiResponse<string[]>> {
    const searchParams = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request<string[]>(`/tags${searchParams}`);
  }

  async getPopularTags(limit: number = 8): Promise<ApiResponse<Array<{ tag: string; count: number }>>> {
    return this.request<Array<{ tag: string; count: number }>>(`/tags/popular?limit=${limit}`);
  }

  // User endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me');
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  // Search endpoints
  async search(query: string, type?: 'questions' | 'answers' | 'users'): Promise<ApiResponse<Question[] | Answer[] | User[]>> {
    const searchParams = new URLSearchParams({ q: query });
    if (type) searchParams.append('type', type);
    
    return this.request<Question[] | Answer[] | User[]>(`/search?${searchParams.toString()}`);
  }

  // Health check
  async getHealth(): Promise<{ status: string; timestamp: string; uptime: number; environment: string }> {
    const response = await fetch(`http://localhost:3001/health`);
    return response.json();
  }

  // Stats endpoints
  async getStats(): Promise<ApiResponse<{
    totalQuestions: number;
    totalUsers: number;
    questionsToday: number;
    answeredPercentage: number;
  }>> {
    return await this.request<{
      totalQuestions: number;
      totalUsers: number;
      questionsToday: number;
      answeredPercentage: number;
    }>('/stats');
  }

  // Get related questions based on tags
  async getRelatedQuestions(questionId: string, limit: number = 5): Promise<ApiResponse<Question[]>> {
    return this.request<Question[]>(`/questions/${questionId}/related?limit=${limit}`);
  }

  // Get hot/popular questions
  async getPopularQuestions(limit: number = 5, days: number = 7): Promise<ApiResponse<Question[]>> {
    return this.request<Question[]>(`/questions/popular?limit=${limit}&days=${days}`);
  }

  // Notifications endpoints
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    filter?: 'all' | 'unread' | 'read';
  }): Promise<ApiResponse<Notification[]>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.filter) searchParams.append('filter', params.filter);

    return this.request<Notification[]>(`/notifications?${searchParams.toString()}`);
  }

  async markNotificationRead(id: string): Promise<ApiResponse<Notification>> {
    return this.request<Notification>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markNotificationUnread(id: string): Promise<ApiResponse<Notification>> {
    return this.request<Notification>(`/notifications/${id}/unread`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead(): Promise<ApiResponse<void>> {
    return this.request<void>('/notifications/mark-all-read', {
      method: 'PUT',
    });
  }

  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  async getNotificationPreferences(): Promise<ApiResponse<NotificationPreferences>> {
    return this.request<NotificationPreferences>('/notifications/preferences');
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<ApiResponse<NotificationPreferences>> {
    return this.request<NotificationPreferences>('/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  }

  // User profile endpoints
  async getCurrentUserProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/users/me/profile');
  }

  async updateUserProfile(data: {
    username?: string;
    bio?: string;
    location?: string;
    website?: string;
    avatar?: string;
  }): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/users/me/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateUserPreferences(preferences: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
  }): Promise<ApiResponse<{ emailNotifications: boolean; pushNotifications: boolean; theme: string }>> {
    return this.request<{ emailNotifications: boolean; pushNotifications: boolean; theme: string }>('/users/me/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return this.request<void>('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async changeEmail(newEmail: string, password: string): Promise<ApiResponse<void>> {
    return this.request<void>('/users/me/email', {
      method: 'PUT',
      body: JSON.stringify({ newEmail, password }),
    });
  }

  async getUserActivity(userId?: string): Promise<ApiResponse<{
    stats: UserProfile['stats'];
    reputation: number;
    badges: UserProfile['badges'];
  }>> {
    const endpoint = userId ? `/users/${userId}/activity` : '/users/me/activity';
    return this.request<{
      stats: UserProfile['stats'];
      reputation: number;
      badges: UserProfile['badges'];
    }>(endpoint);
  }

  async deleteAccount(password: string): Promise<ApiResponse<void>> {
    return this.request<void>('/users/me/account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  }
}

export const api = new ApiService();
export default api;
