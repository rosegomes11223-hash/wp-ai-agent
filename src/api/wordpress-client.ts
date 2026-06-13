// WordPress REST API client
// Handles authenticated communication with WordPress

export class WordPressClient {
  private readonly baseUrl: string;
  private readonly username: string;
  private readonly password: string;

  constructor() {
    this.baseUrl = process.env.WORDPRESS_URL ?? '';
    this.username = process.env.WORDPRESS_USERNAME ?? '';
    this.password = process.env.WORDPRESS_PASSWORD ?? '';

    if (!this.baseUrl) {
      throw new Error('WORDPRESS_URL is not configured');
    }
  }

  private getAuthHeader(): string {
    return `Basic ${btoa(`${this.username}:${this.password}`)}`;
  }

  // Create a new WordPress post
  async createPost(
    title: string,
    content: string,
    language: string
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/wp-json/wp/v2/posts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthHeader(),
        },
        body: JSON.stringify({
          title,
          content,
          status: 'draft',
          meta: {
            language,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`WordPress API Error: ${response.status}`);
    }

    return response.json();
  }

  // Get all WordPress posts
  async getPosts(): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/wp-json/wp/v2/posts`,
      {
        headers: {
          Authorization: this.getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`WordPress API Error: ${response.status}`);
    }

    return response.json();
  }

  // Update an existing WordPress post
  async updatePost(
    postId: number,
    title: string,
    content: string
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/wp-json/wp/v2/posts/${postId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthHeader(),
        },
        body: JSON.stringify({
          title,
          content,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`WordPress API Error: ${response.status}`);
    }

    return response.json();
  }
}
