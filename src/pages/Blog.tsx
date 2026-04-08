import { useLanguage } from '../i18n/LanguageContext';
import SectionHeader from '../components/SectionHeader';
import LuxuryDivider from '../components/LuxuryDivider';
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
        <SectionHeader 
          title={t.blog.pageTitle}
          subtitle={t.blog.intro}
          centered={true}
        />

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

        <LuxuryDivider delay={0.1} />
      </div>
    </div>
  );
};

export default Blog;
