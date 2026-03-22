import { useLanguage } from '../i18n/LanguageContext';
import './Blog.css';

const Blog = () => {
  const { t } = useLanguage();

  const posts = [
    { id: 1, title: t.blog.post1Title, date: t.blog.post1Date, excerpt: t.blog.post1Excerpt },
    { id: 2, title: t.blog.post2Title, date: t.blog.post2Date, excerpt: t.blog.post2Excerpt },
    { id: 3, title: t.blog.post3Title, date: t.blog.post3Date, excerpt: t.blog.post3Excerpt },
  ];

  return (
    <div className="blog-page">
      <div className="blog-container">
        <h1 className="blog-title">{t.blog.pageTitle}</h1>
        <p className="blog-intro">{t.blog.intro}</p>

        <div className="blog-list">
          {posts.map((post) => (
            <article key={post.id} className="blog-card">
              <h2>
                <a href={`/blog/${post.id}`}>{post.title}</a>
              </h2>
              <p className="blog-meta">{post.date}</p>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
