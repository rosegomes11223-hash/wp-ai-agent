// WordPress Client
// Production-ready WordPress REST API integration layer

export interface WordPressConfig {
  baseUrl: string;
  username: string;
  appPassword: string;
}

export interface WordPressPost {
  id?: number;
  title: string;
  content: string;
  status?: 'publish' | 'draft' | 'pending' | 'private';
  slug?: string;
  excerpt?: string;
  categories?: number[];
  tags?: number[];
}

export interface WordPressPostResponse {
  id: number;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  status: string;
  date: string;
}

function getConfig(): WordPressConfig {
  const baseUrl = process.env.WORDPRESS_URL;
  const username = process.env.WORDPRESS_USERNAME;
  const appPassword = process.env.WORDPRESS_APP_PASSWORD;

  if (!baseUrl || !username || !appPassword) {
    throw new Error(
      'Missing WordPress environment variables: WORDPRESS_URL, WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD'
    );
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    username,
    appPassword,
  };
}

function getAuthHeader(config: WordPressConfig): string {
  const credentials = `${config.username}:${config.appPassword}`;
  const encoded = Buffer.from(credentials, 'utf-8').toString('base64');
  return `Basic ${encoded}`;
}

async function wordpressFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const config = getConfig();

  const url = `${config.baseUrl}/wp-json/wp/v2${endpoint}`;

  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: getAuthHeader(config),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `WordPress API Error (${response.status}): ${errorText}`
    );
  }

  if (!contentType.includes('application/json')) {
    throw new Error('Invalid response format from WordPress API');
  }

  return response;
}

export async function createPost(
  post: WordPressPost
): Promise<WordPressPostResponse> {
  const response = await wordpressFetch('/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: post.title,
      content: post.content,
      status: post.status ?? 'draft',
      slug: post.slug,
      excerpt: post.excerpt,
      categories: post.categories,
      tags: post.tags,
    }),
  });

  return response.json();
}

export async function updatePost(
  postId: number,
  post: Partial<WordPressPost>
): Promise<WordPressPostResponse> {
  const response = await wordpressFetch(`/posts/${postId}`, {
    method: 'POST',
    body: JSON.stringify(post),
  });

  return response.json();
}

export async function getPost(
  postId: number
): Promise<WordPressPostResponse> {
  const response = await wordpressFetch(`/posts/${postId}`);
  return response.json();
}

export async function listPosts(params?: {
  perPage?: number;
  page?: number;
  status?: string;
}): Promise<WordPressPostResponse[]> {
  const query = new URLSearchParams();

  if (params?.perPage) query.set('per_page', String(params.perPage));
  if (params?.page) query.set('page', String(params.page));
  if (params?.status) query.set('status', params.status);

  const queryString = query.toString();
  const endpoint = queryString ? `/posts?${queryString}` : '/posts';

  const response = await wordpressFetch(endpoint);
  return response.json();
}

export async function deletePost(
  postId: number,
  force: boolean = false
): Promise<void> {
  await wordpressFetch(`/posts/${postId}?force=${force}`, {
    method: 'DELETE',
  });
}

export async function testConnection(): Promise<boolean> {
  try {
    await wordpressFetch('/users/me');
    return true;
  } catch (error) {
    console.error('WordPress connection test failed:', error);
    return false;
  }
}
